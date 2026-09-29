# API ArcadeCream

API REST em TypeScript responsável por autenticação, catálogo e pedidos. Em desenvolvimento, a URL padrão é `http://localhost:3001`.

## Execução

Na raiz do repositório:

```bash
npm install
copy .env.example .env
npm run dev:api
```

O arquivo `.env` é único para todo o monorepo e nunca deve ser enviado ao Git. Consulte `.env.example` para conhecer as variáveis necessárias.

## Autenticação

As rotas protegidas recebem o access token do Supabase:

```http
Authorization: Bearer <access_token>
Content-Type: application/json
```

As senhas são gerenciadas pelo Supabase Auth, que aplica hash bcrypt com salt. A aplicação não cria nem armazena colunas de senha.

## Endpoints

### Saúde da aplicação

`GET /health` — verifica a API e uma consulta mínima ao banco. Retorna `200` quando disponível ou `503` quando o banco não responde.

```json
{ "status": "ok", "database": "connected" }
```

### Criar conta

`POST /auth/register`

```json
{
  "email": "cliente@exemplo.com",
  "password": "senha-com-10-ou-mais-caracteres",
  "fullName": "Cliente Arcade"
}
```

Retorna `201`. Conforme a configuração do Supabase, pode exigir a confirmação do e-mail antes de criar uma sessão.

### Entrar

`POST /auth/login`

```json
{ "email": "cliente@exemplo.com", "password": "senha-do-cliente" }
```

Retorna o usuário e a sessão. Credenciais incorretas retornam `401`.

### Perfil atual

`GET /me` — protegida. Retorna o usuário autenticado e seu registro em `profiles`.

### Listar produtos

`GET /products` — pública. Retorna apenas produtos ativos. Preços são armazenados em centavos para evitar erros de ponto flutuante.

### Criar pedido

`POST /orders` — protegida.

```json
{
  "items": [{ "productId": "uuid-do-produto", "quantity": 2 }]
}
```

Aceita de 1 a 30 itens e quantidade de 1 a 20 por item. O banco consulta os preços atuais, calcula o total e cria tudo de forma transacional. Retorna `201` com `orderId`.

### Listar pedidos

`GET /orders` — protegida. Retorna somente os pedidos pertencentes ao usuário autenticado, com seus itens.

## Respostas de erro

| Código | Significado |
| --- | --- |
| `400` | Corpo inválido ou regra de negócio recusada |
| `401` | Token ausente/inválido ou credenciais incorretas |
| `404` | Recurso ou rota não encontrado |
| `500` | Falha interna inesperada |
| `503` | Banco indisponível no health check |

## Banco de dados

| Tabela | Responsabilidade |
| --- | --- |
| `profiles` | Dados complementares ligados a `auth.users` |
| `products` | Catálogo, preços, categorias e disponibilidade |
| `orders` | Cabeçalho, total e estado dos pedidos |
| `order_items` | Produtos, quantidades e preço congelado no pedido |

O schema, políticas RLS, gatilhos, dados iniciais e função transacional estão em `supabase/migrations/`.

## Organização do código

```text
api/src/
├── config/       # leitura e validação do ambiente
├── lib/          # clientes compartilhados do Supabase
├── middleware/   # autenticação Bearer
├── routes/       # endpoints separados por domínio
├── scripts/      # verificações operacionais
├── app.ts        # configuração do Express
└── server.ts     # inicialização HTTP
```

## Segurança

- Segredos do Supabase e a URL direta do banco existem somente no back-end.
- Apenas variáveis prefixadas por `VITE_` podem chegar ao navegador.
- A API recalcula preços no banco e não confia no total enviado pelo cliente.
- Helmet, limite de JSON, CORS e validação Zod são aplicados no servidor.
- RLS protege os dados quando acessados sem privilégios administrativos.

## Validação

```bash
npm run lint
npm run build
npm run test:connection
```

O último comando exige acesso ao projeto Supabase configurado no `.env`.
