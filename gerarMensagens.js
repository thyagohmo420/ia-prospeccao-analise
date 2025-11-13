import { createClient } from '@supabase/supabase-js'
import { config } from 'dotenv'
import OpenAI from 'openai'

config()

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY)
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

async function gerarMensagens() {
  const { data: empresas } = await supabase
    .from('empresas')
    .select('*')
    .not('diagnostico', 'is', null)
    .is('mensagem_ia', null)

  for (const empresa of empresas) {
    const prompt = `
Crie uma mensagem de WhatsApp personalizada para prospecção da empresa "${empresa.nome}" para nossa clínica médica.

Diagnóstico do lead:
"${empresa.diagnostico}"

Diretrizes para a mensagem:
- Tom profissional mas humano e amigável
- Máximo de 3-4 parágrafos curtos (adequado para WhatsApp)
- Demonstrar conhecimento sobre a empresa
- Destacar 1-2 serviços médicos mais relevantes para este lead
- Focar nos benefícios para os funcionários e empresa (produtividade, redução de absenteísmo, bem-estar)
- Incluir uma proposta de valor clara
- Terminar com convite leve para conversa (sem pressão de venda)
- Não usar emojis excessivos
- Não mencionar como obtivemos as informações

A mensagem deve parecer uma prospecção consultiva B2B de qualidade.
`

    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7
    })

    const mensagem = completion.choices[0].message.content

    await supabase
      .from('empresas')
      .update({ mensagem_ia: mensagem, status: 'finalizado' })
      .eq('id', empresa.id)

    console.log(`📩 Mensagem gerada para ${empresa.nome}`)
  }
}

gerarMensagens()
