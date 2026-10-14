import { useId } from 'react';
import type { ReactNode } from 'react';
import { CheckIcon } from './icons.tsx';

export interface CheckboxProps {
    checked: boolean;
    onChange: (checked: boolean) => void;
    label?: ReactNode;
    id?: string;
    className?: string;
}

export function Checkbox({ checked, onChange, label, id, className = '' }: CheckboxProps) {
    const generatedId = useId();
    const checkboxId = id ?? generatedId;

    return (
        <label className={`ds-checkbox ${className}`.trim()} htmlFor={checkboxId}>
            <input
                id={checkboxId}
                type="checkbox"
                className="ds-checkbox-input"
                checked={checked}
                onChange={(event) => onChange(event.target.checked)}
            />

            <span className={checked ? 'ds-checkbox-box is-checked' : 'ds-checkbox-box'} aria-hidden="true">
                {checked && <CheckIcon size={13} />}
            </span>

            {label && <span className="ds-checkbox-label">{label}</span>}
        </label>
    );
}
