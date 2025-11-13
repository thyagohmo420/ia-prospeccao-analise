# 🏥 Sistema de Prospecção B2C - Clínica Médica

Sistema completo de captação e qualificação de leads pessoas físicas para clínicas médicas, com IA avançada para segmentação e conversão.

---

## 🎯 Diferenças B2B vs B2C

### B2B (Empresas) - Sistema Antigo
- Análise de sites corporativos
- Foco em convênios corporativos
- Mensagens profissionais formais
- Ciclo de vendas mais longo

### B2C (Pessoas Físicas) - Sistema Novo ✨
- Captação de leads individuais
- Múltiplas fontes (formulários, ads, eventos)
- Mensagens empáticas e personalizadas
- Foco em conversão rápida (agendamento)
- Score de qualificação inteligente
- Segmentação por especialidade médica

---

## 📊 Estrutura do Banco de Dados

Execute o arquivo `database-b2c.sql` no Supabase para criar:

### Tabelas Principais:

1. **leads** - Dados completos dos leads pessoas físicas
2. **interacoes** - Histórico de todas as interações
3. **campanhas** - Controle de campanhas de marketing
4. **especialidades** - Especialidades médicas disponíveis

### Campos Importantes:

```sql
leads:
  - Dados pessoais: nome, email, telefone, idade, gênero
  - Localização: cidade, estado, CEP
  - Médico: queixas, especialidade_interesse, convênio
  - Qualificação: score (0-100), prioridade, segmentação
  - IA: analise_ia, mensagem_ia, melhor_abordagem
  - Conversão: agendamento_realizado, convertido_em_paciente
```

---

## 🚀 Início Rápido

### 1. Configurar Banco de Dados

```bash
# Execute no Supabase SQL Editor
psql -f database-b2c.sql
```

### 2. Configurar Variáveis de Ambiente

Adicione ao `.env`:

```env
# Já existentes
OPENAI_API_KEY=sua-chave
SUPABASE_URL=sua-url
SUPABASE_KEY=sua-key
ULTRAMSG_INSTANCE_ID=seu-id
ULTRAMSG_TOKEN=seu-token

# Novas para B2C
NOME_CLINICA=Clínica Saúde Completa
WHATSAPP_CLINICA=(11) 99999-9999
SITE_CLINICA=www.saudecompleta.com.br
```

### 3. Importar Leads

```bash
# Importar do formulário do site
npm run b2c:importar leads-formulario-site.csv formulario_site

# Importar do Facebook Ads
npm run b2c:importar leads-facebook-ads.csv facebook_ads

# Ver ajuda
node importarLeadsB2C.js
```

### 4. Qualificar Leads com IA

```bash
npm run b2c:qualificar
```

### 5. Gerar Mensagens Personalizadas

```bash
npm run b2c:mensagens
```

### 6. Enviar via WhatsApp

```bash
npm run b2c:enviar
```

### 7. Pipeline Completo

```bash
npm run b2c:pipeline
```

---

## 📥 Fontes de Captação de Leads

### 1. Formulário do Site

**Campos recomendados:**
- Nome completo *
- Telefone/WhatsApp *
- Email
- Idade
- Queixas/Motivo do contato
- Especialidade de interesse
- Convênio

**Exemplo de implementação:**

```html
<form action="/api/lead" method="POST">
  <input type="text" name="nome_completo" required>
  <input type="tel" name="telefone" required>
  <input type="email" name="email">
  <select name="especialidade">
    <option>Clínica Geral</option>
    <option>Cardiologia</option>
    <!-- ... -->
  </select>
  <textarea name="queixas"></textarea>
  <button type="submit">Agendar Consulta</button>
</form>
```

### 2. Facebook Lead Ads

**Configuração recomendada:**
- Formulário instantâneo do Facebook
- Perguntas: Nome, Telefone, Email, Interesse
- Integração via Zapier ou API do Facebook
- Exportar e importar via CSV

**CSV esperado:**
```
nome_completo,telefone,email,queixas,campanha
```

### 3. Google Ads

**Landing page com formulário:**
- Use Google Tag Manager
- Capture informações essenciais
- Integre com Zapier ou webhook
- Importar via CSV

### 4. Instagram

**Link na bio para formulário:**
- Landing page específica
- Formulário curto (nome e WhatsApp)
- CTA direto para agendamento

### 5. Eventos e Palestras

**Captura presencial:**
- Lista de presença digital (Google Forms)
- QR Code para cadastro
- Campos: nome, telefone, interesse

