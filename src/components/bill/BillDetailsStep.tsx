import type { Ref } from 'react';
import type { BillDraft } from '../../types/draft.ts';
import { getBillPayer, formatDayLabel } from '../../utils/utils.ts';
import { Avatar } from '../ui/Avatar.tsx';
import { Button } from '../ui/Button.tsx';
import { DateField } from '../ui/DateField.tsx';
import { Input } from '../ui/Input.tsx';
import { ArrowRightIcon, ChevronLeftIcon, MapPinIcon, SparklesIcon } from '../ui/icons.tsx';
import { SelectField } from '../ui/SelectField.tsx';
import BillPreviewCard from './BillPreviewCard.tsx';
import ItemsMethodPicker from './ItemsMethodPicker.tsx';
import type { ItemsMethod } from './ItemsMethodPicker.tsx';

const PAYER_ME = 'me';

interface BillDetailsStepProps {
    draft: BillDraft;
    date: string;
    userName: string;
    method: ItemsMethod;
    isBusy: boolean;
    titleError?: string;
    titleInputRef: Ref<HTMLInputElement>;
    onTitleChange: (title: string) => void;
    onPlaceChange: (place: string) => void;
    onDateChange: (date: string) => void;
    onPayerChange: (payerId: number | null) => void;
    onMethodChange: (method: ItemsMethod) => void;
    onCancel: () => void;
    onContinue: () => void;
}

export default function BillDetailsStep({
    draft,
    date,
    userName,
    method,
    isBusy,
    titleError,
    titleInputRef,
    onTitleChange,
    onPlaceChange,
    onDateChange,
    onPayerChange,
    onMethodChange,
    onCancel,
    onContinue,
}: BillDetailsStepProps) {
    const payer = getBillPayer(draft, userName);

    const payerOptions = [
        { value: PAYER_ME, label: 'Você' },
        ...draft.persons.map((person) => ({ value: String(person.id), label: person.name })),
    ];

    const payerValue = payer.avatarIndex === 0 ? PAYER_ME : String(draft.payerId);

    return (
        <>
            <div className="newbill-grid">
                <section className="newbill-card">
                    <h2 className="newbill-h2">Detalhes da conta</h2>

                    <div className="newbill-fields">
                        <Input
                            ref={titleInputRef}
                            label="Nome da conta"
                            value={draft.title}
                            onChange={(event) => onTitleChange(event.target.value)}
                            placeholder="Ex: Rolê de sexta"
                            maxLength={255}
                            error={titleError}
                        />

                        <div className="newbill-row">
                            <div className="newbill-row-place">
                                <Input
                                    label="Local"
                                    value={draft.place}
                                    onChange={(event) => onPlaceChange(event.target.value)}
                                    placeholder="Ex: Bar do Zé"
                                    maxLength={120}
                                    leftIcon={<MapPinIcon size={20} strokeWidth={2.2} />}
                                />
                            </div>

                            <DateField label="Data" value={date} onChange={onDateChange} />

                            <SelectField
                                label="Quem pagou"
                                value={payerValue}
                                options={payerOptions}
                                onChange={(value) =>
                                    onPayerChange(value === PAYER_ME ? null : Number(value))
                                }
                                leading={
                                    <Avatar
                                        label={payer.avatarLabel}
                                        index={payer.avatarIndex}
                                        size="xs"
                                    />
                                }
                            />
                        </div>
                    </div>

                    <h2 className="newbill-h2 newbill-h2-spaced">Como adicionar os itens?</h2>

                    <ItemsMethodPicker value={method} onChange={onMethodChange} disabled={isBusy} />
                </section>

                <aside className="newbill-aside">
                    <BillPreviewCard
                        title={draft.title}
                        place={draft.place}
                        dateLabel={formatDayLabel(date)}
                        payer={payer}
                    />

                    <div className="newbill-tip">
                        <SparklesIcon size={22} strokeWidth={2.4} />
                        <span>Dica: com a foto da nota, os itens entram em segundos. Você só confere.</span>
                    </div>
                </aside>
            </div>

            <div className="newbill-footer">
                <Button
                    type="button"
                    variant="outline"
                    size="lg"
                    className="newbill-cancel"
                    onClick={onCancel}
                    disabled={isBusy}
                >
                    <ChevronLeftIcon size={18} strokeWidth={2.6} />
                    Cancelar
                </Button>

                <Button
                    type="button"
                    size="lg"
                    className="newbill-continue"
                    onClick={onContinue}
                    loading={isBusy}
                >
                    Continuar
                    <ArrowRightIcon size={20} strokeWidth={2.6} />
                </Button>
            </div>
        </>
    );
}
