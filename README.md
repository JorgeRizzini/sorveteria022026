# ArcadeCream

Aplicação full stack de uma sorveteria artesanal, construída com React, TypeScript, Express e Supabase. O projeto contém Home, Cardápio, Carrinho, autenticação e uma API para produtos e pedidos.

## Executar localmente

Requisitos: Node.js 20 ou superior, npm e um projeto Supabase configurado.

```bash
git clone https://github.com/JorgeRizzini/sorveteria022026.git
cd sorveteria022026
npm install
copy .env.example .env
```

Preencha o `.env` e inicie os dois processos em terminais separados:

```bash
npm run dev:api
npm run dev:web
```

- Front-end: `http://localhost:5173`
- API: `http://localhost:3001`
- Saúde da API: `http://localhost:3001/health`

No PowerShell que bloqueia `npm.ps1`, utilize `npm.cmd`.

## Funcionalidades

- Home responsiva e catálogo com busca e filtros
- Carrinho compartilhado entre as telas
- Produtos carregados da API, com catálogo local de contingência
- Cadastro e login com Supabase Auth
- Criação e consulta de pedidos autenticados
- PostgreSQL com migrations, RLS e criação transacional de pedido

## Estrutura

```text
.
├── api/                 # API Express + TypeScript
├── docs/                # documentação técnica e da API
├── supabase/migrations/ # schema, segurança e dados iniciais
├── web/                 # SPA React + Vite
├── .env.example         # contrato único de configuração
└── package.json         # workspaces e scripts do monorepo
```

## Comandos

| Comando | Ação |
| --- | --- |
| `npm run dev:web` | Inicia o React/Vite |
| `npm run dev:api` | Inicia a API com recarga automática |
| `npm run build` | Compila API e front-end |
| `npm run lint` | Executa ESLint e typecheck |
| `npm run test:connection` | Testa a conexão e as tabelas do Supabase |

## Configuração

Existe apenas um `.env`, na raiz. Ele é ignorado pelo Git. Nunca envie credenciais reais ao repositório; mantenha apenas os nomes e exemplos seguros em `.env.example`.

## Documentação

- [Desenvolvimento e organização](docs/DESENVOLVIMENTO.md)
- [Referência da API](docs/API.md)

O fluxo de branches recomendado é `feature/*` → `dev` → `main`.
