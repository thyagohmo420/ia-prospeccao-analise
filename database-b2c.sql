-- ======================================
-- ESTRUTURA DE BANCO PARA LEADS B2C
-- Clínica Médica - Pessoas Físicas
-- ======================================

-- Tabela principal de leads
CREATE TABLE leads (
  id BIGSERIAL PRIMARY KEY,

  -- Dados pessoais
  nome_completo TEXT NOT NULL,
  email TEXT,
  telefone TEXT NOT NULL,
  cpf TEXT,
  data_nascimento DATE,
  idade INTEGER,
  genero TEXT, -- 'masculino', 'feminino', 'outro', 'prefiro_nao_informar'

  -- Localização
  cidade TEXT,
  estado TEXT,
  cep TEXT,

  -- Informações médicas
  queixas_principais TEXT, -- Sintomas ou motivos de interesse
  especialidade_interesse TEXT, -- Ex: Cardiologia, Dermatologia, etc
  tem_convenio BOOLEAN DEFAULT false,
  nome_convenio TEXT,

  -- Origem do lead
  fonte TEXT NOT NULL, -- 'formulario_site', 'facebook_ads', 'google_ads', 'indicacao', 'evento', 'landing_page', 'instagram', 'manual'
  campanha TEXT, -- Nome da campanha de origem
  midia_social TEXT, -- Se veio de rede social

  -- Qualificação
  score_qualificacao INTEGER DEFAULT 0, -- 0-100
  prioridade TEXT DEFAULT 'media', -- 'baixa', 'media', 'alta', 'urgente'
  status TEXT DEFAULT 'novo', -- 'novo', 'qualificado', 'contatado', 'agendado', 'convertido', 'perdido'

  -- IA e análise
  analise_ia TEXT, -- Análise da IA sobre o perfil
  segmentacao TEXT, -- Segmento identificado pela IA
  mensagem_ia TEXT, -- Mensagem personalizada gerada
  melhor_abordagem TEXT, -- Sugestão de como abordar

  -- Interações
  data_primeiro_contato TIMESTAMP,
  data_ultimo_contato TIMESTAMP,
  numero_tentativas_contato INTEGER DEFAULT 0,
  observacoes TEXT,

  -- Conversão
  agendamento_realizado BOOLEAN DEFAULT false,
  data_agendamento TIMESTAMP,
  especialidade_agendada TEXT,
  valor_consulta DECIMAL(10,2),
  convertido_em_paciente BOOLEAN DEFAULT false,

  -- Metadados
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Índices para performance
CREATE INDEX idx_leads_telefone ON leads(telefone);
CREATE INDEX idx_leads_status ON leads(status);
CREATE INDEX idx_leads_fonte ON leads(fonte);
CREATE INDEX idx_leads_prioridade ON leads(prioridade);
CREATE INDEX idx_leads_score ON leads(score_qualificacao DESC);
CREATE INDEX idx_leads_created_at ON leads(created_at DESC);

-- Tabela de histórico de interações
CREATE TABLE interacoes (
  id BIGSERIAL PRIMARY KEY,
  lead_id BIGINT REFERENCES leads(id) ON DELETE CASCADE,
  tipo TEXT NOT NULL, -- 'whatsapp', 'email', 'ligacao', 'sms', 'visita'
  canal TEXT, -- 'manual', 'automatico'
  mensagem TEXT,
  resposta TEXT,
  status TEXT, -- 'enviado', 'entregue', 'lido', 'respondido', 'erro'
  enviado_por TEXT, -- 'sistema', 'usuario_nome'
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_interacoes_lead_id ON interacoes(lead_id);
CREATE INDEX idx_interacoes_created_at ON interacoes(created_at DESC);

-- Tabela de campanhas
CREATE TABLE campanhas (
  id BIGSERIAL PRIMARY KEY,
  nome TEXT NOT NULL,
  tipo TEXT NOT NULL, -- 'facebook_ads', 'google_ads', 'email_marketing', 'whatsapp_blast', 'sms'
  status TEXT DEFAULT 'ativa', -- 'ativa', 'pausada', 'encerrada'
  especialidade_alvo TEXT,
  publico_alvo TEXT,
  orcamento DECIMAL(10,2),
  leads_gerados INTEGER DEFAULT 0,
  conversoes INTEGER DEFAULT 0,
  taxa_conversao DECIMAL(5,2),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Tabela de especialidades da clínica
CREATE TABLE especialidades (
  id BIGSERIAL PRIMARY KEY,
  nome TEXT NOT NULL UNIQUE,
  descricao TEXT,
  palavras_chave TEXT[], -- Array de sintomas/palavras relacionadas
  valor_consulta_particular DECIMAL(10,2),
  aceita_convenio BOOLEAN DEFAULT true,
  ativa BOOLEAN DEFAULT true
);

-- Inserir especialidades exemplo
INSERT INTO especialidades (nome, descricao, palavras_chave, valor_consulta_particular) VALUES
('Clínica Geral', 'Atendimento geral e check-ups', ARRAY['checkup', 'exame', 'rotina', 'prevencao'], 200.00),
('Cardiologia', 'Saúde do coração', ARRAY['coração', 'pressao', 'colesterol', 'dor no peito'], 350.00),
('Dermatologia', 'Cuidados com a pele', ARRAY['pele', 'acne', 'mancha', 'queda de cabelo'], 300.00),
('Endocrinologia', 'Hormônios e metabolismo', ARRAY['diabetes', 'tireoide', 'obesidade', 'hormonio'], 350.00),
('Ginecologia', 'Saúde da mulher', ARRAY['ginecologico', 'preventivo', 'gestacao', 'menopausa'], 300.00),
('Ortopedia', 'Ossos e articulações', ARRAY['dor nas costas', 'joelho', 'fratura', 'articulacao'], 350.00),
('Pediatria', 'Saúde infantil', ARRAY['criança', 'bebe', 'vacinacao', 'desenvolvimento'], 250.00),
('Psiquiatria', 'Saúde mental', ARRAY['ansiedade', 'depressao', 'insonia', 'estresse'], 400.00);

-- Função para atualizar o updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_leads_updated_at BEFORE UPDATE ON leads
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- View para dashboard - leads mais promissores
CREATE VIEW leads_promissores AS
SELECT
  l.*,
  e.nome as especialidade_nome,
  e.valor_consulta_particular
FROM leads l
LEFT JOIN especialidades e ON l.especialidade_interesse = e.nome
WHERE l.status IN ('novo', 'qualificado')
  AND l.score_qualificacao >= 60
ORDER BY l.score_qualificacao DESC, l.prioridade DESC;

-- View para análise de conversão por fonte
CREATE VIEW conversao_por_fonte AS
SELECT
  fonte,
  COUNT(*) as total_leads,
  COUNT(CASE WHEN status = 'convertido' THEN 1 END) as convertidos,
  ROUND(COUNT(CASE WHEN status = 'convertido' THEN 1 END)::NUMERIC / COUNT(*)::NUMERIC * 100, 2) as taxa_conversao,
  AVG(score_qualificacao) as score_medio
FROM leads
GROUP BY fonte
ORDER BY taxa_conversao DESC;

-- View para análise por especialidade
CREATE VIEW performance_especialidades AS
SELECT
  especialidade_interesse,
  COUNT(*) as total_leads,
  COUNT(CASE WHEN status = 'convertido' THEN 1 END) as convertidos,
  COUNT(CASE WHEN agendamento_realizado = true THEN 1 END) as agendamentos,
  AVG(score_qualificacao) as score_medio,
  SUM(valor_consulta) as receita_total
FROM leads
WHERE especialidade_interesse IS NOT NULL
GROUP BY especialidade_interesse
ORDER BY convertidos DESC;
