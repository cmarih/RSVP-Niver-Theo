# RSVP Aniversário do Théo 🚀

Site interativo de confirmação de presença para o aniversário do Théo, com tema Astro Bot. 

Sistema completo de RSVP com página de convite, prevenção de duplicatas, validações de segurança e interface imersiva com design espacial para tornar o convite memorável e funcional.

## 🎯 Objetivo

- Apresentar o convite de forma atrativa com tema espacial/Astro Bot
- Permitir que os convidados confirmem presença **apenas uma vez** por nome
- Registrar quem vai comparecer, separando quantos adultos e crianças irão
- Registrar também quem não poderá ir
- Facilitar acesso à localização do evento via Google Maps

## ✨ Funcionalidades Implementadas

### 🎨 **Página de Convite Interativa (Nova!)**
- **HeroSection**: Tela de boas-vindas com animações e tema espacial
- **MissionSection**: Card informativo com:
  - Data do evento (26 de Abril de 2026)
  - Horário (16h00)
  - Local com **link direto para Google Maps** (clique no endereço)
  - **Contagem regressiva em tempo real** (dias, horas e minutos)
  - Botões de ação: "Confirmar Presença" e "Não poderei ir"
- **Design espacial imersivo**: Estrelas animadas, planetas decorativos, logo personalizada
- **Layout responsivo**: Adapta perfeitamente de mobile a desktop

### 🔍 **Sistema Inteligente de Verificação**
- **Verificação automática**: Ao digitar o nome, sistema verifica se já existe confirmação
- **Prevenção de duplicatas**: Cada nome só pode confirmar uma vez
- **Feedback imediato**: Interface mostra status da confirmação existente

### 🛡️ **Segurança e Validação**
- **Políticas RLS restritivas** no Supabase para ambiente de produção
- **Validação de entrada**: Nome (2-100 chars), adultos/crianças (0-4 cada, total 1-4), caracteres seguros
- **Proteção contra spam**: Debounce de 800ms nas consultas
- **Sistema apenas de inserção**: Não permite alterações após confirmação

### 🎨 **Interface Otimizada**
- **Fluxo contextual**: Interface se adapta se nome já confirmou
- **Mensagens claras**: "Nome já confirmou presença" com detalhes
- **Botões padronizados**: "Voltar ao início" presente em todas as telas
- **Design responsivo**: Funciona perfeitamente em mobile e desktop
- **Formulário de acompanhantes separado**: campos independentes para adultos e crianças
- **Mobile compacto**: ajustes específicos para telas pequenas (ex.: 375x667)

### 📱 **Fluxos de Experiência**

#### 🎬 **Fluxo Completo (Novo com Página de Convite):**
```
1. Página de Convite → Visualiza info do evento + contagem regressiva
2. Clica "Confirmar Presença" ou "Não poderei ir"
3. Formulário → Digite nome
4. Sistema verifica duplicatas automaticamente
5. Se novo: Escolhe adultos/crianças → Confirma
6. Tela de sucesso → Adicionar na agenda → Voltar ao início
```

#### 1️⃣ **Primeira confirmação:**
```
Convite → Digite nome → Não existe → Escolha presença → Confirma adultos/crianças → Sucesso
```

#### 2️⃣ **Nome já confirmado:**
```
Convite → Digite nome → Já existe → Mostra confirmação atual → "Entre em contato para alterar"
```

#### 3️⃣ **Pós-confirmação:**
```
Tela de sucesso → Adicionar na agenda → Voltar ao início (retorna ao convite)
```

### 🎉 **Funcionalidades da Interface**
- **Página de convite inicial** com design espacial e tema Astro Bot
- **Informações do evento** em card interativo com:
  - Link clicável para Google Maps (abre em nova aba)
  - Contagem regressiva em tempo real
  - Design com efeitos de brilho e hover
- **Validação em tempo real** no formulário de RSVP
- **Fluxo condicional** baseado na resposta (confirmar/declinar)
- **Campo de acompanhantes dividido** em:
  - Quantidade de adultos (0-4)
  - Quantidade de crianças (0-4)
  - Total entre 1-4 pessoas
- **Tela de confirmação** com opção de adicionar evento na agenda (.ics para desktop, Google Calendar para mobile)
- **Tela de recusa** com feedback amigável
- **Layout totalmente responsivo** com identidade visual consistente
- **Animações suaves** entre transições de tela
- **Acessibilidade**: aria-labels, semântica HTML correta

### 📐 **Ajustes recentes de layout (mobile)**
- Scroll vertical habilitado em telas menores para evitar corte de conteúdo
- Redução de espaçamento/padding de cards e formulário no mobile
- Breakpoint adicional para dispositivos pequenos (`max-width: 390px` e `max-height: 700px`)
- Redução proporcional de logo, ícone, título e campos para melhor encaixe visual

## 🏗️ Stack Técnica

- **Frontend**: React 19.2 + Vite 7.3
- **Estilização**: CSS Modules + estilos globais + animações CSS
- **Backend**: Supabase (PostgreSQL + Real-time + Auth)
- **Validação**: Frontend (React state + debounce) + Database (constraints + RLS policies)
- **Integração**: Google Maps API (Search), iCalendar (.ics), Google Calendar
- **Gerenciamento de Estado**: React Hooks (useState, useEffect)
- **Deploy**: Pronto para Vercel/Netlify/GitHub Pages

## 📁 Estrutura do Projeto

