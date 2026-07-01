# 🏋️‍♂️ WEGYM

> **Supere seus limites. Sua jornada para a melhor versão de si mesmo começa aqui.**

O **WEGYM** é uma plataforma moderna e inteligente de gestão esportiva e fitness. Projetado tanto para atletas quanto para Personal Trainers, o aplicativo une inteligência artificial (Google Gemini 2.5 Flash), gamificação, biometria (Bluetooth BLE), rastreamento GPS (Leaflet), pagamentos (Mercado Pago) e i18n com 15 idiomas.

---

## 🚀 Funcionalidades Completas

### 🧑‍💻 Para o Atleta

| Funcionalidade | Detalhes |
|---|---|
| **Dashboard** | Stats de localStorage (sessões, tempo, distância, dias ativos), ranking personalizado, modalidade favorita, quick start, sessões recentes, onboarding tutorial |
| **Musculação** | Plano semanal (Seg-Dom), toggle de conclusão, input de carga (kg), modal com GIF demonstrativo, temporizador de descanso (60s), barra de progresso, gerar treino via IA, adicionar manual, histórico |
| **Corrida/Caminhada/Ciclismo/Trilha** | Input de distância alvo, rastreamento GPS em tempo real (Haversine), mapa Leaflet ao vivo, monitor cardíaco Bluetooth, tela de resultado com conquistas (Elite/Great/Good), compartilhar como PNG |
| **Natação** | Seleção de piscina (25m/50m/custom), contador de voltas, timer |
| **Cardio** | Cronômetro start/pause/reset/finish |
| **Estatísticas** | Fetch `/api/workout-stats` (week/month/year), 4 cartões (volume, FC, calorias, tempo), gráfico de barras |
| **Progresso** | Registro de peso, massa magra, % gordura, notas — CRUD completo |
| **Perfil** | Avatar ui-avatars, nome/peso/altura editáveis inline, IMC, plano (Free/PRO), Bluetooth HR, PWA install, exportação de dados (LGPD), exclusão de conta |
| **Bluetooth BLE** | Conexão com monitores cardíacos (UUID Heart Rate `0000180d`), leitura de BPM 8/16-bit, sensor contact, energia, intervalos RR, bateria. Reconexão automática (3 tentativas) |
| **Chat IA** | Painel flutuante com Gemini 2.5 Flash para gerar treinos personalizados |

### 📋 Para o Personal Trainer

| Funcionalidade | Detalhes |
|---|---|
| **Dashboard** | 3 visões (home/students/create), 4 stat cards (alunos ativos, aulas/semana, receita, retenção) |
| **Cadastro de Aluno** | 25 campos completos (dados pessoais, físicos, saúde, plano) |
| **Lista de Alunos** | Grid com busca, paginação infinita via cursor, tags de objetivo/nível |
| **Agenda Semanal** | Aulas com status (confirmed/pending/canceled), cores por status |
| **Detalhe do Aluno** | Perfil editável, gerenciamento de exercícios por dia, histórico de progresso |
| **AI Copilot** | Chat Gemini para otimização de treinos |
| **Onboarding** | Tutorial em 4 etapas para primeira vez |

### 🔐 Autenticação

| Funcionalidade | Detalhes |
|---|---|
| **Login** | Email + senha via NextAuth Credentials Provider, bcryptjs, rate limit 10/10s |
| **Registro** | Atleta (CPF, CEP com auto-fill ViaCEP, dados físicos, LGPD) ou Personal (CREF validado) |
| **Esqueci Senha** | Token UUID (1h), email via Resend com template HTML |
| **Reset Senha** | Token + nova senha, invalida após uso |
| **Role Guard** | `AuthGuard` com `allowedRoles` — protege rotas por `atleta` / `personal` |
| **LGPD** | Banner consentimento, termos aceitos, privacy policy, exportação de dados, exclusão com anonimização |

### 💳 Pagamentos — Mercado Pago

| Funcionalidade | Detalhes |
|---|---|
| **Landing PRO** | `/pro` — 3 pacotes (Elite/Recovery/Wallet), toggle mensal (R$49,90) / anual (R$399,90) |
| **Checkout** | `/payment` — SDK CardPayment, dark theme, 12 parcelas, `POST /api/process-payment` |
| **Webhook** | `POST /api/webhooks/mercadopago` — validação HMAC-SHA256, 3 retentativas, ativa assinatura |
| **Assinatura** | CRUD via `subscriptionService`, status active/inactive/cancelled |

