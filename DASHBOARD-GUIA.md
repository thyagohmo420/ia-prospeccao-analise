# 📊 Guia do Dashboard e Automação

Sistema completo de dashboard web e automação para gerenciar a prospecção de leads para clínica médica.

---

## 🚀 Início Rápido

### 1. Instalar novas dependências

```bash
npm install
```

### 2. Iniciar o Dashboard

```bash
npm run dashboard
```

O dashboard estará disponível em: **http://localhost:3000**

### 3. Iniciar a Automação (opcional)

```bash
npm run automacao
```

### 4. Iniciar Tudo de Uma Vez

```bash
npm run dev
```

Isso iniciará o dashboard e a automação simultaneamente.

---

## 📊 Funcionalidades do Dashboard

### Visão Geral

O dashboard fornece uma interface visual completa para gerenciar todo o processo de prospecção:

#### 1. **Estatísticas em Tempo Real**

- Total de leads no sistema
- Leads pendentes de análise
- Leads analisados
- Leads finalizados
- Mensagens enviadas

#### 2. **Métricas de Conversão**

Acompanhe a eficiência do funil de prospecção:

- % de análises concluídas
- % de diagnósticos gerados
- % de mensagens criadas
- % de taxa de envio

#### 3. **Controle do Pipeline**

Execute manualmente qualquer etapa do processo:

- **Importar Leads**: Carrega leads do CSV para o banco
- **Analisar Sites**: Analisa sites com IA
- **Gerar Diagnósticos**: Cria avaliação de potencial
- **Gerar Mensagens**: Cria mensagens personalizadas
- **Enviar WhatsApp**: Dispara mensagens
- **Pipeline Completo**: Executa todas as etapas automaticamente

#### 4. **Adicionar Lead Manual**

Adicione leads individuais diretamente pelo dashboard:

- Nome da empresa
- Site
- Telefone (opcional)

#### 5. **Lista de Leads**

Visualize todos os leads com:

- Filtros por status
- Visualização detalhada
- Ver análise da IA
- Ver diagnóstico
- Ver mensagem gerada
- Deletar leads

#### 6. **Detalhes Completos**

Clique em qualquer lead para ver:

- Análise completa do site
- Diagnóstico com score de potencial
- Mensagem personalizada gerada
- Status atual

---

## 🤖 Sistema de Automação

O sistema de automação executa tarefas automaticamente em horários pré-definidos usando agendamento inteligente.

### Tarefas Agendadas

#### 1. **Análise Diária de Sites**

- **Horário**: 09:00 todos os dias
- **Ação**: Analisa automaticamente todos os leads pendentes

#### 2. **Diagnósticos e Mensagens**

- **Horário**: 14:00 todos os dias
- **Ação**: Gera diagnósticos e mensagens para leads analisados

#### 3. **Envio de Mensagens WhatsApp**

- **Horário**: 10:00 (segunda a sexta-feira)
- **Ação**: Envia mensagens prontas via WhatsApp

#### 4. **Pipeline Completo Semanal**

- **Horário**: 08:00 (toda segunda-feira)
- **Ação**: Executa o pipeline completo do zero

#### 5. **Verificação de Novos Leads**

- **Horário**: A cada 2 horas (9h às 18h)
- **Ação**: Verifica e analisa novos leads adicionados

### Personalizar Agendamentos

Edite o arquivo `automacao.js` e modifique as constantes:

```javascript
const SCHEDULES = {
  analisarDiario: '0 9 * * *',      // 09:00 todos os dias
  diagnosticarDiario: '0 14 * * *',  // 14:00 todos os dias
  enviarSemanal: '0 10 * * 1-5',     // 10:00 seg-sex
  pipelineCompleto: '0 8 * * 1',     // 08:00 segunda
  verificarLeads: '0 9-18/2 * * *'   // A cada 2h (9h-18h)
}
```

**Formato Cron:**

```
* * * * *
│ │ │ │ │
│ │ │ │ └─── Dia da semana (0-7, 0 e 7 = domingo)
│ │ │ └───── Mês (1-12)
│ │ └─────── Dia do mês (1-31)
│ └───────── Hora (0-23)
└─────────── Minuto (0-59)
```

**Exemplos:**

- `0 9 * * *` = Todo dia às 9h
- `0 10 * * 1-5` = Segunda a sexta às 10h
- `*/30 * * * *` = A cada 30 minutos
- `0 */2 * * *` = A cada 2 horas

---

## 📡 APIs REST

O dashboard expõe APIs REST para integração com outros sistemas:

### Estatísticas

```http
GET /api/stats
```

Retorna estatísticas gerais do sistema.

### Métricas

```http
GET /api/metrics
```

Retorna métricas de conversão.

### Listar Leads

```http
GET /api/leads?status=pendente&limit=100
```

Parâmetros:

- `status`: pendente, analisado, finalizado, mensagem_enviada, todos
- `limit`: número máximo de resultados (padrão: 100)

### Detalhes de um Lead

```http
GET /api/leads/:id
```

### Adicionar Lead

