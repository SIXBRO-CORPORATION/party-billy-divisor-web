import { Link } from 'react-router-dom';
import { ChevronRightIcon } from '../ui/icons.tsx';
import BillStepper from './BillStepper.tsx';

interface NewBillHeaderProps {
    current: number;
    title: string;
    subtitle?: string;
    trail?: string;
}

export default function NewBillHeader({ current, title, subtitle, trail }: NewBillHeaderProps) {
    return (
        <>
            <nav className="newbill-crumbs" aria-label="Você está em">
                <Link to="/">Contas</Link>
                <ChevronRightIcon size={14} strokeWidth={2.6} />

                {trail ? (
                    <>
                        <span>Nova conta</span>
                        <ChevronRightIcon size={14} strokeWidth={2.6} />
                        <strong aria-current="page">{trail}</strong>
                    </>
                ) : (
                    <strong aria-current="page">Nova conta</strong>
                )}
            </nav>

            <h1 className="newbill-title">{title}</h1>

            {subtitle && <p className="newbill-subtitle">{subtitle}</p>}

            <BillStepper current={current} />
        </>
    );
}