### 🤖 IA — Google Gemini 2.5 Flash

| Funcionalidade | Detalhes |
|---|---|
| **Modelo** | `gemini-2.5-flash` com `responseMimeType: application/json` |
| **Library** | 100+ exercícios em 8 categorias (peito, costas, pernas, ombros, braços, core/abdominal, alta performance, mobilidade) |
| **Filtro por nível** | Iniciante (max 4, básicos), Intermediário (5-6, máquinas + livres + 1 explosão), Avançado (6-8, todas categorias) |
| **Usado em** | Chat na página de treino, AI Copilot no dashboard do personal |

### 🌐 Internacionalização

| Funcionalidade | Detalhes |
|---|---|
| **Idiomas** | 15: pt-BR, en, es, fr, de, it, nl, pl, ru, tr, ar, hi, ja, ko, zh-CN |
| **Detecção** | Cookie (`WEGYM_LOCALE`) → Accept-Language (negotiator + `@formatjs/intl-localematcher`) |
| **RTL** | Árabe com `dir="rtl"` |
| **Provider** | Resolução de chaves aninhadas, fallback chain (locale → en → param → literal) |

### 🗺️ GPS e Mapas

| Funcionalidade | Detalhes |
|---|---|
| **Hook** | `useGpsTracker` — `watchPosition` alta precisão, Haversine, estimativa de passos, timer 1s |
| **Visualização** | Leaflet + OpenStreetMap, polyline laranja, marcadores verde (início) / vermelho (fim) |
| **Compartilhamento** | html2canvas → PNG → Web Share API ou download |
| **API** | `POST /api/gps-sessions`, `GET /api/gps-sessions` (cursor pagination) |

### 🧪 Testes

| Suite | Arquivo |
|---|---|
| Schemas Zod | `validation.test.ts` |
| Erros customizados | `errors.test.ts` |
| Validação CREF | `cref.test.ts` |
| IA Gemini | `chat.test.ts` |
| Cache dual-mode | `cache.test.ts` |
| API endpoints | `api.test.ts` (via supertest) |
| Workout session service | `services/workout-session.test.ts` |
| Subscription service | `services/subscription.test.ts` |
| CEP service | `services/cep.test.ts` |
| Setup | `setup.ts` (override DB para `wegym_test`) |

---

## 📄 Páginas e Rotas

### Frontend (12 páginas)

| Rota | Descrição | Auth | Role |
|---|---|---|---|
| `/` | Redireciona para login | — | — |
| `/login` | Login + Registro (atleta/personal) | — | — |
| `/home` | Dashboard do atleta | Sim | `atleta` |
| `/training` | Treino (4 modos: gym, GPS, natação, cardio) | Sim | `atleta` |
| `/profile` | Perfil completo (dados, Bluetooth, PWA, LGPD) | Sim | any |
| `/stats` | Estatísticas e gráficos | Sim | `atleta` |
| `/personal` | Dashboard do personal trainer | Sim | `personal` |
| `/pro` | Landing de assinatura PRO | Sim | any |
| `/payment` | Checkout Mercado Pago | Sim | any |
| `/privacy` | Política de privacidade (LGPD) | — | — |
| `/reset-password` | Redefinir senha via token | — | — |
| `/offline` | Fallback offline (PWA) | — | — |

### API (18 rotas, 29 handlers)

| Rota | Métodos | Descrição |
|---|---|---|
| `/api/athletes` | GET, POST | Listar e registrar atletas (personal) |
| `/api/auth/[...nextauth]` | GET, POST | NextAuth (login, sessão, logout) |
| `/api/auth/register` | POST | Registro de usuário |
| `/api/auth/forgot-password` | POST | Gerar token de reset |
| `/api/auth/reset-password` | POST | Redefinir senha |
| `/api/cep` | GET | Busca de endereço por CEP (ViaCEP) |
| `/api/chat` | POST | Geração de treino via Gemini |
| `/api/classes` | GET | Lista aulas semanais |
| `/api/cref/validate` | POST | Valida CREF |
| `/api/gps-sessions` | GET, POST | CRUD de sessões GPS |
| `/api/health` | GET | Health check (DB + env vars) |
| `/api/personal-stats` | GET | Dashboard do personal |
| `/api/process-payment` | POST | Processa pagamento MP |
| `/api/progress` | GET, POST, DELETE | Progresso do atleta |
| `/api/subscriptions` | GET | Assinatura ativa |
| `/api/training-plans` | GET, POST, DELETE | Planos de treino |
| `/api/user/profile` | GET, PATCH | Perfil do usuário |
| `/api/user/account` | DELETE | Excluir conta |
| `/api/user/export` | GET | Exportar dados (LGPD) |
| `/api/webhooks/mercadopago` | POST | Webhook de pagamento |
| `/api/workout-sessions` | GET, POST | Sessões de treino |
| `/api/workout-stats` | GET | Estatísticas agregadas |
| `/api/sentry-example-api` | GET | Teste Sentry |

