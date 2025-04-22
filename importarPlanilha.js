import { createClient } from '@supabase/supabase-js'
import fs from 'fs'
import csv from 'csv-parser'
import { config } from 'dotenv'

config()

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY)

const resultados = []

fs.createReadStream('Lista.csv')
  .pipe(csv({ separator: ',' }))
  .on('data', (data) => {
    if (data.Nome && data.Site && data.Telefone) {
      resultados.push({
        nome: data.Nome,
        site: data.Site,
        telefone: data.Telefone.replace(/\D/g, ''),
        status: 'pendente'
      })
    }
  })
  .on('end', async () => {
    try {
      const { data, error } = await supabase
        .from('empresas')
        .insert(resultados)

      if (error) {
        console.error('❌ Erro ao inserir dados:', error.message)
      } else {
        console.log(`✅ ${resultados.length} registros inseridos com sucesso!`)
      }
    } catch (err) {
      console.error('❌ Erro inesperado:', err.message)
    }
  })
