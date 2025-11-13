# 🚀 Setup Rápido - Sistema B2C

## ✅ Checklist de Configuração

### 1. Configurar Arquivo .env

Copie o arquivo `.env.example` para `.env` e preencha com suas credenciais:

```bash
cp .env.example .env
```

Edite o arquivo `.env` e configure:

#### Obrigatórias:
- **OPENAI_API_KEY** - Sua chave da OpenAI (https://platform.openai.com/api-keys)
- **SUPABASE_URL** - URL do seu projeto Supabase
- **SUPABASE_KEY** - Chave anônima do Supabase (Settings > API)

#### Para envio de WhatsApp:
- **ULTRAMSG_INSTANCE_ID** - ID da instância UltraMsg
- **ULTRAMSG_TOKEN** - Token do UltraMsg

#### Informações da clínica:
- **NOME_CLINICA** - Nome da sua clínica
- **WHATSAPP_CLINICA** - Telefone de contato
- **SITE_CLINICA** - Site da clínica

### 2. Criar Banco de Dados no Supabase

1. Acesse seu projeto no Supabase
2. Vá em **SQL Editor**
3. Copie e cole o conteúdo do arquivo `database-b2c.sql`
4. Execute o script

Isso criará:
- ✅ Tabela `leads` (dados dos pacientes)
- ✅ Tabela `interacoes` (histórico)
- ✅ Tabela `campanhas` (campanhas de marketing)
- ✅ Tabela `especialidades` (8 especialidades pré-carregadas)
- ✅ Views de análise (métricas e conversão)

### 3. Testar com Dados de Exemplo

Após configurar o .env e o banco, teste com os CSVs de exemplo:

```bash
# Importar leads do formulário do site (15 leads)
npm run b2c:importar leads-formulario-site.csv formulario_site

# Importar leads do Facebook Ads (10 leads)
npm run b2c:importar leads-facebook-ads.csv facebook_ads

# Qualificar todos os leads com IA
npm run b2c:qualificar

# Gerar mensagens personalizadas
npm run b2c:mensagens
```

### 4. Visualizar Resultados

Acesse o Supabase e veja:
- Leads importados na tabela `leads`
- Score de qualificação (0-100)
- Prioridade (urgente/alta/média/baixa)
- Mensagens personalizadas geradas

### 5. Pipeline Completo (Automático)

Para rodar todo o fluxo de uma vez:

```bash
npm run b2c:pipeline
```

Isso executa:
1. Qualificação com IA
2. Geração de mensagens personalizadas

---

## 📊 Comandos Disponíveis

### Importação
```bash
npm run b2c:importar <arquivo.csv> <fonte>
```
Fontes: `formulario_site`, `facebook_ads`, `google_ads`, `instagram`, `indicacao`, `evento`, `landing_page`

### Qualificação
```bash
npm run b2c:qualificar
```
Qualifica leads novos com IA e calcula score

### Mensagens
```bash
npm run b2c:mensagens
```
Gera mensagens personalizadas para leads qualificados

### Envio WhatsApp
```bash
npm run b2c:enviar
```
Envia mensagens via WhatsApp (requer UltraMsg configurado)

### Pipeline Completo
```bash
npm run b2c:pipeline
```
Executa qualificação + geração de mensagens

### Dashboard
```bash
npm run dashboard
```
Inicia dashboard web em http://localhost:3000

### Automação
```bash
npm run automacao
```
Inicia sistema de automação com agendamentos

---

## 🎯 Fluxo Recomendado

### Primeira Vez:
1. ✅ Configure .env
2. ✅ Execute database-b2c.sql no Supabase
3. ✅ Teste com CSVs de exemplo
4. ✅ Verifique resultados no Supabase

### Uso Diário:
1. Importe novos leads (formulários, ads, etc)
2. Execute `npm run b2c:pipeline`
3. Revise mensagens no Supabase
4. Envie via WhatsApp ou manualmente

### Automação:
1. Configure `npm run automacao` como serviço
2. Define horários no arquivo `automacao.js`
3. Sistema roda automaticamente

---

## 🆘 Verificações Rápidas

### Teste de Conexão OpenAI
```bash
node -e "import('openai').then(m => console.log('✅ OpenAI module OK'))"
```

### Teste de Conexão Supabase
```bash
node -e "import('@supabase/supabase-js').then(m => console.log('✅ Supabase module OK'))"
```

### Verificar .env
```bash
cat .env
```

---

## 📚 Documentação Completa

- **GUIA-B2C.md** - Guia completo do sistema B2C
- **DASHBOARD-GUIA.md** - Guia do dashboard web
- **README.md** - Documentação geral

---

**Sistema pronto para captar e converter leads! 🏥💚**
