export interface SegmentedOption<T extends string> {
    label: string;
    value: T;
}

export interface SegmentedControlProps<T extends string> {
    options: SegmentedOption<T>[];
    value: T;
    onChange: (value: T) => void;
    className?: string;
}

export function SegmentedControl<T extends string>({
    options,
    value,
    onChange,
    className = '',
}: SegmentedControlProps<T>) {
    return (
        <div className={`ds-segmented ${className}`.trim()} role="tablist">
            {options.map((option) => (
                <button
                    key={option.value}
                    type="button"
                    role="tab"
                    aria-selected={option.value === value}
                    className={
                        option.value === value ? 'ds-segmented-option is-active' : 'ds-segmented-option'
                    }
                    onClick={() => onChange(option.value)}
                >
                    {option.label}
                </button>
            ))}
        </div>
    );
}
