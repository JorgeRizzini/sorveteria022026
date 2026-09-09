# Documentação de desenvolvimento — ArcadeCream

## 1. Visão geral

ArcadeCream é uma aplicação web front-end para uma sorveteria artesanal do litoral paulista. A interface foi construída em React e TypeScript a partir de referências visuais e reúne três fluxos principais:

1. apresentação da marca e dos produtos na Home;
2. descoberta e filtragem de sabores no Cardápio;
3. revisão dos itens selecionados no Carrinho.

O projeto é uma *single-page application* (SPA). As mudanças de página acontecem no navegador sem recarregar o documento inteiro.

### Escopo atual

- Interface responsiva para desktop, tablet e celular;
- catálogo local com 12 sabores;
- busca e filtros executados no navegador;
- carrinho mantido no estado do React;
- modal visual de login;
- navegação entre `/`, `/cardapio` e `/carrinho`.

### Fora do escopo atual

- API ou banco de dados;
- autenticação real;
- criação e acompanhamento de pedidos;
- integração com pagamentos;
- cálculo de entrega ou escolha de unidade;
- persistência do carrinho após atualizar ou fechar a página;
- painel administrativo.

## 2. Tecnologias e versões

| Tecnologia | Função |
| --- | --- |
| React 19 | Construção da interface e gerenciamento de estado |
| React DOM 19 | Renderização da aplicação no navegador |
| TypeScript 6 | Tipagem estática e validação durante o build |
| Vite 8 | Servidor de desenvolvimento e empacotamento |
| CSS | Layout, identidade visual e responsividade |
| ESLint 10 | Análise estática e padronização do código |

As versões exatas resolvidas estão registradas em `web/package-lock.json`.

## 3. Organização do repositório

```text
sorveteria022026/
├── docs/
│   └── DESENVOLVIMENTO.md    # Esta documentação técnica
├── web/                      # Aplicação front-end
│   ├── public/               # Arquivos servidos sem transformação
│   │   ├── favicon.svg
│   │   └── icons.svg
│   ├── src/
│   │   ├── assets/           # Imagens importáveis pelo Vite
│   │   ├── App.css           # Estilos das páginas e componentes
│   │   ├── App.tsx           # Dados, componentes, rotas e estado global
│   │   ├── index.css         # Reset e estilos globais
│   │   └── main.tsx          # Ponto de entrada do React
│   ├── eslint.config.js      # Configuração do ESLint
│   ├── index.html            # Documento HTML base
│   ├── package.json          # Dependências e scripts
│   ├── package-lock.json     # Versões reproduzíveis das dependências
│   ├── tsconfig.app.json     # TypeScript da aplicação
│   ├── tsconfig.json         # Configuração TypeScript agregadora
│   ├── tsconfig.node.json    # TypeScript das ferramentas Node/Vite
│   └── vite.config.ts        # Configuração do Vite
└── README.md                 # Apresentação pública do repositório
```

### Arquivos gerados localmente

As pastas abaixo não representam código-fonte e não devem ser editadas manualmente:

- `web/node_modules/`: dependências instaladas;
- `web/dist/`: aplicação compilada para produção;
- arquivos `*.tsbuildinfo`: cache incremental do TypeScript.

## 4. Arquitetura da aplicação

### Inicialização

`web/src/main.tsx` procura o elemento `#root` de `web/index.html` e renderiza o componente `App` dentro de `StrictMode`.

```text
index.html
    └── main.tsx
          └── <App />
                ├── cabeçalho compartilhado
                ├── página selecionada
                ├── modal de login
                └── rodapé compartilhado
```

### Componente principal

`App.tsx` concentra atualmente:

- tipos dos produtos e categorias;
- lista local de sabores;
- componentes compartilhados;
- estado do carrinho;
- estado do modal de login;
- identificação da página atual;
- navegação com a History API.

Essa organização é adequada para o tamanho atual. Caso o projeto cresça, consulte a seção “Evolução recomendada”.

### Componentes atuais

| Componente | Responsabilidade |
| --- | --- |
| `Brand` | Renderizar a marca e o atalho para o início |
| `ProductCard` | Exibir um sabor e permitir sua adição ao carrinho |
| `MenuPage` | Renderizar pesquisa, filtros e catálogo completo |
| `CartPage` | Renderizar os estados vazio e preenchido do carrinho |
| `App` | Coordenar navegação, estado compartilhado e estrutura geral |

## 5. Modelo de dados

Os produtos usam o tipo `Flavor`:

```ts
type Flavor = {
  name: string
  subtitle: string
  description: string
  price: number
  emoji: string
  family: 'gold' | 'green' | 'lilac'
  badge: string
  category: 'Clássicos' | 'Tropicais' | 'Especiais' | 'Veganos'
  new?: boolean
}
```

### Significado dos campos

