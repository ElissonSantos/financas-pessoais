const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000';

export const TOKEN_KEY = 'financeiro.token';

export async function loginWithPin(pin: string): Promise<string> {
  const response = await fetch(`${API_URL}/auth/pin`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ pin }),
  });

  if (!response.ok) {
    if (response.status === 401) {
      throw new Error('PIN incorreto.');
    }

    throw new Error('Nao foi possivel acessar o servidor.');
  }

  const data = (await response.json()) as { accessToken: string };
  return data.accessToken;
}

export async function checkSession(token: string): Promise<boolean> {
  const response = await fetch(`${API_URL}/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  return response.ok;
}