**CSV de evento:**
```csv
nome_completo,telefone,email,cidade,queixas,fonte
```

### 6. Indicações

**Sistema de indicações:**
- Pacientes indicam amigos
- Campo "indicado_por"
- Fonte: "indicacao"

### 7. Chatbot

**WhatsApp/Site:**
- Captura automática via chatbot
- Integração com Supabase via API
- Qualificação inicial automatizada

---

## 🎯 Sistema de Qualificação

### Score de Qualificação (0-100)

**Como funciona:**

Base: 50 pontos

**Pontos extras:**
- +10: Tem email
- +15: Queixas específicas e detalhadas
- +10: Já identificou especialidade
- +5: Tem convênio
- +5: Informou idade
- +15: IA identificou urgência
- +10: Alta prioridade pela IA
- -10: Baixa prioridade pela IA

**Interpretação:**
- 80-100: Lead excelente (contatar HOJE)
- 60-79: Lead bom (contatar em 24h)
- 40-59: Lead médio (contatar em 48h)
- 0-39: Lead frio (nutrir antes)

### Prioridades

**Urgente:**
- Sintomas graves mencionados
- Palavras-chave: dor forte, sangramento, emergência
- Contato IMEDIATO

**Alta:**
- Score ≥ 80
- Queixas específicas
- Convênio confirmado

**Média:**
- Score 60-79
- Interesse geral
- Check-up preventivo

**Baixa:**
- Score < 60
- Informações incompletas
- Apenas curiosidade

### Segmentações

1. **Check-up preventivo**
   - Pessoas saudáveis querendo prevenir
   - Foco: benefícios da prevenção

2. **Tratamento específico**
   - Queixa/sintoma definido
   - Foco: solução para o problema

3. **Emergência/Urgência**
   - Necessita atendimento rápido
   - Foco: disponibilidade imediata

4. **Acompanhamento contínuo**
   - Doenças crônicas (diabetes, pressão)
   - Foco: plano de acompanhamento

5. **Primeiro contato**
   - Nunca consultou especialista
   - Foco: educação + facilitar

---

## 💬 Mensagens Personalizadas

### Estrutura das Mensagens

**Tom:**
- Empático e acolhedor
- Profissional mas humano
- Linguagem simples

**Exemplo de mensagem gerada pela IA:**

```
Olá Maria! 👋

Vi que você entrou em contato através do nosso site mencionando dores de cabeça frequentes.

Entendo como isso pode ser desconfortável no dia a dia. Nosso time de Clínica Geral está preparado para te ajudar a identificar a causa e encontrar o melhor tratamento.

A boa notícia é que atendemos seu convênio Unimed! 😊

Que tal agendar uma consulta ainda esta semana? Temos horários disponíveis. É só me responder qual melhor dia e horário para você!

Estou aqui para ajudar!
Clínica Saúde Completa
```

### Adaptação por Urgência

**Urgente:**
```
Olá João!

Vi sua mensagem sobre dor no peito. Isso precisa de atenção IMEDIATA.

Temos disponibilidade HOJE para te atender com nosso cardiologista.

Posso agendar para você ainda hoje às 14h ou 16h?

Aguardo sua resposta!
```

**Preventivo:**
```
Oi Ana!

Que legal que você está cuidando da sua saúde! 💚

Check-ups preventivos são fundamentais. Vamos agendar sua consulta com nosso clínico geral?

Qual melhor semana para você?
```

---

## 📈 Métricas e Análise

### Principais Métricas

**Taxa de Conversão por Fonte:**
```sql
SELECT * FROM conversao_por_fonte;
```

**Performance por Especialidade:**
```sql
SELECT * FROM performance_especialidades;
```

**Leads Mais Promissores:**
```sql
SELECT * FROM leads_promissores LIMIT 20;
```

### Dashboard Analytics

Acesse o dashboard para ver:
- Leads por fonte
- Taxa de conversão
- Score médio
- Agendamentos realizados
- Receita por especialidade

---

## 🔄 Workflow Recomendado

### Diário (Automático)

1. **09:00** - Importar novos leads (formulários, ads)
2. **09:30** - Qualificar leads com IA
3. **10:00** - Gerar mensagens personalizadas
4. **10:30** - Enviar mensagens prioritárias
5. **14:00** - Enviar mensagens médias
6. **16:00** - Follow-up de leads sem resposta

### Semanal

1. Analisar métricas de conversão
2. Ajustar campanhas com baixo ROI
3. Treinar equipe com melhores práticas
4. Atualizar mensagens sazonais

