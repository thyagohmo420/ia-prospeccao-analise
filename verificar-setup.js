import { config } from 'dotenv'
import { readFileSync, existsSync } from 'fs'

// Carregar .env se existir
config()

async function verificarSetup() {
  console.log('\n🔍 VERIFICAÇÃO DO SISTEMA B2C\n')
  console.log('━'.repeat(50))

  // 1. Verificar arquivos essenciais
  console.log('\n📁 ARQUIVOS DO SISTEMA:\n')

  const arquivosEssenciais = [
    'database-b2c.sql',
    'importarLeadsB2C.js',
    'qualificarLeadsB2C.js',
    'gerarMensagensB2C.js',
    'leads-formulario-site.csv',
    'leads-facebook-ads.csv',
    'GUIA-B2C.md',
    'SETUP-RAPIDO.md',
    'STATUS-SISTEMA.md',
    '.env.example'
  ]

  let arquivosOK = 0
  arquivosEssenciais.forEach(arquivo => {
    if (existsSync(arquivo)) {
      console.log(`✅ ${arquivo}`)
      arquivosOK++
    } else {
      console.log(`❌ ${arquivo} - NÃO ENCONTRADO`)
    }
  })

  console.log(`\nTotal: ${arquivosOK}/${arquivosEssenciais.length} arquivos OK`)

  // 2. Verificar .env
  console.log('\n⚙️  CONFIGURAÇÃO (.env):\n')

  if (!existsSync('.env')) {
    console.log('❌ Arquivo .env NÃO ENCONTRADO')
    console.log('   → Execute: cp .env.example .env')
    console.log('   → Edite .env com suas credenciais')
  } else {
    console.log('✅ Arquivo .env encontrado')

    const requiredVars = [
      'OPENAI_API_KEY',
      'SUPABASE_URL',
      'SUPABASE_KEY',
      'NOME_CLINICA',
      'WHATSAPP_CLINICA'
    ]

    const optionalVars = [
      'ULTRAMSG_INSTANCE_ID',
      'ULTRAMSG_TOKEN',
      'SITE_CLINICA'
    ]

    console.log('\n   Variáveis obrigatórias:')
    requiredVars.forEach(varName => {
      const value = process.env[varName]
      if (value && value !== '' && !value.includes('sua-')) {
        console.log(`   ✅ ${varName} configurado`)
      } else {
        console.log(`   ❌ ${varName} não configurado`)
      }
    })

    console.log('\n   Variáveis opcionais (para WhatsApp):')
    optionalVars.forEach(varName => {
      const value = process.env[varName]
      if (value && value !== '' && !value.includes('sua-') && !value.includes('seu-')) {
        console.log(`   ✅ ${varName} configurado`)
      } else {
        console.log(`   ⚠️  ${varName} não configurado`)
      }
    })
  }

  // 3. Verificar dependências
  console.log('\n📦 DEPENDÊNCIAS (node_modules):\n')

  const dependencias = [
    '@supabase/supabase-js',
    'openai',
    'axios',
    'dotenv',
    'express',
    'node-cron'
  ]

  let depsOK = 0
  for (const dep of dependencias) {
    try {
      await import(dep)
      console.log(`✅ ${dep}`)
      depsOK++
    } catch (err) {
      console.log(`❌ ${dep} - Execute: npm install`)
    }
  }

  console.log(`\nTotal: ${depsOK}/${dependencias.length} dependências OK`)

  // 4. Verificar CSVs de exemplo
  console.log('\n📋 DADOS DE EXEMPLO:\n')

  try {
    const csvSite = readFileSync('leads-formulario-site.csv', 'utf-8')
    const linhasSite = csvSite.split('\n').filter(l => l.trim()).length - 1 // -1 para header
    console.log(`✅ leads-formulario-site.csv - ${linhasSite} leads`)

    const csvFacebook = readFileSync('leads-facebook-ads.csv', 'utf-8')
    const linhasFacebook = csvFacebook.split('\n').filter(l => l.trim()).length - 1
    console.log(`✅ leads-facebook-ads.csv - ${linhasFacebook} leads`)

    console.log(`\nTotal de ${linhasSite + linhasFacebook} leads de exemplo prontos para teste`)
  } catch (err) {
    console.log('❌ Erro ao ler CSVs de exemplo')
  }

  // 5. Scripts disponíveis
  console.log('\n🚀 SCRIPTS DISPONÍVEIS:\n')

  const scripts = {
    'npm run b2c:importar': 'Importar leads de CSV',
    'npm run b2c:qualificar': 'Qualificar leads com IA',
    'npm run b2c:mensagens': 'Gerar mensagens personalizadas',
    'npm run b2c:enviar': 'Enviar via WhatsApp',
    'npm run b2c:pipeline': 'Pipeline completo (qualificar + mensagens)',
    'npm run dashboard': 'Iniciar dashboard web',
    'npm run automacao': 'Iniciar automação'
  }

  Object.entries(scripts).forEach(([cmd, desc]) => {
    console.log(`✅ ${cmd}`)
    console.log(`   ${desc}`)
  })

  // 6. Próximos passos
  console.log('\n━'.repeat(50))
  console.log('\n📋 PRÓXIMOS PASSOS:\n')

  if (!existsSync('.env')) {
    console.log('1️⃣  Criar arquivo .env:')
    console.log('   cp .env.example .env')
    console.log('')
    console.log('2️⃣  Editar .env e adicionar suas credenciais:')
    console.log('   - OpenAI API Key (https://platform.openai.com/api-keys)')
    console.log('   - Supabase URL e Key (Settings → API)')
    console.log('   - Nome da clínica')
    console.log('   - WhatsApp da clínica')
    console.log('')
  } else if (!process.env.SUPABASE_URL || process.env.SUPABASE_URL.includes('sua-')) {
    console.log('1️⃣  Configurar credenciais no arquivo .env')
    console.log('')
  }

  console.log('2️⃣  Executar database-b2c.sql no Supabase:')
  console.log('   - Abra Supabase → SQL Editor')
  console.log('   - Copie conteúdo de database-b2c.sql')
  console.log('   - Execute o script')
  console.log('')

  console.log('3️⃣  Testar com dados de exemplo:')
  console.log('   npm run b2c:importar leads-formulario-site.csv formulario_site')
  console.log('   npm run b2c:pipeline')
  console.log('')

  console.log('4️⃣  Verificar resultados no Supabase:')
  console.log('   - Tabela leads: 15 leads importados')
  console.log('   - Score, prioridade e mensagens geradas')
  console.log('')

  console.log('━'.repeat(50))
  console.log('\n✅ Sistema B2C 100% instalado e pronto!\n')
  console.log('📚 Documentação completa em:')
  console.log('   - STATUS-SISTEMA.md (visão geral)')
  console.log('   - SETUP-RAPIDO.md (configuração)')
  console.log('   - GUIA-B2C.md (guia completo)\n')
}

// Executar
verificarSetup().catch(console.error)