- `name`: nome comercial do sabor;
- `subtitle`: composição ou tipo do produto;
- `description`: texto apresentado no cartão;
- `price`: preço numérico em reais;
- `emoji`: ilustração provisória;
- `family`: família visual que determina a paleta do cartão;
- `badge`: selo exibido sobre os detalhes;
- `category`: grupo utilizado pelos filtros;
- `new`: ativa o selo “Novo”.

Os dados permanecem em um array local chamado `flavors`. Não existe carregamento assíncrono ou integração com uma API nesta etapa.

## 6. Páginas e navegação

| Rota | Página | Estado ativo no cabeçalho |
| --- | --- | --- |
| `/` | Home | Início |
| `/cardapio` | Cardápio | Cardápio |
| `/carrinho` | Carrinho | Botão Carrinho |

A navegação usa `window.history.pushState`. O evento `popstate` mantém a interface sincronizada com os botões voltar e avançar do navegador.

### Observação para produção

Como o roteamento é feito no cliente, o servidor de hospedagem precisa redirecionar rotas desconhecidas para `index.html`. Sem esse fallback, abrir `/cardapio` ou `/carrinho` diretamente pode resultar em erro 404.

Exemplos de configuração:

- Vercel: criar um *rewrite* de `/(.*)` para `/index.html`;
- Netlify: adicionar `/* /index.html 200` ao arquivo `_redirects`;
- Nginx: usar `try_files $uri $uri/ /index.html`.

## 7. Funcionamento das telas

### Home

A Home apresenta:

- cabeçalho fixo;
- seção principal com proposta da marca;
- mosaico de sabores;
- diferenciais de produção;
- destaques da temporada;
- famílias de sabores;
- chamada para montar o pedido;
- rodapé institucional.

Os cartões em destaque reutilizam `ProductCard` e são escolhidos pelo nome a partir do catálogo principal.

### Cardápio

O Cardápio contém todos os sabores cadastrados.

A busca:

- é controlada pelo estado `search`;
- ignora diferenças entre letras maiúsculas e minúsculas;
- filtra os itens pelo nome enquanto o usuário digita.

Os filtros:

- são controlados pelo estado `category`;
- permitem exibir todos os sabores ou uma categoria;
- funcionam em conjunto com a busca;
- atualizam a contagem de resultados;
- exibem uma mensagem quando não há correspondências.

### Carrinho

O carrinho é um array de produtos armazenado no componente `App`.

- “Adicionar” inclui uma nova ocorrência do produto;
- o contador do cabeçalho usa o tamanho do array;
- o total é calculado somando o campo `price`;
- “Remover” exclui a ocorrência selecionada;
- sem itens, a página exibe o estado vazio da referência visual.

O carrinho não usa `localStorage`. Atualizar a página limpa os itens.

### Login

O botão “Entrar” abre um modal com campos de e-mail e senha. Atualmente os campos não enviam dados e não autenticam o usuário.

## 8. Estilização e responsividade

### Estilos globais

`index.css` contém:

- importação das fontes DM Sans e DM Serif Display;
- `box-sizing: border-box`;
- comportamento de rolagem suave;
- reset das margens do documento;
- estilos básicos de fontes, links, botões e inputs.

As fontes são carregadas pelo Google Fonts. Em um ambiente sem acesso à internet, o navegador utiliza a fonte de fallback disponível.

### Estilos da aplicação

`App.css` reúne:

- tokens de cor em variáveis CSS;
- layout do cabeçalho e rodapé;
- seções da Home;
- cartões de produtos;
- filtros e busca;
- estados do Carrinho;
- modal;
- regras responsivas.

Principais cores:

| Variável | Uso |
| --- | --- |
| `--yellow` | Ações, família dourada e destaques |
| `--green` | Família verde e ingredientes naturais |
| `--lilac` | Família lilás e seção final |
| `--black` | Botões principais e textos de alto contraste |

### Breakpoints

- até `1000px`: catálogo passa de quatro para três colunas;
- até `850px`: Home reorganiza conteúdos e cartões;
- até `750px`: catálogo passa para duas colunas;
- até `600px`: navegação e seções recebem layout móvel;
- até `520px`: catálogo passa para uma coluna e filtros ganham rolagem horizontal.

## 9. Ambiente de desenvolvimento

### Requisitos

- Node.js 20 ou superior;
- npm compatível com o Node.js instalado;
- Git.

### Preparação

```bash
git clone https://github.com/JorgeRizzini/sorveteria022026.git
cd sorveteria022026
git switch dev
cd web
npm install
```

No PowerShell com execução de scripts bloqueada, use `npm.cmd` no lugar de `npm`.

### Desenvolvimento local

```bash
npm run dev
```

O endereço padrão é `http://localhost:5173`, mas o terminal sempre deve ser considerado a fonte correta da porta utilizada.

### Validações obrigatórias

Antes de criar um commit:

```bash
npm run lint
npm run build
```

O build executa primeiro `tsc -b` e depois gera os arquivos de produção com o Vite.

