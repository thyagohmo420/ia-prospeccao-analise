// Dashboard App JavaScript

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
    loadStats()
    loadMetrics()
    loadLeads()
    checkSystemStatus()

    // Auto-refresh a cada 30 segundos
    setInterval(() => {
        loadStats()
        loadMetrics()
    }, 30000)
})

// Carregar estatísticas
async function loadStats() {
    try {
        const response = await fetch('/api/stats')
        const stats = await response.json()

        document.getElementById('total-leads').textContent = stats.total
        document.getElementById('pendentes').textContent = stats.pendente
        document.getElementById('analisados').textContent = stats.analisado
        document.getElementById('finalizados').textContent = stats.finalizado
        document.getElementById('enviados').textContent = stats.mensagem_enviada
    } catch (error) {
        console.error('Erro ao carregar estatísticas:', error)
    }
}

// Carregar métricas
async function loadMetrics() {
    try {
        const response = await fetch('/api/metrics')
        const metrics = await response.json()

        // Atualizar barras de progresso
        updateProgress('metric-analise', metrics.conversao_analise)
        updateProgress('metric-diagnostico', metrics.conversao_diagnostico)
        updateProgress('metric-mensagem', metrics.conversao_mensagem)
        updateProgress('metric-envio', metrics.conversao_envio)

    } catch (error) {
        console.error('Erro ao carregar métricas:', error)
    }
}

// Atualizar barra de progresso
function updateProgress(id, value) {
    const element = document.getElementById(id)
    const valueElement = document.getElementById(id + '-value')

    element.style.width = value + '%'
    valueElement.textContent = value + '%'
}

// Carregar leads
async function loadLeads(status = 'todos') {
    try {
        const container = document.getElementById('leads-container')
        container.innerHTML = '<p class="loading">Carregando leads...</p>'

        const url = status === 'todos' ? '/api/leads' : `/api/leads?status=${status}`
        const response = await fetch(url)
        const leads = await response.json()

        if (leads.length === 0) {
            container.innerHTML = '<p class="loading">Nenhum lead encontrado.</p>'
            return
        }

        container.innerHTML = leads.map(lead => `
            <div class="lead-item">
                <div class="lead-info">
                    <h3>${lead.nome}</h3>
                    <div class="lead-meta">
                        <span>🌐 <a href="${lead.site}" target="_blank">${lead.site}</a></span>
                        ${lead.telefone ? `<span>📱 ${lead.telefone}</span>` : ''}
                        <span class="lead-status ${lead.status}">${getStatusLabel(lead.status)}</span>
                    </div>
                </div>
                <div class="lead-actions">
                    <button class="btn btn-primary btn-small" onclick="viewLead(${lead.id})">
                        👁️ Ver Detalhes
                    </button>
                    <button class="btn btn-danger btn-small" onclick="deleteLead(${lead.id})">
                        🗑️
                    </button>
                </div>
            </div>
        `).join('')
    } catch (error) {
        console.error('Erro ao carregar leads:', error)
        document.getElementById('leads-container').innerHTML =
            '<p class="loading">Erro ao carregar leads. Verifique a conexão.</p>'
    }
}

// Filtrar leads
function filterLeads() {
    const status = document.getElementById('filter-status').value
    loadLeads(status)
}

// Ver detalhes do lead
async function viewLead(id) {
    try {
        const response = await fetch(`/api/leads/${id}`)
        const lead = await response.json()

        const modalBody = document.getElementById('modal-body')
        modalBody.innerHTML = `
            <div class="modal-detail">
                <h4>Nome da Empresa</h4>
                <p>${lead.nome}</p>
            </div>
            <div class="modal-detail">
                <h4>Site</h4>
                <p><a href="${lead.site}" target="_blank">${lead.site}</a></p>
            </div>
            ${lead.telefone ? `
                <div class="modal-detail">
                    <h4>Telefone</h4>
                    <p>${lead.telefone}</p>
                </div>
            ` : ''}
            <div class="modal-detail">
                <h4>Status</h4>
                <p><span class="lead-status ${lead.status}">${getStatusLabel(lead.status)}</span></p>
            </div>
            ${lead.analise_ia ? `
                <div class="modal-detail">
                    <h4>Análise da IA</h4>
                    <p>${lead.analise_ia}</p>
                </div>
            ` : ''}
            ${lead.diagnostico ? `
                <div class="modal-detail">
                    <h4>Diagnóstico</h4>
                    <p>${lead.diagnostico}</p>
                </div>
            ` : ''}
            ${lead.mensagem_ia ? `
                <div class="modal-detail">
                    <h4>Mensagem Gerada</h4>
                    <p>${lead.mensagem_ia}</p>
                </div>
            ` : ''}
        `

        document.getElementById('modal-title').textContent = `Detalhes: ${lead.nome}`
        document.getElementById('lead-modal').classList.add('show')
    } catch (error) {
        console.error('Erro ao carregar detalhes:', error)
        alert('Erro ao carregar detalhes do lead')
    }
}

