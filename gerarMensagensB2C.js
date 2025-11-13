import { createClient } from '@supabase/supabase-js'
import { config } from 'dotenv'
import OpenAI from 'openai'

config()

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY)
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

// Nome da clínica (configurável)
const NOME_CLINICA = process.env.NOME_CLINICA || 'Clínica Saúde Completa'
const WHATSAPP_CLINICA = process.env.WHATSAPP_CLINICA || '(11) 99999-9999'
const SITE_CLINICA = process.env.SITE_CLINICA || 'www.saudecompleta.com.br'

async function gerarMensagens() {
  try {
    console.log('\n📝 Gerando mensagens personalizadas para leads\n')

    // Buscar leads qualificados sem mensagem
    const { data: leads, error } = await supabase
      .from('leads')
      .select('*')
      .eq('status', 'qualificado')
      .is('mensagem_ia', null)
      .not('analise_ia', 'is', null)

    if (error) {
      console.error('❌ Erro ao buscar leads:', error.message)
      return
    }

    if (!leads || leads.length === 0) {
      console.log('ℹ️  Nenhum lead qualificado para gerar mensagem')
      return
    }

    console.log(`📋 Encontrados ${leads.length} leads para gerar mensagens\n`)

    for (const lead of leads) {
      try {
        const primeiroNome = lead.nome_completo.split(' ')[0]

        // Buscar informações da especialidade
        let infoEspecialidade = ''
        if (lead.especialidade_interesse) {
          const { data: esp } = await supabase
            .from('especialidades')
            .select('descricao, valor_consulta_particular, aceita_convenio')
            .eq('nome', lead.especialidade_interesse)
            .single()

          if (esp) {
            infoEspecialidade = `
INFORMAÇÕES DA ESPECIALIDADE (${lead.especialidade_interesse}):
- Descrição: ${esp.descricao}
- Valor consulta particular: R$ ${esp.valor_consulta_particular}
- Aceita convênio: ${esp.aceita_convenio ? 'Sim' : 'Não'}
`
          }
        }

        const prompt = `
Você é um assistente virtual de uma clínica médica chamada "${NOME_CLINICA}".

Crie uma mensagem de WhatsApp PERSONALIZADA E EMPÁTICA para o seguinte lead:

INFORMAÇÕES DO LEAD:
- Nome: ${lead.nome_completo} (use apenas "${primeiroNome}" na mensagem)
- Idade: ${lead.idade || 'não informada'}
- Queixas/Interesse: ${lead.queixas_principais || 'Interesse geral'}
- Especialidade recomendada: ${lead.especialidade_interesse || 'Clínica Geral'}
- Segmentação: ${lead.segmentacao}
- Prioridade: ${lead.prioridade}
- Tem convênio: ${lead.tem_convenio ? `Sim (${lead.nome_convenio})` : 'Não'}
- Fonte: ${lead.fonte}

ANÁLISE E ABORDAGEM RECOMENDADA:
${lead.analise_ia}

${infoEspecialidade}

DIRETRIZES PARA A MENSAGEM:

1. **Tom e Estilo:**
   - Humano, empático e acolhedor
   - Profissional mas não formal demais
   - Linguagem simples e clara
   - ${lead.prioridade === 'urgente' ? 'DEMONSTRE URGÊNCIA E DISPONIBILIDADE IMEDIATA' : 'Tom tranquilo e consultivo'}

2. **Estrutura:**
   - Cumprimente pelo primeiro nome
   - Mencione de onde veio o contato (${lead.fonte === 'formulario_site' ? 'formulário do nosso site' : lead.fonte === 'facebook_ads' ? 'Facebook' : lead.fonte === 'instagram' ? 'Instagram' : 'nosso contato'})
   - Demonstre que entendeu a necessidade dele(a)
   - ${lead.queixas_principais ? 'Valide a preocupação/sintoma mencionado' : 'Ofereça ajuda para identificar a melhor especialidade'}
   - Apresente a solução (consulta com ${lead.especialidade_interesse})
   - Destaque 1-2 diferenciais da clínica
   - ${lead.tem_convenio ? `Confirme que atendemos o convênio ${lead.nome_convenio}` : 'Mencione valor acessível e formas de pagamento'}
   - Call-to-action claro e simples

3. **Tamanho:**
   - 3-4 parágrafos curtos (máximo 5 linhas cada)
   - Total: 150-200 palavras
   - Adequado para WhatsApp (fácil de ler no celular)

4. **O QUE NÃO FAZER:**
   - Não use emojis em excesso (máximo 2-3)
   - Não seja insistente ou vendedor demais
   - Não faça perguntas excessivas
   - Não mencione preços altos se não for necessário
   - Não use jargão médico complexo

5. **Call-to-Action:**
   - ${lead.prioridade === 'urgente' || lead.prioridade === 'alta' ? 'Ofereça horário ainda hoje ou amanhã' : 'Pergunte qual melhor dia/horário'}
   - Facilite ao máximo o agendamento
   - Deixe claro que é só responder a mensagem

INFORMAÇÕES DA CLÍNICA:
- Nome: ${NOME_CLINICA}
- WhatsApp: ${WHATSAPP_CLINICA}
- Site: ${SITE_CLINICA}

Crie APENAS a mensagem, sem explicações adicionais. A mensagem deve parecer escrita por um atendente humano real.
`

        console.log(`💬 Gerando mensagem para: ${lead.nome_completo}...`)

        const completion = await openai.chat.completions.create({
          model: 'gpt-4',
          messages: [
            {
              role: 'system',
              content: 'Você é um atendente empático de uma clínica médica. Crie mensagens personalizadas que convertem leads em pacientes, com tom humano e acolhedor.'
            },
            { role: 'user', content: prompt }
          ],
          temperature: 0.8,
          max_tokens: 500
        })

        const mensagem = completion.choices[0].message.content.trim()

        // Atualizar lead com a mensagem
        const { error: updateError } = await supabase
          .from('leads')
          .update({
            mensagem_ia: mensagem,
            melhor_abordagem: lead.analise_ia
          })
          .eq('id', lead.id)

        if (updateError) {
          console.log(`❌ ${lead.nome_completo}: Erro ao salvar mensagem - ${updateError.message}`)
        } else {
          console.log(`✅ ${lead.nome_completo}: Mensagem gerada!`)
          console.log(`   Preview: ${mensagem.substring(0, 80)}...\n`)
        }

      } catch (err) {
        console.error(`❌ Erro ao gerar mensagem para ${lead.nome_completo}:`, err.message)
      }

      // Delay para não sobrecarregar API
      await new Promise(resolve => setTimeout(resolve, 1000))
    }

    console.log(`\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`)
    console.log(`✅ Geração de mensagens concluída!`)
    console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`)

  } catch (error) {
    console.error('❌ Erro geral na geração de mensagens:', error.message)
  }
}

// Executar
gerarMensagens()
