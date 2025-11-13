import cron from 'node-cron'
import { exec } from 'child_process'
import { promisify } from 'util'
import { config } from 'dotenv'

const execAsync = promisify(exec)

config()

console.log('🤖 Sistema de Automação Iniciado')
console.log('================================')

// Configurações de agendamento
const SCHEDULES = {
  // Executar análise de novos leads todos os dias às 9h
  analisarDiario: '0 9 * * *', // 09:00 todos os dias

  // Gerar diagnósticos e mensagens todos os dias às 14h
  diagnosticarDiario: '0 14 * * *', // 14:00 todos os dias

  // Enviar mensagens de segunda a sexta às 10h
  enviarSemanal: '0 10 * * 1-5', // 10:00 segunda a sexta

  // Pipeline completo toda segunda-feira às 8h
  pipelineCompleto: '0 8 * * 1', // 08:00 segunda-feira

  // Verificar novos leads a cada 2 horas (horário comercial)
  verificarLeads: '0 9-18/2 * * *' // A cada 2h das 9h às 18h
}

// Função para executar comando
async function executarComando(comando, descricao) {
  console.log(`\n⏰ [${new Date().toLocaleString('pt-BR')}] ${descricao}`)
  console.log(`🔄 Executando: ${comando}`)

  try {
    const { stdout, stderr } = await execAsync(comando)

    if (stdout) {
      console.log('✅ Resultado:', stdout)
    }

    if (stderr) {
      console.warn('⚠️ Avisos:', stderr)
    }

    console.log(`✅ ${descricao} - Concluído com sucesso!`)
    return { success: true, output: stdout }
  } catch (error) {
    console.error(`❌ ${descricao} - Erro:`, error.message)
    return { success: false, error: error.message }
  }
}

// ===== TAREFAS AGENDADAS =====

// 1. Analisar novos leads diariamente às 9h
cron.schedule(SCHEDULES.analisarDiario, async () => {
  await executarComando('node analisarSites.js', 'Análise Diária de Sites')
})

console.log('📅 Agendado: Análise de sites todos os dias às 09:00')

// 2. Gerar diagnósticos e mensagens às 14h
cron.schedule(SCHEDULES.diagnosticarDiario, async () => {
  await executarComando('node gerarDiagnostico.js', 'Geração de Diagnósticos')
  await executarComando('node gerarMensagens.js', 'Geração de Mensagens')
})

console.log('📅 Agendado: Diagnósticos e mensagens todos os dias às 14:00')

// 3. Enviar mensagens de segunda a sexta às 10h
cron.schedule(SCHEDULES.enviarSemanal, async () => {
  await executarComando('node enviarWhatsapp.js', 'Envio de Mensagens WhatsApp')
})

console.log('📅 Agendado: Envio de mensagens segunda a sexta às 10:00')

// 4. Pipeline completo toda segunda às 8h
cron.schedule(SCHEDULES.pipelineCompleto, async () => {
  console.log('\n🚀 ===== PIPELINE COMPLETO SEMANAL =====')

  await executarComando('node importarPlanilha.js', 'Importação de Leads')
  await executarComando('node analisarSites.js', 'Análise de Sites')
  await executarComando('node gerarDiagnostico.js', 'Geração de Diagnósticos')
  await executarComando('node gerarMensagens.js', 'Geração de Mensagens')

  console.log('\n✅ ===== PIPELINE COMPLETO FINALIZADO =====\n')
})

console.log('📅 Agendado: Pipeline completo toda segunda-feira às 08:00')

// 5. Verificar novos leads a cada 2 horas no horário comercial
cron.schedule(SCHEDULES.verificarLeads, async () => {
  await executarComando('node analisarSites.js', 'Verificação de Novos Leads')
})

console.log('📅 Agendado: Verificação de leads a cada 2 horas (9h-18h)')

// ===== TAREFAS MANUAIS DISPONÍVEIS =====

// Exportar funções para uso manual
export async function executarPipelineCompleto() {
  console.log('\n🚀 Executando Pipeline Completo (Manual)...\n')

  await executarComando('node importarPlanilha.js', 'Importação de Leads')
  await executarComando('node analisarSites.js', 'Análise de Sites')
  await executarComando('node gerarDiagnostico.js', 'Geração de Diagnósticos')
  await executarComando('node gerarMensagens.js', 'Geração de Mensagens')

  console.log('\n✅ Pipeline Completo Finalizado!\n')
}

export async function analisarLeads() {
  await executarComando('node analisarSites.js', 'Análise de Sites (Manual)')
}

export async function gerarDiagnosticos() {
  await executarComando('node gerarDiagnostico.js', 'Geração de Diagnósticos (Manual)')
}

export async function gerarMensagens() {
  await executarComando('node gerarMensagens.js', 'Geração de Mensagens (Manual)')
}

export async function enviarMensagens() {
  await executarComando('node enviarWhatsapp.js', 'Envio de Mensagens (Manual)')
}

// ===== RELATÓRIO DE STATUS =====

// Relatório de status a cada 6 horas
cron.schedule('0 */6 * * *', () => {
  console.log('\n📊 ===== RELATÓRIO DE STATUS =====')
  console.log(`⏰ Horário: ${new Date().toLocaleString('pt-BR')}`)
  console.log('✅ Sistema de automação ativo')
  console.log('📅 Próximas execuções agendadas:')
  console.log('   - Análise diária: 09:00')
  console.log('   - Diagnósticos: 14:00')
  console.log('   - Envio WhatsApp: 10:00 (seg-sex)')
  console.log('   - Pipeline completo: 08:00 (segunda)')
  console.log('==================================\n')
})

console.log('\n✅ Sistema de automação configurado com sucesso!')
console.log('⏰ Aguardando horários agendados...')
console.log('💡 Use CTRL+C para parar o sistema\n')

// Manter o processo rodando
process.on('SIGINT', () => {
  console.log('\n\n👋 Sistema de automação finalizado')
  process.exit(0)
})

// Prevenir crash
process.on('uncaughtException', (error) => {
  console.error('❌ Erro não tratado:', error)
  console.log('🔄 Continuando execução...')
})
