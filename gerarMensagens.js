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
Crie uma mensagem personalizada para o lead da empresa "${empresa.nome}".
Diagnóstico da empresa:
"${empresa.diagnostico}"

A mensagem deve ser objetiva, consultiva, com tom humano. Mostrar que conhecemos a empresa e temos uma solução de IA útil. Terminar com convite para reunião.
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
