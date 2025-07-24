import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export interface JurosJustosData {
  id?: string
  nome_completo: string
  whatsapp: string
  email: string
  cidade_estado: string
  descricao_situacao: string
  created_at?: string
}