// Fechar modal
function closeModal() {
    document.getElementById('lead-modal').classList.remove('show')
}

// Fechar modal ao clicar fora
window.onclick = function(event) {
    const modal = document.getElementById('lead-modal')
    if (event.target === modal) {
        closeModal()
    }
}

// Deletar lead
async function deleteLead(id) {
    if (!confirm('Tem certeza que deseja deletar este lead?')) {
        return
    }

    try {
        const response = await fetch(`/api/leads/${id}`, {
            method: 'DELETE'
        })

        if (response.ok) {
            showPipelineStatus('Lead deletado com sucesso!', 'success')
            loadLeads()
            loadStats()
        } else {
            throw new Error('Erro ao deletar lead')
        }
    } catch (error) {
        console.error('Erro ao deletar lead:', error)
        showPipelineStatus('Erro ao deletar lead', 'error')
    }
}

// Adicionar lead manual
async function addLead(event) {
    event.preventDefault()

    const nome = document.getElementById('lead-nome').value
    const site = document.getElementById('lead-site').value
    const telefone = document.getElementById('lead-telefone').value

    try {
        const response = await fetch('/api/leads', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ nome, site, telefone })
        })

        if (response.ok) {
            showPipelineStatus('Lead adicionado com sucesso!', 'success')

            // Limpar formulário
            document.getElementById('lead-nome').value = ''
            document.getElementById('lead-site').value = ''
            document.getElementById('lead-telefone').value = ''

            loadLeads()
            loadStats()
        } else {
            throw new Error('Erro ao adicionar lead')
        }
    } catch (error) {
        console.error('Erro ao adicionar lead:', error)
        showPipelineStatus('Erro ao adicionar lead', 'error')
    }
}

// Executar pipeline
async function runPipeline(step) {
    const messages = {
        importar: 'Importando leads do CSV...',
        analisar: 'Analisando sites das empresas...',
        diagnosticar: 'Gerando diagnósticos...',
        mensagens: 'Gerando mensagens personalizadas...',
        enviar: 'Enviando mensagens via WhatsApp...',
        completo: 'Executando pipeline completo...'
    }

    showPipelineStatus(messages[step], 'success')

    try {
        const response = await fetch('/api/pipeline/run', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ step })
        })

        const result = await response.json()

        if (result.success) {
            showPipelineStatus(`${messages[step]} Pipeline iniciado em background!`, 'success')

            // Recarregar dados após alguns segundos
            setTimeout(() => {
                loadStats()
                loadMetrics()
                loadLeads()
            }, 5000)
        } else {
            throw new Error(result.error || 'Erro desconhecido')
        }
    } catch (error) {
        console.error('Erro ao executar pipeline:', error)
        showPipelineStatus(`Erro ao executar pipeline: ${error.message}`, 'error')
    }
}

// Mostrar status do pipeline
function showPipelineStatus(message, type) {
    const statusDiv = document.getElementById('pipeline-status')
    statusDiv.textContent = message
    statusDiv.className = `pipeline-status show ${type}`

    setTimeout(() => {
        statusDiv.classList.remove('show')
    }, 5000)
}

// Verificar status do sistema
async function checkSystemStatus() {
    try {
        const response = await fetch('/api/system/status')
        const status = await response.json()

        const indicator = document.getElementById('system-status')

        if (status.openai && status.supabase && status.ultramsg) {
            indicator.innerHTML = '<span class="pulse"></span> Sistema Online'
        } else {
            indicator.innerHTML = '<span class="pulse" style="background: #ef4444;"></span> Configuração Incompleta'
        }
    } catch (error) {
        console.error('Erro ao verificar status:', error)
        document.getElementById('system-status').innerHTML =
            '<span class="pulse" style="background: #ef4444;"></span> Sistema Offline'
    }
}

// Obter label do status
function getStatusLabel(status) {
    const labels = {
        pendente: 'Pendente',
        analisado: 'Analisado',
        finalizado: 'Finalizado',
        mensagem_enviada: 'Enviado'
    }
    return labels[status] || status
}
