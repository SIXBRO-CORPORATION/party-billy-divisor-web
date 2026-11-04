import type { CSSProperties } from 'react';
import { useToast } from '../../hooks/useToast.ts';
import type { Person } from '../../types/person.ts';
import type { PersonProduct } from '../../types/personProduct.ts';
import type { Product } from '../../types/product.ts';
import { PERSON_COLORS } from '../../utils/person-colors.ts';
import {
    calculatePersonTotals,
    formatMoney,
    roundMoney,
    splitEvenly,
} from '../../utils/utils.ts';
import { Avatar } from '../ui/Avatar.tsx';
import { Button } from '../ui/Button.tsx';
import { Chip } from '../ui/Chip.tsx';
import { Pill } from '../ui/Pill.tsx';
import { ArrowRightIcon, ChevronLeftIcon, CheckIcon, ClockIcon } from '../ui/icons.tsx';
import { ItemTile } from './BillItemRow.tsx';

interface ConsumptionStepProps {
    persons: Person[];
    products: Product[];
    relations: PersonProduct[];
    onSetProductParticipants: (productId: number, personIds: number[]) => void;
    onSplitAll: () => void;
    onClear: () => void;
    onBack: () => void;
    onContinue: () => void;
}

function personColorIndex(personIndex: number): number {
    return personIndex + 1;
}

interface ConsumptionToggleProps {
    person: Person;
    product: Product;
    personIndex: number;
    checked: boolean;
    onToggle: () => void;
}

function ConsumptionToggle({ person, product, personIndex, checked, onToggle }: ConsumptionToggleProps) {
    const color = PERSON_COLORS[personColorIndex(personIndex) % PERSON_COLORS.length];

    return (
        <button
            type="button"
            className={checked ? 'consumption-toggle is-on' : 'consumption-toggle'}
            style={checked ? { background: color.bg, color: color.text } : undefined}
            aria-pressed={checked}
            aria-label={`${person.name} ${checked ? 'consumiu' : 'não consumiu'} ${product.name}`}
            title={person.name}
            onClick={onToggle}
        >
            {checked && <CheckIcon size={20} strokeWidth={3.4} />}
        </button>
    );
}