```
src/
├── App.jsx                    # Controle de estado principal e navegação entre telas
├── App.css                    # Estilos globais e botões padronizados
├── Components/
│   ├── InvitePage/            # Página de convite inicial (NOVO!)
│   │   ├── InvitePage.jsx           # Container principal com bg espacial
│   │   ├── InvitePage.module.css    # Estilos da página (estrelas, planetas)
│   │   ├── HeroSection.jsx          # Seção hero com boas-vindas
│   │   ├── HeroSection.module.css   # Estilos do hero
│   │   ├── MissionSection.jsx       # Card de info com contador e botões
│   │   ├── MissionSection.module.css # Estilos do card de informações
│   │   ├── InfoCard.jsx             # Card reutilizável (data, hora, local)
│   │   ├── InfoCard.module.css      # Estilos do card info
│   │   ├── Button.jsx               # Botão customizado
│   │   └── Button.module.css        # Estilos do botão
│   ├── HomeScreen/            # Formulário principal + validação de duplicatas
│   │   ├── HomeScreen.jsx
│   │   └── HomeScreen.css
│   ├── ConfirmedScreen/       # Tela de sucesso + botão agenda
│   │   ├── ConfirmedScreen.jsx
│   │   └── ConfirmedScreen.css
│   └── DeclinedScreen/        # Tela de recusa com mensagem amigável
│       ├── DeclinedScreen.jsx
│       └── DeclinedScreen.css
├── lib/
│   └── supabaseClient.js      # Configuração do cliente Supabase
├── index.css                  # Reset CSS e estilos base
└── main.jsx                   # Entry point da aplicação
```

## ⚙️ Configuração do Supabase (PRODUÇÃO)

### 1️⃣ **Criar tabela com constraints de segurança:**

```sql
-- Criar tabela principal
CREATE TABLE IF NOT EXISTS public.rsvps (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  will_attend BOOLEAN NOT NULL,
  adults_guests INTEGER DEFAULT 0,
  children_guests INTEGER DEFAULT 0,
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
ADD CONSTRAINT check_adults_guests_limit CHECK (adults_guests >= 0 AND adults_guests <= 4),
ADD CONSTRAINT check_children_guests_limit CHECK (children_guests >= 0 AND children_guests <= 4),
ADD CONSTRAINT check_guests_limit CHECK (guests >= 0 AND guests <= 4);

-- Se a tabela já existia antes dessa versão, rode também:
ALTER TABLE rsvps ADD COLUMN IF NOT EXISTS adults_guests INTEGER DEFAULT 0;
ALTER TABLE rsvps ADD COLUMN IF NOT EXISTS children_guests INTEGER DEFAULT 0;
UPDATE rsvps SET adults_guests = guests WHERE adults_guests IS NULL;
UPDATE rsvps SET children_guests = 0 WHERE children_guests IS NULL;
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
  AND adults_guests >= 0
  AND adults_guests <= 4
  AND children_guests >= 0
  AND children_guests <= 4
  AND guests >= 0
  AND guests <= 4
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
npm install --legacy-peer-deps

# Configurar .env com credenciais do Supabase
cp .env.example .env
# Editar .env com suas chaves

# Executar aplicação
npm run dev
```

> **Nota**: Usamos `--legacy-peer-deps` devido a conflitos de peer dependencies entre ESLint 10 e plugins React.

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
- Frontend: Tamanho, caracteres, números e total de acompanhantes (adultos + crianças)
- Backend: Constraints, políticas, tipos
- Sanitização automática (TRIM)

### **✅ Proteção contra Abuso**
- Rate limiting via debounce
- Validação de caracteres suspeitos
- Limites de acompanhantes por tipo (adultos/crianças) com total de 1-4
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

## 🔧 Troubleshooting

### **Erro: "VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY não configuradas"**
- **Solução**: Crie o arquivo `.env` na raiz do projeto com suas credenciais do Supabase
- Veja a seção "Configurar variáveis de ambiente" acima

### **Erro: "vite não é reconhecido como comando"**
- **Solução**: Rode `npm install --legacy-peer-deps` para instalar as dependências

### **Erro: "In HTML, <h3> cannot be a descendant of <p>"**
- **Solução**: Já corrigido! Usamos `<div>` ao invés de `<p>` para o contador

### **Erro: "npm ERR! ERESOLVE unable to resolve dependency tree"**
- **Solução**: Use `npm install --legacy-peer-deps` ao invés de `npm install`

### **Link do Google Maps não funciona**
- **Verificar**: O link está configurado corretamente no `MissionSection.jsx`
- O link deve abrir automaticamente em nova aba ao clicar

---

## 💡 Sobre o Projeto

Este projeto combina aprendizado prático em React com um caso real de uso, implementando conceitos avançados:

- **Estado complexo** com múltiplos componentes e navegação entre telas
- **Validação robusta** frontend + backend  
- **Segurança de produção** com RLS e constraints
- **UX otimizada** para usuários finais com design imersivo
- **Integração com APIs externas** (Google Maps, Calendar)
- **CSS avançado** com animações, efeitos e responsividade
- **Arquitetura modular** com componentes reutilizáveis
- **Boas práticas** de acessibilidade e semântica HTML

### 🎯 **Recursos Destacados**
- ✅ Página de convite interativa com tema espacial
- ✅ Link direto para Google Maps
- ✅ Contagem regressiva em tempo real
- ✅ Sistema anti-duplicatas
- ✅ Validação completa de dados
- ✅ Integração com calendários
- ✅ Design responsivo mobile-first

Ideal para demonstrar habilidades em desenvolvimento full-stack moderno com React e Supabase! 🎯🚀
