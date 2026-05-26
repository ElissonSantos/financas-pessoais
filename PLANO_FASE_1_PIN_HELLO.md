# Plano de Execucao - Fase 1: PIN + Hello World

## 1. Contexto

Projeto financeiro pessoal para uso no computador e no celular. Nesta primeira fase, o objetivo nao e registrar gastos ainda. O objetivo e criar a base tecnica minima do sistema:

- app web com React;
- API com NestJS;
- acesso por PIN unico;
- sessao com token;
- tela protegida exibindo `Hello World`;
- estrutura preparada para evoluir depois para registros financeiros;
- PWA basico para futura instalacao no iPhone e desktop.

## 2. Escopo da Fase 1

### Incluido

- Criar backend em `apps/api`.
- Criar frontend em `apps/web`.
- Criar fluxo de login por PIN.
- Criar endpoint protegido para validar sessao.
- Criar tela protegida com `Hello World`.
- Criar botao de logout.
- Criar configuracao basica de PWA.
- Criar testes da API e do frontend.
- Criar documentacao de setup local.

### Fora do escopo

- Banco de dados.
- Prisma.
- Neon.
- Render.
- Cloudflare deploy real.
- Registros financeiros.
- Categorias financeiras.
- Entradas e saidas.
- Exportacao CSV/JSON.
- Sync offline.
- Login por email e senha.
- Cadastro de usuario.
- Recuperacao de PIN.

## 3. Stack da Fase 1

- Monorepo com `pnpm`.
- Backend: NestJS + TypeScript.
- Frontend: React + TypeScript + Vite.
- Autenticacao: PIN unico + JWT.
- Testes backend: Vitest + Supertest.
- Testes frontend: Vitest + Testing Library.
- PWA: manifest + service worker simples.

## 4. Estrutura Esperada

```txt
.
├── apps
│   ├── api
│   │   ├── src
│   │   │   ├── auth
│   │   │   ├── health.controller.ts
│   │   │   ├── app.module.ts
│   │   │   └── main.ts
│   │   ├── test
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   └── .env.example
│   └── web
│       ├── public
│       │   ├── manifest.webmanifest
│       │   ├── sw.js
│       │   └── icon.svg
│       ├── src
│       │   ├── App.tsx
│       │   ├── api.ts
│       │   ├── main.tsx
│       │   └── styles.css
│       ├── package.json
│       ├── tsconfig.json
│       └── .env.example
├── package.json
├── pnpm-workspace.yaml
├── .env.example
├── .gitignore
└── README.md
```

## 5. Etapa 2 - Criar Backend API

### Objetivo

Criar API NestJS minima em `apps/api`, pronta para receber autenticacao por PIN.

### Gerar

Dentro de `apps/api`:

- `package.json`
- `tsconfig.json`
- `nest-cli.json`
- `src/main.ts`
- `src/app.module.ts`
- `src/health.controller.ts`
- `.env.example`

### Dependencias

Producao:

- `@nestjs/common`
- `@nestjs/core`
- `@nestjs/platform-express`
- `reflect-metadata`
- `rxjs`

Desenvolvimento:

- `@nestjs/cli`
- `@nestjs/testing`
- `typescript`
- `ts-node`
- `vitest`
- `supertest`
- `eslint`

### Comportamento

Criar endpoint:

```txt
GET /health
```

Resposta:

```json
{
  "status": "ok"
}
```

Configurar CORS no `main.ts` usando:

```env
WEB_ORIGIN=http://localhost:5173
```

### Criterio de aceite

- `pnpm dev:api` sobe API na porta `3000`.
- `GET http://localhost:3000/health` retorna `{ "status": "ok" }`.

## 6. Etapa 3 - Implementar PIN no Backend

### Objetivo

Criar autenticacao simples por PIN unico global.

### Gerar

Dentro de `apps/api/src/auth`:

- `auth.controller.ts`
- `auth.service.ts`
- `auth.guard.ts`
- `pin.dto.ts`

Atualizar:

- `app.module.ts`
- `.env.example`

### Dependencias adicionais

Producao:

- `@nestjs/jwt`
- `class-validator`
- `class-transformer`

### Variaveis

```env
APP_PIN=1234
JWT_SECRET=change-me
```

### API

#### POST /auth/pin

Body:

```json
{
  "pin": "1234"
}
```

Se PIN correto:

```json
{
  "accessToken": "jwt-token"
}
```

Status: `201`

Se PIN errado:

```json
{
  "message": "PIN incorreto."
}
```

Status: `401`

#### GET /me

Header:

```txt
Authorization: Bearer <token>
```

Se token valido:

```json
{
  "authenticated": true
}
```

Se token ausente ou invalido:

```txt
401 Unauthorized
```

### Regras

- PIN vem de `APP_PIN`.
- JWT usa `JWT_SECRET`.
- Token expira em `30d`.
- Nao criar usuario.
- Nao criar banco.
- Nao salvar PIN em arquivo alem de `.env` local.

### Criterio de aceite

- PIN correto retorna token.
- PIN errado retorna `401`.
- `/me` aceita token valido.
- `/me` rejeita token ausente.

## 7. Etapa 4 - Criar Frontend

### Objetivo

Criar app React em `apps/web` com tela inicial de PIN.

### Gerar

Dentro de `apps/web`:

- `package.json`
- `index.html`
- `vite.config.ts`
- `tsconfig.json`
- `src/main.tsx`
- `src/App.tsx`
- `src/api.ts`
- `src/styles.css`
- `.env.example`

