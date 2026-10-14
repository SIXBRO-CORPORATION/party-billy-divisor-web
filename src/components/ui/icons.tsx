import type { SVGProps } from 'react';

type IconProps = SVGProps<SVGSVGElement> & { size?: number };

function createIconProps({ size = 18, ...props }: IconProps) {
    return {
        width: size,
        height: size,
        viewBox: '0 0 24 24',
        fill: 'none',
        stroke: 'currentColor',
        strokeWidth: 1.8,
        strokeLinecap: 'round' as const,
        strokeLinejoin: 'round' as const,
        'aria-hidden': true,
        ...props,
    };
}

export function ShareIcon(props: IconProps) {
    return (
        <svg {...createIconProps(props)}>
            <circle cx="18" cy="5" r="2.6" />
            <circle cx="6" cy="12" r="2.6" />
            <circle cx="18" cy="19" r="2.6" />
            <line x1="8.3" y1="10.7" x2="15.7" y2="6.3" />
            <line x1="8.3" y1="13.3" x2="15.7" y2="17.7" />
        </svg>
    );
}

export function MessageIcon(props: IconProps) {
    return (
        <svg {...createIconProps(props)}>
            <path d="M4 5.5A2.5 2.5 0 0 1 6.5 3h11A2.5 2.5 0 0 1 20 5.5v7A2.5 2.5 0 0 1 17.5 15H10l-4.5 4.2a.6.6 0 0 1-1-.44V15h-.5A2.5 2.5 0 0 1 4 12.5z" />
        </svg>
    );
}

export function CopyIcon(props: IconProps) {
    return (
        <svg {...createIconProps(props)}>
            <rect x="9" y="9" width="11" height="11" rx="2" />
            <path d="M6 15H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v1" />
        </svg>
    );
}

export function ReceiptScanIcon(props: IconProps) {
    return (
        <svg {...createIconProps(props)}>
            <path d="M6 3h12v18l-2.5-1.6L13 21l-2.5-1.6L8 21l-2-1.6z" />
            <line x1="9" y1="8" x2="15" y2="8" />
            <line x1="9" y1="12" x2="15" y2="12" />
            <line x1="9" y1="16" x2="12.5" y2="16" />
        </svg>
    );
}

export function HomeIcon(props: IconProps) {
    return (
        <svg {...createIconProps(props)}>
            <path d="M4 11.5 12 4l8 7.5" />
            <path d="M6 10v9.5a.5.5 0 0 0 .5.5H10v-5a2 2 0 0 1 4 0v5h3.5a.5.5 0 0 0 .5-.5V10" />
        </svg>
    );
}

export function ListIcon(props: IconProps) {
    return (
        <svg {...createIconProps(props)}>
            <rect x="4" y="4" width="16" height="16" rx="3" />
            <line x1="8" y1="9" x2="16" y2="9" />
            <line x1="8" y1="13" x2="16" y2="13" />
            <line x1="8" y1="17" x2="13" y2="17" />
        </svg>
    );
}

export function LogoutIcon(props: IconProps) {
    return (
        <svg {...createIconProps(props)}>
            <path d="M14 8V6.5A2.5 2.5 0 0 0 11.5 4h-5A2.5 2.5 0 0 0 4 6.5v11A2.5 2.5 0 0 0 6.5 20h5a2.5 2.5 0 0 0 2.5-2.5V16" />
            <line x1="20" y1="12" x2="10.5" y2="12" />
            <path d="m17 8.5 3.5 3.5-3.5 3.5" />
        </svg>
    );
}

export function PlusIcon(props: IconProps) {
    return (
        <svg {...createIconProps(props)}>
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
        </svg>
    );
}

export function CheckCircleIcon(props: IconProps) {
    return (
        <svg {...createIconProps(props)}>
            <circle cx="12" cy="12" r="8.5" />
            <path d="m8.5 12.3 2.4 2.4 4.6-5.4" />
        </svg>
    );
}

export function ClockIcon(props: IconProps) {
    return (
        <svg {...createIconProps(props)}>
            <circle cx="12" cy="12" r="8.5" />
            <path d="M12 7.5V12l3 2" />
        </svg>
    );
}

export function CheckIcon(props: IconProps) {
    return (
        <svg {...createIconProps(props)} strokeWidth={3.6}>
            <path d="M5 12.5l4.5 4.5L19 7.5" />
        </svg>
    );
}

export function MailIcon(props: IconProps) {
    return (
        <svg {...createIconProps(props)}>
            <rect x="3" y="5" width="18" height="14" rx="3" />
            <path d="M3.5 7.5l8.5 6 8.5-6" />
        </svg>
    );
}

