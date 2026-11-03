import type { BillDraft } from "../types/draft.ts";
import type { PersonSplit, PersonSplitItem, SplitResult } from "../types/split.ts";
import type { CreateBillRequest } from "../types/bill.ts";
import type { BillPayer } from "../components/bill/BillPreviewCard.tsx";

export function parseMoneyInput(value: string): number {
    const normalized = value.replace(",", ".").replace(/[^0-9.]/g, "");
    const parsed = Number(normalized);

    return isNaN(parsed) ? 0 : parsed;
}

export function formatMoney(value: number): string {
    return value.toFixed(2).replace(".", ",");
}

export function formatAmount(value: string | number): string {
    const parsed = typeof value === "number" ? value : Number(value);

    return formatMoney(isNaN(parsed) ? 0 : parsed);
}

export function formatDate(value?: string | null): string {
    if (!value) {
        return "";
    }

    const parsed = new Date(value);

    if (isNaN(parsed.getTime())) {
        return "";
    }

    return parsed.toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    });
}

export function formatShortDate(value?: string | null): string {
    if (!value) {
        return "";
    }

    const parsed = new Date(value);

    if (isNaN(parsed.getTime())) {
        return "";
    }

    return parsed.toLocaleDateString("pt-BR", {
        weekday: "short",
        day: "numeric",
        month: "short",
    });
}

const WEEKDAYS = ["dom", "seg", "ter", "qua", "qui", "sex", "sáb"];
const MONTHS = ["jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago", "set", "out", "nov", "dez"];

export function todayISODate(): string {
    const now = new Date();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");

    return `${now.getFullYear()}-${month}-${day}`;
}

export function formatDayLabel(isoDate: string): string {
    const [year, month, day] = isoDate.split("-").map(Number);
    const parsed = new Date(year, month - 1, day);

    if (!year || !month || !day || parsed.getMonth() !== month - 1) {
        return "";
    }

    return `${WEEKDAYS[parsed.getDay()]}, ${day} ${MONTHS[month - 1]}`;
}

export function getBillPayer(draft: BillDraft, userName: string): BillPayer {
    const personIndex = draft.persons.findIndex((person) => person.id === draft.payerId);

    if (personIndex === -1) {
        return { name: "Você", avatarLabel: userName, avatarIndex: 0 };
    }

    const name = draft.persons[personIndex].name;

    return { name, avatarLabel: name, avatarIndex: personIndex + 1 };
}

export function capitalize(value: string): string {
    return value.length > 0 ? value.charAt(0).toUpperCase() + value.slice(1) : value;
}

export function roundMoney(value: number): number {
    return Math.round(value * 100) / 100;
}

export function getNextId(items: { id: number }[]): number {
    return items.reduce((maxId, item) => Math.max(maxId, item.id), 0) + 1;
}

export function splitEvenly(total: number, participantsCount: number): number[] {
    if (participantsCount <= 0) {
        return [];
    }

    const totalInCents = Math.round(total * 100);
    const baseInCents = Math.floor(totalInCents / participantsCount);

    const splits = new Array(participantsCount).fill(baseInCents);

    splits[0] += totalInCents - baseInCents * participantsCount;

    return splits.map((cents) => cents / 100);
}

export function calculateBillSplit(draft: BillDraft): SplitResult {
    const missingProducts = draft.products
        .filter((product) =>
            !draft.relations.some((relation) => relation.productId === product.id)
        )
        .map((product) => product.name);

    if (missingProducts.length > 0) {
        return {
            success: false,
            missingProducts,
        };
    }

    const shareByPerson = new Map<number, PersonSplitItem[]>();

    for (const product of draft.products) {
        const participantIds = draft.relations
            .filter((relation) => relation.productId === product.id)
            .map((relation) => relation.personId);

        const productTotal = roundMoney(product.unitPrice * product.quantity);
        const shares = splitEvenly(productTotal, participantIds.length);

        participantIds.forEach((personId, index) => {
            const items = shareByPerson.get(personId) ?? [];

            items.push({
                productId: product.id,
                productName: product.name,
                productTotal,
                quantity: product.quantity,
                participantsCount: participantIds.length,
                shareValue: shares[index],
            });

            shareByPerson.set(personId, items);
        });
    }

    const splits: PersonSplit[] = draft.persons.map((person) => {
        const items = shareByPerson.get(person.id) ?? [];

        return {
            personId: person.id,
            personName: person.name,
            items,
            total: roundMoney(items.reduce((sum, item) => sum + item.shareValue, 0)),
        };
    });

    return {
        success: true,
        splits,
        totalBill: roundMoney(splits.reduce((sum, split) => sum + split.total, 0)),
    };
}

export function draftToCreateBillRequest(draft: BillDraft): CreateBillRequest {
    return {
        title: draft.title.trim(),
        products: draft.products.map((product) => ({
            name: product.name,
            quantity: product.quantity,
            unit_price: product.unitPrice,
            participant_names: draft.relations
                .filter((relation) => relation.productId === product.id)
                .map((relation) =>
                    draft.persons.find((person) => person.id === relation.personId)?.name ?? ""
                )
                .filter((name) => name.length > 0),
        })),
    };
}