### Dependencias

Producao:

- `react`
- `react-dom`

Desenvolvimento:

- `vite`
- `typescript`
- `@vitejs/plugin-react`
- `vitest`
- `jsdom`
- `@testing-library/react`
- `@testing-library/user-event`
- `@testing-library/jest-dom`
- `eslint`

### Variavel

```env
VITE_API_URL=http://localhost:3000
```

### UI inicial

Mostrar tela com:

- titulo: `Financeiro Pessoal`;
- subtitulo: `Acesso por PIN`;
- input de PIN;
- botao `Entrar`;
- area de erro.

### Criterio de aceite

- `pnpm dev:web` sobe app na porta `5173`.
- Tela de PIN aparece ao abrir app.

## 8. Etapa 5 - Conectar Frontend com Backend

### Objetivo

Criar fluxo completo: PIN correto libera tela protegida `Hello World`.

### Comportamento

Ao enviar PIN:

1. Frontend chama `POST /auth/pin`.
2. Se sucesso, salva `accessToken` em `localStorage`.
3. App mostra tela protegida.
4. Tela protegida exibe:
   - `Hello World`;
   - botao `Sair`.

Ao recarregar pagina:

1. Frontend le token do `localStorage`.
2. Chama `GET /me`.
3. Se valido, mantem tela `Hello World`.
4. Se invalido, remove token e volta para PIN.

Ao clicar `Sair`:

1. Remove token do `localStorage`.
2. Volta para tela PIN.

### Chave de sessao

```txt
localStorage key: financeiro.token
```

### Erros

PIN invalido mostra:

```txt
PIN incorreto.
```

API fora do ar mostra:

```txt
Nao foi possivel acessar o servidor.
```

### Criterio de aceite

- PIN correto entra.
- PIN errado mostra erro.
- Reload mantem sessao.
- Logout limpa sessao.
- Token invalido volta ao login.

## 9. Etapa 6 - Configurar PWA Basico

### Objetivo

Preparar app para instalacao futura no iPhone e desktop.

### Gerar

Dentro de `apps/web/public`:

- `manifest.webmanifest`
- `sw.js`
- `icon.svg`

Atualizar `index.html` com:

- link do manifest;
- theme color;
- apple touch icon;
- favicon.

### Manifest

Configurar:

```json
{
  "name": "Financeiro Pessoal",
  "short_name": "Financeiro",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#f8fafc",
  "theme_color": "#0f766e"
}
```

### Service worker

Criar cache simples para:

- `/`
- `/manifest.webmanifest`
- `/icon.svg`

Nao precisa cache avancado nesta fase.

### Criterio de aceite

- Browser detecta manifest.
- App tem base para instalacao futura.
- Build continua funcionando.

## 10. Etapa 7 - Testes

### Objetivo

Garantir comportamento minimo da fase.

### Backend

Criar testes para:

- `POST /auth/pin` com PIN correto retorna token.
- `POST /auth/pin` com PIN errado retorna `401`.
- `GET /me` sem token retorna `401`.
- `GET /me` com token valido retorna `200`.

### Frontend

Criar testes para:

- tela PIN aparece inicialmente.
- PIN invalido mostra erro.
- PIN valido mostra `Hello World`.
- sessao persiste apos reload.
- logout volta para tela PIN.

### Comandos esperados

```bash
pnpm test
pnpm lint
pnpm build
```

### Criterio de aceite

- Todos os testes passam.
- Build passa.
- Lint passa.

## 11. Etapa 8 - Documentacao

### Objetivo

Deixar projeto rodavel por outro dev ou outro chat.

### Gerar

Na raiz:

- `README.md`
- `.env.example`
- `.gitignore`

### README deve conter

- visao geral do projeto;
- stack usada;
- estrutura de pastas;
- como instalar;
- como rodar API;
- como rodar web;
- variaveis de ambiente;
- endpoints disponiveis;
- fluxo de PIN;
- comandos de teste;
- nota: banco e registros financeiros entram em fase futura.

### `.env.example` raiz

```env
APP_PIN=1234
JWT_SECRET=change-me
WEB_ORIGIN=http://localhost:5173
VITE_API_URL=http://localhost:3000
```

### `.gitignore`

Incluir:

```txt
node_modules
dist
coverage
.env
.env.*
!.env.example
*.log
```

## 12. Resultado Final Esperado

Ao final da Fase 1:

- `pnpm install` funciona.
- `pnpm dev` sobe web e API.
- usuario abre `http://localhost:5173`.
- tela de PIN aparece.
- PIN correto libera `Hello World`.
- PIN errado mostra erro.
- reload mantem sessao.
- botao sair funciona.
- PWA basico configurado.
- testes passam.
- README explica tudo.

## 13. Ordem de Execucao

```txt
Etapa 2: Criar backend API
Etapa 3: Implementar PIN no backend
Etapa 4: Criar frontend
Etapa 5: Conectar frontend com backend
Etapa 6: Configurar PWA basico
Etapa 7: Criar testes
Etapa 8: Criar documentacao
```

## 14. Observacoes Para Proxima Fase

Depois desta fase, proxima evolucao natural:

- adicionar banco PostgreSQL;
- adicionar Prisma;
- criar tabela de transacoes;
- criar cadastro de entradas e saidas;
- listar registros;
- exportar CSV/JSON;
- preparar deploy em Cloudflare Pages, Render e Neon.
