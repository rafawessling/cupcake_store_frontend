# Cupcake Store — Frontend

Front-end da loja virtual Cupcake Store, feito com React, Vite e React Router, com CSS puro. Todo o site está em português (pt-BR).

> **Este projeto precisa da API para funcionar.** A API (Go) e o banco (PostgreSQL) ficam em outro repositório. Sem a API rodando em `http://localhost:8080`, o login, o catálogo e os pedidos não funcionam.

## Pré-requisitos
- Node.js 20 ou mais novo (o Node 16 não roda o Vite) e npm
- A API da Cupcake Store rodando em `http://localhost:8080`

## Como rodar
```bash
npm install
npm run dev      # http://localhost:5173
```

Para gerar a versão de produção (saída em `dist/`):
```bash
npm run build
```

## Conexão com a API
Em desenvolvimento, o Vite encaminha tudo que começa com `/api` para `http://localhost:8080` (veja `vite.config.js`). Não precisa configurar nada se a API estiver nessa porta.

Para usar outro endereço, defina `VITE_API_URL` antes de rodar ou de gerar o build:
```bash
VITE_API_URL=http://localhost:9000 npm run dev
```
Com `VITE_API_URL` o navegador chama a API direto, sem o proxy. Então a API precisa liberar a origem do front (CORS), por exemplo `http://localhost:5173`. A variável é lida na hora do build, então em produção é preciso refazer o `npm run build` ao mudá-la.

## Telas
| Rota | Tela |
|---|---|
| `/cadastro` | Cadastro |
| `/login` | Login |
| `/` | Catálogo (com busca por nome) |
| `/produto/:id` | Detalhe do produto |
| `/carrinho` | Carrinho |
| `/pedido/:id/sucesso` | Pedido confirmado |
| `/pedido/erro` | Erro ao finalizar o pedido |

Só o cadastro e o login são públicos. As outras rotas redirecionam para `/login` quando não há sessão, e depois de entrar o usuário sempre cai no catálogo.

## Estrutura de `src/`
```
api/         cliente da API (fetch, token, erros)
context/     Auth, Cart (carrinho) e Toast (avisos)
components/  cabeçalho, card de produto, botões, campos, modal etc.
pages/       uma página por tela
styles/      tokens.css (cores, espaçamentos) e CSS global, de componentes e de páginas
utils/       formatação de preço e validação de e-mail
```

## Observações
- O token JWT e os dados do usuário ficam no `localStorage`. Se a API responder 401, a sessão é limpa e o usuário volta ao login.
- O carrinho fica só na memória do navegador, então **recarregar a página esvazia o carrinho**.
- Os totais do carrinho são apenas informativos. O valor oficial do pedido vem da resposta da API.
- As imagens ficam em `public/img/`: os seis cupcakes (`morango.png`, `berries.png`, `red_velvet.png`, `baunilha.png`, `chocolate.png`, `limao.png`) e os logos. O caminho de cada produto vem do campo `imagem_url` da API. Se uma imagem não carregar, aparece um cupcake desenhado no lugar.

## Deploy (Vercel)
1. Importe o repositório na Vercel. O preset é Vite (build `npm run build`, saída `dist`); o `vercel.json` já cuida de recarregar rotas como `/carrinho` sem dar 404.
2. Em **Environment Variables**, crie `VITE_API_URL` com a URL pública da API, por exemplo `https://minha-api.exemplo.com` (com ou sem barra no final). Ela é lida no build, então mudar o valor exige um novo deploy.
3. Na API, libere a URL da Vercel em `CORS_ORIGIN` (por exemplo `https://cupcake-store.vercel.app`). Em produção não existe o proxy do Vite: o navegador chama a API direto.
