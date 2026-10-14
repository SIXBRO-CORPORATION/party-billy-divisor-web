import { useCallback, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { AuthContext } from './auth-context.ts';
import { authService } from '../services/auth.service.ts';
import { setUnauthorizedCallback } from '../utils/http-client.ts';
import type { LoginRequest, RegisterRequest } from '../types/auth.ts';
import type { User } from '../types/user.ts';

export function AuthProvider({ children }: { children: ReactNode }) {
    const hadTokenOnBoot = authService.isAuthenticated();

    const [user, setUser] = useState<User | null>(null);
    const [isAuthenticated, setIsAuthenticated] = useState(hadTokenOnBoot);
    const [isLoading, setIsLoading] = useState(hadTokenOnBoot);

    const fetchUser = useCallback(async () => {
        if (!authService.isAuthenticated()) {
            setUser(null);
            setIsAuthenticated(false);
            setIsLoading(false);
            return;
        }

        try {
            const userData = await authService.getMe();

            setUser(userData);
            setIsAuthenticated(true);
        } catch {
            authService.logout();
            setUser(null);
            setIsAuthenticated(false);
        } finally {
            setIsLoading(false);
        }
    }, []);

    // Sessão vinda do cookie: valida o token antes de liberar as rotas.
    useEffect(() => {
        if (!hadTokenOnBoot) {
            return;
        }

        let cancelled = false;

        authService
            .getMe()
            .then((userData) => {
                if (!cancelled) {
                    setUser(userData);
                    setIsAuthenticated(true);
                }
            })
            .catch(() => {
                authService.logout();

                if (!cancelled) {
                    setUser(null);
                    setIsAuthenticated(false);
                }
            })
            .finally(() => {
                if (!cancelled) {
                    setIsLoading(false);
                }
            });

        return () => {
            cancelled = true;
        };
    }, [hadTokenOnBoot]);

    // Quando o http-client recebe 401, derruba a sessão do contexto também.
    useEffect(() => {
        setUnauthorizedCallback(() => {
            setUser(null);
            setIsAuthenticated(false);
        });
    }, []);

    const login = useCallback(async (credentials: LoginRequest, options?: { remember?: boolean }) => {
        const auth = await authService.login(credentials, options?.remember ?? true);

        setUser(auth.user);
        setIsAuthenticated(true);
        setIsLoading(false);
    }, []);

    const register = useCallback(async (payload: RegisterRequest) => {
        await authService.register(payload);

        const auth = await authService.login({
            email: payload.email,
            password: payload.password,
        });

        setUser(auth.user);
        setIsAuthenticated(true);
        setIsLoading(false);
    }, []);

    const logout = useCallback(() => {
        authService.logout();
        setUser(null);
        setIsAuthenticated(false);
    }, []);

    const refetch = useCallback(async () => {
        await fetchUser();
    }, [fetchUser]);

    return (
        <AuthContext.Provider
            value={{ user, isLoading, isAuthenticated, login, register, logout, refetch }}
        >
            {children}
        </AuthContext.Provider>
    );
}