export function LockIcon(props: IconProps) {
    return (
        <svg {...createIconProps(props)}>
            <rect x="5" y="11" width="14" height="9" rx="2.5" />
            <path d="M8 11V8a4 4 0 0 1 8 0v3" />
        </svg>
    );
}

export function EyeIcon(props: IconProps) {
    return (
        <svg {...createIconProps(props)}>
            <path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12z" />
            <circle cx="12" cy="12" r="3" />
        </svg>
    );
}

export function EyeOffIcon(props: IconProps) {
    return (
        <svg {...createIconProps(props)}>
            <path d="M3 3l18 18" />
            <path d="M10.6 5.6A10.6 10.6 0 0 1 12 5.5c6 0 9.5 6.5 9.5 6.5a16.7 16.7 0 0 1-3.2 4.1M6.6 6.6C4.1 8.2 2.5 12 2.5 12s3.5 6.5 9.5 6.5a9.4 9.4 0 0 0 3.4-.62" />
            <path d="M9.9 9.9a3 3 0 0 0 4.2 4.2" />
        </svg>
    );
}

export function GoogleLogo({ size = 20 }: { size?: number }) {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
            <path
                fill="#4285F4"
                d="M22 12.2c0-.7-.1-1.4-.2-2H12v3.9h5.6a4.8 4.8 0 0 1-2.1 3.1v2.6h3.4c2-1.8 3.1-4.5 3.1-7.6z"
            />
            <path
                fill="#34A853"
                d="M12 22.5c2.8 0 5.2-.9 6.9-2.5l-3.4-2.6c-.9.6-2.1 1-3.5 1-2.7 0-5-1.8-5.8-4.3H2.7v2.7A10.5 10.5 0 0 0 12 22.5z"
            />
            <path fill="#FBBC05" d="M6.2 14.1a6.3 6.3 0 0 1 0-4.2V7.2H2.7a10.5 10.5 0 0 0 0 9.6z" />
            <path
                fill="#EA4335"
                d="M12 6.1c1.5 0 2.9.5 4 1.6l3-3A10.5 10.5 0 0 0 2.7 7.2l3.5 2.7C7 7.9 9.3 6.1 12 6.1z"
            />
        </svg>
    );
}

export function SearchIcon(props: IconProps) {
    return (
        <svg {...createIconProps(props)}>
            <circle cx="11" cy="11" r="6.5" />
            <path d="M20 20l-4.2-4.2" />
        </svg>
    );
}

export function BellIcon(props: IconProps) {
    return (
        <svg {...createIconProps(props)}>
            <path d="M6 16v-5a6 6 0 0 1 12 0v5l2 2H4z" />
            <path d="M10 21h4" />
        </svg>
    );
}

export function UserCircleIcon(props: IconProps) {
    return (
        <svg {...createIconProps(props)}>
            <circle cx="12" cy="8" r="4" />
            <path d="M4 20c0-3.8 3.6-6 8-6s8 2.2 8 6" />
        </svg>
    );
}

export function HelpCircleIcon(props: IconProps) {
    return (
        <svg {...createIconProps(props)}>
            <circle cx="12" cy="12" r="9" />
            <path d="M9.5 9.5a2.6 2.6 0 0 1 5 .8c0 1.8-2.5 2.2-2.5 3.9M12 17.3v.1" />
        </svg>
    );
}

export function ChevronRightIcon(props: IconProps) {
    return (
        <svg {...createIconProps(props)}>
            <path d="M9 5l7 7-7 7" />
        </svg>
    );
}

export function AppleLogo({ size = 20 }: { size?: number }) {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="#1B1511" aria-hidden="true">
            <path d="M16.4 12.6c0-2.2 1.8-3.3 1.9-3.3-1-1.5-2.6-1.7-3.2-1.7-1.4-.1-2.6.8-3.3.8-.7 0-1.7-.8-2.8-.8-1.4 0-2.8.9-3.5 2.2-1.5 2.6-.4 6.5 1.1 8.6.7 1 1.6 2.2 2.7 2.1 1.1 0 1.5-.7 2.8-.7 1.3 0 1.7.7 2.8.7 1.2 0 1.9-1 2.6-2.1.8-1.2 1.2-2.3 1.2-2.4 0 0-2.3-.9-2.3-3.4zM14.3 6.2c.6-.7 1-1.7.9-2.7-.9 0-1.9.6-2.5 1.3-.5.6-1 1.6-.9 2.6 1 .1 1.9-.5 2.5-1.2z" />
        </svg>
    );
}
