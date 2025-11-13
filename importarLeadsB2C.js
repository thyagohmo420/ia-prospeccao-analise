import { createClient } from '@supabase/supabase-js'
import { config } from 'dotenv'
import fs from 'fs'
import path from 'path'

config()

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY)

// Função para calcular idade a partir da data de nascimento
function calcularIdade(dataNascimento) {
  if (!dataNascimento) return null
  const hoje = new Date()
  const nascimento = new Date(dataNascimento)
  let idade = hoje.getFullYear() - nascimento.getFullYear()
  const mes = hoje.getMonth() - nascimento.getMonth()
  if (mes < 0 || (mes === 0 && hoje.getDate() < nascimento.getDate())) {
    idade--
  }
  return idade
}

// Função para validar e normalizar telefone
function normalizarTelefone(telefone) {
  if (!telefone) return null
  // Remove tudo que não é número
  const numeros = telefone.replace(/\D/g, '')
  // Verifica se tem pelo menos 10 dígitos (DDD + número)
  if (numeros.length < 10) return null
  return numeros
}

// Função para validar email
function validarEmail(email) {
  if (!email) return null
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return regex.test(email) ? email.toLowerCase() : null
}

// Função principal de importação
async function importarLeadsCSV(caminhoArquivo, fonte = 'manual') {
  try {
    console.log(`\n📥 Importando leads de: ${caminhoArquivo}`)
    console.log(`📌 Fonte: ${fonte}\n`)

    // Ler arquivo CSV
    const conteudo = fs.readFileSync(caminhoArquivo, 'utf-8')
    const linhas = conteudo.split('\n').filter(linha => linha.trim())

    if (linhas.length < 2) {
      console.log('❌ Arquivo vazio ou sem dados')
      return
    }

    // Processar header
    const header = linhas[0].split(',').map(col => col.trim().toLowerCase())
    console.log(`📋 Colunas encontradas: ${header.join(', ')}\n`)

    let importados = 0
    let erros = 0

    // Processar cada linha
    for (let i = 1; i < linhas.length; i++) {
      try {
        const valores = linhas[i].split(',').map(val => val.trim())
        const lead = {}

        // Mapear valores do CSV para objeto
        header.forEach((coluna, index) => {
          lead[coluna] = valores[index] || null
        })

        // Validações obrigatórias
        if (!lead.nome && !lead.nome_completo) {
          console.log(`⚠️  Linha ${i + 1}: Nome não informado - PULADO`)
          erros++
          continue
        }

        const telefone = normalizarTelefone(lead.telefone || lead.whatsapp || lead.celular)
        if (!telefone) {
          console.log(`⚠️  Linha ${i + 1}: Telefone inválido - PULADO`)
          erros++
          continue
        }

        // Preparar dados para inserção
        const dadosLead = {
          nome_completo: lead.nome_completo || lead.nome,
          telefone: telefone,
          email: validarEmail(lead.email),
          cpf: lead.cpf,
          data_nascimento: lead.data_nascimento || lead.nascimento,
          idade: lead.idade ? parseInt(lead.idade) : calcularIdade(lead.data_nascimento || lead.nascimento),
          genero: lead.genero || lead.sexo,
          cidade: lead.cidade,
          estado: lead.estado || lead.uf,
          cep: lead.cep,
          queixas_principais: lead.queixas || lead.queixas_principais || lead.sintomas || lead.motivo,
          especialidade_interesse: lead.especialidade || lead.especialidade_interesse,
          tem_convenio: lead.convenio && lead.convenio.toLowerCase() !== 'particular',
          nome_convenio: lead.convenio && lead.convenio.toLowerCase() !== 'particular' ? lead.convenio : null,
          fonte: fonte,
          campanha: lead.campanha,
          midia_social: lead.midia_social || lead.rede_social,
          status: 'novo',
          observacoes: lead.observacoes
        }

        // Inserir no Supabase
        const { data, error } = await supabase
          .from('leads')
          .insert([dadosLead])
          .select()

        if (error) {
          console.log(`❌ Linha ${i + 1}: Erro ao inserir - ${error.message}`)
          erros++
        } else {
          console.log(`✅ Lead importado: ${dadosLead.nome_completo} - ${dadosLead.telefone}`)
          importados++
        }

      } catch (err) {
        console.log(`❌ Linha ${i + 1}: Erro ao processar - ${err.message}`)
        erros++
      }
    }

    console.log(`\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`)
    console.log(`📊 RESUMO DA IMPORTAÇÃO`)
    console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`)
    console.log(`✅ Importados com sucesso: ${importados}`)
    console.log(`❌ Erros/Pulados: ${erros}`)
    console.log(`📋 Total de linhas: ${linhas.length - 1}`)
    console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`)

  } catch (error) {
    console.error('❌ Erro geral na importação:', error.message)
  }
}

