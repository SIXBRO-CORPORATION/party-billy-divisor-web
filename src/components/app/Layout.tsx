import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth.ts';
import { useToast } from '../../hooks/useToast.ts';
import { Avatar } from '../ui/Avatar.tsx';
import {
    HelpCircleIcon,
    HomeIcon,
    ListIcon,
    LogoutIcon,
    PlusIcon,
    ReceiptScanIcon,
    UserCircleIcon,
} from '../ui/icons.tsx';
import { Logo } from '../ui/Logo.tsx';
import { QuickScanFab } from './QuickScanFab.tsx';

export function Layout() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const toast = useToast();

    function handleLogout() {
        logout();
        navigate('/login', { replace: true });
    }

    function handleComingSoon(label: string) {
        toast.info(`${label} chega em breve por aqui.`);
    }

    return (
        <div className="app-shell">
            {/* Navegação principal no desktop (ver docs/system-design/html/w02-inicio.html) */}
            <aside className="app-sidebar">
                <Link className="app-sidebar-brand" to="/">
                    <Logo size={32} />
                </Link>

                <Link to="/bills/new" className="btn btn-primary btn-md app-sidebar-cta">
                    <PlusIcon size={20} />
                    Nova conta
                </Link>

                <nav className="app-sidebar-nav">
                    <NavLink
                        to="/"
                        end
                        className={({ isActive }) =>
                            isActive ? 'app-sidebar-nav-item is-active' : 'app-sidebar-nav-item'
                        }
                    >
                        <ReceiptScanIcon size={21} />
                        Contas
                    </NavLink>

                    <button
                        type="button"
                        className="app-sidebar-nav-item"
                        onClick={() => handleComingSoon('O perfil e recebimento')}
                    >
                        <UserCircleIcon size={21} />
                        Perfil e recebimento
                    </button>

                    <button
                        type="button"
                        className="app-sidebar-nav-item"
                        onClick={() => handleComingSoon('A ajuda')}
                    >
                        <HelpCircleIcon size={21} />
                        Ajuda
                    </button>
                </nav>

                <div className="app-sidebar-spacer" />

                <div className="app-sidebar-user">
                    <Avatar label={user?.name ?? user?.email ?? '?'} size="sm" />

                    <div className="app-sidebar-user-info">
                        <span className="app-sidebar-user-name">{user?.name ?? user?.email}</span>
                        {user?.name && <span className="app-sidebar-user-email">{user.email}</span>}
                    </div>

                    <button
                        type="button"
                        className="app-sidebar-logout"
                        onClick={handleLogout}
                        aria-label="Sair"
                        title="Sair"
                    >
                        <LogoutIcon size={18} />
                    </button>
                </div>
            </aside>

            <div className="app-content">
                {/* Topo compacto — só no mobile, a sidebar acima cobre o desktop */}
                <header className="app-topbar">
                    <Link className="brand" to="/">
                        <Logo size={28} />
                    </Link>
                </header>

                <main className="app-main">
                    <Outlet />
                </main>

                <QuickScanFab />

                <nav className="app-bottom-nav" aria-label="Navegação principal">
                    <NavLink to="/" end className="app-bottom-nav-item">
                        <HomeIcon size={22} />
                        <span>Início</span>
                    </NavLink>

                    <NavLink to="/bills/new" className="app-bottom-nav-item">
                        <ListIcon size={22} />
                        <span>Nova conta</span>
                    </NavLink>

                    <button type="button" className="app-bottom-nav-item" onClick={handleLogout}>
                        <LogoutIcon size={22} />
                        <span>Sair</span>
                    </button>
                </nav>
            </div>
        </div>
    );
}
