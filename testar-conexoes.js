import { config } from 'dotenv'
import { createClient } from '@supabase/supabase-js'
import OpenAI from 'openai'

// Carregar .env
config()

console.log('\n🔍 TESTANDO CONEXÕES DO SISTEMA\n')
console.log('━'.repeat(50))

async function testarConexoes() {
  let todosOK = true

  // 1. Testar OpenAI
  console.log('\n🤖 TESTANDO OPENAI...\n')

  if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY.includes('sua-')) {
    console.log('❌ OPENAI_API_KEY não configurada no .env')
    todosOK = false
  } else {
    try {
      const openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY
      })

      const response = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [{ role: 'user', content: 'Responda apenas: OK' }],
        max_tokens: 10
      })

      if (response.choices[0].message.content) {
        console.log('✅ OpenAI conectada com sucesso!')
        console.log(`   Modelo usado: gpt-4o-mini`)
        console.log(`   Resposta: ${response.choices[0].message.content.trim()}`)
      }
    } catch (err) {
      console.log('❌ Erro ao conectar OpenAI:')
      if (err.status === 401) {
        console.log('   → API Key inválida. Verifique se copiou corretamente.')
      } else if (err.status === 429) {
        console.log('   → Sem créditos. Adicione créditos em: https://platform.openai.com/settings/organization/billing')
      } else {
        console.log(`   → ${err.message}`)
      }
      todosOK = false
    }
  }

  // 2. Testar Supabase
  console.log('\n🗄️  TESTANDO SUPABASE...\n')

  if (!process.env.SUPABASE_URL || process.env.SUPABASE_URL.includes('sua-')) {
    console.log('❌ SUPABASE_URL não configurada no .env')
    todosOK = false
  } else if (!process.env.SUPABASE_KEY || process.env.SUPABASE_KEY.includes('sua-')) {
    console.log('❌ SUPABASE_KEY não configurada no .env')
    todosOK = false
  } else {
    try {
      const supabase = createClient(
        process.env.SUPABASE_URL,
        process.env.SUPABASE_KEY
      )

      // Testar conexão listando tabelas (via especialidades)
      const { data, error } = await supabase
        .from('especialidades')
        .select('id, nome')
        .limit(3)

      if (error) {
        throw error
      }

      console.log('✅ Supabase conectado com sucesso!')
      console.log(`   URL: ${process.env.SUPABASE_URL}`)
      console.log('   Especialidades encontradas:')
      data.forEach(esp => {
        console.log(`   - ${esp.nome}`)
      })

      // Contar leads
      const { count } = await supabase
        .from('leads')
        .select('*', { count: 'exact', head: true })

      console.log(`\n   Total de leads no banco: ${count || 0}`)

    } catch (err) {
      console.log('❌ Erro ao conectar Supabase:')
      if (err.message.includes('relation') && err.message.includes('does not exist')) {
        console.log('   → Tabelas não encontradas.')
        console.log('   → Execute o arquivo database-b2c.sql no SQL Editor do Supabase')
      } else if (err.message.includes('Failed to fetch')) {
        console.log('   → URL inválida ou sem conexão com internet')
      } else {
        console.log(`   → ${err.message}`)
      }
      todosOK = false
    }
  }

  // 3. Verificar UltraMsg (opcional)
  console.log('\n📱 ULTRAMSG (WhatsApp - Opcional)...\n')

  if (!process.env.ULTRAMSG_INSTANCE_ID || process.env.ULTRAMSG_INSTANCE_ID.includes('seu-')) {
    console.log('⚠️  UltraMsg não configurado (opcional)')
    console.log('   Se quiser enviar WhatsApp automaticamente, configure:')
    console.log('   - ULTRAMSG_INSTANCE_ID')
    console.log('   - ULTRAMSG_TOKEN')
  } else {
    console.log('✅ Credenciais UltraMsg encontradas')
    console.log('   Instance ID: ' + process.env.ULTRAMSG_INSTANCE_ID)
    console.log('   (Use "npm run b2c:enviar" para testar envio)')
  }

  // 4. Verificar informações da clínica
  console.log('\n🏥 INFORMAÇÕES DA CLÍNICA...\n')

  const nomeClinica = process.env.NOME_CLINICA
  const whatsappClinica = process.env.WHATSAPP_CLINICA
  const siteClinica = process.env.SITE_CLINICA

  if (nomeClinica && !nomeClinica.includes('Clínica Saúde Completa')) {
    console.log(`✅ Nome: ${nomeClinica}`)
  } else {
    console.log('⚠️  NOME_CLINICA usando valor padrão (recomendado alterar)')
  }

  if (whatsappClinica && !whatsappClinica.includes('99999')) {
    console.log(`✅ WhatsApp: ${whatsappClinica}`)
  } else {
    console.log('⚠️  WHATSAPP_CLINICA usando valor padrão (recomendado alterar)')
  }

  if (siteClinica) {
    console.log(`✅ Site: ${siteClinica}`)
  }

  // Resumo final
  console.log('\n━'.repeat(50))
  console.log('\n📋 RESUMO:\n')

  if (todosOK) {
    console.log('✅ TUDO CONFIGURADO CORRETAMENTE!\n')
    console.log('Próximos passos:')
    console.log('1. Importar leads: npm run b2c:importar leads-formulario-site.csv formulario_site')
    console.log('2. Processar: npm run b2c:pipeline')
    console.log('3. Ver resultados no Supabase')
  } else {
    console.log('❌ ALGUMAS CONFIGURAÇÕES PRECISAM SER AJUSTADAS\n')
    console.log('Revise o arquivo .env e o guia INSTALACAO-LOCAL.md')
  }

  console.log('\n━'.repeat(50))
  console.log()
}

// Executar
testarConexoes().catch(err => {
  console.error('\n❌ Erro inesperado:', err.message)
  process.exit(1)
})
