import { Button } from '../ui/Button.tsx';
import { Pill } from '../ui/Pill.tsx';
import { DownloadIcon, ImageIcon, PencilIcon } from '../ui/icons.tsx';

export type ReceiptScanStatus = 'reading' | 'failed';

interface ReceiptScanStepProps {
    imageUrl: string;
    fileName: string;
    status: ReceiptScanStatus;
    onPickAnother: () => void;
    onManual: () => void;
}

const SKELETON_ROWS = 4;

export default function ReceiptScanStep({
    imageUrl,
    fileName,
    status,
    onPickAnother,
    onManual,
}: ReceiptScanStepProps) {
    const isReading = status === 'reading';

    return (
        <div className="scan-grid">
            <div className={isReading ? 'scan-stage' : 'scan-stage is-failed'}>
                <div className="scan-file">
                    <ImageIcon size={17} strokeWidth={2.2} />
                    <span>{fileName}</span>
                </div>

                <div className="scan-paper">
                    <img src={imageUrl} alt="Foto da nota fiscal enviada" />

                    <span className="scan-corner is-tl" aria-hidden="true" />
                    <span className="scan-corner is-tr" aria-hidden="true" />
                    <span className="scan-corner is-bl" aria-hidden="true" />
                    <span className="scan-corner is-br" aria-hidden="true" />

                    {isReading && <span className="scan-line" aria-hidden="true" />}
                </div>
            </div>

            <div className="scan-side">
                <section className="scan-card" aria-live="polite">
                    <div className="scan-card-head">
                        <h2 className="newbill-h2">{isReading ? 'Lendo a nota…' : 'Não consegui ler a nota'}</h2>

                        {!isReading && <Pill tone="red">Falhou</Pill>}
                    </div>

                    {isReading ? (
                        <>
                            <div className="scan-progress" role="progressbar" aria-label="Lendo a nota">
                                <i />
                            </div>

                            <p className="scan-hint">
                                Leva alguns segundos. Você confere tudo no próximo passo.
                            </p>

                            <div className="scan-skeletons" aria-hidden="true">
                                {Array.from({ length: SKELETON_ROWS }, (_, index) => (
                                    <div className="scan-skeleton-row" key={index}>
                                        <span className="scan-skeleton-tile" />

                                        <span className="scan-skeleton-lines">
                                            <i />
                                            <i />
                                        </span>

                                        <span className="scan-skeleton-value" />
                                    </div>
                                ))}
                            </div>
                        </>
                    ) : (
                        <p className="scan-hint">
                            Tente outra foto, com boa luz e a nota inteira no quadro, ou adicione os
                            itens na mão.
                        </p>
                    )}
                </section>

                <div className="scan-actions">
                    <Button type="button" variant="outline" onClick={onPickAnother}>
                        <DownloadIcon size={18} strokeWidth={2.4} />
                        Enviar outra foto
                    </Button>

                    <Button type="button" variant="secondary" onClick={onManual}>
                        <PencilIcon size={18} strokeWidth={2.2} />
                        Adicionar manualmente
                    </Button>
                </div>
            </div>
        </div>
    );
}
