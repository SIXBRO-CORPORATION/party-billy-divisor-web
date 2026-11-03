import { useCallback, useEffect, useRef, useState } from 'react';
import { clearDraft, emptyDraft, loadDraft, saveDraft } from '../utils/draft-storage.ts';
import { getNextId } from '../utils/utils.ts';
import type { BillDraft } from '../types/draft.ts';

export function useBillDraft() {
    const [draft, setDraft] = useState<BillDraft>(loadDraft);
    const isFirstRender = useRef(true);

    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }

        saveDraft(draft);
    }, [draft]);

    const setTitle = useCallback((title: string) => {
        setDraft((current) => ({ ...current, title }));
    }, []);

    const setPlace = useCallback((place: string) => {
        setDraft((current) => ({ ...current, place }));
    }, []);

    const setDate = useCallback((date: string) => {
        setDraft((current) => ({ ...current, date }));
    }, []);

    const setPayerId = useCallback((payerId: number | null) => {
        setDraft((current) => ({ ...current, payerId }));
    }, []);

    const addPerson = useCallback((name: string) => {
        const trimmed = name.trim();

        if (!trimmed) {
            return;
        }

        setDraft((current) => {
            const alreadyExists = current.persons.some(
                (person) => person.name.toLowerCase() === trimmed.toLowerCase()
            );

            if (alreadyExists) {
                return current;
            }

            return {
                ...current,
                persons: [...current.persons, { id: getNextId(current.persons), name: trimmed }],
            };
        });
    }, []);

    const removePerson = useCallback((personId: number) => {
        setDraft((current) => ({
            ...current,
            persons: current.persons.filter((person) => person.id !== personId),
            payerId: current.payerId === personId ? null : current.payerId,
            relations: current.relations.filter((relation) => relation.personId !== personId),
        }));
    }, []);

    const addProduct = useCallback(
        (name: string, unitPrice: number, quantity: number) => {
            setDraft((current) => ({
                ...current,
                products: [
                    ...current.products,
                    { id: getNextId(current.products), name: name.trim(), unitPrice, quantity },
                ],
            }));
        },
        []
    );

    const addProducts = useCallback(
        (items: { name: string; unitPrice: number; quantity: number }[]) => {
            if (items.length === 0) {
                return;
            }

            setDraft((current) => {
                let nextId = getNextId(current.products);

                const newProducts = items.map((item) => ({
                    id: nextId++,
                    name: item.name,
                    unitPrice: item.unitPrice,
                    quantity: item.quantity,
                }));

                return { ...current, products: [...current.products, ...newProducts] };
            });
        },
        []
    );

    const updateProduct = useCallback(
        (productId: number, changes: { name: string; unitPrice: number; quantity: number }) => {
            setDraft((current) => ({
                ...current,
                products: current.products.map((product) =>
                    product.id === productId
                        ? { ...product, ...changes, name: changes.name.trim() }
                        : product
                ),
            }));
        },
        []
    );

    const removeProduct = useCallback((productId: number) => {
        setDraft((current) => ({
            ...current,
            products: current.products.filter((product) => product.id !== productId),
            relations: current.relations.filter((relation) => relation.productId !== productId),
        }));
    }, []);

    const setProductParticipants = useCallback((productId: number, personIds: number[]) => {
        setDraft((current) => ({
            ...current,
            relations: [
                ...current.relations.filter((relation) => relation.productId !== productId),
                ...personIds.map((personId) => ({ personId, productId })),
            ],
        }));
    }, []);

    const reset = useCallback(() => {
        clearDraft();
        setDraft({ ...emptyDraft });
    }, []);

    return {
        draft,
        setTitle,
        setPlace,
        setDate,
        setPayerId,
        addPerson,
        removePerson,
        addProduct,
        addProducts,
        updateProduct,
        removeProduct,
        setProductParticipants,
        reset,
    };
}
