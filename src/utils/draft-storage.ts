import type { BillDraft } from '../types/draft.ts';

const DRAFT_KEY = 'billy:draft';

export const emptyDraft: BillDraft = {
    title: '',
    place: '',
    date: '',
    payerId: null,
    persons: [],
    products: [],
    relations: [],
};

export function loadDraft(): BillDraft {
    try {
        const raw = localStorage.getItem(DRAFT_KEY);

        if (!raw) {
            return { ...emptyDraft };
        }

        const parsed = JSON.parse(raw) as Partial<BillDraft>;

        return {
            title: parsed.title ?? '',
            place: parsed.place ?? '',
            date: parsed.date ?? '',
            payerId: parsed.payerId ?? null,
            persons: parsed.persons ?? [],
            products: parsed.products ?? [],
            relations: parsed.relations ?? [],
        };
    } catch {
        return { ...emptyDraft };
    }
}

export function saveDraft(draft: BillDraft): void {
    try {
        localStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
    } catch {
        // localStorage cheio ou indisponível: o rascunho segue apenas em memória.
    }
}

export function clearDraft(): void {
    try {
        localStorage.removeItem(DRAFT_KEY);
    } catch {
        // ignora
    }
}
