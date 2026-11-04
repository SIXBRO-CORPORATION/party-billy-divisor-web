import { useRef, useState } from 'react';
import type { KeyboardEvent } from 'react';
import type { Person } from '../../types/person.ts';
import { formatPhoneInput, maskPhoneDisplay } from '../../utils/phone.ts';
import { Avatar } from '../ui/Avatar.tsx';
import { Pill } from '../ui/Pill.tsx';
import { CheckIcon, CloseIcon, MessageIcon, PencilIcon, UserCircleIcon } from '../ui/icons.tsx';

interface PersonRowProps {
    person: Person;
    avatarIndex: number;
    isPayer: boolean;
    actionsDisabled: boolean;
    onEdit: (personId: number) => void;
    onRemove: (personId: number) => void;
}

export function PersonRow({
    person,
    avatarIndex,
    isPayer,
    actionsDisabled,
    onEdit,
    onRemove,
}: PersonRowProps) {
    return (
        <div className="person-row" role="row">
            <div className="person-cell person-cell-name" role="cell">
                <Avatar label={person.name} index={avatarIndex} size="sm" />

                <span className="person-name">{person.name}</span>

                {isPayer && (
                    <Pill tone="green" className="person-payer-pill">
                        Pagou
                    </Pill>
                )}
            </div>

            <div className="person-cell person-cell-phone" role="cell">
                {person.phone ? (
                    <span className="person-phone tn">
                        <MessageIcon size={18} strokeWidth={2.4} />
                        {maskPhoneDisplay(person.phone)}
                    </span>
                ) : (
                    <span className="person-phone-empty">Sem WhatsApp</span>
                )}
            </div>

            <div className="person-cell person-cell-actions" role="cell">
                <button
                    type="button"
                    className="icon-btn"
                    aria-label={`Editar ${person.name}`}
                    disabled={actionsDisabled}
                    onClick={() => onEdit(person.id)}
                >
                    <PencilIcon size={18} strokeWidth={2.2} />
                </button>

                <button
                    type="button"
                    className="icon-btn"
                    aria-label={`Remover ${person.name}`}
                    disabled={actionsDisabled}
                    onClick={() => onRemove(person.id)}
                >
                    <CloseIcon size={18} strokeWidth={2.2} />
                </button>
            </div>
        </div>
    );
}

export interface PersonValues {
    name: string;
    phone?: string;
}

interface PersonEditRowProps {
    person: Person;
    avatarIndex: number;
    onConfirm: (values: PersonValues) => void;
    onCancel: () => void;
}

export function PersonEditRow({ person, avatarIndex, onConfirm, onCancel }: PersonEditRowProps) {
    const [name, setName] = useState(person.name);
    const [phone, setPhone] = useState(person.phone ?? '');
    const [showError, setShowError] = useState(false);

    const nameRef = useRef<HTMLInputElement>(null);

    const hasNameError = name.trim().length === 0;

    function handleConfirm() {
        if (hasNameError) {
            setShowError(true);
            nameRef.current?.focus();
            return;
        }

        onConfirm({ name: name.trim(), phone: phone.trim() || undefined });
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

    return (
        <div className="person-row is-editing" role="row" onKeyDown={handleKeyDown}>
            <div className="person-cell person-cell-name" role="cell">
                <Avatar label={name || person.name} index={avatarIndex} size="sm" />

                <label className={showError && hasNameError ? 'item-input has-error' : 'item-input'}>
                    <span className="visually-hidden">Nome da pessoa</span>
                    <UserCircleIcon size={18} strokeWidth={2.2} />
                    <input
                        ref={nameRef}
                        value={name}
                        onChange={(event) => setName(event.target.value)}
                        placeholder="Nome"
                        maxLength={120}
                        autoComplete="off"
                        autoFocus
                        aria-invalid={showError && hasNameError ? true : undefined}
                    />
                </label>
            </div>

            <div className="person-cell person-cell-phone" role="cell">
                <label className="item-input">
                    <span className="visually-hidden">WhatsApp (opcional)</span>
                    <MessageIcon size={18} strokeWidth={2.4} />
                    <input
                        value={phone}
                        onChange={(event) => setPhone(formatPhoneInput(event.target.value))}
                        placeholder="(85) 9 0000-0000"
                        inputMode="numeric"
                        maxLength={16}
                    />
                </label>
            </div>

            <div className="person-cell person-cell-actions" role="cell">
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
                    aria-label="Confirmar pessoa"
                    onClick={handleConfirm}
                >
                    <CheckIcon size={18} strokeWidth={3.2} />
                </button>
            </div>
        </div>
    );
}
