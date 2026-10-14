import { PERSON_COLORS } from '../../utils/person-colors.ts';
import { CheckIcon } from './icons.tsx';

const SIZE_MAP = { xs: 24, sm: 36, md: 44, lg: 64 } as const;

export interface AvatarProps {
    label: string;
    index?: number;
    size?: keyof typeof SIZE_MAP;
    checked?: boolean;
    ring?: boolean;
    className?: string;
}

export function Avatar({ label, index = 0, size = 'md', checked = false, ring = false, className = '' }: AvatarProps) {
    const px = SIZE_MAP[size];
    const color = PERSON_COLORS[index % PERSON_COLORS.length];
    const initial = label.trim().charAt(0).toUpperCase() || '?';
    const fontSize = Math.round(px * 0.42);

    return (
        <span
            className={`ds-avatar ${className}`.trim()}
            style={{
                width: px,
                height: px,
                background: color.bg,
                color: color.text,
                fontSize,
                boxShadow: ring ? '0 0 0 4px var(--surface)' : undefined,
            }}
            title={label}
        >
            {initial}

            {checked && (
                <span className="ds-avatar-check" aria-hidden="true">
                    <CheckIcon size={Math.max(10, Math.round(px * 0.34))} />
                </span>
            )}
        </span>
    );
}
