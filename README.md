# RSVP Aniversário do Théo 🚀

Este projeto é um formulário de confirmação de presença para o aniversário do meu filho, com tema Astro Bot.

Sistema completo de RSVP com prevenção de duplicatas, validações de segurança e interface intuitiva para os convidados confirmarem presença de forma segura e organizada.

## 🎯 Objetivo

- Permitir que os convidados confirmem presença **apenas uma vez** por nome
- Registrar quem vai comparecer e quantos acompanhantes irão
- Registrar também quem não poderá ir

## ✨ Funcionalidades Implementadas

### 🔍 **Sistema Inteligente de Verificação**
- **Verificação automática**: Ao digitar o nome, sistema verifica se já existe confirmação
- **Prevenção de duplicatas**: Cada nome só pode confirmar uma vez
- **Feedback imediato**: Interface mostra status da confirmação existente

### 🛡️ **Segurança e Validação**
- **Políticas RLS restritivas** no Supabase para ambiente de produção
- **Validação de entrada**: Nome (2-100 chars), acompanhantes (1-10), caracteres seguros
- **Proteção contra spam**: Debounce de 800ms nas consultas
- **Sistema apenas de inserção**: Não permite alterações após confirmação

### 🎨 **Interface Otimizada**
- **Fluxo contextual**: Interface se adapta se nome já confirmou
- **Mensagens claras**: "Nome já confirmou presença" com detalhes
- **Botões padronizados**: "Voltar ao início" presente em todas as telas
- **Design responsivo**: Funciona perfeitamente em mobile e desktop

### 📱 **Fluxos de Experiência**

#### 1️⃣ **Primeira confirmação:**
```
Digite nome → Não existe → Escolha presença → Confirma acompanhantes → Sucesso
```

#### 2️⃣ **Nome já confirmado:**
```
Digite nome → Já existe → Mostra confirmação atual → "Entre em contato para alterar"
```

#### 3️⃣ **Pós-confirmação:**
```
Tela de sucesso → Adicionar na agenda → Voltar ao início
```

### 🎉 **Funcionalidades da Interface**
- Tela inicial com validação em tempo real
- Fluxo condicional baseado na resposta
- Tela de confirmação com opção de adicionar evento na agenda (.ics para desktop, Google Calendar para mobile)
- Tela de recusa com feedback amigável
- Layout responsivo com identidade visual Astro Bot
- Animações suaves entre transições

## 🏗️ Stack Técnica

- **Frontend**: React 19.2 + Vite 7.3
- **Estilização**: CSS modular + estilos globais
- **Backend**: Supabase (PostgreSQL + Real-time + Auth)
- **Validação**: Frontend + Database constraints + RLS policies
- **Deploy**: Pronto para Vercel/Netlify

## 📁 Estrutura do Projeto

```
src/
├── App.jsx                    # Controle de estado principal e navegação
├── App.css                   # Estilos globais e botões padronizados
├── Components/
│   ├── HomeScreen/           # Formulário principal + validação
│   ├── ConfirmedScreen/      # Tela de sucesso + agenda
│   └── DeclinedScreen/       # Tela de recusa
├── lib/
│   └── supabaseClient.js     # Configuração do Supabase
└── index.css                 # Reset e estilos base
```

## ⚙️ Configuração do Supabase (PRODUÇÃO)

### 1️⃣ **Criar tabela com constraints de segurança:**

```sql
-- Criar tabela principal
CREATE TABLE IF NOT EXISTS public.rsvps (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  will_attend BOOLEAN NOT NULL,
  guests INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índice único para prevenir duplicatas (case-insensitive)
CREATE UNIQUE INDEX rsvps_name_unique_ci 
ON rsvps (LOWER(TRIM(name)));

-- Constraints de validação
ALTER TABLE rsvps 
ADD CONSTRAINT check_name_length CHECK (LENGTH(TRIM(name)) >= 2 AND LENGTH(TRIM(name)) <= 100),
ADD CONSTRAINT check_guests_limit CHECK (guests >= 0 AND guests <= 10);
```

### 2️⃣ **Configurar políticas RLS de segurança:**

