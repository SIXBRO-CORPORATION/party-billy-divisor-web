import { useId } from 'react';
import type { ReactNode } from 'react';
import { ChevronDownIcon } from './icons.tsx';

export interface SelectOption {
    value: string;
    label: string;
}

export interface SelectFieldProps {
    label: string;
    value: string;
    options: SelectOption[];
    onChange: (value: string) => void;
    leading?: ReactNode;
}

export function SelectField({ label, value, options, onChange, leading }: SelectFieldProps) {
    const selectId = useId();
    const selected = options.find((option) => option.value === value);

    return (
        <div className="field">
            <label className="field-label" htmlFor={selectId}>
                {label}
            </label>

            <div className="field-shell field-shell-overlay">
                {leading}

                <span className="field-value">{selected?.label}</span>

                <span className="field-slot" aria-hidden="true">
                    <ChevronDownIcon size={18} strokeWidth={2.2} />
                </span>

                <select
                    id={selectId}
                    className="field-overlay"
                    value={value}
                    onChange={(event) => onChange(event.target.value)}
                >
                    {options.map((option) => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>
            </div>
        </div>
    );
}
