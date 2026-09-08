# ArcadeCream 🍦

Interface web responsiva para uma sorveteria artesanal do litoral paulista. O projeto oferece uma experiência de compra leve e colorida, com catálogo de sabores, filtros de pesquisa e carrinho de compras.

## Sobre o projeto

O ArcadeCream foi desenvolvido em React a partir de mockups visuais. A identidade combina amarelo, verde e lilás com tipografia editorial, cartões de produtos e uma navegação simples entre as principais etapas da experiência.

O projeto está atualmente focado no front-end. Login, checkout, pagamentos e persistência de dados ainda são representações de interface e não estão conectados a um back-end.

## Funcionalidades

- Home responsiva com apresentação da marca e destaques da temporada
- Catálogo com 12 sabores artesanais
- Pesquisa instantânea por nome do sabor
- Filtros por sabores clássicos, tropicais, especiais e veganos
- Carrinho compartilhado entre as telas
- Adição e remoção de produtos
- Cálculo do subtotal e total do pedido
- Estado vazio do carrinho
- Modal de acesso do cliente
- Navegação sem recarregamento entre as páginas
- Layout adaptado para desktop, tablet e celular

## Páginas

| Página | Endereço | Descrição |
| --- | --- | --- |
| Home | `/` | Apresentação, diferenciais, destaques e famílias de sabores |
| Cardápio | `/cardapio` | Catálogo completo com pesquisa e filtros |
| Carrinho | `/carrinho` | Itens selecionados, resumo e estado vazio |

## Tecnologias

- [React 19](https://react.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Vite](https://vite.dev/)
- CSS responsivo
- ESLint

## Como executar localmente

### Pré-requisitos

- Node.js 20 ou superior
- npm

### Instalação

Clone o repositório e acesse a pasta do projeto:

```bash
git clone https://github.com/JorgeRizzini/sorveteria022026.git
cd sorveteria022026/web
```

Instale as dependências:

```bash
npm install
```

Inicie o servidor de desenvolvimento:

```bash
npm run dev
```

O Vite exibirá o endereço local no terminal, normalmente `http://localhost:5173`.

No Windows com restrição de execução do PowerShell, utilize:

```powershell
npm.cmd install
npm.cmd run dev
```

## Comandos disponíveis

| Comando | Descrição |
| --- | --- |
| `npm run dev` | Inicia o ambiente de desenvolvimento |
| `npm run build` | Valida o TypeScript e gera a versão de produção |
| `npm run lint` | Analisa o código com ESLint |
| `npm run preview` | Executa localmente a versão compilada |

## Estrutura principal

```text
sorveteria022026/
├── README.md
└── web/
    ├── public/
    ├── src/
    │   ├── assets/
    │   ├── App.css
    │   ├── App.tsx
    │   ├── index.css
    │   └── main.tsx
    ├── index.html
    ├── package.json
    └── vite.config.ts
```

## Próximos passos

- Integrar autenticação real
- Persistir o carrinho entre sessões
- Criar fluxo de checkout e seleção da loja
- Integrar estoque, pedidos e pagamentos a um back-end
- Substituir ilustrações provisórias pelos assets finais da marca
- Adicionar testes automatizados

## Status

Em desenvolvimento. As telas de Home, Cardápio e Carrinho estão disponíveis na branch `dev`.
