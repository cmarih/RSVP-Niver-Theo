// Teste simples de conexão com Supabase
// Execute no console do navegador para diagnosticar

import { supabase } from './src/lib/supabaseClient.js'

// Função de teste
window.testeSupabase = async function() {
  console.log('🧪 Testando conexão com Supabase...')
  
  try {
    // Teste básico - verificar se a tabela existe
    const { data, error } = await supabase
      .from('rsvps')
      .select('*')
      .limit(1)
    
    if (error) {
      console.error('❌ Erro:', error)
      
      if (error.code === 'PGRST116') {
        console.log('📋 SOLUÇÃO: A tabela "rsvps" não existe. Configure-a no Supabase.')
      } else if (error.message.includes('policy')) {
        console.log('🔒 SOLUÇÃO: Configure as políticas RLS no Supabase.')
      }
      
      return false
    }
    
    console.log('✅ Conexão OK! Dados:', data)
    return true
    
  } catch (err) {
    console.error('💥 Erro de conexão:', err)
    return false
  }
}

// Auto-executar se estiver no contexto do navegador
if (typeof window !== 'undefined') {
  window.testeSupabase()
}