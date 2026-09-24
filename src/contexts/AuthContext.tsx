import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { User } from '@/api/types';
import * as authApi from '@/api/auth';
import { saveSession, loadSession, clearSession } from '@/utils/storage';
import { ApiError } from '@/api/client';

type AuthContextValue = {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (name: string, email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const { token, user: storedUser } = await loadSession();
        if (token && storedUser) {
          setUser(storedUser);
          // valida/atualiza os dados do usuário com a API
          try {
            const me = await authApi.getMe();
            setUser(me);
          } catch {
            // se o token expirou, o client já limpa a sessão
          }
        }
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    const response = await authApi.signIn({ email, password });
    await saveSession(response.token, response.user);
    setUser(response.user);
  }, []);

  const signUp = useCallback(async (name: string, email: string, password: string) => {
    const response = await authApi.signUp({ name, email, password });
    await saveSession(response.token, response.user);
    setUser(response.user);
  }, []);

  const signOut = useCallback(async () => {
    await clearSession();
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, isLoading, isAuthenticated: !!user, signIn, signUp, signOut }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  return ctx;
}

export function getErrorMessage(error: unknown): string {
  if (error instanceof ApiError) return error.message;
  if (error instanceof Error) return error.message;
  return 'Ocorreu um erro inesperado.';
}