---

## 🛠️ Stack Tecnológica Completa

### Frontend

| Tecnologia | Versão | Finalidade |
|---|---|---|
| Next.js | 16.2.9 | Framework fullstack (App Router, standalone) |
| React | 19.2.4 | UI components |
| TypeScript | 5 | Tipagem estática |
| Tailwind CSS | 4 | Estilização utilitária |
| Framer Motion | 12.38.0 | Animações |
| Lucide React | 1.7.0 | Ícones |
| Leaflet / react-leaflet | 1.9.4 / 5.0.0 | Mapas GPS |
| html2canvas | 1.4.1 | Captura de tela para compartilhar |

### Backend & Database

| Tecnologia | Finalidade |
|---|---|
| Next.js API Routes | API REST |
| PostgreSQL 16 | Banco relacional |
| Prisma ORM 6.19.3 | Query builder + migrations + adapter pg |
| Redis 7 | Cache distribuído + rate limiting |

### Autenticação & Segurança

| Tecnologia | Finalidade |
|---|---|
| NextAuth 4 | JWT + Credentials Provider |
| bcryptjs | Hash de senhas |
| Zod 4 | Validação de schemas (register, payment, chat, etc.) |
| Rate limiting | Redis + fallback memória (10 req / 10s) |
| CSP + Security Headers | X-Frame-Options, Permissions-Policy, Referrer-Policy |

### Integrações

| Tecnologia | Finalidade |
|---|---|
| Google Gemini 2.5 Flash | IA generativa para treinos |
| Mercado Pago SDK | Pagamentos (cartão tokenizado) |
| Resend API | Emails transacionais |
| Web Bluetooth API | Monitor cardíaco BLE |
| ViaCEP | Busca automática de endereço |
| Apple Health / Google Fit | Sincronização de saúde (futuro) |

### Observabilidade

| Tecnologia | Finalidade |
|---|---|
| Sentry | Monitoramento de erros (DSN, traces 1.0) |
| Pino + pino-pretty | Logger estruturado com redação de dados sensíveis |

### Infraestrutura

| Tecnologia | Finalidade |
|---|---|
| Docker Compose | PostgreSQL 16 + Redis 7 + App |
| Nginx | Proxy reverso para produção |
| PWA | Service Worker + manifest.json + ícones |
| CDN | Configurável via `NEXT_PUBLIC_CDN_URL` |
| GitHub Actions | CI/CD (build, lint, Docker push ghcr.io) |
| Scripts | backup.ps1, restore.sh, setup-all.sh, setup-github.sh, setup-sentry.sh, setup-ssl.sh |

---

## 🗄️ Modelo de Dados

```prisma
User         → atleta ou personal (role enum)
Athlete      → dados biométricos, nível, CEP, contato, objetivos
PersonalTrainer → nome + CREF validado (algoritmo dígito verificador)
TrainingPlan → plano semanal por dia (Seg-Dom)
Exercise     → exercícios com séries, repetições, carga
ProgressEntry → evolução (peso, massa magra, % gordura, nota)
WeeklyClass  → aulas agendadas (confirmed / pending / canceled)
Subscription → assinatura PRO (active / inactive / cancelled)
WorkoutSession → treino realizado (modalidade, calorias, FC, distância)
GpsSession   → corrida/caminhada com coordenadas GPS
```

**Migrations:** 6 (schema inicial → personalId → remove diet → LGPD consent → reset token → subscription/workout/gps)

---

## 🧠 Serviços (lib/services)

