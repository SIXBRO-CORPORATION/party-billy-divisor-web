import { useId } from 'react';
import type { ReactNode } from 'react';

export interface SwitchProps {
    checked: boolean;
    onChange: (checked: boolean) => void;
    label?: ReactNode;
    id?: string;
    className?: string;
}

export function Switch({ checked, onChange, label, id, className = '' }: SwitchProps) {
    const generatedId = useId();
    const switchId = id ?? generatedId;

    return (
        <label className={`ds-switch ${className}`.trim()} htmlFor={switchId}>
            <input
                id={switchId}
                type="checkbox"
                role="switch"
                aria-checked={checked}
                className="ds-switch-input"
                checked={checked}
                onChange={(event) => onChange(event.target.checked)}
            />

            <span className={checked ? 'ds-switch-track is-on' : 'ds-switch-track'} aria-hidden="true" />

            {label && <span className="ds-switch-label">{label}</span>}
        </label>
    );
}
