import { createClient } from '@supabase/supabase-js'
import axios from 'axios'
import * as cheerio from 'cheerio' // ← Aqui está a correção
import { config } from 'dotenv'
import OpenAI from 'openai'

config()

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY)
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

async function analisarEmpresas() {
  const { data: empresas, error } = await supabase
    .from('empresas')
    .select('*')
    .eq('status', 'pendente')

  if (error) {
    console.error("Erro ao buscar empresas:", error.message)
    return
  }

  if (!empresas || empresas.length === 0) {
    console.log("Nenhuma empresa pendente encontrada.")
    return
  }

  for (const empresa of empresas) {
    try {
      const html = await axios.get(empresa.site).then(res => res.data)
      const $ = cheerio.load(html)
      const textoSite = $('body').text().replace(/\s+/g, ' ').slice(0, 4000)

      const prompt = `Com base no seguinte conteúdo extraído do site da empresa "${empresa.nome}":\n\n"${textoSite}"\n\nAnalise os produtos, serviços, segmento de atuação e possíveis dores dessa empresa. Retorne em formato estruturado.`

      const completion = await openai.chat.completions.create({
        model: 'gpt-4',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.7
      })

      const analise = completion.choices[0].message.content

      await supabase
        .from('empresas')
        .update({ analise_ia: analise, status: 'analisado' })
        .eq('id', empresa.id)

      console.log(`✔️ Análise feita: ${empresa.nome}`)

    } catch (err) {
      console.error(`Erro ao analisar ${empresa.nome}:`, err.message)
    }
  }
}

analisarEmpresas()
