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
Com base na seguinte análise de uma empresa potencial lead:

"${empresa.analise_ia}"

Como especialista em prospecção para clínicas médicas, identifique:

1. **Potencial de Conversão**: Avalie de 1-10 o quanto esta empresa é um bom lead
2. **Serviços Recomendados**: Quais serviços médicos seriam mais relevantes (ex: convênio corporativo, medicina ocupacional, check-ups executivos, telemedicina, programas de bem-estar)
3. **Dores e Necessidades**: Quais problemas de saúde/bem-estar dos funcionários esta empresa pode estar enfrentando
4. **Gatilhos de Venda**: Identifique pontos específicos para abordar (crescimento, expansão, cultura de bem-estar, etc.)
5. **Abordagem Sugerida**: Como iniciar o contato de forma consultiva e personalizada

Seja específico e objetivo.
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
