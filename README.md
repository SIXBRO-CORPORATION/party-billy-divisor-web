# Billy · Divisor de Contas

Frontend do Billy: cadastre pessoas e itens, veja quanto cada um deve e salve a
conta na API para acompanhar quem já pagou.

- Backend: https://github.com/SIXBRO-CORPORATION/party-billy-divisor-backend
- API em produção: https://billy-divisor.onrender.com (docs em `/docs`)

## Stack

React 19 + TypeScript + Vite, React Router, cookies para o token (`js-cookie`)
e um `http-client` próprio em cima do `fetch`.

## Rodando localmente

```bash
npm install
cp .env.example .env   # ajuste a URL da API se necessário
npm run dev
```

A API espera o frontend em `http://localhost:5173` (origem liberada no CORS).

### Variáveis de ambiente

| Variável       | Descrição                                        |
| -------------- | ------------------------------------------------ |
| `VITE_API_URL` | URL base da API, **incluindo** o prefixo `/api`. |

Sem `.env`, o app usa `https://billy-divisor.onrender.com/api`.

## Estrutura

```
src/
├── components/
│   ├── app/        # shell da aplicação e guards de rota
│   ├── bill/       # formulários e cards da conta
│   └── ui/         # Button, Input, Loading, Modal, Toast
├── hooks/          # useAuth, useToast, useBills, useBillDraft
├── pages/          # Login, Register, Bills, NewBill, BillDetail
├── providers/      # AuthProvider, ToastProvider e seus contexts
├── services/       # auth.service, bill.service (chamadas à API)
├── types/          # contratos da API + tipos do rascunho local
└── utils/          # http-client, token-manager, helpers, draft-storage
```

### Camadas

- `utils/http-client.ts` — wrapper do `fetch`: injeta `Authorization: Bearer`,
  desembrulha o envelope `ApiResponse`, dispara toast de erro/sucesso e, em
  `401`, limpa o token e devolve a sessão para o login.
- `utils/token-manager.ts` — guarda o `access_token` em cookie, respeitando o
  `expires_at` devolvido pelo login.
- `services/*.service.ts` — uma função por endpoint, devolvendo já o `data`.
- `hooks/*` — estado de tela (carregando, erro, refetch) em cima dos services.

## Fluxo

1. **Login/registro** (`/login`, `/register`) — `POST /auth/register` seguido de
   `POST /auth/login`; o token vai para o cookie e `GET /auth/me` valida a
   sessão nos próximos acessos.
2. **Nova conta** (`/bills/new`) — começa pelo passo **Detalhes** (nome, local, data,
   quem pagou e como adicionar os itens: ler a nota ou digitar), conforme
   `docs/system-design/html/w03-nova-conta.html`. O passo **Itens** vem em seguida:
   ao escolher "Ler a nota fiscal" a foto passa por **Escanear nota** (`w04-escanear`) e
   cai em **Confira os itens** (`w05-conferir-itens`), onde cada item pode ser editado,
   removido ou adicionado (também é o caminho da entrada manual). Depois vêm pessoas e
   vínculos. O rascunho fica no `localStorage` e mostra uma prévia da divisão
   calculada com a mesma regra do backend (sobra de centavos para o primeiro
   participante). Ao salvar, vira um `POST /bills` com `participant_names` por
   item. Local, data e quem pagou ainda não existem na API: ficam só no rascunho.
3. **Minhas contas** (`/`) — `GET /bills`, com progresso de pagamento por conta.
4. **Detalhe** (`/bills/:billId`) — `GET /bills/{id}` e
   `PATCH /bills/{id}/participants/{id}/payment` para marcar quem já pagou.

## Scripts

| Script          | O que faz                        |
| --------------- | -------------------------------- |
| `npm run dev`   | Servidor de desenvolvimento      |
| `npm run build` | Typecheck (`tsc -b`) + build     |
| `npm run lint`  | ESLint                           |

> Deploy em host estático: o app é uma SPA, então todas as rotas precisam cair
> em `index.html` (já existe um `public/_redirects` para Render/Netlify).
