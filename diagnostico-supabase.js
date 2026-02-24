// Script de diagnóstico para testar conectividade e configuração do Supabase
import { supabase } from './src/lib/supabaseClient.js'

async function diagnosticoSupabase() {
  console.log('🔍 Iniciando diagnóstico do Supabase...')
  
  try {
    // Teste 1: Verificar conectividade básica
    console.log('1️⃣ Testando conectividade...')
    const { data, error } = await supabase
      .from('rsvps')
      .select('count', { count: 'exact' })
      .limit(1)
    
    if (error) {
      console.error('❌ Erro na conectividade:', error)
      
      if (error.code === 'PGRST116') {
        console.log('📝 A tabela "rsvps" não existe. Vamos criá-la!')
        return 'CRIAR_TABELA'
      }
      
      if (error.message.includes('policy')) {
        console.log('🔒 Problema com políticas RLS. Vamos configurá-las!')
        return 'CONFIGURAR_RLS'
      }
      
      return 'ERRO_DESCONHECIDO'
    }
    
    console.log('✅ Conectividade OK!')
    console.log(`📊 Total de registros na tabela: ${data?.[0]?.count || 0}`)
    
    // Teste 2: Verificar operações CRUD
    console.log('2️⃣ Testando operações...')
    
    // Teste de SELECT
    const selectTest = await supabase
      .from('rsvps')
      .select('*')
      .limit(1)
    
    if (selectTest.error) {
      console.error('❌ Erro no SELECT:', selectTest.error)
      return 'ERRO_SELECT'
    }
    
    console.log('✅ SELECT funcionando!')
    
    // Teste de INSERT (com dados de teste)
    const insertTest = await supabase
      .from('rsvps')
      .insert({
        name: 'TESTE_DIAGNOSTICO_' + Date.now(),
        will_attend: true,
        guests: 0
      })
      .select()
    
    if (insertTest.error) {
      console.error('❌ Erro no INSERT:', insertTest.error)
      return 'ERRO_INSERT'
    }
    
    console.log('✅ INSERT funcionando!')
    
    // Limpar teste
    if (insertTest.data?.[0]?.id) {
      await supabase
        .from('rsvps')
        .delete()
        .eq('id', insertTest.data[0].id)
      console.log('🧹 Dados de teste removidos!')
    }
    
    console.log('🎉 Todos os testes passaram! Supabase está configurado corretamente.')
    return 'OK'
    
  } catch (error) {
    console.error('💥 Erro inesperado:', error)
    return 'ERRO_CONEXAO'
  }
}

// Executar diagnóstico
diagnosticoSupabase().then(resultado => {
  console.log(`\n🏁 Resultado final: ${resultado}`)
  
  if (resultado === 'CRIAR_TABELA') {
    console.log(`
📋 PRÓXIMOS PASSOS - Criar tabela no Supabase:

1. Acesse: https://supabase.com/dashboard
2. Selecione seu projeto
3. Vá em "SQL Editor"
4. Execute este comando:

CREATE TABLE rsvps (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  will_attend BOOLEAN NOT NULL,
  guests INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Habilitar RLS
ALTER TABLE rsvps ENABLE ROW LEVEL SECURITY;

-- Política para permitir SELECT público
CREATE POLICY "Allow public select" ON rsvps 
FOR SELECT USING (true);

-- Política para permitir INSERT público  
CREATE POLICY "Allow public insert" ON rsvps 
FOR INSERT WITH CHECK (true);

-- Política para permitir UPDATE público
CREATE POLICY "Allow public update" ON rsvps 
FOR UPDATE USING (true);

-- Política para permitir DELETE público (opcional)
CREATE POLICY "Allow public delete" ON rsvps 
FOR DELETE USING (true);
`)
  }
  
  if (resultado === 'CONFIGURAR_RLS') {
    console.log(`
🔒 PRÓXIMOS PASSOS - Configurar políticas RLS:

1. Acesse: https://supabase.com/dashboard
2. Selecione seu projeto  
3. Vá em "SQL Editor"
4. Execute:

-- Política para permitir SELECT público
CREATE POLICY "Allow public select" ON rsvps 
FOR SELECT USING (true);

-- Política para permitir INSERT público
CREATE POLICY "Allow public insert" ON rsvps 
FOR INSERT WITH CHECK (true);

-- Política para permitir UPDATE público  
CREATE POLICY "Allow public update" ON rsvps 
FOR UPDATE USING (true);
`)
  }
})