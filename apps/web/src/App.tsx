import { FormEvent, useEffect, useState } from 'react';
import { checkSession, loginWithPin, TOKEN_KEY } from './api';

type AppState = 'checking' | 'login' | 'protected';

export default function App() {
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const [state, setState] = useState<AppState>('checking');

  useEffect(() => {
    const token = localStorage.getItem(TOKEN_KEY);

    if (!token) {
      setState('login');
      return;
    }

    void checkSession(token)
      .then((ok) => {
        if (ok) {
          setState('protected');
          return;
        }

        localStorage.removeItem(TOKEN_KEY);
        setState('login');
      })
      .catch(() => {
        localStorage.removeItem(TOKEN_KEY);
        setState('login');
      });
  }, []);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setError('');

    try {
      const token = await loginWithPin(pin);
      localStorage.setItem(TOKEN_KEY, token);
      setPin('');
      setState('protected');
    } catch (submitError) {
      const message = submitError instanceof Error ? submitError.message : 'Nao foi possivel acessar o servidor.';
      setError(message);
    }
  }

  function logout() {
    localStorage.removeItem(TOKEN_KEY);
    setState('login');
  }

  if (state === 'checking') {
    return <main className="container">Carregando...</main>;
  }

  if (state === 'protected') {
    return (
      <main className="container">
        <h1>Hello World</h1>
        <button onClick={logout} type="button">
          Sair
        </button>
      </main>
    );
  }

  return (
    <main className="container">
      <h1>Financeiro Pessoal</h1>
      <p>Acesso por PIN</p>
      <form onSubmit={onSubmit}>
        <label htmlFor="pin">PIN</label>
        <input id="pin" value={pin} onChange={(event) => setPin(event.target.value)} type="password" />
        <button type="submit">Entrar</button>
      </form>
      <p role="alert">{error}</p>
    </main>
  );
}