### Visualização da versão de produção

```bash
npm run build
npm run preview
```

## 10. Estratégia de Git

### Branches

- `main`: versão estável e pronta para integração/publicação;
- `dev`: integração das funcionalidades em desenvolvimento;
- `QA`: branch disponível para validações de qualidade;
- branches de funcionalidade: recomendadas para trabalhos futuros.

Fluxo recomendado:

```text
feature/nome-da-funcionalidade
              ↓
             dev
              ↓
              QA
              ↓
             main
```

### Convenção de commits

O histórico atual segue mensagens próximas ao padrão Conventional Commits:

- `feat:` nova funcionalidade;
- `fix:` correção de comportamento;
- `docs:` documentação;
- `style:` alteração visual sem mudança de regra de negócio;
- `refactor:` reorganização sem alterar o resultado;
- `test:` criação ou ajuste de testes;
- `chore:` manutenção de ferramentas e dependências.

Exemplos:

```text
feat: add checkout screen
fix: preserve cart when navigating
docs: document deployment process
```

## 11. Qualidade, segurança e acessibilidade

### Qualidade atual

- TypeScript com verificação de código não utilizado;
- ESLint com regras recomendadas para JavaScript, TypeScript e hooks;
- build de produção validado pelo Vite;
- componentes e dados compartilhados entre as páginas.

### Melhorias recomendadas

- testes unitários com Vitest;
- testes de componentes com Testing Library;
- testes de navegação com Playwright;
- formatação automática com Prettier;
- integração contínua para executar lint e build;
- auditoria com Lighthouse.

### Acessibilidade

Ao evoluir a interface:

- manter textos alternativos em imagens reais;
- garantir navegação completa por teclado;
- incluir foco visível em links, botões e campos;
- associar mensagens de erro aos inputs;
- usar títulos em ordem hierárquica;
- preservar contraste mínimo WCAG AA;
- implementar fechamento dos modais pela tecla `Escape`;
- impedir a rolagem do documento enquanto um modal estiver aberto.

### Segurança futura

Quando houver back-end:

- nunca armazenar senhas ou segredos no front-end;
- validar preços e totais no servidor;
- não confiar nos dados do carrinho enviados pelo navegador;
- usar cookies seguros ou tokens com armazenamento apropriado;
- validar e sanitizar todas as entradas;
- aplicar proteção contra abuso nos endpoints de autenticação e pedidos.

## 12. Evolução recomendada

Com a adição de novas telas, a estrutura sugerida é:

```text
src/
├── assets/
├── components/
│   ├── Brand/
│   ├── Header/
│   └── ProductCard/
├── data/
│   └── flavors.ts
├── hooks/
│   └── useCart.ts
├── pages/
│   ├── HomePage.tsx
│   ├── MenuPage.tsx
│   └── CartPage.tsx
├── styles/
│   ├── tokens.css
│   └── global.css
├── types/
│   └── flavor.ts
├── App.tsx
└── main.tsx
```

Outras evoluções importantes:

1. adotar React Router quando o número de rotas crescer;
2. extrair o carrinho para Context ou um gerenciador de estado;
3. persistir o carrinho em `localStorage` ou no back-end;
4. obter catálogo e preços por API;
5. substituir emojis por assets finais otimizados;
6. instalar as fontes localmente para evitar dependência externa;
7. criar estados de carregamento, erro e indisponibilidade;
8. implementar autenticação, checkout e confirmação do pedido.

## 13. Checklist para novas funcionalidades

- [ ] Criar a alteração a partir da branch `dev` atualizada
- [ ] Manter dados e tipos consistentes
- [ ] Reutilizar componentes existentes quando apropriado
- [ ] Verificar desktop, tablet e celular
- [ ] Testar navegação por teclado
- [ ] Executar `npm run lint`
- [ ] Executar `npm run build`
- [ ] Criar um commit pequeno e descritivo
- [ ] Enviar primeiro para `dev`
- [ ] Atualizar esta documentação quando a arquitetura mudar

## 14. Solução de problemas

### `npm.ps1 não pode ser carregado`

O PowerShell está bloqueando scripts. Execute:

```powershell
npm.cmd install
npm.cmd run dev
```

### `tsc não é reconhecido` ou `eslint não é reconhecido`

As dependências ainda não foram instaladas. Dentro de `web`, execute:

```bash
npm install
```

### Uma rota retorna 404 após publicar

Configure a hospedagem para encaminhar todas as rotas da SPA para `index.html`, conforme a seção de navegação.

### O carrinho foi apagado após atualizar

Esse é o comportamento atual. Os itens existem apenas no estado em memória do React.

### A fonte está diferente

Confirme o acesso ao Google Fonts ou instale os arquivos de fonte localmente no projeto.

---

Esta documentação descreve o estado do projeto na branch `dev` e deve acompanhar mudanças relevantes de arquitetura, dependências ou fluxo de desenvolvimento.
