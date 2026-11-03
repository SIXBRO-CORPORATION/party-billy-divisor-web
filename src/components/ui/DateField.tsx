import { useId } from 'react';
import type { MouseEvent } from 'react';
import { capitalize, formatDayLabel } from '../../utils/utils.ts';
import { CalendarIcon } from './icons.tsx';

export interface DateFieldProps {
    label: string;
    value: string;
    onChange: (value: string) => void;
}

export function DateField({ label, value, onChange }: DateFieldProps) {
    const inputId = useId();

    function openPicker(event: MouseEvent<HTMLInputElement>) {
        try {
            event.currentTarget.showPicker();
        } catch {

        }
    }

    return (
        <div className="field">
            <label className="field-label" htmlFor={inputId}>
                {label}
            </label>

            <div className="field-shell field-shell-overlay">
                <span className="field-icon" aria-hidden="true">
                    <CalendarIcon size={20} strokeWidth={2.2} />
                </span>

                <span className="field-value">{capitalize(formatDayLabel(value))}</span>

                <input
                    id={inputId}
                    type="date"
                    className="field-overlay"
                    value={value}
                    onChange={(event) => onChange(event.target.value)}
                    onClick={openPicker}
                />
            </div>
        </div>
    );
}
