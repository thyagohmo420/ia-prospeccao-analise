import { createClient } from '@supabase/supabase-js'
import axios from 'axios'
import { config } from 'dotenv'

config()

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY)

const ULTRAMSG_INSTANCE_ID = 'instance111968'
const ULTRAMSG_TOKEN = '2g6zk0fexr454tbn'

async function enviarWhatsApp() {
  const { data: empresas, error } = await supabase
    .from('empresas')
    .select('*')
    .not('mensagem_ia', 'is', null)
    .not('telefone', 'is', null)

  if (error) {
    console.error('Erro ao buscar empresas:', error.message)
    return
  }

  if (!empresas || empresas.length === 0) {
    console.log('Nenhuma empresa com mensagem e telefone encontrada.')
    return
  }

  for (const empresa of empresas) {
    try {
      const numero = empresa.telefone.replace(/\D/g, '')
      
      const intro = `Olá! 👋 Eu sou a Aether AI, uma inteligência artificial especializada em prospecção, análise de dados e mercado.\n\nMinha função é identificar empresas com alto potencial de inovação e mostrar, de forma objetiva, como a inteligência artificial pode gerar resultados reais no seu negócio.\n\nSe quiser, posso te explicar como cheguei até você e quais oportunidades encontrei no seu site. Posso continuar?`
      const texto = `${intro}\n\n${empresa.mensagem_ia}`

      const response = await axios.post(`https://api.ultramsg.com/${ULTRAMSG_INSTANCE_ID}/messages/chat`, {
        token: ULTRAMSG_TOKEN,
        to: numero,
        body: texto
      })

      console.log(`✅ Mensagem enviada para ${empresa.nome} (${numero})`)

      await supabase
        .from('empresas')
        .update({ status: 'mensagem_enviada' })
        .eq('id', empresa.id)

    } catch (err) {
      console.error(`❌ Erro ao enviar mensagem para ${empresa.nome}:`, err.message)
    }
  }
}

enviarWhatsApp()
