# Telas do app de divisão de contas (nome provisório: "racha")

27 imagens PNG + tokens para implementar em **Next.js (web)** e **React Native (mobile)**.

## O que tem aqui

| Pasta/arquivo | Conteúdo |
|---|---|
| `png/m01…m12` | 12 telas mobile, 390×844 (PNG em 2x: 780×1688) |
| `png/w01…w12` | 12 páginas web, 1440 de largura (PNG em 2x: 2880) |
| `png/g01…g03` | Guia de estilo: cores e contraste, tipografia e layout, componentes |
| `png/00-visao-geral-mobile.png` | As 12 telas mobile numa imagem só |
| `tokens.ts` | Tokens compartilhados web + mobile (cores, tipografia, raios, sombras, `brl()`) |
| `tokens.css` | Os mesmos tokens como variáveis CSS |
| `html/` | Fonte de cada tela em HTML/CSS. Use para medir distâncias, não como código de produção |

## Mapa de telas (rota sugerida)

| # | Tela | Web (Next.js) | Mobile |
|---|---|---|---|
| 01 | Login e cadastro | `/entrar` | `Login` |
| 02 | Início (minhas contas) | `/contas` | `Contas` (aba) |
| 03 | Nova conta | `/contas/nova` | `NovaConta` (passo 1/5) |
| 04 | Escanear nota | `/contas/nova/nota` | `EscanearNota` (câmera) |
| 05 | Conferir itens | `/contas/[id]/itens` | `ConferirItens` (passo 2/5) |
| 06 | Pessoas | `/contas/[id]/pessoas` | `Pessoas` (passo 3/5) |
| 07 | Quem consumiu o quê | `/contas/[id]/consumo` | `Consumo` (passo 4/5) |
| 08 | Resumo da divisão | `/contas/[id]/resumo` | `Resumo` (passo 5/5) |
| 09 | Compartilhar no WhatsApp | `/contas/[id]/compartilhar` | `Compartilhar` (bottom sheet) |
| 10 | Acompanhar pagamentos | `/contas/[id]/pagamentos` | `Pagamentos` |
| 11 | Página pública de pagamento | `/p/[slug]` (sem login) | abre no navegador; a tela mobile serve de referência para o web mobile |
| 12 | Perfil e recebimento | `/perfil` | `Perfil` (aba) |

## Como aplicar os tokens

**Web:** importe `tokens.css` no layout raiz e use as variáveis (`var(--orange)`, `var(--sh)`). Para Tailwind, mapeie `colors` de `tokens.ts` em `theme.extend.colors`.

**React Native:** importe de `tokens.ts`. Sombras: use `shadows.md.native` (no Android vira `elevation`). Letter-spacing já está convertido para px.

**Fontes:** Inter (500–800) para o texto e **Inter Display** (800/900) para títulos e valores. Se não quiser carregar duas famílias, use só Inter 800/900 nos títulos; a diferença é sutil.

**Valores em reais:** use sempre `brl(valor)` e números tabulares (`.tn` no CSS, `fontVariant: ['tabular-nums']` no RN) para as colunas alinharem.

## Regras que importam

1. **Texto sobre laranja ou verde vivo é `ink`**, nunca branco (branco dá 2,9:1 e 2,6:1). Branco só sobre `greenDeep` (#0B7A4B, 5,4:1). A tabela de contraste está em `g01`.
2. **Verde profundo = dinheiro** (Pagar, Cobrar, Enviar no WhatsApp, "Pago"). **Laranja = avançar no fluxo** e "pendente".
3. **Estado nunca só por cor:** "Pago" tem check, "Pendente" tem relógio, pessoa marcada tem check no avatar.
4. Cinza de texto é `muted` (#6F645B). `muted2` (#8C8076) é só para ícones e bordas.
5. Barra de status (9:41), indicador de home e moldura do celular **não fazem parte do app**, estão nas imagens só para dar escala.

## Premissas que eu assumi (confirme antes de implementar)

- **Nome "racha" e domínio `racha.app`** são provisórios (vieram do vídeo). Troque o wordmark quando o nome final sair.
- **Pix e cartão** como métodos de pagamento na página pública. Mostre só os que o seu app realmente oferece.
- **Login com Google e Apple** e **toggle "Incluir 10% de serviço"** são sugestões minhas, não estavam no fluxo que você descreveu.
- **Dados de exemplo:** conta "Rolê de sexta" (R$ 266,00, 4 pessoas), telefones mascarados e e-mail `ana@exemplo.com` são fictícios. O QR Code da página pública é ilustrativo, não é um código Pix válido.
- A tela 09 mostra "No grupo / Um a um" como opções de envio; ajuste conforme o que o WhatsApp permite no seu fluxo.
- Estados que **não** foram desenhados: lista vazia, carregando, erro de rede e leitura de nota que falhou (só o aviso em `g03`). Siga os componentes do guia.

## Ordem de implementação sugerida

1. Tokens + componentes de `g03` (botão, campo, pílula, avatar, card, abas).
2. Fluxo principal: 03 → 04 → 05 → 06 → 07 → 08.
3. Envio e cobrança: 09 → 10 e a página pública 11 (é a que seu cliente final vê).
4. Login (01), início (02) e perfil (12).
