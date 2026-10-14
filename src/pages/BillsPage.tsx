import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button.tsx';
import { Chip } from '../components/ui/Chip.tsx';
import { Loading } from '../components/ui/Loading.tsx';
import { Pill } from '../components/ui/Pill.tsx';
import {
    BellIcon,
    CheckCircleIcon,
    ChevronRightIcon,
    ClockIcon,
    SearchIcon,
} from '../components/ui/icons.tsx';
import { useAuth } from '../hooks/useAuth.ts';
import { useBills } from '../hooks/useBills.ts';
import { useToast } from '../hooks/useToast.ts';
import type { BillSummary } from '../types/bill.ts';
import { capitalize, formatAmount, formatShortDate } from '../utils/utils.ts';

type StatusFilter = 'all' | 'open' | 'settled';

// Decorativo — cada conta recebe um emoji fixo (derivado do id) só pra dar
// variedade visual na lista. Não representa nenhuma categoria real da conta.
const BILL_EMOJIS = ['🍕', '🥩', '🍝', '🍣', '☕', '🎬', '🍔', '🥗', '🍰', '🍹'];

function billEmoji(id: string): string {
    let hash = 0;

    for (let i = 0; i < id.length; i += 1) {
        hash = (hash * 31 + id.charCodeAt(i)) >>> 0;
    }

    return BILL_EMOJIS[hash % BILL_EMOJIS.length];
}

function isBillSettled(bill: BillSummary): boolean {
    return bill.participants_count > 0 && bill.paid_count === bill.participants_count;
}

