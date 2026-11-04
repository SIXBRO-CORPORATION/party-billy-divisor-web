import { useRef, useState } from 'react';
import type { ChangeEvent, KeyboardEvent } from 'react';
import type { Product } from '../../types/product.ts';
import { getProductEmoji } from '../../utils/product-emoji.ts';
import { formatMoney, parseMoneyInput, roundMoney } from '../../utils/utils.ts';
import { CheckIcon, CloseIcon, PencilIcon, TrashIcon } from '../ui/icons.tsx';

export interface ItemValues {
    name: string;
    unitPrice: number;
    quantity: number;
}

export function ItemTile({ name, index }: { name: string; index: number }) {
    return (
        <span className={`item-tile ${index % 2 === 0 ? 'is-orange' : 'is-green'}`} aria-hidden="true">
            {getProductEmoji(name)}
        </span>
    );
}

interface BillItemRowProps {
    product: Product;
    index: number;
    actionsDisabled: boolean;
    onEdit: (productId: number) => void;
    onRemove: (productId: number) => void;
}

export function BillItemRow({ product, index, actionsDisabled, onEdit, onRemove }: BillItemRowProps) {
    const total = roundMoney(product.unitPrice * product.quantity);

    return (
        <div className="item-row" role="row">
            <div className="item-cell item-cell-name" role="cell">
                <ItemTile name={product.name} index={index} />
                <span className="item-name">{product.name}</span>
            </div>

            <span className="item-cell item-cell-qty tn" role="cell">
                {product.quantity}
            </span>

            <span className="item-cell item-cell-unit tn" role="cell">
                R$ {formatMoney(product.unitPrice)}
            </span>

            <b className="item-cell item-cell-total tn" role="cell">
                R$ {formatMoney(total)}
            </b>

            <div className="item-cell item-cell-actions" role="cell">
                <button
                    type="button"
                    className="icon-btn"
                    aria-label={`Editar ${product.name}`}
                    disabled={actionsDisabled}
                    onClick={() => onEdit(product.id)}
                >
                    <PencilIcon size={18} strokeWidth={2.2} />
                </button>

                <button
                    type="button"
                    className="icon-btn"
                    aria-label={`Remover ${product.name}`}
                    disabled={actionsDisabled}
                    onClick={() => onRemove(product.id)}
                >
                    <TrashIcon size={18} strokeWidth={2.2} />
                </button>
            </div>
        </div>
    );
}

interface BillItemEditRowProps {
    product?: Product;
    index: number;
    onConfirm: (values: ItemValues) => void;
    onCancel: () => void;
}

export function BillItemEditRow({ product, index, onConfirm, onCancel }: BillItemEditRowProps) {
    const [name, setName] = useState(product?.name ?? '');
    const [quantity, setQuantity] = useState(product ? String(product.quantity) : '1');
    const [price, setPrice] = useState(product ? formatMoney(product.unitPrice) : '');
    const [showErrors, setShowErrors] = useState(false);

    const nameRef = useRef<HTMLInputElement>(null);
    const quantityRef = useRef<HTMLInputElement>(null);
    const priceRef = useRef<HTMLInputElement>(null);

    const unitPrice = parseMoneyInput(price);
    const quantityValue = Number(quantity || '0');

    const hasNameError = name.trim().length === 0;
    const hasQuantityError = quantityValue < 1;
    const hasPriceError = unitPrice <= 0;

    function handleQuantityChange(event: ChangeEvent<HTMLInputElement>) {
        if (/^[0-9]*$/.test(event.target.value)) {
            setQuantity(event.target.value);
        }
    }

    function handlePriceChange(event: ChangeEvent<HTMLInputElement>) {
        if (/^[0-9]*[.,]?[0-9]*$/.test(event.target.value)) {
            setPrice(event.target.value);
        }
    }

    function handleConfirm() {
        if (hasNameError || hasQuantityError || hasPriceError) {
            setShowErrors(true);

            const firstInvalid = hasNameError ? nameRef : hasQuantityError ? quantityRef : priceRef;

            firstInvalid.current?.focus();
            return;
        }

        onConfirm({ name: name.trim(), unitPrice, quantity: quantityValue });
    }

    function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
        if (event.key === 'Enter') {
            event.preventDefault();
            handleConfirm();
        } else if (event.key === 'Escape') {
            event.preventDefault();
            onCancel();
        }
    }

    const total = roundMoney(unitPrice * quantityValue);

    return (
        <div className="item-row is-editing" role="row" onKeyDown={handleKeyDown}>
            <div className="item-cell item-cell-name" role="cell">
                <ItemTile name={name} index={index} />

                <label className={showErrors && hasNameError ? 'item-input has-error' : 'item-input'}>
                    <span className="visually-hidden">Nome do item</span>
                    <input
                        ref={nameRef}
                        value={name}
                        onChange={(event) => setName(event.target.value)}
                        placeholder="Ex: Pizza calabresa"
                        maxLength={255}
                        autoComplete="off"
                        autoFocus
                        aria-invalid={showErrors && hasNameError ? true : undefined}
                    />
                </label>
            </div>

            <div className="item-cell item-cell-qty" role="cell">
                <label
                    className={
                        showErrors && hasQuantityError
                            ? 'item-input is-center has-error tn'
                            : 'item-input is-center tn'
                    }
                >
                    <span className="visually-hidden">Quantidade</span>
                    <input
                        ref={quantityRef}
                        value={quantity}
                        onChange={handleQuantityChange}
                        inputMode="numeric"
                        maxLength={4}
                        aria-invalid={showErrors && hasQuantityError ? true : undefined}
                    />
                </label>
            </div>

            <div className="item-cell item-cell-unit" role="cell">
                <label
                    className={
                        showErrors && hasPriceError ? 'item-input has-error tn' : 'item-input tn'
                    }
                >
                    <span className="item-input-prefix" aria-hidden="true">
                        R$
                    </span>
                    <span className="visually-hidden">Valor unitário em reais</span>
                    <input
                        ref={priceRef}
                        value={price}
                        onChange={handlePriceChange}
                        placeholder="0,00"
                        inputMode="decimal"
                        maxLength={9}
                        aria-invalid={showErrors && hasPriceError ? true : undefined}
                    />
                </label>
            </div>

            <b className="item-cell item-cell-total tn" role="cell">
                R$ {formatMoney(total)}
            </b>

            <div className="item-cell item-cell-actions" role="cell">
                <button
                    type="button"
                    className="icon-btn"
                    aria-label="Cancelar edição"
                    onClick={onCancel}
                >
                    <CloseIcon size={18} strokeWidth={2.4} />
                </button>

                <button
                    type="button"
                    className="icon-btn is-confirm"
                    aria-label="Confirmar item"
                    onClick={handleConfirm}
                >
                    <CheckIcon size={18} strokeWidth={3.2} />
                </button>
            </div>
        </div>
    );
}
