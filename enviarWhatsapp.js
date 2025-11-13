import { createClient } from '@supabase/supabase-js'
import axios from 'axios'
import { config } from 'dotenv'

config()

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY)

const ULTRAMSG_INSTANCE_ID = process.env.ULTRAMSG_INSTANCE_ID
const ULTRAMSG_TOKEN = process.env.ULTRAMSG_TOKEN

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
      
      const texto = empresa.mensagem_ia

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
