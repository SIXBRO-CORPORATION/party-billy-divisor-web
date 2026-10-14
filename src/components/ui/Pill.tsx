import type { ReactNode } from 'react';

export type PillTone = 'orange' | 'green' | 'yellow' | 'red' | 'ink';

export interface PillProps {
    tone?: PillTone;
    icon?: ReactNode;
    children: ReactNode;
    className?: string;
}

export function Pill({ tone = 'orange', icon, children, className = '' }: PillProps) {
    return (
        <span className={`ds-pill ds-pill-${tone} ${className}`.trim()}>
            {icon && (
                <span className="ds-pill-icon" aria-hidden="true">
                    {icon}
                </span>
            )}
            {children}
        </span>
    );
}