```sql
-- Habilitar RLS
ALTER TABLE rsvps ENABLE ROW LEVEL SECURITY;

-- Remover políticas antigas (se houver)
DROP POLICY IF EXISTS "Allow public select" ON rsvps;
DROP POLICY IF EXISTS "Allow public insert" ON rsvps;
DROP POLICY IF EXISTS "Allow public update" ON rsvps;

-- Política SELECT: Permitir consulta (para verificar duplicatas)
CREATE POLICY "allow_select_rsvps" ON rsvps FOR SELECT USING (true);

-- Política INSERT: Permitir apenas uma confirmação por nome
CREATE POLICY "allow_insert_rsvps" ON rsvps FOR INSERT WITH CHECK (
  name IS NOT NULL 
  AND LENGTH(TRIM(name)) >= 2
  AND LENGTH(TRIM(name)) <= 100
  AND will_attend IS NOT NULL
  AND guests >= 0
  AND guests <= 10
);

-- SEM UPDATE/DELETE públicos (apenas service_role para admin)
```

### 3️⃣ **Configurar variáveis de ambiente:**

```bash
# .env (local)
VITE_SUPABASE_URL=https://SEU-PROJETO.supabase.co
VITE_SUPABASE_ANON_KEY=SUA_ANON_KEY_PUBLICA
```

**Onde encontrar as chaves:**
1. Dashboard Supabase → Seu projeto → Settings → API
2. **URL**: Project URL  
3. **anon public**: anon key (não a service_role!)

## 🚀 Como Rodar

### **Desenvolvimento:**
```bash
# Instalar dependências
npm install

# Configurar .env com credenciais do Supabase
cp .env.example .env
# Editar .env com suas chaves

# Executar aplicação
npm run dev
```

### **Produção:**
```bash
# Build otimizado
npm run build

# Preview do build
npm run preview

# Deploy (Vercel/Netlify)
# Configurar variáveis VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY
```

## 🔒 Segurança Implementada

### **✅ Prevenção de Duplicatas**
- Unique constraint no banco (case-insensitive)
- Verificação automática no frontend
- Políticas RLS restritivas

### **✅ Validação de Dados**
- Frontend: Tamanho, caracteres, números
- Backend: Constraints, políticas, tipos
- Sanitização automática (TRIM)

### **✅ Proteção contra Abuso**
- Rate limiting via debounce
- Validação de caracteres suspeitos
- Limites de acompanhantes (1-10)
- Apenas inserção (sem updates públicos)

### **✅ Experiência Segura**
- Mensagens de erro claras
- Feedback de status em tempo real  
- Interface que previne erros do usuário
- Navegação intuitiva

## 📊 Dashboard do Supabase - Monitoramento em Tempo Real

O Supabase oferece um dashboard completo para monitorar as confirmações! Muito mais prático que criar interfaces customizadas:

### 🎯 **Como Acessar o Dashboard**

