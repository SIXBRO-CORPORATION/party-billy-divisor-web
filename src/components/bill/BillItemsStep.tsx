import { useState } from 'react';
import type { Product } from '../../types/product.ts';
import { useToast } from '../../hooks/useToast.ts';
import { formatMoney, roundMoney } from '../../utils/utils.ts';
import { Button } from '../ui/Button.tsx';
import { ArrowRightIcon, ChevronLeftIcon, PlusIcon, ReceiptScanIcon } from '../ui/icons.tsx';
import { BillItemEditRow, BillItemRow } from './BillItemRow.tsx';
import type { ItemValues } from './BillItemRow.tsx';

type EditingTarget = number | 'new' | null;

interface BillItemsStepProps {
    products: Product[];
    receiptUrl: string | null;
    onAddProduct: (name: string, unitPrice: number, quantity: number) => void;
    onUpdateProduct: (productId: number, values: ItemValues) => void;
    onRemoveProduct: (productId: number) => void;
    onBack: () => void;
    onContinue: () => void;
}

export default function BillItemsStep({
    products,
    receiptUrl,
    onAddProduct,
    onUpdateProduct,
    onRemoveProduct,
    onBack,
    onContinue,
}: BillItemsStepProps) {
    const toast = useToast();

    const [editing, setEditing] = useState<EditingTarget>(() => (products.length === 0 ? 'new' : null));

    const total = roundMoney(
        products.reduce((sum, product) => sum + roundMoney(product.unitPrice * product.quantity), 0)
    );

    const isEditing = editing !== null;

    function handleConfirm(values: ItemValues) {
        if (editing === 'new') {
            onAddProduct(values.name, values.unitPrice, values.quantity);
        } else if (editing !== null) {
            onUpdateProduct(editing, values);
        }

        setEditing(null);
    }

    function handleRemove(productId: number) {
        onRemoveProduct(productId);
    }

    function handleContinue() {
        if (isEditing) {
            toast.error('Confirme ou cancele o item que você está editando.');
            return;
        }

        if (products.length === 0) {
            toast.error('Adicione ao menos um item para continuar.');
            return;
        }

        onContinue();
    }

    return (
        <>
            <div className={receiptUrl ? 'items-grid has-receipt' : 'items-grid'}>
                <section className="items-card" aria-labelledby="items-card-title">
                    <div className="items-card-head">
                        <h2 id="items-card-title" className="newbill-h2">
                            Itens da nota
                        </h2>

                        <Button
                            type="button"
                            variant="secondary"
                            size="sm"
                            onClick={() => setEditing('new')}
                            disabled={isEditing}
                        >
                            <PlusIcon size={17} strokeWidth={2.8} />
                            Adicionar item
                        </Button>
                    </div>

                    <div role="table" aria-label="Itens da conta">
                        <div className="items-head" role="row">
                            <span role="columnheader">Item</span>
                            <span role="columnheader">Qtd.</span>
                            <span role="columnheader">Valor unit.</span>
                            <span role="columnheader">Total</span>
                            <span role="columnheader">
                                <span className="visually-hidden">Ações</span>
                            </span>
                        </div>

                        {products.map((product, index) =>
                            editing === product.id ? (
                                <BillItemEditRow
                                    key={product.id}
                                    product={product}
                                    index={index}
                                    onConfirm={handleConfirm}
                                    onCancel={() => setEditing(null)}
                                />
                            ) : (
                                <BillItemRow
                                    key={product.id}
                                    product={product}
                                    index={index}
                                    actionsDisabled={isEditing}
                                    onEdit={setEditing}
                                    onRemove={handleRemove}
                                />
                            )
                        )}

                        {editing === 'new' && (
                            <BillItemEditRow
                                index={products.length}
                                onConfirm={handleConfirm}
                                onCancel={() => setEditing(null)}
                            />
                        )}
                    </div>

                    {products.length === 0 && !isEditing && (
                        <p className="items-empty">
                            Nenhum item ainda. Use “Adicionar item” para começar.
                        </p>
                    )}

                    <div className="items-foot">
                        <div className="items-foot-count">
                            <span className="items-foot-icon" aria-hidden="true">
                                <ReceiptScanIcon size={16} strokeWidth={2.4} />
                            </span>
                            {products.length} {products.length === 1 ? 'item' : 'itens'}
                        </div>

                        <div className="items-foot-total">
                            <span>Total dos itens</span>
                            <strong className="tn">R$ {formatMoney(total)}</strong>
                        </div>
                    </div>
                </section>

                {receiptUrl && (
                    <aside className="receipt-card" aria-labelledby="receipt-card-title">
                        <h2 id="receipt-card-title" className="receipt-card-eyebrow">
                            Nota original
                        </h2>

                        <a
                            className="receipt-card-link"
                            href={receiptUrl}
                            target="_blank"
                            rel="noreferrer"
                            title="Abrir a foto em tamanho real"
                        >
                            <img
                                className="receipt-card-img"
                                src={receiptUrl}
                                alt="Foto da nota fiscal enviada"
                            />
                        </a>
                    </aside>
                )}
            </div>

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
                    Continuar
                    <ArrowRightIcon size={20} strokeWidth={2.6} />
                </Button>
            </div>
        </>
    );
}
