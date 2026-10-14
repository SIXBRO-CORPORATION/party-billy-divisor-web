interface LogoProps {
    size?: number;
    withWordmark?: boolean;
    plate?: boolean;
    className?: string;
}


export function Logo({ size = 32, withWordmark = true, plate = false, className = '' }: LogoProps) {
    const markSize = plate ? Math.round(size * 0.74) : size;
    const wordSize = Math.round(size * 0.78);

    const mark = (
        <svg width={markSize} height={markSize} viewBox="0 0 100 100" aria-hidden="true" className="ds-logo-mark">
            <path d="M50 18A32 32 0 0 0 50 82Z" fill="#FF6A13" transform="translate(-3.5,-3.5)" />
            <path d="M50 18A32 32 0 0 1 50 82Z" fill="#12B76A" transform="translate(3.5,3.5)" />
        </svg>
    );

    return (
        <span className={`ds-logo ${className}`.trim()}>
            {plate ? (
                <span className="ds-logo-plate" style={{ width: size, height: size }}>
                    {mark}
                </span>
            ) : (
                mark
            )}

            {withWordmark && (
                <span className="ds-logo-word" style={{ fontSize: wordSize }}>
                    racha
                </span>
            )}
        </span>
    );
}