1. **Acesse o Supabase**: [https://supabase.com](https://supabase.com)
2. **Faça login** na sua conta
3. **Selecione seu projeto** do RSVP
4. **Vá para "Table Editor"** no menu lateral

### 📋 **Visualizando as Confirmações**

Na aba **Table Editor** → **rsvps**:

- **Lista completa** de todas as confirmações
- **Filtros automáticos** por coluna
- **Ordenação** por data, nome, status
- **Busca em tempo real** 
- **Visualização clara** de quem confirmou/recusou

### 📊 **Relatórios Instantâneos**

#### **1️⃣ Estatísticas Rápidas (SQL Editor)**
```sql
-- Resumo geral das confirmações
SELECT 
  COUNT(*) FILTER (WHERE will_attend = true) as "✅ Confirmados",
  COUNT(*) FILTER (WHERE will_attend = false) as "❌ Não vão",
  SUM(guests) FILTER (WHERE will_attend = true) as "👥 Total Pessoas",
  COUNT(*) as "📋 Total Respostas"
FROM rsvps;
```

#### **2️⃣ Lista Detalhada dos Confirmados**
```sql
-- Todos que confirmaram presença
SELECT 
  name as "Nome",
  guests as "Acompanhantes", 
  (guests + 1) as "Total na Mesa",
  created_at as "Confirmou em"
FROM rsvps 
WHERE will_attend = true 
ORDER BY created_at DESC;
```

#### **3️⃣ Confirmações por Período**
```sql
-- Confirmações por dia
SELECT 
  DATE(created_at) as "Data",
  COUNT(*) as "Confirmações do Dia",
  SUM(guests + 1) FILTER (WHERE will_attend = true) as "Pessoas Confirmadas"
FROM rsvps 
GROUP BY DATE(created_at)
ORDER BY DATE(created_at) DESC;
```

### 📥 **Exportar Dados**

#### **Através do Dashboard:**
1. **Table Editor** → **rsvps**
2. **Botão "Export"** → **CSV/Excel**
3. **Filtrar dados** se necessário
4. **Download automático**

#### **Lista para Impressão:**
```sql
-- Lista limpa para imprimir
SELECT 
  ROW_NUMBER() OVER (ORDER BY name) as "#",
  name as "Nome do Convidado",
  CASE 
    WHEN will_attend THEN '✅ Confirmado (' || (guests + 1) || ' pessoas)'
    ELSE '❌ Não comparecerá'
  END as "Status"
FROM rsvps 
ORDER BY will_attend DESC, name ASC;
```

### 📱 **Dashboard Mobile-Friendly**

O Supabase funciona perfeitamente no celular:
- **App móvel** ou **browser mobile**
- **Notificações em tempo real** (configurável)
- **Acesso rápido** às estatísticas
- **Compartilhamento** de relatórios

### ⚡ **Vantagens do Dashboard Supabase**

✅ **Sem código extra**: Funciona imediatamente  
✅ **Tempo real**: Atualizações automáticas  
✅ **Seguro**: Mesmo nível de segurança da aplicação  
✅ **Completo**: Filtros, busca, exportação  
✅ **Gratuito**: Incluído no plano free  
✅ **Colaborativo**: Pode dar acesso a outros organized  

### 🔐 **Compartilhar Acesso (Opcional)**

Para dar acesso a outros organizadores:
1. **Project Settings** → **Team** 
2. **Invite member** 
3. **Escolher permissão**: `Read-only` ou `Full access`
4. **Pessoa recebe email** com convite

### 🤖 **Automações Avançadas (Opcional)**

O Supabase permite automações poderosas via **Database Webhooks**:

#### **Notificação a cada confirmação:**
```sql
-- Trigger para webhook a cada nova confirmação
CREATE OR REPLACE FUNCTION notify_new_rsvp()
RETURNS TRIGGER AS $$
BEGIN
  -- Payload enviado para webhook
  PERFORM net.http_post(
    url := 'https://seu-webhook-url.com/nova-confirmacao',
    headers := '{"Content-Type": "application/json"}'::jsonb,
    body := jsonb_build_object(
      'nome', NEW.name,
      'comparecera', NEW.will_attend,
      'acompanhantes', NEW.guests,
      'total_pessoas', NEW.guests + 1,
      'data_confirmacao', NEW.created_at
    )
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Ativar trigger
CREATE TRIGGER rsvp_notification_trigger
  AFTER INSERT ON rsvps
  FOR EACH ROW
  EXECUTE FUNCTION notify_new_rsvp();
```

**Onde usar:**
- **WhatsApp Business API** para notificações
- **Email automático** para organizadores  
- **Slack/Discord** para equipe do evento
- **Planilha Google** auto-atualizada

---

## 📊 Próximos Passos (Pós-Deploy)

### **Monitoramento**
- ✅ **Dashboard nativo Supabase** para análise de confirmações
- **Relatórios SQL personalizados** para estatísticas específicas
- **Exportação automática** de listas para planejamento do evento
- Log de erros para debugging de produção
- Métricas de uso via Supabase Analytics

### **Melhorias Futuras** (se necessário)
- Notificações automáticas por email/WhatsApp
- QR Code para acesso rápido ao formulário
- Integração com sistemas de controle de entrada
- Dashboard customizado com gráficos (se o nativo não for suficiente)

## 📝 Deploy Checklist

- [ ] ✅ Supabase configurado com políticas RLS
- [ ] ✅ Variáveis de ambiente configuradas
- [ ] ✅ Build testado localmente
- [ ] ✅ Domínio/URL de produção configurado
- [ ] ✅ Teste de fluxo completo em produção
- [ ] ✅ Backup das configurações do Supabase

---

## 💡 Sobre o Projeto

Este projeto combina aprendizado prático em React com um caso real de uso, implementando conceitos avançados:

- **Estado complexo** com múltiplos componentes
- **Validação robusta** frontend + backend  
- **Segurança de produção** com RLS e constraints
- **UX otimizada** para usuários finais
- **Arquitetura escalável** para projetos maiores

Ideal para demonstrar habilidades em desenvolvimento full-stack com React e Supabase! 🎯
