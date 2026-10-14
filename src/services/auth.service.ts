import { httpClient } from '../utils/http-client.ts';
import { tokenManager } from '../utils/token-manager.ts';
import type { AuthResponse, LoginRequest, RegisterRequest } from '../types/auth.ts';
import type { User } from '../types/user.ts';

export const authService = {
    login: async (credentials: LoginRequest, remember: boolean = true): Promise<AuthResponse> => {
        const response = await httpClient.post<AuthResponse>(
            '/auth/login',
            credentials,
            { skipAuth: true, skipToast: true }
        );

        if (response.data) {
            tokenManager.setToken(response.data.access_token, response.data.expires_at, remember);
        }

        return response.data!;
    },

    register: async (payload: RegisterRequest): Promise<User> => {
        const response = await httpClient.post<User>('/auth/register', payload, {
            skipAuth: true,
            skipToast: true,
        });

        return response.data!;
    },

    getMe: async (): Promise<User> => {
        const response = await httpClient.get<User>('/auth/me');

        return response.data!;
    },

    logout: (): void => {
        tokenManager.clearTokens();
    },

    isAuthenticated: (): boolean => {
        return tokenManager.hasTokens();
    },
};
