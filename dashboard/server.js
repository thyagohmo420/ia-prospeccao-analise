import express from 'express'
import { createClient } from '@supabase/supabase-js'
import { config } from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'
import { exec } from 'child_process'
import { promisify } from 'util'

const execAsync = promisify(exec)

config()

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()
const PORT = process.env.PORT || 3000

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY)

app.use(express.json())
app.use(express.static(path.join(__dirname, 'public')))

// ===== DASHBOARD - ESTATÍSTICAS =====

app.get('/api/stats', async (req, res) => {
  try {
    const { data: empresas, error } = await supabase
      .from('empresas')
      .select('*')

    if (error) throw error

    const stats = {
      total: empresas.length,
      pendente: empresas.filter(e => e.status === 'pendente').length,
      analisado: empresas.filter(e => e.status === 'analisado').length,
      finalizado: empresas.filter(e => e.status === 'finalizado').length,
      mensagem_enviada: empresas.filter(e => e.status === 'mensagem_enviada').length,
      ultimo_update: empresas.length > 0 ? empresas[0].created_at : null
    }

    res.json(stats)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// ===== LISTAR LEADS =====

app.get('/api/leads', async (req, res) => {
  try {
    const { status, limit = 100 } = req.query

    let query = supabase
      .from('empresas')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit)

    if (status && status !== 'todos') {
      query = query.eq('status', status)
    }

    const { data: empresas, error } = await query

    if (error) throw error

    res.json(empresas)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// ===== DETALHES DE UM LEAD =====

app.get('/api/leads/:id', async (req, res) => {
  try {
    const { data: empresa, error } = await supabase
      .from('empresas')
      .select('*')
      .eq('id', req.params.id)
      .single()

    if (error) throw error

    res.json(empresa)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// ===== ATUALIZAR LEAD =====

app.put('/api/leads/:id', async (req, res) => {
  try {
    const { status, observacoes } = req.body

    const updateData = {}
    if (status) updateData.status = status
    if (observacoes !== undefined) updateData.observacoes = observacoes

    const { data, error } = await supabase
      .from('empresas')
      .update(updateData)
      .eq('id', req.params.id)
      .select()

    if (error) throw error

    res.json(data[0])
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// ===== DELETAR LEAD =====

app.delete('/api/leads/:id', async (req, res) => {
  try {
    const { error } = await supabase
      .from('empresas')
      .delete()
      .eq('id', req.params.id)

    if (error) throw error

    res.json({ success: true })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// ===== EXECUTAR PIPELINE =====

app.post('/api/pipeline/run', async (req, res) => {
  try {
    const { step } = req.body // 'importar', 'analisar', 'diagnosticar', 'mensagens', 'enviar', 'completo'

    const commands = {
      importar: 'node ../importarPlanilha.js',
      analisar: 'node ../analisarSites.js',
      diagnosticar: 'node ../gerarDiagnostico.js',
      mensagens: 'node ../gerarMensagens.js',
      enviar: 'node ../enviarWhatsapp.js',
      completo: 'node ../importarPlanilha.js && node ../analisarSites.js && node ../gerarDiagnostico.js && node ../gerarMensagens.js'
    }

    if (!commands[step]) {
      return res.status(400).json({ error: 'Etapa inválida' })
    }

    // Executar em background
    exec(commands[step], { cwd: path.join(__dirname, '..') }, (error, stdout, stderr) => {
      if (error) {
        console.error(`Erro ao executar ${step}:`, error)
      }
      console.log(`Pipeline ${step} concluído:`, stdout)
    })

    res.json({ success: true, message: `Pipeline ${step} iniciado em background` })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// ===== STATUS DO SISTEMA =====

app.get('/api/system/status', async (req, res) => {
  try {
    const status = {
      openai: !!process.env.OPENAI_API_KEY,
      supabase: !!process.env.SUPABASE_URL && !!process.env.SUPABASE_KEY,
      ultramsg: !!process.env.ULTRAMSG_INSTANCE_ID && !!process.env.ULTRAMSG_TOKEN,
      timestamp: new Date().toISOString()
    }

    res.json(status)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// ===== MÉTRICAS AVANÇADAS =====

app.get('/api/metrics', async (req, res) => {
  try {
    const { data: empresas, error } = await supabase
      .from('empresas')
      .select('*')

    if (error) throw error

    // Calcular métricas
    const totalLeads = empresas.length
    const comMensagem = empresas.filter(e => e.mensagem_ia).length
    const enviadas = empresas.filter(e => e.status === 'mensagem_enviada').length

    const metrics = {
      conversao_analise: totalLeads > 0 ? ((empresas.filter(e => e.analise_ia).length / totalLeads) * 100).toFixed(1) : 0,
      conversao_diagnostico: totalLeads > 0 ? ((empresas.filter(e => e.diagnostico).length / totalLeads) * 100).toFixed(1) : 0,
      conversao_mensagem: totalLeads > 0 ? ((comMensagem / totalLeads) * 100).toFixed(1) : 0,
      conversao_envio: comMensagem > 0 ? ((enviadas / comMensagem) * 100).toFixed(1) : 0,
      leads_por_status: {
        pendente: empresas.filter(e => e.status === 'pendente').length,
        analisado: empresas.filter(e => e.status === 'analisado').length,
        finalizado: empresas.filter(e => e.status === 'finalizado').length,
        mensagem_enviada: empresas.filter(e => e.status === 'mensagem_enviada').length
      }
    }

    res.json(metrics)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// ===== ADICIONAR LEAD MANUAL =====

app.post('/api/leads', async (req, res) => {
  try {
    const { nome, site, telefone } = req.body

    if (!nome || !site) {
      return res.status(400).json({ error: 'Nome e site são obrigatórios' })
    }

    const { data, error } = await supabase
      .from('empresas')
      .insert([{ nome, site, telefone, status: 'pendente' }])
      .select()

    if (error) throw error

    res.json(data[0])
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// ===== PÁGINA PRINCIPAL =====

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'))
})

// ===== INICIAR SERVIDOR =====

app.listen(PORT, () => {
  console.log(`🚀 Dashboard rodando em http://localhost:${PORT}`)
  console.log(`📊 Acesse o painel de controle no navegador`)
})