```http
POST /api/leads
Content-Type: application/json

{
  "nome": "Empresa XYZ",
  "site": "https://empresa.com",
  "telefone": "11999887766"
}
```

### Atualizar Lead

```http
PUT /api/leads/:id
Content-Type: application/json

{
  "status": "finalizado"
}
```

### Deletar Lead

```http
DELETE /api/leads/:id
```

### Executar Pipeline

```http
POST /api/pipeline/run
Content-Type: application/json

{
  "step": "completo"
}
```

Opções de `step`:

- `importar`
- `analisar`
- `diagnosticar`
- `mensagens`
- `enviar`
- `completo`

### Status do Sistema

```http
GET /api/system/status
```

Verifica se todas as APIs estão configuradas.

---

## 🛠️ Comandos NPM

### Dashboard e Automação

```bash
npm run dashboard    # Inicia apenas o dashboard
npm run automacao    # Inicia apenas a automação
npm run dev          # Inicia dashboard + automação
```

### Pipeline Manual

```bash
npm run importar     # Importa leads do CSV
npm run start        # Analisa sites
npm run diagnostico  # Gera diagnósticos
npm run mensagens    # Gera mensagens
npm run enviar       # Envia via WhatsApp
npm run pipeline     # Executa tudo (exceto envio)
```

---

## 🎨 Interface do Dashboard

### Tela Principal

1. **Header**: Título e status do sistema
2. **Cards de Estatísticas**: Visão rápida dos números
3. **Métricas de Conversão**: Barras de progresso visuais
4. **Controle do Pipeline**: Botões para executar ações
5. **Adicionar Lead**: Formulário rápido
6. **Lista de Leads**: Tabela com filtros

### Recursos Visuais

- Design moderno e responsivo
- Cores e status visuais
- Atualização automática a cada 30 segundos
- Modal para detalhes completos
- Feedback visual de ações

---

## 📈 Monitoramento

### Logs da Automação

Os logs da automação mostram:

- Horários de execução
- Comandos executados
- Resultados (sucesso/erro)
- Relatórios de status a cada 6 horas

### Verificação de Status

O dashboard verifica automaticamente:

- Conexão com OpenAI
- Conexão com Supabase
- Configuração do UltraMsg
- Status em tempo real

---

## 🔧 Troubleshooting

### Dashboard não inicia

```bash
# Verifique se a porta 3000 está livre
lsof -i :3000

# Ou use outra porta
PORT=3001 npm run dashboard
```

### Automação não executa

- Verifique se o arquivo `.env` está configurado
- Confira os logs para erros
- Teste manualmente: `npm run pipeline`

### Leads não aparecem no dashboard

- Verifique a conexão com Supabase
- Confirme que a tabela `empresas` existe
- Teste a API: `curl http://localhost:3000/api/leads`

### Pipeline falha

- Verifique as credenciais no `.env`
- Teste cada etapa individualmente
- Veja os logs de erro no console

---

## 🚀 Workflow Recomendado

### Setup Inicial

1. Instale as dependências: `npm install`
2. Configure o `.env`
3. Crie a tabela no Supabase
4. Prepare o arquivo CSV com leads
5. Importe os leads: `npm run importar`

### Uso Diário

1. Inicie o sistema: `npm run dev`
2. Acesse o dashboard: `http://localhost:3000`
3. A automação cuidará do resto!
4. Monitore os resultados pelo dashboard

### Adição de Novos Leads

**Opção 1: CSV**

1. Adicione leads ao CSV
2. Execute: `npm run importar`
3. A automação processará automaticamente

**Opção 2: Dashboard**

1. Use o formulário "Adicionar Lead Manual"
2. O lead será processado no próximo agendamento

### Envio de Mensagens

**Automático:**

- Mensagens são enviadas automaticamente seg-sex às 10h

**Manual:**

1. No dashboard, clique em "Enviar WhatsApp"
2. Ou execute: `npm run enviar`

---

## 💡 Dicas de Uso

1. **Mantenha o sistema rodando**: Use `pm2` ou `forever` para rodar em produção
2. **Monitore regularmente**: Acesse o dashboard diariamente
3. **Ajuste os horários**: Personalize conforme sua necessidade
4. **Backup dos dados**: O Supabase já faz backup automático
5. **Teste antes de enviar**: Sempre teste com seu número primeiro

---

## 📊 Métricas de Sucesso

Acompanhe no dashboard:

- Taxa de conversão por etapa
- Tempo médio de processamento
- Qualidade das mensagens geradas
- Taxa de resposta (acompanhar manualmente)

---

## 🔐 Segurança

- Dashboard não possui autenticação (adicione se necessário)
- Use firewall para proteger a porta 3000
- Nunca exponha o `.env`
- Use HTTPS em produção

---

## 🎯 Próximas Melhorias

- [ ] Autenticação no dashboard
- [ ] Gráficos e charts avançados
- [ ] Exportar relatórios em PDF
- [ ] Integração com CRM
- [ ] Webhooks para eventos
- [ ] Notificações por email/Slack
- [ ] A/B testing de mensagens
- [ ] Score de qualidade dos leads

---

**Dashboard e automação prontos! Boa prospecção! 🚀**
