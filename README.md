# Velô Sprint - Configurador de Veículo Elétrico

Aplicação web em React para configuração e compra do veículo elétrico **Velô Sprint**.

## Sobre o Projeto

Uma SPA (Single Page Application) que permite:
- Personalizar cores, rodas e opcionais do veículo
- Calcular preços em tempo real
- Realizar pedidos com análise de crédito
- Consultar status de pedidos

**Especificações do Velô Sprint:** 450 km de autonomia | 0-100 km/h em 3.2s | 500 cv

---

## Stack Tecnológica

| Categoria | Tecnologias |
|-----------|-------------|
| **Frontend** | React 18, TypeScript, Vite, Tailwind CSS, shadcn/ui |
| **Estado** | Zustand (global), React Hook Form (formulários) |
| **Validação** | Zod |
| **Data Fetching** | TanStack Query |
| **Backend** | Supabase (PostgreSQL + Edge Functions) |
| **Testes E2E** | Playwright, TypeScript |

---

## Instalação

```bash
# Instalar dependências
npm install

# Rodar em desenvolvimento
npm run dev
```

Acesse: `http://localhost:5173`

---

## Configuração do Supabase

### 1. Criar Projeto

1. Acesse [supabase.com](https://supabase.com) e crie uma conta
2. Clique em **New Project**
3. Escolha um nome e senha para o banco
4. Aguarde a criação (~2 minutos)

### 2. Variáveis de Ambiente

Crie o arquivo `.env` na raiz do projeto:

```env
VITE_SUPABASE_PROJECT_ID="seu_project_id"
VITE_SUPABASE_PUBLISHABLE_KEY="sua_chave_anon_publica"
VITE_SUPABASE_URL="https://seu_project_id.supabase.co"
```

> Encontre essas informações em: **Project Settings → API**

### 3. Deploy (banco + functions)

```bash
# Instalar CLI
npm install -g supabase

# Login e vincular projeto
npx supabase login
npx supabase link --project-ref aeoccgnlapvzubifmmqb

# Aplicar migrações (cria tabelas e RLS)
npx supabase db push

# Deploy das Edge Functions
npx supabase functions deploy
```

Pronto! O banco e as functions estarão configurados.

---

## Estrutura Principal

```
src/
├── pages/           # Páginas da aplicação
├── components/      # Componentes React
│   ├── configurator/   # Configurador do carro
│   ├── landing/        # Landing page
│   └── ui/             # Componentes shadcn/ui
├── store/           # Estado global (Zustand)
├── hooks/           # Hooks customizados
└── integrations/    # Cliente Supabase

playwright/
├── e2e/             # Specs E2E (*.spec.ts)
├── support/
│   ├── actions/     # Comportamentos E2E organizados por contexto
│   │   ├── landingActions.ts
│   │   └── orderLookupActions.ts
│   ├── fixtures.ts  # Fixture central: expõe a aplicação como { app }
│   └── helpers.ts   # Funções auxiliares independentes
└── backup/legacy/   # Page Objects e fixtures anteriores, apenas como referência
```

---

## Rotas

| Rota | Descrição |
|------|-----------|
| `/` | Landing page |
| `/configure` | Configurador do veículo |
| `/order` | Checkout/Pedido |
| `/success` | Confirmação do pedido |
| `/lookup` | Consulta de pedidos |
| `/termos` | Termos de uso |
| `/privacidade` | Política de privacidade |

---

## Modelo de Preços

- **Preço base:** R$ 40.000
- **Rodas Sport:** +R$ 2.000
- **Precision Park:** +R$ 5.500
- **Flux Capacitor:** +R$ 5.000
- **Financiamento:** 12x com juros de 2% a.m.

---

## Banco de Dados

**Tabela `orders`** — campos principais:
- `order_number` — Formato: VLO-XXXXXX
- `color`, `wheel_type`, `optionals` — Configuração
- `customer_name`, `customer_email`, `customer_cpf` — Cliente
- `payment_method`, `total_price` — Pagamento
- `status` — `APROVADO`, `REPROVADO`, `EM_ANALISE`

---

## Análise de Crédito

| Score | Resultado |
|-------|-----------|
| > 700 | Aprovado |
| 501-700 | Em análise |
| ≤ 500 | Reprovado |

*Se entrada ≥ 50% do total, aprova mesmo com score < 700*

---

## Fluxo Principal

```
Landing → Configurador → Checkout → Análise de Crédito → Confirmação
```

---

## Testes E2E

Os testes usam [Playwright](https://playwright.dev/) e exigem a aplicação rodando em `http://localhost:5173`.
Eles seguem o padrão funcional **Actions + Fixture**: cada action recebe `Page` e a fixture
central injeta todas elas em `app`.

```bash
# Terminal 1 — app
npm run dev

# Terminal 2 — testes
npm run test

# Modo interativo (UI)
npm run test:ui

# Relatório HTML do último run
npm run test:report

# Gravar ações e gerar código (app deve estar rodando)
npm run codegen
```

Demais comandos do Playwright podem ser executados via `npx playwright <comando>`.

### Convenções

- Specs em `playwright/e2e/<funcionalidade>.spec.ts`
- Importar sempre de `../support/fixtures` (não de `@playwright/test` nem de arquivos internos de fixture)
- Criar actions em `playwright/support/actions/<contexto>Actions.ts`, exportando `create<Contexto>Actions(page: Page)`
- Actions retornam objetos literais com métodos `async`; não usam classes, herança, `this` ou estado global
- Registrar cada action em `playwright/support/fixtures.ts` para disponibilizá-la em `app`
- Os arquivos legados ficam em `playwright/backup/legacy` e não devem ser importados pelos specs ativos

```typescript
import { test, expect } from '../support/fixtures'

test('consulta um pedido', async ({ app }) => {
  await app.orderLookup.open()
  await app.orderLookup.searchOrder('VLO-86R45Q')
  await app.orderLookup.validateStatusBadge('APROVADO')
})
```

### Criando uma nova Action

Crie uma factory por contexto em `playwright/support/actions`. Ela recebe a `Page` e retorna
somente os comportamentos que o teste precisa executar ou validar.

```typescript
// playwright/support/actions/checkoutActions.ts
import { expect, Page } from '@playwright/test'

export function createCheckoutActions(page: Page) {
  return {
    async open() {
      await page.goto('/order')
    },

    async submit() {
      await page.getByRole('button', { name: 'Finalizar pedido' }).click()
    },

    async validateConfirmation() {
      await expect(page.getByRole('heading', { name: 'Pedido confirmado' })).toBeVisible()
    },
  }
}
```

Registre a action na fixture central para que ela fique disponível como `app.checkout`:

```typescript
// playwright/support/fixtures.ts
import { createCheckoutActions } from './actions/checkoutActions'

type App = {
  // ...actions existentes
  checkout: ReturnType<typeof createCheckoutActions>
}

const app: App = {
  // ...actions existentes
  checkout: createCheckoutActions(page),
}
```

Então utilize a action no spec, sem instanciar objetos ou importar a `Page`:

```typescript
import { test } from '../support/fixtures'

test('finaliza o pedido', async ({ app }) => {
  await app.checkout.open()
  await app.checkout.submit()
  await app.checkout.validateConfirmation()
})
```

---

## Scripts

```bash
npm run dev                 # Desenvolvimento
npm run build               # Build de produção
npm run build:dev           # Build em modo development
npm run preview             # Preview do build de produção
npm run lint                # Verificar código
npm run test                # Executar todos os testes
npm run test:ui             # Executar testes em modo interativo
npm run test:headed         # Executar testes com browser visível
npm run test:debug          # Executar testes em modo debug
npm run test:report         # Abrir relatório HTML do último run
npm run codegen             # Gravar ações e gerar código
```
