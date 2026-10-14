import type { ReactNode } from 'react';

export interface CardProps {
    children: ReactNode;
    className?: string;
    padded?: boolean;
    rounded?: 'lg' | 'xl';
}

export function Card({ children, className = '', padded = true, rounded = 'lg' }: CardProps) {
    const classes = ['ds-card', `ds-card-${rounded}`, padded ? 'is-padded' : '', className]
        .filter(Boolean)
        .join(' ');

    return <div className={classes}>{children}</div>;
}