// Importação via formulário web (simulação - em produção seria via API)
async function importarFormularioWeb(dados) {
  try {
    const dadosLead = {
      nome_completo: dados.nome,
      telefone: normalizarTelefone(dados.telefone),
      email: validarEmail(dados.email),
      queixas_principais: dados.mensagem || dados.queixas,
      especialidade_interesse: dados.especialidade,
      fonte: 'formulario_site',
      status: 'novo'
    }

    const { data, error } = await supabase
      .from('leads')
      .insert([dadosLead])
      .select()

    if (error) throw error

    console.log(`✅ Lead do formulário importado: ${dadosLead.nome_completo}`)
    return data[0]

  } catch (error) {
    console.error('❌ Erro ao importar formulário:', error.message)
    return null
  }
}

// Importação via Facebook Ads (simulação - em produção seria via API do Facebook)
async function importarFacebookLeads(leads, campanha) {
  try {
    console.log(`\n📱 Importando ${leads.length} leads do Facebook Ads`)
    console.log(`📌 Campanha: ${campanha}\n`)

    let importados = 0

    for (const lead of leads) {
      const dadosLead = {
        nome_completo: lead.field_data.find(f => f.name === 'full_name')?.values[0],
        telefone: normalizarTelefone(lead.field_data.find(f => f.name === 'phone_number')?.values[0]),
        email: validarEmail(lead.field_data.find(f => f.name === 'email')?.values[0]),
        fonte: 'facebook_ads',
        campanha: campanha,
        midia_social: 'Facebook',
        status: 'novo'
      }

      if (!dadosLead.nome_completo || !dadosLead.telefone) {
        console.log(`⚠️  Lead incompleto - PULADO`)
        continue
      }

      const { error } = await supabase
        .from('leads')
        .insert([dadosLead])

      if (!error) {
        console.log(`✅ Lead Facebook importado: ${dadosLead.nome_completo}`)
        importados++
      }
    }

    console.log(`\n📊 Total importado do Facebook: ${importados}/${leads.length}\n`)

  } catch (error) {
    console.error('❌ Erro ao importar Facebook Leads:', error.message)
  }
}

// Verificar argumentos da linha de comando
const args = process.argv.slice(2)

if (args.length === 0) {
  console.log(`
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  IMPORTADOR DE LEADS B2C - CLÍNICA MÉDICA
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

USO:
  node importarLeadsB2C.js <arquivo.csv> [fonte]

FONTES DISPONÍVEIS:
  - formulario_site    (Formulário do site)
  - facebook_ads       (Facebook Ads)
  - google_ads         (Google Ads)
  - instagram          (Instagram)
  - indicacao          (Indicações)
  - evento             (Eventos/Palestras)
  - landing_page       (Landing Pages)
  - manual             (Importação manual) [PADRÃO]

EXEMPLOS:
  node importarLeadsB2C.js leads-formulario.csv formulario_site
  node importarLeadsB2C.js leads-facebook.csv facebook_ads
  node importarLeadsB2C.js leads-evento.csv evento

FORMATO DO CSV:
  Nome obrigatório: nome_completo ou nome
  Telefone obrigatório: telefone, whatsapp ou celular
  Opcionais: email, cpf, data_nascimento, idade, genero,
             cidade, estado, queixas, especialidade, convenio

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  `)
  process.exit(0)
}

const arquivo = args[0]
const fonte = args[1] || 'manual'

// Verificar se arquivo existe
if (!fs.existsSync(arquivo)) {
  console.log(`❌ Arquivo não encontrado: ${arquivo}`)
  process.exit(1)
}

// Executar importação
importarLeadsCSV(arquivo, fonte)

// Exportar funções para uso em outros módulos
export { importarLeadsCSV, importarFormularioWeb, importarFacebookLeads }
