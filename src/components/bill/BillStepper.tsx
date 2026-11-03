import { Fragment } from 'react';
import { CheckIcon } from '../ui/icons.tsx';

const STEPS = ['Detalhes', 'Itens', 'Pessoas', 'Consumo', 'Resumo'];

interface BillStepperProps {
    current: number;
}

export default function BillStepper({ current }: BillStepperProps) {
    return (
        <>
            <ol className="stepper" aria-label="Etapas da nova conta">
                {STEPS.map((label, index) => {
                    const number = index + 1;
                    const state =
                        number < current ? 'is-done' : number === current ? 'is-current' : '';

                    return (
                        <Fragment key={label}>
                            {index > 0 && (
                                <li
                                    className={number <= current ? 'stepper-line is-done' : 'stepper-line'}
                                    aria-hidden="true"
                                />
                            )}

                            <li
                                className={`stepper-step ${state}`.trim()}
                                aria-current={number === current ? 'step' : undefined}
                            >
                                <span className="stepper-number">
                                    {number < current ? <CheckIcon size={14} /> : number}
                                </span>
                                {label}
                            </li>
                        </Fragment>
                    );
                })}
            </ol>

            <div className="stepper-compact">
                <span className="stepper-compact-label">
                    Passo {current} de {STEPS.length} · <strong>{STEPS[current - 1]}</strong>
                </span>

                <div className="stepper-compact-bars" aria-hidden="true">
                    {STEPS.map((label, index) => (
                        <i key={label} className={index < current ? 'is-on' : ''} />
                    ))}
                </div>
            </div>
        </>
    );
}
