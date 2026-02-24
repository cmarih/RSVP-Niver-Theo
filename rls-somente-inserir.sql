-- 🔒 POLÍTICAS RLS SIMPLES - APENAS INSERIR E CONSULTAR
-- Execute este SQL no Supabase (SQL Editor)

-- 1. Limpar políticas existentes 
DROP POLICY IF EXISTS "Allow public select" ON rsvps;
DROP POLICY IF EXISTS "Allow public insert" ON rsvps;  
DROP POLICY IF EXISTS "Allow public update" ON rsvps;
DROP POLICY IF EXISTS "Allow public delete" ON rsvps;
DROP POLICY IF EXISTS "rsvp_select_policy" ON rsvps;
DROP POLICY IF EXISTS "rsvp_insert_policy" ON rsvps;
DROP POLICY IF EXISTS "rsvp_update_policy" ON rsvps;
DROP POLICY IF EXISTS "select_rsvps" ON rsvps;
DROP POLICY IF EXISTS "insert_rsvps" ON rsvps;
DROP POLICY IF EXISTS "update_rsvps" ON rsvps;

-- 2. Garantir que RLS está habilitado
ALTER TABLE rsvps ENABLE ROW LEVEL SECURITY;

-- 3. Política SELECT: Permitir consulta (para verificar se já confirmou)
CREATE POLICY "allow_select_rsvps" ON rsvps FOR SELECT USING (true);

-- 4. Política INSERT: Permitir apenas uma confirmação por nome
CREATE POLICY "allow_insert_rsvps" ON rsvps FOR INSERT WITH CHECK (
  name IS NOT NULL 
  AND LENGTH(TRIM(name)) >= 2
  AND LENGTH(TRIM(name)) <= 100
  AND will_attend IS NOT NULL
  AND guests >= 0
  AND guests <= 10
);

-- 5. SEM POLÍTICA UPDATE - Não permitir alterações públicas
-- 6. SEM POLÍTICA DELETE - Não permitir exclusões públicas

-- 7. Remover índices/constraints existentes
DROP INDEX IF EXISTS rsvps_name_unique_idx;
DROP INDEX IF EXISTS rsvps_name_unique_lower_idx;
DROP INDEX IF EXISTS rsvps_name_lower_unique;
ALTER TABLE rsvps DROP CONSTRAINT IF EXISTS rsvps_name_unique;
ALTER TABLE rsvps DROP CONSTRAINT IF EXISTS check_name_length;
ALTER TABLE rsvps DROP CONSTRAINT IF EXISTS check_guests_limit;

-- 8. Criar índice único para impedir nomes duplicados
CREATE UNIQUE INDEX rsvps_name_unique_ci 
ON rsvps (LOWER(TRIM(name)));

-- 9. Constraints de validação
ALTER TABLE rsvps 
ADD CONSTRAINT check_name_length CHECK (LENGTH(TRIM(name)) >= 2 AND LENGTH(TRIM(name)) <= 100),
ADD CONSTRAINT check_guests_limit CHECK (guests >= 0 AND guests <= 10);

-- ✅ Sistema final:
-- • SELECT: ✅ Permitido (para consultar confirmações)  
-- • INSERT: ✅ Permitido (apenas uma vez por nome)
-- • UPDATE: ❌ Bloqueado (não pode alterar)
-- • DELETE: ❌ Bloqueado (não pode excluir)