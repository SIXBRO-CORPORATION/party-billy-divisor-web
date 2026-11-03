const EMOJI_RULES: { pattern: RegExp; emoji: string }[] = [
    { pattern: /pizza/, emoji: '🍕' },
    { pattern: /chopp?|cerveja|brahma|skol|heineken|long ?neck/, emoji: '🍺' },
    { pattern: /caipirinha|drink|drinque|gin|vodka|mojito|cocktail|coquetel/, emoji: '🍹' },
    { pattern: /vinho|espumante/, emoji: '🍷' },
    { pattern: /batata|fritas/, emoji: '🍟' },
    { pattern: /hamb[uú]rguer|burger|x-/, emoji: '🍔' },
    { pattern: /sobremesa|bolo|torta|pudim|sorvete|doce|brownie/, emoji: '🍰' },
    { pattern: /refri|coca|guaran[aá]|suco|[aá]gua|soda|tônica|tonica/, emoji: '🥤' },
    { pattern: /caf[eé]|cappuccino|expresso/, emoji: '☕' },
    { pattern: /salada/, emoji: '🥗' },
    { pattern: /churrasco|carne|picanha|espeto|costela|fil[eé]/, emoji: '🥩' },
    { pattern: /peixe|camar[aã]o|sushi|salm[aã]o|isca/, emoji: '🍤' },
    { pattern: /por[cç][aã]o|petisco|past[eé]l|coxinha|salgad/, emoji: '🍢' },
];

const FALLBACK_EMOJI = '🍽️';

export function getProductEmoji(name: string): string {
    const normalized = name.toLowerCase();

    return EMOJI_RULES.find((rule) => rule.pattern.test(normalized))?.emoji ?? FALLBACK_EMOJI;
}
