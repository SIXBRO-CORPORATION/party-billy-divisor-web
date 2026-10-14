import type { ButtonHTMLAttributes, ReactNode } from 'react';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'outline';
    size?: 'sm' | 'md' | 'lg';
    loading?: boolean;
    children: ReactNode;
}

export function Button({
    variant = 'primary',
    size = 'md',
    loading = false,
    className = '',
    children,
    disabled,
    ...props
}: ButtonProps) {
    const classes = ['btn', `btn-${variant}`, `btn-${size}`, className]
        .filter(Boolean)
        .join(' ');

    return (
        <button className={classes} disabled={disabled || loading} {...props}>
            {loading && <span className="btn-spinner" aria-hidden="true" />}
            <span className={loading ? 'btn-content is-loading' : 'btn-content'}>{children}</span>
        </button>
    );
}