| Serviço | Métodos | Descrição |
|---|---|---|
| `athlete.service` | register, list, getRelations | CRUD de atletas com transação + senha temporária |
| `user.service` | register, getProfile, updateProfile, exportData, deleteAccount | Gestão de usuários + LGPD |
| `training-plan.service` | upsert, getByAthlete, getById, delete, addExercise, removeExercise | Planos de treino CRUD |
| `progress.service` | create, list, delete | Progresso do atleta |
| `subscription.service` | create, getActive, getByPaymentId, cancel | Assinaturas PRO |
| `payment.service` | process | Pagamento Mercado Pago |
| `workout-session.service` | create, list, getStats | Sessões de treino + stats agregados |
| `gps-session.service` | create, list | Sessões GPS com paginação |
| `chat.service` | generateWorkout | IA Gemini com library própria |
| `cep.service` | validate | Consulta ViaCEP |
| `personal-stats.service` | getDashboard | Dashboard do personal |

---

## 🧩 Componentes (17)

| Componente | Descrição |
|---|---|
| `AuthGuard` | Proteção de rotas por autenticação + role |
| `Chatbot` | Chat flutuante com IA Gemini para gerar treino |
| `ExerciseItem` | Exercício com toggle, input de carga, modal GIF |
| `I18nWrapper` | Provider de internacionalização |
| `LanguageSwitcher` | Dropdown seletor de idioma (15 bandeiras) |
| `ConsentBanner` | Banner LGPD com aceite localStorage |
| `OnboardingTutorial` | Tutorial em etapas (5 atleta / 4 personal) |
| `SessionProviderWrapper` | NextAuth SessionProvider |
| `GpsSessionResult` | Tela de resultado GPS (conquistas, mapa, stats, compartilhar) |
| `RouteMap` | Mapa Leaflet com polyline + marcadores |
| `AgendaItem` | Card de aula na agenda do personal |
| `AnimatedBackground` | Blobs decorativos animados |
| `AppShell` | Layout principal com sidebar responsiva |
| `DashboardElements` | StatCard + Field (componentes primitivos) |
| `LeftPanel` | Painel decorativo do login |
| `Sidebar` | Sidebar completa com navegação, flyout, mobile drawer |
| `PwaSync` | Registro de service worker (efeito colateral) |

---

## 🪝 Hooks Customizados

| Hook | Descrição |
|---|---|
| `useGpsTracker` | Rastreamento GPS completo (watchPosition, Haversine, steps, timer) |
| `usePWAInstall` | Gerenciamento de instalação PWA (beforeinstallprompt) |
| `useRegisterSW` | Registro de service worker |
| `useLoginForm` | Formulário de login/registro (validação, máscaras, ViaCEP, CREF) |

---

## 🔧 Utilitários

| Arquivo | Exportações |
|---|---|
| `calculations.ts` | `getSuggestedCardioBlock` |
| `home-stats.ts` | `buildHomeStats`, `readSessionsFromStorage`, `formatRelative` |
| `initializers.ts` | `createEmptyStudentForm` |
| `masks.ts` | `maskCPF`, `maskCEP` |
| `training-helpers.ts` | `formatClock`, `formatDurationHMS`, `parseKmInput`, `getSuggestedTimeBlock` |

---

## 📦 Constantes

| Arquivo | Conteúdo |
|---|---|
| `exercises.ts` | 127 exercícios com ID, músculo, séries, reps, GIF URL |
| `keys.ts` | `MODALITY_STORAGE_KEY` |
| `modalities.ts` | 20 modalidades com ícone Lucide |
| `options.ts` | Níveis, dias, gêneros, disponibilidade |
| `plans.ts` | Plano semanal inicial (Push/Pull/Legs) |

---

## ⚙️ Como rodar o projeto

### Pré-requisitos
- Node.js 20+
- Docker (ou PostgreSQL + Redis locais)

### 1. Clone e instale
```bash
git clone https://github.com/seu-usuario/wegym.git
cd wegym
cp .env.example .env.local
# Edite .env.local com suas credenciais
```

### 2. Suba os serviços (Docker)
```bash
npm run docker:build
npm run docker:up
```

### 3. Configure o banco
```bash
npx prisma migrate dev
npx prisma db seed
```

### 4. Execute
```bash
npm run dev
```

### Scripts disponíveis

