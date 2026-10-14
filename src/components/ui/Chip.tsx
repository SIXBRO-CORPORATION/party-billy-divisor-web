import type { ButtonHTMLAttributes, ReactNode } from 'react';

export interface ChipProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    active?: boolean;
    icon?: ReactNode;
}

export function Chip({ active = false, icon, children, className = '', type = 'button', ...props }: ChipProps) {
    return (
        <button
            type={type}
            className={`ds-chip ${active ? 'is-active' : ''} ${className}`.trim()}
            {...props}
        >
            {icon && (
                <span className="ds-chip-icon" aria-hidden="true">
                    {icon}
                </span>
            )}
            {children}
        </button>
    );
}
