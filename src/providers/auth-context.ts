import { createContext } from 'react';
import type { LoginRequest, RegisterRequest } from '../types/auth.ts';
import type { User } from '../types/user.ts';

export interface AuthContextData {
    user: User | null;
    isLoading: boolean;
    isAuthenticated: boolean;
    login: (credentials: LoginRequest, options?: { remember?: boolean }) => Promise<void>;
    register: (payload: RegisterRequest) => Promise<void>;
    logout: () => void;
    refetch: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextData | null>(null);
