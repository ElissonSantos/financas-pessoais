# Financeiro Pessoal - Fase 1

Projeto inicial com login por PIN, sessao por JWT, tela protegida `Hello World`, e base PWA.

## Stack

- Monorepo com `pnpm`
- API: NestJS + TypeScript
- Web: React + Vite + TypeScript
- Auth: PIN unico + JWT
- Testes: Vitest, Supertest, Testing Library

## Estrutura

- `apps/api`: backend NestJS
- `apps/web`: frontend React

## Instalar

```bash
pnpm install
```

## Rodar

```bash
pnpm dev
```

Separado:

```bash
pnpm dev:api
pnpm dev:web
```

- API: `http://localhost:3000`
- Web: `http://localhost:5173`

## Variaveis de ambiente

Copie os exemplos e ajuste localmente.

Raiz `.env.example`:

```env
APP_PIN=1234
JWT_SECRET=change-me
WEB_ORIGIN=http://localhost:5173
VITE_API_URL=http://localhost:3000
```

`apps/api/.env.example`:

```env
APP_PIN=1234
JWT_SECRET=change-me
WEB_ORIGIN=http://localhost:5173
```

`apps/web/.env.example`:

```env
VITE_API_URL=http://localhost:3000
```

## Endpoints

- `GET /health` -> `{ "status": "ok" }`
- `POST /auth/pin` body `{ "pin": "1234" }` -> `{ "accessToken": "..." }`
- `GET /me` com `Authorization: Bearer <token>` -> `{ "authenticated": true }`

## Fluxo de PIN

1. Usuario envia PIN para `/auth/pin`.
2. Se correto, frontend salva token em `localStorage` (`financeiro.token`).
3. Frontend valida sessao em `/me` no reload.
4. Logout remove token e volta para login.

## Testes e qualidade

```bash
pnpm test
pnpm lint
pnpm build
```

## Nota

Banco de dados e registro financeiro ficam para fase futura.
