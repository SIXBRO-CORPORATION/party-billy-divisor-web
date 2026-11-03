import type { ReactNode } from 'react';
import { Pill } from '../ui/Pill.tsx';
import { CameraIcon, CheckIcon, PencilIcon } from '../ui/icons.tsx';

export type ItemsMethod = 'scan' | 'manual';

interface ItemsMethodPickerProps {
    value: ItemsMethod;
    onChange: (value: ItemsMethod) => void;
    disabled?: boolean;
}

interface MethodOption {
    value: ItemsMethod;
    title: string;
    description: string;
    tone: 'orange' | 'green';
    icon: ReactNode;
    badge?: string;
}

const OPTIONS: MethodOption[] = [
    {
        value: 'scan',
        title: 'Ler a nota fiscal',
        description: 'Envie uma foto e a gente lê os itens pra você.',
        tone: 'orange',
        icon: <CameraIcon size={28} strokeWidth={2.2} />,
        badge: 'Mais rápido',
    },
    {
        value: 'manual',
        title: 'Adicionar manualmente',
        description: 'Digite item por item, do seu jeito.',
        tone: 'green',
        icon: <PencilIcon size={28} strokeWidth={2.2} />,
    },
];

export default function ItemsMethodPicker({ value, onChange, disabled }: ItemsMethodPickerProps) {
    return (
        <div className="method-grid" role="radiogroup" aria-label="Como adicionar os itens">
            {OPTIONS.map((option) => {
                const selected = option.value === value;

                return (
                    <button
                        key={option.value}
                        type="button"
                        role="radio"
                        aria-checked={selected}
                        disabled={disabled}
                        className={selected ? 'method-card is-selected' : 'method-card'}
                        onClick={() => onChange(option.value)}
                    >
                        <span className="method-card-top">
                            <span className={`method-tile is-${option.tone}`}>{option.icon}</span>

                            <span className="method-radio" aria-hidden="true">
                                {selected && <CheckIcon size={16} />}
                            </span>
                        </span>

                        <span className="method-title-row">
                            <span className="method-title">{option.title}</span>
                            {option.badge && <Pill tone="green">{option.badge}</Pill>}
                        </span>

                        <span className="method-desc">{option.description}</span>
                    </button>
                );
            })}
        </div>
    );
}
