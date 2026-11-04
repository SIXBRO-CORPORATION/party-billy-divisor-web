import { useState } from 'react';
import { useToast } from '../../hooks/useToast.ts';
import type { SplitResult } from '../../types/split.ts';
import { getProductEmoji } from '../../utils/product-emoji.ts';
import { buildSplitShareData, formatShareText } from '../../utils/shareText.ts';
import type { ShareBillData } from '../../utils/shareText.ts';
import {
    SERVICE_FEE_RATE,
    calculateServiceFee,
    formatMoney,
    roundMoney,
} from '../../utils/utils.ts';
import { Avatar } from '../ui/Avatar.tsx';
import { Button } from '../ui/Button.tsx';
import { Pill } from '../ui/Pill.tsx';
import { Switch } from '../ui/Switch.tsx';
import { ChevronLeftIcon, CopyIcon, WhatsAppIcon } from '../ui/icons.tsx';

interface SummaryStepProps {
    title: string;
    place: string;
    payerId: number | null;
    itemsCount: number;
    split: SplitResult;
    isSaving: boolean;
    onBack: () => void;
    onSave: () => void;
}

const SERVICE_FEE_LABEL = `${Math.round(SERVICE_FEE_RATE * 100)}%`;

function pluralize(count: number, singular: string, plural: string): string {
    return `${count} ${count === 1 ? singular : plural}`;
}

export default function SummaryStep({
    title,
    place,
    payerId,
    itemsCount,
    split,
    isSaving,
    onBack,
    onSave,
}: SummaryStepProps) {
    const toast = useToast();

    const [includeService, setIncludeService] = useState(false);

    if (!split.success) {
        return (
            <>
                <section className="newbill-card summary-missing" role="alert">
                    <h2 className="newbill-h2">Ainda faltam itens sem ninguém</h2>

                    <p className="summary-missing-text">
                        Volte e marque quem consumiu: {split.missingProducts.join(', ')}.
                    </p>
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
                </div>
            </>
        );
    }

    const rows = split.splits.map((personSplit, index) => {
        const serviceFee = includeService ? calculateServiceFee(personSplit.total) : 0;

        return {
            split: personSplit,
            avatarIndex: index + 1,
            serviceFee,
            total: roundMoney(personSplit.total + serviceFee),
        };
    });

    const total = roundMoney(rows.reduce((sum, row) => sum + row.total, 0));
    const average = rows.length > 0 ? roundMoney(total / rows.length) : 0;

    const baseShareData = buildSplitShareData(title, split);
    const shareData: ShareBillData = includeService
        ? {
              ...baseShareData,
              totalAmount: total,
              participants: baseShareData.participants.map((participant, index) => ({
                  ...participant,
                  total: rows[index].total,
                  items: [
                      ...participant.items,
                      { label: `Serviço ${SERVICE_FEE_LABEL}`, value: rows[index].serviceFee },
                  ],
              })),
          }
        : baseShareData;

    const details = [
        title.trim(),
        place.trim(),
        pluralize(itemsCount, 'item', 'itens'),
        pluralize(rows.length, 'pessoa', 'pessoas'),
    ]
        .filter(Boolean)
        .join(' · ');

    function handleWhatsApp() {
        const url = `https://wa.me/?text=${encodeURIComponent(formatShareText(shareData))}`;

        window.open(url, '_blank', 'noopener,noreferrer');
    }

    async function handleCopy() {
        try {
            await navigator.clipboard.writeText(formatShareText(shareData));
            toast.success('Resumo copiado! Já pode colar no WhatsApp.');
        } catch {
            toast.error('Não foi possível copiar o resumo.');
        }
    }

    return (
        <>
            <div className="summary-grid">
                <ul className="summary-people" aria-label="Quanto cada pessoa paga">
                    {rows.map((row) => (
                        <li key={row.split.personId} className="summary-person">
                            <div className="summary-person-head">
                                <Avatar label={row.split.personName} index={row.avatarIndex} size="md" />

                                <div className="summary-person-info">
                                    <div className="summary-person-name-row">
                                        <h2 className="summary-person-name">{row.split.personName}</h2>

                                        {payerId === row.split.personId && (
                                            <Pill tone="green">Pagou</Pill>
                                        )}
                                    </div>

                                    <span className="summary-person-count">
                                        {pluralize(row.split.items.length, 'item', 'itens')}
                                    </span>
                                </div>

                                <b className="summary-person-total tn">R$ {formatMoney(row.total)}</b>
                            </div>

                            <ul className="summary-items">
                                {row.split.items.map((item) => (
                                    <li key={item.productId} className="summary-item">
                                        <span className="summary-item-emoji" aria-hidden="true">
                                            {getProductEmoji(item.productName)}
                                        </span>

                                        <span className="summary-item-name">{item.productName}</span>

                                        <span className="summary-item-divisor tn">
                                            <span className="visually-hidden">dividido por </span>÷
                                            {item.participantsCount}
                                        </span>

                                        <b className="summary-item-value tn">
                                            R$ {formatMoney(item.shareValue)}
                                        </b>
                                    </li>
                                ))}

                                {row.split.items.length === 0 && (
                                    <li className="summary-item summary-item-empty">
                                        Não consumiu nenhum item.
                                    </li>
                                )}

                                {includeService && (
                                    <li className="summary-item summary-item-service">
                                        <span className="summary-item-emoji" aria-hidden="true">
                                            🧾
                                        </span>

                                        <span className="summary-item-name">
                                            Serviço {SERVICE_FEE_LABEL}
                                        </span>

                                        <b className="summary-item-value tn">
                                            R$ {formatMoney(row.serviceFee)}
                                        </b>
                                    </li>
                                )}
                            </ul>
                        </li>
                    ))}
                </ul>

                <aside className="summary-aside" aria-label="Total e compartilhamento">
                    <section className="summary-total">
                        <span className="summary-eyebrow">Total da conta</span>

                        <strong className="summary-total-value tn">R$ {formatMoney(total)}</strong>

                        <p className="summary-total-details">{details}</p>

                        <div className="summary-service">
                            <Switch
                                checked={includeService}
                                onChange={setIncludeService}
                                label={`Incluir ${SERVICE_FEE_LABEL} de serviço`}
                            />

                            {includeService && (
                                <p className="summary-service-hint">
                                    Vale só para este resumo e para o texto compartilhado. A conta salva
                                    não leva o serviço.
                                </p>
                            )}
                        </div>

                        <div className="summary-average">
                            <span>Média por pessoa</span>
                            <b className="tn">R$ {formatMoney(average)}</b>
                        </div>
                    </section>

                    <div className="summary-actions">
                        <Button
                            type="button"
                            size="lg"
                            className="summary-whatsapp"
                            onClick={handleWhatsApp}
                        >
                            <WhatsAppIcon size={24} />
                            Compartilhar no WhatsApp
                        </Button>

                        <Button type="button" variant="outline" size="lg" onClick={handleCopy}>
                            <CopyIcon size={19} strokeWidth={2.4} />
                            Copiar resumo
                        </Button>
                    </div>
                </aside>
            </div>

            <div className="newbill-footer">
                <Button
                    type="button"
                    variant="outline"
                    size="lg"
                    className="newbill-cancel"
                    onClick={onBack}
                    disabled={isSaving}
                >
                    <ChevronLeftIcon size={18} strokeWidth={2.6} />
                    Voltar
                </Button>

                <Button
                    type="button"
                    size="lg"
                    className="newbill-continue"
                    onClick={onSave}
                    loading={isSaving}
                >
                    Salvar conta
                </Button>
            </div>
        </>
    );
}
