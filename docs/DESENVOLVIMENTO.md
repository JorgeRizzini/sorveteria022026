# Desenvolvimento e organização do ArcadeCream

## Visão geral

O repositório é um monorepo npm com dois workspaces: `web` e `api`. O front-end nunca acessa o banco diretamente; toda operação passa pela API, que conversa com o Supabase.

```text
Navegador (React) → API REST (Express) → Supabase Auth/PostgreSQL
```

## Árvore do repositório

```text
.
├── api/
│   └── src/
│       ├── config/       # ambiente validado com Zod
│       ├── lib/          # clientes Supabase
│       ├── middleware/   # autenticação
│       ├── routes/       # auth, health, orders e products
│       ├── scripts/      # teste de conexão
│       ├── app.ts        # composição do Express
│       └── server.ts     # listener HTTP
├── docs/
│   ├── API.md
│   └── DESENVOLVIMENTO.md
├── supabase/
│   └── migrations/       # histórico versionado do banco
├── web/
│   └── src/
│       ├── components/   # elementos reutilizáveis
│       ├── data/         # catálogo de contingência
│       ├── lib/          # cliente HTTP
│       ├── pages/        # Home, Cardápio e Carrinho
│       ├── types/        # contratos TypeScript
│       ├── App.tsx       # estado e navegação
│       └── main.tsx      # entrada do React
├── .env.example          # variáveis esperadas, sem segredos
├── .gitignore
└── package.json          # scripts e workspaces
```

Arquivos gerados (`node_modules`, `dist`, logs e `.env`) são ignorados pelo Git.

## Ambiente único

Copie `.env.example` para `.env` na raiz. Não crie arquivos de ambiente dentro de `web`, `api` ou `supabase`.

| Variável | Consumidor | Uso |
| --- | --- | --- |
| `VITE_API_URL` | web | Endereço público da API |
| `PORT` | api | Porta HTTP |
| `CORS_ORIGIN` | api | Origem aceita no navegador |
| `SUPABASE_URL` | api | URL do projeto |
| `SUPABASE_PUBLISHABLE_KEY` | api | Fluxos públicos de Auth |
| `SUPABASE_SECRET_KEY` | api | Operações administrativas no servidor |
| `SUPABASE_DB_URL` | ferramentas | Conexão PostgreSQL/migrations |

O Vite carrega o ambiente da raiz por meio de `envDir`. Somente variáveis que começam com `VITE_` são expostas ao navegador.

## Instalação e execução

Na raiz:

```bash
npm install
npm run dev:api
```

Em outro terminal:

```bash
npm run dev:web
```

O front abre normalmente em `http://localhost:5173` e a API em `http://localhost:3001`.

## Front-end

`App.tsx` mantém o catálogo, carrinho, modal e rota atual. Cada tela vive em `pages/`; cabeçalho, rodapé, login e cartões vivem em `components/`. `lib/apiClient.ts` concentra as requisições e o token da sessão.

As rotas da SPA são `/`, `/cardapio` e `/carrinho`. Em produção, a hospedagem deve redirecionar rotas desconhecidas para `index.html`.

Se a API estiver temporariamente indisponível, o catálogo local em `data/flavors.ts` mantém a interface utilizável. Pedidos e autenticação continuam dependentes da API.

## API e banco

`app.ts` configura CORS, Helmet, JSON, rotas e erros. `server.ts` apenas abre a porta. As regras de cada domínio ficam em arquivos de rota separados.

O banco contém `profiles`, `products`, `orders` e `order_items`. Mudanças no schema devem ser criadas como uma nova migration; uma migration já aplicada não deve ser reescrita.

Consulte [API.md](API.md) para endpoints, exemplos e códigos HTTP.

## Segurança

- Senhas pertencem ao Supabase Auth e não ao schema da aplicação.
- Chaves secretas jamais devem entrar no front-end ou em commits.
- A API valida entradas com Zod e autentica tokens Bearer.
- Totais são calculados usando preços do banco.
- Políticas RLS limitam o acesso aos dados de cada usuário.
- Se uma credencial for exposta, ela deve ser rotacionada no painel do Supabase.

## Qualidade e entrega

Antes de cada commit:

```bash
npm run lint
npm run build
```

Quando houver alterações de banco ou ambiente:

```bash
npm run test:connection
```

Fluxo Git recomendado:

```text
feature/nome → dev → main
```

Use commits pequenos com prefixos como `feat:`, `fix:`, `docs:`, `refactor:` e `chore:`.

## Solução de problemas

- `npm.ps1 não pode ser carregado`: use `npm.cmd` no PowerShell.
- CORS no navegador: confirme se `CORS_ORIGIN` corresponde exatamente à URL do front.
- Catálogo local em vez do banco: verifique `/health`, `VITE_API_URL` e o terminal da API.
- 404 ao abrir rota publicada: configure fallback da SPA para `index.html`.
- Erro de ambiente: compare o `.env` com `.env.example`, sem publicar os valores.
