import type { Person } from './person.ts';
import type { Product } from './product.ts';
import type { PersonProduct } from './personProduct.ts';

export interface BillDraft {
    title: string;
    place: string;
    date: string;
    payerId: number | null;
    persons: Person[];
    products: Product[];
    relations: PersonProduct[];
}
