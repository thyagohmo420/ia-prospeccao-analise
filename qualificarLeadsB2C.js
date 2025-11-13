import { createClient } from '@supabase/supabase-js'
import { config } from 'dotenv'
import OpenAI from 'openai'

config()

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY)
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

// Buscar especialidades cadastradas
async function buscarEspecialidades() {
  const { data } = await supabase
    .from('especialidades')
    .select('nome, palavras_chave')
    .eq('ativa', true)

  return data || []
}

// Calcular score de qualificação do lead
function calcularScore(lead, analiseIA) {
  let score = 50 // Score base

  // +10 pontos se tem email
  if (lead.email) score += 10

  // +15 pontos se tem queixas específicas
  if (lead.queixas_principais && lead.queixas_principais.length > 20) score += 15

  // +10 pontos se já identificou especialidade
  if (lead.especialidade_interesse) score += 10

  // +5 pontos se tem convênio
  if (lead.tem_convenio) score += 5

  // +10 pontos se tem idade (mais info = mais qualificado)
  if (lead.idade) score += 5

  // Análise da IA pode ajustar score
  if (analiseIA) {
    if (analiseIA.includes('urgente') || analiseIA.includes('urgência')) score += 15
    if (analiseIA.includes('alta prioridade')) score += 10
    if (analiseIA.includes('baixa prioridade')) score -= 10
  }

  // Garantir que score fique entre 0 e 100
  return Math.max(0, Math.min(100, score))
}

// Determinar prioridade baseado no score e urgência
function determinarPrioridade(score, analiseIA) {
  if (analiseIA && (analiseIA.includes('urgente') || analiseIA.includes('emergência'))) {
    return 'urgente'
  }
  if (score >= 80) return 'alta'
  if (score >= 60) return 'media'
  return 'baixa'
}

// Qualificar leads com IA
async function qualificarLeads() {
  try {
    console.log('\n🤖 Iniciando qualificação de leads com IA\n')

    // Buscar especialidades para contexto
    const especialidades = await buscarEspecialidades()
    const listaEspecialidades = especialidades.map(e => e.nome).join(', ')

    // Buscar leads novos para qualificar
    const { data: leads, error } = await supabase
      .from('leads')
      .select('*')
      .eq('status', 'novo')
      .is('analise_ia', null)

    if (error) {
      console.error('❌ Erro ao buscar leads:', error.message)
      return
    }

    if (!leads || leads.length === 0) {
      console.log('ℹ️  Nenhum lead novo para qualificar')
      return
    }

    console.log(`📋 Encontrados ${leads.length} leads para qualificar\n`)

    for (const lead of leads) {
      try {
        // Montar contexto do lead
        const contexto = `
INFORMAÇÕES DO LEAD:
- Nome: ${lead.nome_completo}
- Idade: ${lead.idade || 'Não informado'}
- Gênero: ${lead.genero || 'Não informado'}
- Localização: ${lead.cidade || 'Não informado'}${lead.estado ? `, ${lead.estado}` : ''}
- Queixas/Motivo: ${lead.queixas_principais || 'Não informado'}
- Especialidade de interesse: ${lead.especialidade_interesse || 'Não informado'}
- Tem convênio: ${lead.tem_convenio ? `Sim (${lead.nome_convenio})` : 'Não / Particular'}
- Fonte do lead: ${lead.fonte}

ESPECIALIDADES DISPONÍVEIS NA CLÍNICA:
${listaEspecialidades}
`

        const prompt = `
Você é um especialista em qualificação de leads para clínicas médicas.

Analise o lead abaixo e forneça:

1. **ESPECIALIDADE RECOMENDADA**: Qual especialidade médica seria mais adequada? Escolha APENAS UMA das disponíveis.

2. **SEGMENTAÇÃO**: Classifique o lead em um dos perfis:
   - Check-up preventivo
   - Tratamento específico
   - Emergência/Urgência
   - Acompanhamento contínuo
   - Primeiro contato

3. **URGÊNCIA**: Avalie o nível de urgência (baixa, média, alta, urgente)

4. **ANÁLISE DO PERFIL**:
   - Principais necessidades identificadas
   - Possíveis objeções ao agendamento
   - Pontos de atenção

5. **MELHOR ABORDAGEM**:
   - Tom da mensagem (empático, informativo, urgente)
   - Principais benefícios a destacar
   - Call-to-action sugerido

${contexto}

Forneça uma análise estruturada, objetiva e acionável.
`

        console.log(`🔍 Qualificando: ${lead.nome_completo}...`)

        const completion = await openai.chat.completions.create({
          model: 'gpt-4',
          messages: [
            {
              role: 'system',
              content: 'Você é um especialista em qualificação de leads médicos. Seja objetivo, empático e focado em conversão.'
            },
            { role: 'user', content: prompt }
          ],
          temperature: 0.7,
          max_tokens: 1000
        })

        const analise = completion.choices[0].message.content

        // Extrair especialidade da análise (parsing simples)
        let especialidadeRecomendada = lead.especialidade_interesse
        for (const esp of especialidades) {
          if (analise.toLowerCase().includes(esp.nome.toLowerCase())) {
            especialidadeRecomendada = esp.nome
            break
          }
        }

        // Extrair segmentação
        let segmentacao = 'Primeiro contato'
        if (analise.includes('Check-up preventivo')) segmentacao = 'Check-up preventivo'
        else if (analise.includes('Tratamento específico')) segmentacao = 'Tratamento específico'
        else if (analise.includes('Emergência') || analise.includes('Urgência')) segmentacao = 'Emergência/Urgência'
        else if (analise.includes('Acompanhamento contínuo')) segmentacao = 'Acompanhamento contínuo'

        // Calcular score e prioridade
        const score = calcularScore(lead, analise)
        const prioridade = determinarPrioridade(score, analise)

        // Atualizar lead no banco
        const { error: updateError } = await supabase
          .from('leads')
          .update({
            analise_ia: analise,
            especialidade_interesse: especialidadeRecomendada,
            segmentacao: segmentacao,
            score_qualificacao: score,
            prioridade: prioridade,
            status: 'qualificado'
          })
          .eq('id', lead.id)

        if (updateError) {
          console.log(`❌ ${lead.nome_completo}: Erro ao atualizar - ${updateError.message}`)
        } else {
          console.log(`✅ ${lead.nome_completo}: Score ${score}/100 | Prioridade: ${prioridade} | ${especialidadeRecomendada}`)
        }

      } catch (err) {
        console.error(`❌ Erro ao qualificar ${lead.nome_completo}:`, err.message)
      }

      // Delay para não sobrecarregar API
      await new Promise(resolve => setTimeout(resolve, 1000))
    }

    console.log(`\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`)
    console.log(`✅ Qualificação concluída!`)
    console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`)

  } catch (error) {
    console.error('❌ Erro geral na qualificação:', error.message)
  }
}

// Executar
qualificarLeads()
