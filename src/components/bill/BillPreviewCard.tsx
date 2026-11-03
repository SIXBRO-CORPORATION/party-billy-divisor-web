import { Avatar } from '../ui/Avatar.tsx';

export interface BillPayer {
    name: string;
    avatarLabel: string;
    avatarIndex: number;
}

interface BillPreviewCardProps {
    title: string;
    place: string;
    dateLabel: string;
    payer: BillPayer;
}

export default function BillPreviewCard({ title, place, dateLabel, payer }: BillPreviewCardProps) {
    const hasTitle = title.trim().length > 0;
    const subtitle = [place.trim(), dateLabel].filter(Boolean).join(' · ');

    return (
        <section className="bill-preview" aria-label="Prévia da conta">
            <span className="bill-preview-eyebrow">Prévia</span>

            <div className="bill-preview-head">
                <span className="bill-preview-tile" aria-hidden="true">
                    🍕
                </span>

                <div className="bill-preview-text">
                    <strong className={hasTitle ? undefined : 'is-empty'}>
                        {hasTitle ? title.trim() : 'Dê um nome à conta'}
                    </strong>
                    {subtitle && <span>{subtitle}</span>}
                </div>
            </div>

            <div className="bill-preview-payer">
                <Avatar label={payer.avatarLabel} index={payer.avatarIndex} size="sm" />
                <span>Quem pagou:</span>
                <strong>{payer.name}</strong>
            </div>

            <p className="bill-preview-hint">
                Itens, pessoas e valores aparecem aqui conforme você avança.
            </p>
        </section>
    );
}
