import { useRef, useState } from 'react';
import type { FormEvent } from 'react';
import type { CollaboratorSuggestion } from '../../hooks/useRecentCollaborators.ts';
import { useToast } from '../../hooks/useToast.ts';
import type { Person } from '../../types/person.ts';
import type { Product } from '../../types/product.ts';
import { formatMoney, roundMoney } from '../../utils/utils.ts';
import { formatPhoneInput } from '../../utils/phone.ts';
import { Button } from '../ui/Button.tsx';
import { Input } from '../ui/Input.tsx';
import {
    ArrowRightIcon,
    ChevronLeftIcon,
    MessageIcon,
    PlusIcon,
    UserCircleIcon,
} from '../ui/icons.tsx';
import PeopleSuggestions from './PeopleSuggestions.tsx';
import { PersonEditRow, PersonRow } from './PersonRow.tsx';
import type { PersonValues } from './PersonRow.tsx';

interface PeopleStepProps {
    persons: Person[];
    payerId: number | null;
    products: Product[];
    suggestions: CollaboratorSuggestion[];
    suggestionsLoading: boolean;
    onAddPerson: (name: string, phone?: string) => void;
    onUpdatePerson: (personId: number, values: PersonValues) => void;
    onRemovePerson: (personId: number) => void;
    onBack: () => void;
    onContinue: () => void;
}

export default function PeopleStep({
    persons,
    payerId,
    products,
    suggestions,
    suggestionsLoading,
    onAddPerson,
    onUpdatePerson,
    onRemovePerson,
    onBack,
    onContinue,
}: PeopleStepProps) {
    const toast = useToast();

    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [editingId, setEditingId] = useState<number | null>(null);

    const nameInputRef = useRef<HTMLInputElement>(null);

    const itemsTotal = roundMoney(
        products.reduce((sum, product) => sum + roundMoney(product.unitPrice * product.quantity), 0)
    );
    const average = persons.length > 0 ? itemsTotal / persons.length : 0;

    const isEditing = editingId !== null;

    function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        if (!name.trim()) {
            nameInputRef.current?.focus();
            return;
        }

        onAddPerson(name, phone);
        setName('');
        setPhone('');
        nameInputRef.current?.focus();
    }

    function handleUpdate(values: PersonValues) {
        if (editingId !== null) {
            onUpdatePerson(editingId, values);
        }

        setEditingId(null);
    }

    function handleAddSuggestion(suggestionName: string) {
        onAddPerson(suggestionName);
    }

    function handleContinue() {
        if (isEditing) {
            toast.error('Confirme ou cancele a edição antes de continuar.');
            return;
        }

        if (persons.length === 0) {
            toast.error('Adicione pelo menos uma pessoa para continuar.');
            return;
        }

        onContinue();
    }

    return (
        <>
            <div className="people-grid">
                <div className="people-main">
                    <section className="newbill-card" aria-labelledby="add-person-title">
                        <h2 id="add-person-title" className="newbill-h2">
                            Adicionar pessoa
                        </h2>

                        <form className="people-form" onSubmit={handleSubmit}>
                            <div className="people-form-fields">
                                <Input
                                    ref={nameInputRef}
                                    label="Nome"
                                    value={name}
                                    onChange={(event) => setName(event.target.value)}
                                    placeholder="Ex.: Fernanda"
                                    maxLength={120}
                                    autoComplete="off"
                                    leftIcon={<UserCircleIcon size={20} strokeWidth={2.2} />}
                                />

                                <Input
                                    label="WhatsApp (opcional)"
                                    value={phone}
                                    onChange={(event) => setPhone(formatPhoneInput(event.target.value))}
                                    placeholder="(85) 9 0000-0000"
                                    inputMode="numeric"
                                    maxLength={16}
                                    leftIcon={<MessageIcon size={20} strokeWidth={2.4} />}
                                />
                            </div>

                            <Button type="submit" className="people-form-submit">
                                <PlusIcon size={18} strokeWidth={2.8} />
                                Adicionar
                            </Button>
                        </form>
                    </section>

                    <section className="items-card" aria-labelledby="people-table-title">
                        <div className="items-card-head">
                            <h2 id="people-table-title" className="newbill-h2">
                                Na mesa · {persons.length}
                            </h2>

                            {persons.length > 0 && (
                                <span className="people-average tn">
                                    Média por pessoa: R$ {formatMoney(average)}
                                </span>
                            )}
                        </div>

                        {persons.length > 0 && (
                            <div className="person-head" role="row">
                                <span role="columnheader">Pessoa</span>
                                <span role="columnheader">WhatsApp</span>
                                <span role="columnheader">
                                    <span className="visually-hidden">Ações</span>
                                </span>
                            </div>
                        )}

                        {persons.map((person, index) =>
                            editingId === person.id ? (
                                <PersonEditRow
                                    key={person.id}
                                    person={person}
                                    avatarIndex={index + 1}
                                    onConfirm={handleUpdate}
                                    onCancel={() => setEditingId(null)}
                                />
                            ) : (
                                <PersonRow
                                    key={person.id}
                                    person={person}
                                    avatarIndex={index + 1}
                                    isPayer={payerId === person.id}
                                    actionsDisabled={isEditing}
                                    onEdit={setEditingId}
                                    onRemove={onRemovePerson}
                                />
                            )
                        )}

                        {persons.length === 0 && (
                            <p className="items-empty">
                                Ninguém na mesa ainda. Use “Adicionar pessoa” para começar.
                            </p>
                        )}
                    </section>
                </div>

                <PeopleSuggestions
                    suggestions={suggestions}
                    isLoading={suggestionsLoading}
                    onAdd={handleAddSuggestion}
                />
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
