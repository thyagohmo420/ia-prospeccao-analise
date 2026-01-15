# 📥 Instalação Local - Passo a Passo

## 🎯 Guia Completo para Rodar o Sistema na Sua Máquina

### Pré-requisitos

Antes de começar, você precisa ter instalado:

- ✅ **Node.js** (versão 18 ou superior) - [Download](https://nodejs.org/)
- ✅ **Git** - [Download](https://git-scm.com/)
- ✅ Conta na **OpenAI** - [Criar conta](https://platform.openai.com/)
- ✅ Conta no **Supabase** - [Criar conta](https://supabase.com/)

---

## 📋 Passo 1: Clonar o Repositório

Abra o terminal/prompt e execute:

```bash
# Clone o repositório
git clone https://github.com/thyagohmo420/ia-prospeccao-analise.git

# Entre na pasta do projeto
cd ia-prospeccao-analise

# Mude para a branch de desenvolvimento
git checkout claude/ai-lead-prospecting-clinic-011CV6DdHvLUebpvBFf4uJnS
```

---

## 📦 Passo 2: Instalar Dependências

Ainda no terminal, dentro da pasta do projeto:

```bash
npm install
```

Isso vai instalar todas as bibliotecas necessárias (pode levar 1-2 minutos).

---

## ⚙️ Passo 3: Configurar Variáveis de Ambiente

### 3.1 - Criar arquivo .env

```bash
# No Windows (PowerShell)
copy .env.example .env

# No Mac/Linux
cp .env.example .env
```

### 3.2 - Obter Credenciais

#### **OpenAI API Key** 🔑

1. Acesse: https://platform.openai.com/api-keys
2. Faça login (ou crie conta)
3. Clique em **"Create new secret key"**
4. Dê um nome (ex: "Clinica Prospeccao")
5. Copie a chave (começa com `sk-...`)
6. **IMPORTANTE**: Você precisa ter créditos na conta OpenAI

#### **Supabase URL e Key** 🗄️

1. Acesse: https://supabase.com/dashboard
2. Faça login (ou crie conta gratuita)
3. Clique em **"New Project"**
4. Preencha:
   - Nome: `clinica-prospeccao`
   - Database Password: crie uma senha forte
   - Region: escolha mais próxima de você
5. Aguarde criação do projeto (1-2 minutos)
6. Vá em **Settings** (engrenagem no menu lateral)
7. Clique em **API**
8. Copie:
   - **Project URL** (ex: `https://xxxxx.supabase.co`)
   - **anon public** key (chave longa começando com `eyJ...`)

#### **UltraMsg (Opcional - para WhatsApp)** 📱

Se quiser enviar WhatsApp automaticamente:

1. Acesse: https://ultramsg.com/
2. Crie conta gratuita
3. Conecte seu WhatsApp
4. Copie:
   - **Instance ID**
   - **Token**

### 3.3 - Editar o arquivo .env

Abra o arquivo `.env` em um editor de texto (VS Code, Notepad++, Bloco de Notas) e preencha:

```env
# OpenAI
OPENAI_API_KEY=sk-proj-COLE_SUA_CHAVE_AQUI

# Supabase
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_KEY=eyJxxxxx_COLE_SUA_CHAVE_AQUI

# UltraMsg (WhatsApp) - Opcional
ULTRAMSG_INSTANCE_ID=instance123456
ULTRAMSG_TOKEN=seu_token_aqui

# Configurações da Clínica
NOME_CLINICA=Sua Clínica Médica
WHATSAPP_CLINICA=(11) 99999-9999
SITE_CLINICA=www.suaclinica.com.br
```

**Salve o arquivo!**

---

## 🗄️ Passo 4: Configurar Banco de Dados no Supabase

### 4.1 - Abrir SQL Editor

1. Acesse seu projeto no Supabase: https://supabase.com/dashboard
2. No menu lateral, clique em **SQL Editor**
3. Clique em **"New query"**

### 4.2 - Copiar e Executar o SQL

1. Abra o arquivo `database-b2c.sql` no seu editor de texto
2. **Copie TODO o conteúdo** (Ctrl+A, Ctrl+C)
3. **Cole** no SQL Editor do Supabase (Ctrl+V)
4. Clique em **"Run"** (ou pressione Ctrl+Enter)

Você deve ver: ✅ **Success. No rows returned**

### 4.3 - Verificar Criação

No menu lateral do Supabase:

1. Clique em **Table Editor**
2. Você deve ver as tabelas:
   - ✅ `leads`
   - ✅ `interacoes`
   - ✅ `campanhas`
   - ✅ `especialidades`

3. Clique em `especialidades` → deve ter 8 registros (Cardiologia, Dermatologia, etc)

---

## ✅ Passo 5: Verificar Instalação

No terminal, execute:

```bash
npm run verificar
```

Você deve ver:

```
✅ 10/10 arquivos OK
✅ 6/6 dependências OK
✅ 25 leads de exemplo prontos
```

Se aparecer algum ❌, revise os passos anteriores.

---

## 🚀 Passo 6: Testar com Dados de Exemplo

### 6.1 - Importar Leads de Teste

```bash
npm run b2c:importar leads-formulario-site.csv formulario_site
```

Você deve ver:
```
✅ Lead importado: Maria Silva
✅ Lead importado: João Santos
...
📊 Total: 15 leads importados
```

### 6.2 - Qualificar e Gerar Mensagens

```bash
npm run b2c:pipeline
```

Isso vai:
1. ✅ Qualificar leads com IA (calcula score 0-100)
2. ✅ Gerar mensagens personalizadas

Aguarde 30-60 segundos (a IA está processando).

### 6.3 - Ver Resultados no Supabase

1. Abra Supabase → **Table Editor** → `leads`
2. Você deve ver os 15 leads com:
   - ✅ **score_qualificacao** (ex: 75, 82, 90)
   - ✅ **prioridade** (urgente, alta, média, baixa)
   - ✅ **mensagem_ia** (mensagem personalizada)
   - ✅ **segmentacao** (tipo de necessidade)

### 6.4 - Importar Mais Leads (Opcional)

```bash
npm run b2c:importar leads-facebook-ads.csv facebook_ads
npm run b2c:pipeline
```

Agora você terá 25 leads no total!

---

## 📊 Passo 7: Usar o Dashboard (Opcional)

```bash
npm run dashboard
```

Abra no navegador: http://localhost:3000

Você verá:
- 📈 Estatísticas de leads
- 📋 Lista de leads
- 🎯 Conversão por fonte
- 📱 Status de envio

---

## 🎓 Comandos Principais

### Verificação
```bash
npm run verificar           # Verifica se está tudo configurado
```

### Importação
```bash
npm run b2c:importar <arquivo.csv> <fonte>

# Exemplos:
npm run b2c:importar leads-formulario-site.csv formulario_site
npm run b2c:importar leads-facebook-ads.csv facebook_ads
npm run b2c:importar meus-leads.csv indicacao
```

**Fontes disponíveis:**
- `formulario_site` - Formulário do site
- `facebook_ads` - Facebook Lead Ads
- `google_ads` - Google Ads
- `instagram` - Instagram
- `indicacao` - Indicações
- `evento` - Eventos presenciais
- `landing_page` - Landing pages

### Pipeline Completo
```bash
npm run b2c:pipeline        # Qualifica + Gera mensagens
```

### Ações Individuais
```bash
npm run b2c:qualificar      # Só qualificar leads
npm run b2c:mensagens       # Só gerar mensagens
npm run b2c:enviar          # Enviar via WhatsApp (requer UltraMsg)
```

### Dashboard e Automação
```bash
npm run dashboard           # Dashboard web (porta 3000)
npm run automacao           # Automação com cron jobs
```

---

## 📝 Formato do CSV para Importar Seus Próprios Leads

Crie um arquivo CSV com essas colunas (veja exemplos em `leads-formulario-site.csv`):

```csv
nome_completo,telefone,email,idade,genero,cidade,estado,queixas,especialidade,convenio
Maria Silva,11987654321,maria@email.com,35,F,São Paulo,SP,Dores nas costas há 2 meses,Ortopedia,Sim - Unimed
João Santos,11976543210,joao@email.com,42,M,Campinas,SP,Check-up anual,Clínica Geral,Não
```

**Campos obrigatórios:**
- `nome_completo`
- `telefone` (só números ou formatado)

**Campos opcionais mas recomendados:**
- `email`
- `queixas` (quanto mais detalhado, melhor a IA qualifica)
- `especialidade`
- `convenio` (Sim/Não ou nome do convênio)

---

## 🆘 Solução de Problemas

### ❌ Erro: "Cannot find module"
```bash
# Delete node_modules e reinstale
rm -rf node_modules package-lock.json  # Mac/Linux
# ou
rmdir /s node_modules & del package-lock.json  # Windows

npm install
```

### ❌ Erro: "Invalid API key" (OpenAI)
- Verifique se copiou a chave completa (começa com `sk-`)
- Confirme que tem créditos na conta OpenAI
- Verifique se não tem espaços antes/depois da chave no .env

### ❌ Erro: "Invalid Supabase URL"
- Confirme que a URL está completa: `https://xxxxx.supabase.co`
- Verifique se copiou a chave **anon public** (não a service_role)
- Confirme que executou o `database-b2c.sql`

### ❌ Erro: "ENOENT: no such file"
- Confirme que está na pasta correta do projeto
- Execute `npm run verificar` para ver quais arquivos faltam

### ❌ Nenhum lead foi importado
- Verifique se o arquivo CSV existe
- Confirme o formato do CSV (veja exemplos)
- Verifique se tem pelo menos `nome_completo` e `telefone`

### ❌ IA não está qualificando
- Execute `npm run verificar` e veja se .env está configurado
- Verifique se tem créditos na OpenAI
- Veja se executou o SQL no Supabase corretamente

---

## 🎉 Pronto!

Seu sistema está rodando! Agora você pode:

1. ✅ Importar seus próprios leads (crie um CSV)
2. ✅ Conectar formulários do site
3. ✅ Integrar com Facebook Lead Ads
4. ✅ Configurar automação (envios automáticos)
5. ✅ Personalizar mensagens (edite `gerarMensagensB2C.js`)

---

## 📚 Documentação Adicional

- **GUIA-B2C.md** - Guia completo do sistema B2C
- **STATUS-SISTEMA.md** - Visão geral de tudo que foi criado
- **SETUP-RAPIDO.md** - Comandos e fluxos de trabalho
- **DASHBOARD-GUIA.md** - Documentação do dashboard

---

## 💡 Dicas

1. **Teste primeiro com os CSVs de exemplo** antes de importar seus leads
2. **Revise as mensagens geradas** antes de enviar (elas ficam no Supabase)
3. **Ajuste os prompts** em `gerarMensagensB2C.js` conforme o tom da sua clínica
4. **Configure automação** depois que testar manualmente
5. **Faça backup** do banco de dados regularmente (Supabase → Database → Backups)

---

**Precisa de ajuda? Consulte a documentação ou revise este guia!** 🚀

**Tempo total de setup: 15-20 minutos** ⏱️
