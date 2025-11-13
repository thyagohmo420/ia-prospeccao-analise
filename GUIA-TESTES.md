# 🧪 Guia de Testes - Sistema de Prospecção para Clínica Médica

Este guia ajudará você a testar o sistema passo a passo após a configuração inicial.

---

## ✅ Pré-requisitos

Antes de começar os testes, certifique-se de que:

- [ ] Node.js está instalado (`node --version`)
- [ ] Dependências foram instaladas (`npm install`)
- [ ] Arquivo `.env` foi criado e configurado
- [ ] Tabela `empresas` foi criada no Supabase
- [ ] Todas as APIs estão com as chaves corretas

---

## 🔧 Teste 1: Validar Configuração

### Verificar se o ambiente está configurado corretamente

```bash
node -e "require('dotenv').config(); console.log('OpenAI:', process.env.OPENAI_API_KEY ? '✅' : '❌'); console.log('Supabase:', process.env.SUPABASE_URL ? '✅' : '❌'); console.log('UltraMsg:', process.env.ULTRAMSG_INSTANCE_ID ? '✅' : '❌');"
```

**Resultado esperado:** Todas as variáveis devem mostrar ✅

---

## 📥 Teste 2: Importar Leads

### Objetivo: Importar o arquivo CSV de exemplo para o Supabase

```bash
node importarPlanilha.js
```

**Resultado esperado:**
```
✅ Empresa importada: Accenture Brasil
✅ Empresa importada: Magazine Luiza
...
```

**Verificação no Supabase:**
1. Acesse o painel do Supabase
2. Vá para a tabela `empresas`
3. Verifique se os registros foram inseridos com `status = 'pendente'`

---

## 🔍 Teste 3: Analisar Sites

### Objetivo: Analisar os sites das empresas e gerar análises com IA

```bash
node analisarSites.js
```

**Resultado esperado:**
```
✔️ Análise feita: Accenture Brasil
✔️ Análise feita: Magazine Luiza
...
```

**Verificação no Supabase:**
1. Verifique se o campo `analise_ia` foi preenchido
2. Verifique se o `status` mudou para `'analisado'`
3. Leia a análise para ver se está contextualizada para clínica médica

**Análise deve conter:**
- Segmento de atuação
- Possíveis necessidades de serviços médicos
- Sinais de crescimento
- Cultura organizacional

---

## 🩺 Teste 4: Gerar Diagnósticos

### Objetivo: Criar diagnóstico personalizado para cada lead

```bash
node gerarDiagnostico.js
```

**Resultado esperado:**
```
🧠 Diagnóstico gerado para Accenture Brasil
🧠 Diagnóstico gerado para Magazine Luiza
...
```

**Verificação no Supabase:**
1. Verifique se o campo `diagnostico` foi preenchido
2. O diagnóstico deve conter:
   - Potencial de conversão (score 1-10)
   - Serviços médicos recomendados
   - Dores e necessidades identificadas
   - Gatilhos de venda
   - Abordagem sugerida

---

## 📩 Teste 5: Gerar Mensagens

### Objetivo: Criar mensagens personalizadas de prospecção

```bash
node gerarMensagens.js
```

**Resultado esperado:**
```
📩 Mensagem gerada para Accenture Brasil
📩 Mensagem gerada para Magazine Luiza
...
```

**Verificação no Supabase:**
1. Verifique se o campo `mensagem_ia` foi preenchido
2. Verifique se o `status` mudou para `'finalizado'`
3. Leia a mensagem para avaliar qualidade

**Mensagem deve:**
- Ser adequada para WhatsApp (3-4 parágrafos curtos)
- Demonstrar conhecimento sobre a empresa
- Mencionar serviços médicos relevantes
- Ter tom consultivo e profissional
- Terminar com convite para conversa

---

## 📤 Teste 6: Enviar via WhatsApp

### ⚠️ ATENÇÃO: Este teste enviará mensagens reais!

**Recomendação:** Teste primeiro com um número de telefone seu

### Modificar CSV para teste:

1. Crie um arquivo `teste.csv`:
```csv
Nome,Telefone,Site
Teste Lead,11999999999,https://www.exemplo.com.br
```

2. Importe apenas este lead de teste
3. Execute o pipeline completo
4. Envie a mensagem:

```bash
node enviarWhatsapp.js
```

**Resultado esperado:**
```
✅ Mensagem enviada para Teste Lead (11999999999)
```

**Verificação:**
1. Confira se recebeu a mensagem no WhatsApp
2. Verifique se o `status` mudou para `'mensagem_enviada'` no Supabase

---

## 🚀 Teste 7: Pipeline Completo

### Teste o fluxo completo automatizado (Windows)

```bash
executar-prospeccao.bat
```

**O que deve acontecer:**
1. Importar leads do CSV
2. Analisar todos os sites
3. Gerar diagnósticos
4. Gerar mensagens
5. Enviar via WhatsApp

**Tempo estimado:** Varia conforme número de leads (5-10 min para 15 leads)

---

## 🐛 Troubleshooting

### Erro: "OpenAI API Key inválida"
- Verifique se a chave está correta no `.env`
- Teste a chave em: https://platform.openai.com/api-keys

### Erro: "Supabase connection failed"
- Verifique se a URL e KEY estão corretas
- Teste a conexão no painel do Supabase

### Erro: "UltraMsg failed to send"
- Verifique se o instance ID e token estão corretos
- Confirme se a instância está ativa no UltraMsg

### Análise muito genérica
- Alguns sites podem ter pouco conteúdo
- Considere aumentar o limite de caracteres em `analisarSites.js:32`

### Mensagem não foi enviada
- Verifique se o campo `telefone` está no formato correto
- O número deve ter DDD + número (ex: 11999887766)

---

## 📊 Métricas de Sucesso

Após os testes, avalie:

- [ ] **Taxa de análise:** % de sites analisados com sucesso
- [ ] **Qualidade do diagnóstico:** Relevância dos serviços sugeridos
- [ ] **Qualidade da mensagem:** Tom, personalização, clareza
- [ ] **Taxa de envio:** % de mensagens enviadas com sucesso
- [ ] **Tempo de processamento:** Tempo total do pipeline

---

## 📈 Próximos Passos Após Testes

1. **Refinar prompts**: Ajustar conforme resultados dos testes
2. **Aumentar base de leads**: Adicionar mais empresas ao CSV
3. **Monitorar respostas**: Acompanhar taxa de resposta no WhatsApp
4. **Otimizar segmentação**: Focar nos leads com maior potencial
5. **Implementar follow-up**: Criar fluxo de follow-up automatizado

---

## 💡 Dicas

- Execute os testes em horário comercial para melhor análise
- Comece com 3-5 leads antes de processar a lista completa
- Salve exemplos de boas mensagens para referência
- Documente erros e ajustes necessários
- Monitore os custos da API OpenAI

---

**Boa sorte com os testes! 🚀**
