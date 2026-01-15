# 🚀 Início Rápido

## 3 Passos para Testar o Sistema (5 minutos)

### 1️⃣ Instalar Dependências
```bash
npm install
```

### 2️⃣ Configurar Credenciais
```bash
# Copiar arquivo de exemplo
cp .env.example .env

# Editar .env e adicionar suas chaves:
# - OPENAI_API_KEY (https://platform.openai.com/api-keys)
# - SUPABASE_URL e SUPABASE_KEY (https://supabase.com/dashboard)
# - Nome da sua clínica
```

### 3️⃣ Criar Banco de Dados
1. Abra Supabase → SQL Editor
2. Copie todo o conteúdo de `database-b2c.sql`
3. Execute no SQL Editor

### ✅ Testar
```bash
# Verificar instalação
npm run verificar

# Testar conexões (OpenAI + Supabase)
npm run testar

# Importar leads de exemplo
npm run b2c:importar leads-formulario-site.csv formulario_site

# Processar com IA
npm run b2c:pipeline
```

### 📊 Ver Resultados
Abra Supabase → Table Editor → `leads`

Você verá os leads com:
- Score de qualificação (0-100)
- Prioridade (urgente, alta, média, baixa)
- Mensagens personalizadas

---

## 📚 Documentação Completa

- **INSTALACAO-LOCAL.md** - Guia passo a passo completo
- **GUIA-B2C.md** - Manual completo do sistema
- **STATUS-SISTEMA.md** - Visão geral de tudo que foi criado

---

## 🎯 Comandos Principais

```bash
npm run verificar        # Verifica instalação
npm run testar          # Testa conexões (OpenAI + Supabase)
npm run b2c:importar    # Importar leads de CSV
npm run b2c:pipeline    # Qualificar + Gerar mensagens
npm run dashboard       # Dashboard web (localhost:3000)
```

---

**Sistema pronto para captar e converter pacientes! 🏥**