| Comando | Descrição |
|---|---|
| `npm run dev` | Servidor de desenvolvimento |
| `npm run build` | Build de produção (standalone) |
| `npm run start` | Iniciar produção |
| `npm run test` | Testes (Vitest) |
| `npm run test:watch` | Testes em watch mode |
| `npm run lint` | Lint (ESLint) |
| `npm run lint:fix` | Lint com auto-fix |
| `npm run analyze` | Bundle analyzer |
| `npm run db:studio` | Prisma Studio (navegar no BD) |
| `npm run migrate:dev` | Criar migrations |
| `npm run migrate:deploy` | Aplicar migrations em produção |
| `npm run migrate:seed` | Popular banco (2 atletas + 1 personal) |
| `npm run db:push` | Push schema direto |
| `npm run backup` | Backup via PowerShell |
| `npm run docker:build` | Build Docker |
| `npm run docker:up` | Subir containers (dev) |
| `npm run docker:prod` | Subir containers (produção) |

---

## 🌍 Variáveis de Ambiente

| Variável | Obrigatória | Descrição |
|---|---|---|
| `DATABASE_URL` | Sim | Conexão PostgreSQL |
| `NEXTAUTH_SECRET` | Sim | Chave secreta JWT |
| `NEXTAUTH_URL` | Sim | URL base (ex: http://localhost:3000) |
| `GEMINI_API_KEY` | Sim | Chave da API Google Gemini |
| `MP_ACCESS_TOKEN` | Sim | Token de acesso Mercado Pago |
| `NEXT_PUBLIC_MP_PUBLIC_KEY` | Sim | Chave pública Mercado Pago |
| `RESEND_API_KEY` | Sim | Chave da API Resend |
| `POSTGRES_PASSWORD` | Sim | Senha do PostgreSQL (Docker) |
| `MP_WEBHOOK_SECRET` | Não | Segredo do webhook Mercado Pago |
| `REDIS_URL` | Não | Conexão Redis (opcional, fallback memória) |
| `REDIS_PASSWORD` | Não | Senha Redis (Docker) |
| `SENTRY_DSN` | Não | DSN do Sentry |
| `NEXT_PUBLIC_SENTRY_DSN` | Não | DSN público Sentry |
| `NEXT_PUBLIC_CDN_URL` | Não | URL do CDN |
| `NEXT_PUBLIC_SITE_URL` | Não | URL pública do site |
| `NODE_ENV` | Não | `development` ou `production` |

---

## 📁 Estrutura do Projeto

```
wegym/
├── app/                    # Next.js App Router
│   ├── api/                # 18 rotas de API (29 handlers)
│   ├── home/               # Dashboard do atleta
│   ├── training/           # Treino (4 modos)
│   ├── profile/            # Perfil do usuário
│   ├── stats/              # Estatísticas
│   ├── personal/           # Dashboard do personal
│   ├── pro/                # Landing PRO
│   ├── payment/            # Checkout Mercado Pago
│   ├── login/              # Autenticação
│   ├── privacy/            # Política LGPD
│   ├── reset-password/     # Redefinir senha
│   └── offline/            # Fallback PWA
├── components/             # 17 componentes React
│   ├── auth/               # AuthGuard
│   ├── Chatbot/            # IA Gemini
│   ├── ExerciseItem/       # Exercício com GIF
│   ├── i18n/               # Internacionalização
│   ├── lgpd/               # Consentimento LGPD
│   ├── onboarding/         # Tutorial
│   ├── providers/          # SessionProvider
│   ├── training/           # GPS + Mapa
│   └── ui/                 # Sidebar, AppShell, etc.
├── lib/                    # Lógica compartilhada
│   ├── services/           # 11 serviços (CRUD + IA + CEP)
│   ├── i18n/               # Sistema de tradução
│   └── seo/                # Metadados Next.js
├── hooks/                  # 3 hooks customizados
├── utils/                  # 5 utilitários
├── constants/              # 5 constantes (exercícios, modalidades, etc.)
├── types/                  # 4 arquivos de tipos TS
├── mocks/                  # Dados mockados (personal)
├── prisma/                 # Schema + migrations + seed
├── translations/           # 15 arquivos JSON de tradução
├── scripts/                # 6 scripts (backup, setup, etc.)
├── __tests__/              # 10 arquivos de teste (Vitest)
├── .github/workflows/      # CI/CD GitHub Actions
├── docker-compose.yml      # PostgreSQL + Redis + App
├── Dockerfile              # Build multi-stage standalone
└── nginx/                  # Configuração Nginx
```