### Mensal

1. Review de todas as fontes
2. Análise de especialidades mais procuradas
3. Ajuste de valores e convênios
4. Otimização de formulários

---

## 🎨 Customização

### Especialidades da Clínica

Edite no SQL ou via dashboard:

```sql
INSERT INTO especialidades (nome, descricao, palavras_chave, valor_consulta_particular)
VALUES (
  'Nutrição',
  'Acompanhamento nutricional',
  ARRAY['dieta', 'emagrecimento', 'alimentacao'],
  250.00
);
```

### Mensagens Padrão

Configure no `.env`:

```env
MENSAGEM_BOAS_VINDAS=Olá! Seja bem-vindo à {NOME_CLINICA}
MENSAGEM_CONFIRMACAO=Consulta agendada para {DATA} às {HORA}
```

---

## 🔧 Integrações Avançadas

### 1. API para Formulários

```javascript
// Endpoint para receber leads do site
app.post('/api/lead', async (req, res) => {
  const { nome_completo, telefone, email, queixas } = req.body

  const lead = await supabase
    .from('leads')
    .insert([{
      nome_completo,
      telefone,
      email,
      queixas_principais: queixas,
      fonte: 'formulario_site',
      status: 'novo'
    }])

  res.json({ success: true })
})
```

### 2. Webhook Facebook Leads

```javascript
app.post('/webhook/facebook', async (req, res) => {
  const leads = req.body.entry[0].changes[0].value.leads

  for (const lead of leads) {
    await importarFacebookLeads([lead], 'campanha-facebook')
  }

  res.json({ success: true })
})
```

### 3. Zapier Integration

Crie um Zap:
1. Trigger: New Lead (Facebook/Google)
2. Action: HTTP POST to your API
3. Action: Add to Supabase

---

## 📱 Exemplos de CSV

### leads-formulario-site.csv
Leads capturados via formulário do site da clínica

### leads-facebook-ads.csv
Leads de campanhas pagas no Facebook

### leads-evento-saude.csv
Captura presencial em eventos

**Colunas obrigatórias:**
- `nome_completo`
- `telefone`

**Colunas opcionais:**
- `email`, `idade`, `genero`, `cidade`, `estado`
- `queixas`, `especialidade`, `convenio`
- `campanha`, `midia_social`

---

## 🚨 Troubleshooting

### Leads não estão sendo qualificados

1. Verifique se status = 'novo'
2. Confirme API Key da OpenAI
3. Veja logs de erro

### Mensagens muito genéricas

1. Adicione mais informações no lead
2. Melhore campo "queixas"
3. Ajuste prompt da IA

### Score muito baixo

1. Capture mais dados nos formulários
2. Incentive detalhamento das queixas
3. Ofereça campo de especialidade

---

## 📊 Relatórios Prontos

### Leads Hoje

```sql
SELECT COUNT(*) as total
FROM leads
WHERE DATE(created_at) = CURRENT_DATE;
```

### Taxa de Conversão Geral

```sql
SELECT
  COUNT(*) as total_leads,
  COUNT(CASE WHEN convertido_em_paciente THEN 1 END) as convertidos,
  ROUND(COUNT(CASE WHEN convertido_em_paciente THEN 1 END)::NUMERIC / COUNT(*)::NUMERIC * 100, 2) as taxa
FROM leads;
```

### Melhor Fonte de Leads

```sql
SELECT fonte, COUNT(*) as total
FROM leads
WHERE convertido_em_paciente = true
GROUP BY fonte
ORDER BY total DESC;
```

---

## 🎓 Próximos Passos

- [ ] Integrar com sistema de agendamento
- [ ] Criar fluxo de follow-up automatizado
- [ ] Implementar chatbot WhatsApp
- [ ] Dashboard analytics avançado
- [ ] Sistema de remarketing
- [ ] Score ML preditivo
- [ ] Integração com prontuário eletrônico

---

## 💡 Dicas de Sucesso

1. **Capture leads constantemente** - Quanto mais fontes, melhor
2. **Responda rápido** - Leads urgentes em < 1h
3. **Personalize sempre** - Use nome e contexto
4. **Teste mensagens** - A/B test regularmente
5. **Analise métricas** - Tome decisões baseadas em dados
6. **Facilite agendamento** - Quanto mais fácil, maior conversão
7. **Follow-up persistente** - 3-5 tentativas antes de desistir

---

**Sistema B2C pronto para captar e converter leads! 🚀🏥**
