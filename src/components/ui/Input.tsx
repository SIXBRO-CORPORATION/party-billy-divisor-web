import { useId } from 'react';
import type { InputHTMLAttributes, ReactNode, Ref } from 'react';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    hint?: string;
    leftIcon?: ReactNode;
    rightSlot?: ReactNode;
    ref?: Ref<HTMLInputElement>;
}

export function Input({
    label,
    error,
    hint,
    leftIcon,
    rightSlot,
    className = '',
    id,
    ...props
}: InputProps) {
    const generatedId = useId();
    const inputId = id ?? generatedId;

    const shellClasses = ['field-shell', error ? 'has-error' : ''].filter(Boolean).join(' ');

    return (
        <div className="field">
            {label && (
                <label className="field-label" htmlFor={inputId}>
                    {label}
                </label>
            )}

            <div className={shellClasses}>
                {leftIcon && (
                    <span className="field-icon" aria-hidden="true">
                        {leftIcon}
                    </span>
                )}

                <input
                    id={inputId}
                    className={`field-input ${className}`.trim()}
                    aria-invalid={error ? true : undefined}
                    {...props}
                />

                {rightSlot && <span className="field-slot">{rightSlot}</span>}
            </div>

            {error ? (
                <p className="field-error">{error}</p>
            ) : hint ? (
                <p className="field-hint">{hint}</p>
            ) : null}
        </div>
    );
}
