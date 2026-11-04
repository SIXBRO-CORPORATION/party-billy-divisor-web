import { useEffect, useState } from 'react';
import { billService } from '../services/bill.service.ts';
import type { BillSummary } from '../types/bill.ts';

export interface CollaboratorSuggestion {
    name: string;
    billTitle: string;
}

const MAX_BILLS_TO_SCAN = 5;
const MAX_SUGGESTIONS = 4;


export function useRecentCollaborators(bills: BillSummary[], excludeNames: string[]) {
    const [all, setAll] = useState<CollaboratorSuggestion[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        let cancelled = false;
        setIsLoading(true);

        const recentBills = bills.slice(0, MAX_BILLS_TO_SCAN);

        Promise.allSettled(
            recentBills.map((bill) => billService.getById(bill.id, { skipToast: true }))
        )
            .then((results) => {
                if (cancelled) {
                    return;
                }

                const seen = new Set<string>();
                const found: CollaboratorSuggestion[] = [];

                for (const result of results) {
                    if (result.status !== 'fulfilled') {
                        continue;
                    }

                    for (const participant of result.value.participants) {
                        const key = participant.name.trim().toLowerCase();

                        if (!key || seen.has(key)) {
                            continue;
                        }

                        seen.add(key);
                        found.push({ name: participant.name.trim(), billTitle: result.value.title });
                    }
                }

                setAll(found);
            })
            .finally(() => {
                if (!cancelled) {
                    setIsLoading(false);
                }
            });

        return () => {
            cancelled = true;
        };
    }, [bills]);

    const excluded = new Set(excludeNames.map((name) => name.trim().toLowerCase()));

    const suggestions = all
        .filter((suggestion) => !excluded.has(suggestion.name.toLowerCase()))
        .slice(0, MAX_SUGGESTIONS);

    return { suggestions, isLoading };
}
