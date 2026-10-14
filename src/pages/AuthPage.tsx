import { useMemo, useState } from 'react';
import type { FormEvent } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Avatar } from '../components/ui/Avatar.tsx';
import { Button } from '../components/ui/Button.tsx';
import { Checkbox } from '../components/ui/Checkbox.tsx';
import { Input } from '../components/ui/Input.tsx';
import { Logo } from '../components/ui/Logo.tsx';
import { SegmentedControl } from '../components/ui/SegmentedControl.tsx';
import {
    AppleLogo,
    CheckCircleIcon,
    EyeIcon,
    EyeOffIcon,
    GoogleLogo,
    LockIcon,
    MailIcon,
} from '../components/ui/icons.tsx';
import { useAuth } from '../hooks/useAuth.ts';
import { useToast } from '../hooks/useToast.ts';

type AuthMode = 'login' | 'register';

const RECEIPT_ITEMS = [
    { name: '1x Pizza grande', price: '78,00' },
    { name: '6x Chopp', price: '66,00' },
    { name: '1x Porção de batata', price: '42,00' },
    { name: '2x Caipirinha', price: '44,00' },
    { name: '1x Sobremesa', price: '36,00' },
];

export default function AuthPage() {
    const { login, register } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const toast = useToast();

    const mode: AuthMode = location.pathname.startsWith('/register') ? 'register' : 'login';

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [remember, setRemember] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const isRegister = mode === 'register';

    const copy = useMemo(
        () =>
            isRegister
                ? {
                      title: 'Crie sua conta',
                      subtitle: 'Guarde suas contas e acompanhe quem ainda está devendo.',
                      submitLabel: 'Criar conta',
                  }
                : {
                      title: 'Bem-vindo de volta',
                      subtitle: 'Entre pra ver suas contas e quem já pagou.',
                      submitLabel: 'Entrar',
                  },
        [isRegister]
    );

    function handleModeChange(nextMode: AuthMode) {
        navigate(nextMode === 'register' ? '/register' : '/login', { replace: true });
    }

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        if (isRegister && password.length < 8) {
            toast.error('A senha precisa ter no mínimo 8 caracteres');
            return;
        }

        setIsSubmitting(true);

        try {
            if (isRegister) {
                await register({ name: name.trim(), email: email.trim(), password });
                toast.success('Conta criada com sucesso!');
                navigate('/', { replace: true });
            } else {
                await login({ email: email.trim(), password }, { remember });
                const from = (location.state as { from?: string } | null)?.from ?? '/';
                navigate(from, { replace: true });
            }
        } catch (error) {
            const fallback = isRegister ? 'Não foi possível criar a conta' : 'Não foi possível entrar';
            toast.error(error instanceof Error ? error.message : fallback);
        } finally {
            setIsSubmitting(false);
        }
    }

    function handleComingSoon(label: string) {
        toast.info(`${label} chega em breve por aqui.`);
    }

    return (
        <div className="auth-page">
            <div className="auth-hero" aria-hidden="true">
                <span className="auth-hero-blob auth-hero-blob-a" />
                <span className="auth-hero-blob auth-hero-blob-b" />

                <div className="auth-hero-top">
                    <Logo size={46} plate />
                </div>

                <h1 className="auth-hero-title">
                    A conta chegou.
                    <br />
                    Quem pagou o quê?
                </h1>

                <p className="auth-hero-subtitle">
                    Tire foto da nota, marque quem consumiu o quê e mande o link de pagamento no
                    WhatsApp.
                </p>

                <div className="auth-hero-receipt">
                    <div className="auth-hero-receipt-head">
                        <span className="auth-hero-receipt-name">BAR DO ZÉ</span>
                        <span className="auth-hero-receipt-address">Rua das Flores, 120 · Centro</span>
                    </div>

                    <div className="auth-hero-receipt-items">
                        {RECEIPT_ITEMS.map((item) => (
                            <div className="auth-hero-receipt-item" key={item.name}>
                                <span>{item.name}</span>
                                <strong>{item.price}</strong>
                            </div>
                        ))}
                    </div>

                    <div className="auth-hero-receipt-total">
                        <span>TOTAL</span>
                        <strong>266,00</strong>
                    </div>
                </div>

                <div className="auth-hero-avatars">
                    {[0, 1, 2, 3].map((index) => (
                        <span className="auth-hero-avatar" key={index}>
                            <Avatar label={String.fromCharCode(65 + index)} index={index} size="lg" ring />
                            <span className="auth-hero-avatar-mark">?</span>
                        </span>
                    ))}
                </div>

                <div className="auth-hero-toast">
                    <span className="auth-hero-toast-icon">
                        <CheckCircleIcon size={16} />
                    </span>
                    Beto pagou R$ 70,50
                </div>
            </div>

            <div className="auth-panel">
                <div className="auth-form-wrap">
                    <Logo size={32} className="auth-form-logo" />

                    <h1 className="auth-title">{copy.title}</h1>
                    <p className="auth-subtitle">{copy.subtitle}</p>

                    <SegmentedControl
                        className="auth-segmented"
                        value={mode}
                        onChange={handleModeChange}
                        options={[
                            { value: 'login', label: 'Entrar' },
                            { value: 'register', label: 'Criar conta' },
                        ]}
                    />

                    <form className="stacked-form auth-form" onSubmit={handleSubmit}>
                        {isRegister && (
                            <Input
                                label="Nome"
                                value={name}
                                onChange={(event) => setName(event.target.value)}
                                placeholder="Seu nome"
                                autoComplete="name"
                                minLength={2}
                                required
                            />
                        )}

                        <Input
                            type="email"
                            label="E-mail"
                            value={email}
                            onChange={(event) => setEmail(event.target.value)}
                            placeholder="voce@email.com"
                            autoComplete="email"
                            leftIcon={<MailIcon size={20} />}
                            required
                        />

                        <Input
                            type={showPassword ? 'text' : 'password'}
                            label="Senha"
                            value={password}
                            onChange={(event) => setPassword(event.target.value)}
                            placeholder={isRegister ? 'Mínimo de 8 caracteres' : '••••••••'}
                            autoComplete={isRegister ? 'new-password' : 'current-password'}
                            minLength={isRegister ? 8 : undefined}
                            hint={isRegister ? 'Use ao menos 8 caracteres.' : undefined}
                            leftIcon={<LockIcon size={20} />}
                            rightSlot={
                                <button
                                    type="button"
                                    className="field-toggle"
                                    onClick={() => setShowPassword((current) => !current)}
                                    aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
                                >
                                    {showPassword ? <EyeOffIcon size={20} /> : <EyeIcon size={20} />}
                                </button>
                            }
                            required
                        />

                        {!isRegister && (
                            <div className="auth-form-row">
                                <Checkbox checked={remember} onChange={setRemember} label="Manter conectada" />

                                <button
                                    type="button"
                                    className="auth-link"
                                    onClick={() => handleComingSoon('A recuperação de senha')}
                                >
                                    Esqueci a senha
                                </button>
                            </div>
                        )}

                        <Button type="submit" size="lg" loading={isSubmitting}>
                            {copy.submitLabel}
                        </Button>
                    </form>

                    <div className="auth-divider">
                        <span />
                        <p>ou continue com</p>
                        <span />
                    </div>

                    <div className="auth-social">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => handleComingSoon('O login com Google')}
                        >
                            <span className="btn-icon">
                                <GoogleLogo />
                            </span>{' '}
                            Google
                        </Button>

                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => handleComingSoon('O login com Apple')}
                        >
                            <span className="btn-icon">
                                <AppleLogo />
                            </span>{' '}
                            Apple
                        </Button>
                    </div>

                    <p className="auth-footer">
                        {isRegister ? (
                            <>
                                Já tem conta? <Link to="/login">Entrar</Link>
                            </>
                        ) : (
                            <>
                                Ainda não tem conta? <Link to="/register">Criar agora</Link>
                            </>
                        )}
                    </p>
                </div>
            </div>
        </div>
    );
}
