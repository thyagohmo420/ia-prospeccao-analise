import { createClient } from '@supabase/supabase-js'
import { config } from 'dotenv'
import OpenAI from 'openai'

config()

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY)
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

async function gerarDiagnostico() {
  const { data: empresas } = await supabase
    .from('empresas')
    .select('*')
    .eq('status', 'analisado')
    .is('diagnostico', null)

  for (const empresa of empresas) {
    const prompt = `
Com base na seguinte análise de uma empresa:

"${empresa.analise_ia}"

Identifique os principais problemas e oportunidades onde a inteligência artificial pode ser aplicada. Classifique por área: Atendimento, Vendas, Processos, etc. Liste sugestões de solução com IA para cada um.
`

    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7
    })

    const diagnostico = completion.choices[0].message.content

    await supabase
      .from('empresas')
      .update({ diagnostico })
      .eq('id', empresa.id)

    console.log(`🧠 Diagnóstico gerado para ${empresa.nome}`)
  }
}

gerarDiagnostico()
