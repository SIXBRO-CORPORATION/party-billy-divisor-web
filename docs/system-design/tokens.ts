/**
 * Tokens de design do app (extraídos do vídeo e ajustados para contraste).
 * Funciona igual no Next.js (web) e no React Native: só tipos e valores simples.
 * Nome da marca "racha" é provisório.
 */

export const colors = {
  // Marca
  orange: '#FF6A13', // preenchimento, CTA de fluxo. Texto sobre ele: ink.
  orangeLight: '#FF9A55', // manchas e gradientes
  orange600: '#E5530A', // só números grandes (>=24px, peso 800) sobre branco
  orangeText: '#B93C00', // texto pequeno sobre branco ou orangeTint
  orangeTint: '#FFE6D3', // fundo de pílula "Pendente"
  green: '#12B76A', // preenchimento vivo. Texto sobre ele: ink.
  greenLight: '#34D399', // scanner da câmera
  greenDeep: '#0B7A4B', // botões de dinheiro, texto verde. Texto sobre ele: branco.
  greenTint: '#D8F5E5', // pílula "Pago", banners de sucesso
  yellow: '#FFB224',
  yellowText: '#8A5A00',
  yellowTint: '#FFF1D0',
  red: '#D92D20',
  redText: '#B42318',
  redTint: '#FEE4E2',

  // Neutros
  ink: '#1B1511', // texto principal
  ink2: '#3A302A', // texto sobre gradiente laranja
  muted: '#6F645B', // texto secundário (5,8:1 no branco)
  muted2: '#8C8076', // só ícones e bordas, nunca texto
  line: '#EBE2D8',
  line2: '#E4D9CE', // borda de campo
  soft: '#F4EEE7', // botão suave, trilhos
  bg: '#FAF6F1', // fundo do app
  cream: '#FFF4E6', // fundo da página pública
  surface: '#FFFFFF', // cards
} as const;

/** Cor de cada pessoa da conta, na ordem. A inicial usa `text`. Recomeça a partir da 7ª pessoa. */
export const personColors = [
  { bg: '#FF6A13', text: '#1B1511' },
  { bg: '#12B76A', text: '#1B1511' },
  { bg: '#FFB224', text: '#1B1511' },
  { bg: '#0B7A4B', text: '#FFFFFF' },
  { bg: '#FF9A55', text: '#1B1511' },
  { bg: '#34D399', text: '#1B1511' },
] as const;

export const personColor = (index: number) => personColors[index % personColors.length];

export const gradients = {
  orangeCard: ['#FF8A3D', '#FF5A00'], // "A receber" / "Recebido"
  greenCard: ['#2BD58A', '#0B9F5D'], // vira verde quando a conta fecha (texto: ink)
} as const;

export const spacing = { 1: 4, 2: 8, 3: 12, 4: 16, 5: 20, 6: 24, 8: 32, 12: 48 } as const;

export const radii = {
  sm: 12, // campos pequenos, botão pequeno 14
  md: 16, // inputs
  lg: 18, // cards, botões
  xl: 24, // hero, bottom sheet
  pill: 999,
} as const;

export const fonts = {
  display: 'Inter Display', // títulos e valores (peso 800/900)
  body: 'Inter', // todo o resto (500-700)
} as const;

/** Escala tipográfica em px. `letterSpacing` já convertido de em para px. */
export const type = {
  display: { fontFamily: fonts.display, fontSize: 38, lineHeight: 40, fontWeight: '900', letterSpacing: -1.5 },
  displayWeb: { fontFamily: fonts.display, fontSize: 76, lineHeight: 78, fontWeight: '900', letterSpacing: -3 },
  h1: { fontFamily: fonts.display, fontSize: 27, lineHeight: 30, fontWeight: '800', letterSpacing: -0.95 },
  h1Web: { fontFamily: fonts.display, fontSize: 32, lineHeight: 35, fontWeight: '800', letterSpacing: -1.1 },
  h2: { fontFamily: fonts.display, fontSize: 20, lineHeight: 23, fontWeight: '800', letterSpacing: -0.6 },
  h3: { fontFamily: fonts.display, fontSize: 16, lineHeight: 19, fontWeight: '800', letterSpacing: -0.32 },
  body: { fontFamily: fonts.body, fontSize: 15, lineHeight: 20, fontWeight: '500' },
  small: { fontFamily: fonts.body, fontSize: 13, lineHeight: 17, fontWeight: '600' },
  caption: { fontFamily: fonts.body, fontSize: 12, lineHeight: 16, fontWeight: '700' },
  eyebrow: { fontFamily: fonts.body, fontSize: 12, lineHeight: 16, fontWeight: '800', letterSpacing: 0.96, textTransform: 'uppercase' },
} as const;

/** Dimensões recorrentes. */
export const sizes = {
  mobileWidth: 390,
  mobileMargin: 20,
  webWidth: 1440,
  webSidebar: 248,
  webMargin: 48,
  button: 52,
  buttonSmall: 40,
  input: 52,
  tabBar: 86,
  fab: 58,
  pill: 26,
  avatar: { xs: 24, sm: 36, md: 44, lg: 64 },
} as const;

/** Sombras sempre tingidas de marrom. `css` para web, `native` para React Native. */
export const shadows = {
  sm: {
    css: '0 2px 8px rgba(80,40,0,.08)',
    native: { shadowColor: '#502800', shadowOpacity: 0.08, shadowRadius: 8, shadowOffset: { width: 0, height: 2 }, elevation: 2 },
  },
  md: {
    css: '0 4px 14px rgba(80,40,0,.07)',
    native: { shadowColor: '#502800', shadowOpacity: 0.07, shadowRadius: 14, shadowOffset: { width: 0, height: 4 }, elevation: 3 },
  },
  lg: {
    css: '0 14px 36px rgba(80,40,0,.13)',
    native: { shadowColor: '#502800', shadowOpacity: 0.13, shadowRadius: 36, shadowOffset: { width: 0, height: 14 }, elevation: 8 },
  },
  glowOrange: {
    css: '0 12px 26px rgba(255,106,19,.32)',
    native: { shadowColor: '#FF6A13', shadowOpacity: 0.32, shadowRadius: 26, shadowOffset: { width: 0, height: 12 }, elevation: 8 },
  },
  glowGreen: {
    css: '0 12px 26px rgba(11,122,75,.28)',
    native: { shadowColor: '#0B7A4B', shadowOpacity: 0.28, shadowRadius: 26, shadowOffset: { width: 0, height: 12 }, elevation: 8 },
  },
} as const;

/** Texto que deve ser usado sobre cada fundo (regra de contraste). */
export const textOn = {
  orange: colors.ink,
  green: colors.ink,
  greenDeep: '#FFFFFF',
  orangeTint: colors.orangeText,
  greenTint: colors.greenDeep,
  yellowTint: colors.yellowText,
  redTint: colors.redText,
  surface: colors.ink,
  bg: colors.ink,
} as const;

/** R$ 1.234,50 */
export const brl = (value: number) =>
  value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }).replace(/ /g, ' ');
