# 🏥 IA de Prospecção para Clínica Médica – Sistema Inteligente de Captação de Leads

Sistema completo de automação de prospecção que utiliza inteligência artificial para captar leads corporativos para clínicas médicas:

- 📊 Análise automatizada de sites de empresas potenciais
- 🩺 Identificação de necessidades de serviços médicos
- 💡 Geração de diagnósticos personalizados por lead
- 📩 Criação e envio de mensagens consultivas via WhatsApp
- 🧠 Gestão completa no Supabase como CRM inteligente
- 📊 **Dashboard Web Interativo** - Gerencie tudo visualmente
- 🤖 **Automação Inteligente** - Execução agendada automática

---

## ⚡ Início Rápido

```bash
# 1. Instalar dependências
npm install

# 2. Configurar .env (copie do .env.example e preencha)
cp .env.example .env

# 3. Iniciar Dashboard + Automação
npm run dev
```

Acesse o dashboard em: **http://localhost:3000**

---

## 🚀 Funcionalidades

### Core Features

- 🔍 **Análise Inteligente**: Analisa sites de empresas para identificar oportunidades
- 📈 **Diagnóstico Personalizado**: IA avalia potencial do lead e sugere serviços médicos relevantes
- ✍️ **Mensagens Consultivas**: Geração automática de mensagens personalizadas B2B
- 📤 **Disparo Automatizado**: Envio via WhatsApp através do UltraMsg
- ☁️ **CRM Integrado**: Todos os dados armazenados no Supabase em tempo real
- 🔄 **Controle de Status**: Acompanhamento do funil de prospecção
- 🎯 **Segmentação**: Identifica os melhores leads e serviços para cada empresa

### Dashboard Web

- 📊 **Estatísticas em Tempo Real**: Visualize métricas instantaneamente
- 📈 **Métricas de Conversão**: Acompanhe a eficiência do funil
- ⚙️ **Controle do Pipeline**: Execute qualquer etapa manualmente
- ➕ **Adicionar Leads**: Interface para adicionar leads individualmente
- 📋 **Gestão de Leads**: Visualize, filtre e gerencie todos os leads
- 🔍 **Detalhes Completos**: Veja análises, diagnósticos e mensagens

### Automação

- ⏰ **Análise Diária**: Analisa novos leads automaticamente às 9h
- 🧠 **Diagnósticos Automáticos**: Gera diagnósticos às 14h
- 📤 **Envio Automático**: Envia mensagens seg-sex às 10h
- 🚀 **Pipeline Semanal**: Executa pipeline completo toda segunda às 8h
- 🔄 **Verificação Periódica**: Checa novos leads a cada 2 horas

---

## 📁 Estrutura do Projeto

```
ia-prospeccao-analise/
├── analisarSites.js          # Analisa sites e identifica necessidades
├── gerarDiagnostico.js       # Cria diagnóstico de potencial do lead
├── gerarMensagens.js         # Gera mensagens personalizadas
├── enviarWhatsapp.js         # Envia mensagens via UltraMsg
├── importarPlanilha.js       # Importa leads do CSV para Supabase
├── automacao.js              # Sistema de automação com agendamento
├── leads-clinica-medica.csv  # Exemplo de arquivo com leads
├── executar-prospeccao.bat   # Script para executar pipeline completo
├── dashboard/                # Dashboard web
│   ├── server.js            # Servidor Express + APIs REST
│   └── public/              # Interface do dashboard
│       ├── index.html       # Página principal
│       ├── css/style.css    # Estilos
│       └── js/app.js        # Lógica do frontend
├── DASHBOARD-GUIA.md         # Documentação do dashboard
├── GUIA-TESTES.md            # Guia de testes
└── .env                      # Configurações (não commitar!)
```

---

## 🛠️ Tecnologias Utilizadas

- **Node.js** - Runtime JavaScript
- **OpenAI GPT-4** - Análise inteligente e geração de conteúdo
- **Supabase** - Banco de dados e CRM
- **Express** - Framework web para APIs e dashboard
- **Cheerio** - Web scraping dos sites
- **UltraMsg** - API para envio via WhatsApp
- **Axios** - Requisições HTTP
- **node-cron** - Agendamento de tarefas automáticas

---

## ⚙️ Configuração

### 1. Instalar dependências

```bash
npm install
```

### 2. Configurar variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis:

```env
# OpenAI
OPENAI_API_KEY=sua-chave-openai

# Supabase
SUPABASE_URL=sua-url-supabase
SUPABASE_KEY=sua-chave-supabase

# UltraMsg (WhatsApp)
ULTRAMSG_INSTANCE_ID=seu-instance-id
ULTRAMSG_TOKEN=seu-token
```

### 3. Criar tabela no Supabase

Execute este SQL no seu projeto Supabase:

```sql
CREATE TABLE empresas (
  id BIGSERIAL PRIMARY KEY,
  nome TEXT NOT NULL,
  site TEXT,
  telefone TEXT,
  status TEXT DEFAULT 'pendente',
  analise_ia TEXT,
  diagnostico TEXT,
  mensagem_ia TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);
```

---

## 🎯 Como Usar

### Opção 1: Dashboard e Automação (Recomendado)

```bash
# Iniciar dashboard + automação
npm run dev

# Ou separadamente:
npm run dashboard   # Apenas dashboard (http://localhost:3000)
npm run automacao   # Apenas automação agendada
```

**O sistema ficará 100% automatizado!** A automação cuidará de tudo nos horários agendados.

📖 **Documentação completa**: Veja [DASHBOARD-GUIA.md](DASHBOARD-GUIA.md)

### Opção 2: Comandos NPM

```bash
npm run importar     # Importa leads do CSV
npm start            # Analisa sites
npm run diagnostico  # Gera diagnósticos
npm run mensagens    # Gera mensagens
npm run enviar       # Envia via WhatsApp
npm run pipeline     # Executa tudo (exceto envio)
```

### Opção 3: Pipeline Completo (Windows)

Execute o arquivo `executar-prospeccao.bat` que rodará todos os passos automaticamente:

```bash
executar-prospeccao.bat
```

### Opção 4: Passo a Passo Manual

#### 1. Importar Leads

Prepare um arquivo CSV com as colunas: `Nome`, `Telefone`, `Site`

Use o arquivo `leads-clinica-medica.csv` como exemplo.

```bash
node importarPlanilha.js
```

#### 2. Analisar Sites

Analisa os sites das empresas e identifica necessidades:

```bash
node analisarSites.js
```

#### 3. Gerar Diagnósticos

Cria diagnóstico personalizado avaliando potencial e serviços relevantes:

```bash
node gerarDiagnostico.js
```

#### 4. Gerar Mensagens

Cria mensagens personalizadas de prospecção:

```bash
node gerarMensagens.js
```

#### 5. Enviar via WhatsApp

Dispara as mensagens via UltraMsg:

```bash
node enviarWhatsapp.js
```

---

## 📊 Fluxo de Dados

```
CSV com Leads
    ↓
[Importar] → Supabase (status: pendente)
    ↓
[Analisar Sites] → GPT-4 analisa site (status: analisado)
    ↓
[Diagnosticar] → GPT-4 identifica oportunidades
    ↓
[Gerar Mensagem] → GPT-4 cria mensagem consultiva (status: finalizado)
    ↓
[Enviar WhatsApp] → UltraMsg envia mensagem (status: mensagem_enviada)
```

---

## 🏥 Tipos de Leads Ideais

Este sistema é otimizado para captar leads corporativos que precisam de:

- 🏢 **Convênios Corporativos**: Empresas de médio/grande porte
- 👨‍⚕️ **Medicina Ocupacional**: Indústrias, escritórios, varejo
- 💼 **Check-ups Executivos**: Empresas com foco em C-level
- 🏃 **Programas de Bem-estar**: Empresas com cultura de saúde
- 💻 **Telemedicina**: Empresas tech ou com trabalho remoto
- 🚑 **Atendimento de Urgência**: Empresas com operação 24/7

---

## 🎯 Exemplos de Leads

O arquivo `leads-clinica-medica.csv` contém exemplos de empresas brasileiras como:

- Empresas de tecnologia (iFood, Nubank, QuintoAndar)
- Varejo (Magazine Luiza, Ambev, Natura)
- Serviços (Accenture, Stone, Porto Seguro)
- Operação 24/7 (Smart Fit, Localiza)

---

## 🔒 Segurança

- ⚠️ **NUNCA** commite o arquivo `.env` com suas credenciais
- 🔐 Mantenha suas chaves de API seguras
- 📝 Use `.env.example` como template
- 🚫 O `.gitignore` já está configurado para proteger dados sensíveis

---

## 📈 Próximos Passos

- [ ] Implementar score automático de leads
- [ ] Adicionar follow-up automático
- [ ] Integrar com calendário para agendamentos
- [ ] Dashboard de métricas de conversão
- [ ] Integração com CRM existente
- [ ] Testes A/B de mensagens

---

## 🤝 Suporte

Para dúvidas ou problemas:

1. Verifique se todas as variáveis de ambiente estão configuradas
2. Confirme que a tabela no Supabase foi criada corretamente
3. Teste as APIs (OpenAI, Supabase, UltraMsg) individualmente
4. Verifique os logs no console para mensagens de erro

---

## 📝 Licença

Este projeto é de uso interno. Todos os direitos reservados.

---

**Desenvolvido com ❤️ e IA para revolucionar a captação de leads médicos**