export default function BillsPage() {
    const { user } = useAuth();
    const { bills, isLoading, error, refetch } = useBills();
    const toast = useToast();

    const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
    const [search, setSearch] = useState('');

    const firstName = (user?.name ?? user?.email ?? '').trim().split(' ')[0] || 'por aqui';

    const todayLabel = useMemo(
        () =>
            capitalize(
                new Intl.DateTimeFormat('pt-BR', {
                    weekday: 'long',
                    day: 'numeric',
                    month: 'long',
                }).format(new Date())
            ),
        []
    );

    // KPIs calculados a partir do que a API já devolve em /bills (sem
    // endpoint de estatísticas próprio). Como o resumo de cada conta não
    // traz o valor exato por pessoa, aproximamos o quanto já foi pago e o
    // quanto falta assumindo divisão igual entre participantes — é a mesma
    // conta que a tela de conta individual mostra quando a divisão é igual,
    // e uma estimativa razoável quando não é.
    const stats = useMemo(() => {
        let outstanding = 0;
        let received = 0;
        let unpaidPeople = 0;
        let openBillsCount = 0;
        let monthTotal = 0;
        let monthCount = 0;

        const now = new Date();

        for (const bill of bills) {
            const total = Number(bill.total_amount) || 0;
            const settled = isBillSettled(bill);

            if (!settled) {
                openBillsCount += 1;
                unpaidPeople += bill.participants_count - bill.paid_count;

                if (bill.participants_count > 0) {
                    const paidShare = total * (bill.paid_count / bill.participants_count);
                    received += paidShare;
                    outstanding += total - paidShare;
                }
            }

            if (bill.created_at) {
                const createdAt = new Date(bill.created_at);

                if (
                    !isNaN(createdAt.getTime()) &&
                    createdAt.getFullYear() === now.getFullYear() &&
                    createdAt.getMonth() === now.getMonth()
                ) {
                    monthTotal += total;
                    monthCount += 1;
                }
            }
        }

        const progress =
            outstanding + received > 0 ? Math.round((received / (outstanding + received)) * 100) : 0;

        return { outstanding, received, unpaidPeople, openBillsCount, monthTotal, monthCount, progress };
    }, [bills]);

    const filtered = useMemo(() => {
        const byStatus = bills.filter((bill) => {
            if (statusFilter === 'open') return !isBillSettled(bill);
            if (statusFilter === 'settled') return isBillSettled(bill);
            return true;
        });

        const query = search.trim().toLowerCase();

        if (!query) {
            return byStatus;
        }

        return byStatus.filter((bill) => bill.title.toLowerCase().includes(query));
    }, [bills, statusFilter, search]);

    function handleComingSoon(label: string) {
        toast.info(`${label} chega em breve por aqui.`);
    }

    return (
        <div className="page home-page">
            <div className="home-header">
                <div>
                    <p className="home-header-date">{todayLabel}</p>
                    <h1 className="home-header-title">Oi, {firstName} 👋</h1>
                </div>

                <div className="home-header-actions">
                    <div className="home-search">
                        <SearchIcon size={19} />
                        <input
                            type="search"
                            placeholder="Buscar conta"
                            value={search}
                            onChange={(event) => setSearch(event.target.value)}
                            aria-label="Buscar conta pelo título"
                        />
                    </div>

                    <button
                        type="button"
                        className="home-bell"
                        onClick={() => handleComingSoon('As notificações')}
                        aria-label="Notificações"
                    >
                        <BellIcon size={21} />
                    </button>

                    <Link to="/bills/new" className="hide-on-mobile">
                        <Button size="lg">Nova conta</Button>
                    </Link>
                </div>
            </div>

            {isLoading && <Loading label="Carregando suas contas..." />}

            {!isLoading && error && (
                <div className="alert alert-error">
                    <p>{error}</p>

                    <Button size="sm" variant="secondary" onClick={refetch}>
                        Tentar novamente
                    </Button>
                </div>
            )}

            {!isLoading && !error && bills.length === 0 && (
                <div className="empty-state">
                    <h2>Bora dividir a primeira conta?</h2>

                    <p>
                        Fotografe a nota com o botão de escanear ou cadastre as pessoas e os
                        itens na mão. Depois é só ir marcando quem já acertou.
                    </p>

                    <Link to="/bills/new">
                        <Button>Criar conta</Button>
                    </Link>
                </div>
            )}

            {!isLoading && !error && bills.length > 0 && (
                <>
                    <div className="home-kpis">
                        <div className="home-kpi-hero">
                            <span className="home-kpi-hero-label">A receber</span>
                            <strong className="home-kpi-hero-value tn">
                                R$ {formatAmount(stats.outstanding)}
                            </strong>

                            <div className="home-progress">
                                <i style={{ width: `${stats.progress}%` }} />
                            </div>

                            <p className="home-kpi-hero-caption">
                                {stats.unpaidPeople} pessoa{stats.unpaidPeople === 1 ? '' : 's'} ainda
                                não pagou · {stats.openBillsCount} conta
                                {stats.openBillsCount === 1 ? '' : 's'} em aberto
                            </p>
                        </div>

                        <div className="home-kpi-card">
                            <div className="home-kpi-card-label">
                                <CheckCircleIcon size={16} />
                                Já recebido
                            </div>

                            <strong className="home-kpi-card-value tn">
                                R$ {formatAmount(stats.received)}
                            </strong>

                            <p className="home-kpi-card-caption">nas contas em aberto</p>
                        </div>

                        <div className="home-kpi-card">
                            <div className="home-kpi-card-label home-kpi-card-label-muted">
                                <ClockIcon size={16} />
                                Contas este mês
                            </div>

                            <strong className="home-kpi-card-value tn">{stats.monthCount}</strong>

                            <p className="home-kpi-card-caption">
                                R$ {formatAmount(stats.monthTotal)} no total
                            </p>
                        </div>
                    </div>

                    <div className="home-list-head">
                        <h2 className="home-list-title">Suas contas</h2>

                        <div className="home-chips">
                            <Chip active={statusFilter === 'all'} onClick={() => setStatusFilter('all')}>
                                Todas
                            </Chip>

                            <Chip active={statusFilter === 'open'} onClick={() => setStatusFilter('open')}>
                                Em aberto
                            </Chip>

                            <Chip
                                active={statusFilter === 'settled'}
                                onClick={() => setStatusFilter('settled')}
                            >
                                Pagas
                            </Chip>
                        </div>
                    </div>

                    {filtered.length === 0 ? (
                        <div className="empty-state empty-state-compact">
                            <p>
                                {search.trim()
                                    ? 'Nenhuma conta encontrada com esse termo.'
                                    : statusFilter === 'open'
                                      ? 'Nenhuma conta pendente. Tudo certo por aqui! 🎉'
                                      : statusFilter === 'settled'
                                        ? 'Nenhuma conta quitada ainda.'
                                        : 'Nenhuma conta por aqui ainda.'}
                            </p>
                        </div>
                    ) : (
                        <>
                            {/* Desktop: tabela — ver docs/system-design/html/w02-inicio.html */}
                            <div className="home-table hide-on-mobile-table">
                                <div className="home-table-head">
                                    <span>Conta</span>
                                    <span>Pessoas</span>
                                    <span>Total</span>
                                    <span>Status</span>
                                    <span />
                                </div>

                                {filtered.map((bill) => {
                                    const settled = isBillSettled(bill);

                                    return (
                                        <Link className="home-table-row" to={`/bills/${bill.id}`} key={bill.id}>
                                            <div className="home-table-bill">
                                                <span className="home-table-tile" aria-hidden="true">
                                                    {billEmoji(bill.id)}
                                                </span>

                                                <div>
                                                    <div className="home-table-bill-title">{bill.title}</div>
                                                    <div className="home-table-bill-date">
                                                        {formatShortDate(bill.created_at)}
                                                    </div>
                                                </div>
                                            </div>

                                            <span className="home-table-people">
                                                {bill.participants_count} pessoa
                                                {bill.participants_count === 1 ? '' : 's'}
                                            </span>

                                            <span className="home-table-total tn">
                                                R$ {formatAmount(bill.total_amount)}
                                            </span>

                                            <span>
                                                {settled ? (
                                                    <Pill tone="green" icon={<CheckCircleIcon size={13} />}>
                                                        Tudo pago
                                                    </Pill>
                                                ) : (
                                                    <Pill tone="orange">
                                                        {bill.paid_count} de {bill.participants_count} pagaram
                                                    </Pill>
                                                )}
                                            </span>

                                            <ChevronRightIcon size={18} className="home-table-chevron" />
                                        </Link>
                                    );
                                })}
                            </div>

                            {/* Mobile: cards */}
                            <div className="bill-grid hide-on-desktop-table">
                                {filtered.map((bill) => {
                                    const settled = isBillSettled(bill);

                                    const progress =
                                        bill.participants_count > 0
                                            ? (bill.paid_count / bill.participants_count) * 100
                                            : 0;

                                    return (
                                        <Link className="bill-tile" to={`/bills/${bill.id}`} key={bill.id}>
                                            <div className="bill-tile-header">
                                                <div className="row g10">
                                                    <span className="home-table-tile" aria-hidden="true">
                                                        {billEmoji(bill.id)}
                                                    </span>
                                                    <h3>{bill.title}</h3>
                                                </div>

                                                {settled ? (
                                                    <Pill tone="green">Quitada</Pill>
                                                ) : (
                                                    <Pill tone="orange">Em aberto</Pill>
                                                )}
                                            </div>

                                            <p className="bill-tile-total tn">
                                                R$ {formatAmount(bill.total_amount)}
                                            </p>

                                            <div className="progress">
                                                <div
                                                    className="progress-bar"
                                                    style={{ width: `${progress}%` }}
                                                />
                                            </div>

                                            <div className="bill-tile-footer">
                                                <span>
                                                    {bill.paid_count}/{bill.participants_count} acertaram
                                                </span>

                                                <span>{formatShortDate(bill.created_at)}</span>
                                            </div>
                                        </Link>
                                    );
                                })}
                            </div>
                        </>
                    )}
                </>
            )}
        </div>
    );
}
