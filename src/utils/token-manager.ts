import Cookies from 'js-cookie';

const ACCESS_TOKEN_KEY = 'billy_access_token';
const DEFAULT_EXPIRES_IN_DAYS = 7;

function resolveExpiration(expiresAt?: string | null): Date | number {
    if (!expiresAt) {
        return DEFAULT_EXPIRES_IN_DAYS;
    }

    const parsed = new Date(expiresAt);

    if (isNaN(parsed.getTime()) || parsed.getTime() <= Date.now()) {
        return DEFAULT_EXPIRES_IN_DAYS;
    }

    return parsed;
}

export const tokenManager = {
    getAccessToken: (): string | undefined => {
        return Cookies.get(ACCESS_TOKEN_KEY);
    },

    setToken: (accessToken: string, expiresAt?: string | null, remember: boolean = true): void => {
        const baseOptions = {
            sameSite: 'lax' as const,
            secure: window.location.protocol === 'https:',
        };

        if (!remember) {
            Cookies.set(ACCESS_TOKEN_KEY, accessToken, baseOptions);
            return;
        }

        Cookies.set(ACCESS_TOKEN_KEY, accessToken, {
            ...baseOptions,
            expires: resolveExpiration(expiresAt),
        });
    },

    clearTokens: (): void => {
        Cookies.remove(ACCESS_TOKEN_KEY);
    },

    hasTokens: (): boolean => {
        return !!tokenManager.getAccessToken();
    },
};