export default function ConsumptionStep({
    persons,
    products,
    relations,
    onSetProductParticipants,
    onSplitAll,
    onClear,
    onBack,
    onContinue,
}: ConsumptionStepProps) {
    const toast = useToast();

    const itemsTotal = roundMoney(
        products.reduce((sum, product) => sum + roundMoney(product.unitPrice * product.quantity), 0)
    );

    const personTotals = calculatePersonTotals({ persons, products, relations });

    const consumersByProduct = new Map<number, Set<number>>(
        products.map((product) => [
            product.id,
            new Set(
                relations
                    .filter((relation) => relation.productId === product.id)
                    .map((relation) => relation.personId)
            ),
        ])
    );

    const missingProducts = products.filter(
        (product) => !persons.some((person) => consumersByProduct.get(product.id)?.has(person.id))
    );

    const hasRelations = relations.length > 0;

    const tableStyle = { '--consumption-people': persons.length } as CSSProperties;

    function handleToggle(productId: number, personId: number) {
        const consumers = new Set(consumersByProduct.get(productId));

        if (consumers.has(personId)) {
            consumers.delete(personId);
        } else {
            consumers.add(personId);
        }

        onSetProductParticipants(
            productId,
            persons.filter((person) => consumers.has(person.id)).map((person) => person.id)
        );
    }

    function handleContinue() {
        if (persons.length === 0) {
            toast.error('Adicione pelo menos uma pessoa na mesa para continuar.');
            return;
        }

        if (missingProducts.length === 1) {
            toast.error(`Marque quem consumiu “${missingProducts[0].name}” para continuar.`);
            return;
        }

        if (missingProducts.length > 1) {
            toast.error(`Faltam ${missingProducts.length} itens sem ninguém marcado.`);
            return;
        }

        onContinue();
    }

    return (
        <>
            <section className="items-card consumption-card" aria-labelledby="consumption-title">
                <div className="items-card-head consumption-head">
                    <h2 id="consumption-title" className="newbill-h2">
                        Marque quem consumiu cada item
                    </h2>

                    <div className="consumption-head-actions">
                        {missingProducts.length > 0 && products.length > 0 && (
                            <span role="status">
                                <Pill tone="yellow" icon={<ClockIcon size={14} strokeWidth={2.6} />}>
                                    {missingProducts.length}{' '}
                                    {missingProducts.length === 1 ? 'item sem ninguém' : 'itens sem ninguém'}
                                </Pill>
                            </span>
                        )}

                        <Chip
                            onClick={onSplitAll}
                            disabled={persons.length === 0 || products.length === 0}
                        >
                            Dividir tudo igual
                        </Chip>

                        <Chip onClick={onClear} disabled={!hasRelations}>
                            Limpar
                        </Chip>
                    </div>
                </div>

                <div className="consumption-scroll">
                    <div
                        className="consumption-table"
                        style={tableStyle}
                        role="table"
                        aria-label="Quem consumiu cada item"
                    >
                        <div className="consumption-head-row" role="row">
                            <span role="columnheader">Item</span>
                            <span role="columnheader">Valor</span>

                            {persons.map((person, index) => (
                                <div
                                    key={person.id}
                                    className="consumption-person"
                                    role="columnheader"
                                >
                                    <Avatar
                                        label={person.name}
                                        index={personColorIndex(index)}
                                        size="sm"
                                    />
                                    <b>{person.name}</b>
                                </div>
                            ))}

                            <span className="consumption-cell-each" role="columnheader">
                                Cada um
                            </span>
                        </div>

                        {products.map((product, productIndex) => {
                            const total = roundMoney(product.unitPrice * product.quantity);
                            const consumers = consumersByProduct.get(product.id) ?? new Set<number>();
                            const count = persons.filter((person) => consumers.has(person.id)).length;
                            const shares = splitEvenly(total, count);
                            const baseShare = shares.length > 0 ? Math.min(...shares) : 0;
                            const hasRemainder = shares.some((share) => share !== baseShare);

                            return (
                                <div key={product.id} className="consumption-row" role="row">
                                    <div className="consumption-cell-item" role="cell">
                                        <ItemTile name={product.name} index={productIndex} />

                                        <div className="consumption-item-info">
                                            <span className="item-name">{product.name}</span>
                                            <span className="consumption-item-qty">
                                                {product.quantity} un.
                                            </span>
                                        </div>
                                    </div>

                                    <b className="consumption-cell-value tn" role="cell">
                                        R$ {formatMoney(total)}
                                    </b>

                                    {persons.map((person, personIndex) => (
                                        <div
                                            key={person.id}
                                            className="consumption-cell-toggle"
                                            role="cell"
                                        >
                                            <ConsumptionToggle
                                                person={person}
                                                product={product}
                                                personIndex={personIndex}
                                                checked={consumers.has(person.id)}
                                                onToggle={() => handleToggle(product.id, person.id)}
                                            />
                                        </div>
                                    ))}

                                    <div
                                        className="consumption-cell-each tn"
                                        role="cell"
                                        title={
                                            hasRemainder
                                                ? 'Os centavos que sobram ficam com quem aparece primeiro na tabela.'
                                                : undefined
                                        }
                                    >
                                        {count > 0 ? (
                                            <>
                                                <span className="consumption-each-count">
                                                    ÷ {count}
                                                </span>
                                                <b>
                                                    {hasRemainder ? '≈ ' : ''}R$ {formatMoney(baseShare)}
                                                </b>
                                            </>
                                        ) : (
                                            <span className="consumption-each-missing">
                                                Sem ninguém
                                            </span>
                                        )}
                                    </div>
                                </div>
                            );
                        })}

                        {products.length === 0 && (
                            <p className="items-empty">
                                Nenhum item na conta. Volte e adicione os itens para continuar.
                            </p>
                        )}

                        <div className="consumption-total-row" role="row">
                            <b className="consumption-total-label" role="cell">
                                Cada um paga
                            </b>

                            <b className="consumption-total-sum tn" role="cell">
                                R$ {formatMoney(itemsTotal)}
                            </b>

                            {persons.map((person) => (
                                <div
                                    key={person.id}
                                    className="consumption-person-total tn"
                                    role="cell"
                                >
                                    R$ {formatMoney(personTotals.get(person.id) ?? 0)}
                                </div>
                            ))}

                            <span role="cell" />
                        </div>
                    </div>
                </div>
            </section>

            <div className="newbill-footer">
                <Button
                    type="button"
                    variant="outline"
                    size="lg"
                    className="newbill-cancel"
                    onClick={onBack}
                >
                    <ChevronLeftIcon size={18} strokeWidth={2.6} />
                    Voltar
                </Button>

                <Button type="button" size="lg" className="newbill-continue" onClick={handleContinue}>
                    Ver resumo
                    <ArrowRightIcon size={20} strokeWidth={2.6} />
                </Button>
            </div>
        </>
    );
}
