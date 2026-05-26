import { cleanup, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import App from './App';

describe('App', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  afterEach(() => {
    cleanup();
  });

  it('shows pin screen initially', async () => {
    vi.stubGlobal('fetch', vi.fn());

    render(<App />);

    expect(await screen.findByText('Financeiro Pessoal')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Entrar' })).toBeInTheDocument();
  });

  it('shows error for invalid pin', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => ({ ok: false, status: 401, json: async () => ({}) })) as never,
    );

    render(<App />);

    await userEvent.type(screen.getByLabelText('PIN'), '9999');
    await userEvent.click(screen.getByRole('button', { name: 'Entrar' }));

    expect(await screen.findByRole('alert')).toHaveTextContent('PIN incorreto.');
  });

  it('shows hello world for valid pin', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => ({ ok: true, status: 201, json: async () => ({ accessToken: 'token' }) })) as never,
    );

    render(<App />);

    await userEvent.type(screen.getByLabelText('PIN'), '1234');
    await userEvent.click(screen.getByRole('button', { name: 'Entrar' }));

    expect(await screen.findByText('Hello World')).toBeInTheDocument();
  });

  it('keeps session after reload when token valid', async () => {
    localStorage.setItem('financeiro.token', 'token');
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => ({ ok: true, status: 200, json: async () => ({ authenticated: true }) })) as never,
    );

    render(<App />);

    expect(await screen.findByText('Hello World')).toBeInTheDocument();
  });

  it('logout returns to pin screen', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => ({ ok: true, status: 201, json: async () => ({ accessToken: 'token' }) })) as never,
    );

    render(<App />);

    await userEvent.type(screen.getByLabelText('PIN'), '1234');
    await userEvent.click(screen.getByRole('button', { name: 'Entrar' }));
    await screen.findByText('Hello World');

    await userEvent.click(screen.getByRole('button', { name: 'Sair' }));

    await waitFor(() => {
      expect(screen.getByText('Financeiro Pessoal')).toBeInTheDocument();
    });
    expect(localStorage.getItem('financeiro.token')).toBeNull();
  });
});
