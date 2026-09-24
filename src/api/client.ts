import { loadSession, clearSession } from '@/utils/storage';

// Ambiente de testes/alunos da API (ver documentação do desafio).
// Pode ser trocado para a URL da sua própria instância/deploy.
export const API_BASE_URL = 'https://expense-split-api-test.onrender.com/api/v1';

export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

type RequestOptions = {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  body?: unknown;
  auth?: boolean;
};

export async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { method = 'GET', body, auth = true } = options;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'Accept-Language': 'pt-BR',
  };

  if (auth) {
    const { token } = await loadSession();
    if (token) headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  if (response.status === 401 && auth) {
    // token expirado/ inválido — limpa sessão para forçar novo login
    await clearSession();
  }

  const text = await response.text();
  const data = text ? JSON.parse(text) : null;

  if (!response.ok) {
    const message = data?.reason || data?.error || data?.message || 'Ocorreu um erro. Tente novamente.';
    throw new ApiError(message, response.status);
  }

  return data as T;
}
