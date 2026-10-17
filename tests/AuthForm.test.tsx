import { beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AuthForm from '@/components/AuthForm';
import * as auth from '@/lib/auth';

const replace = vi.fn();
vi.mock('next/navigation', () => ({ useRouter: () => ({ replace }) }));
vi.mock('@/lib/auth', () => ({
  clearLegacyToken: vi.fn(),
  login: vi.fn(),
  signup: vi.fn(),
  inviteCodeRequired: vi.fn(async () => false),
}));

const login = vi.mocked(auth.login);
const signup = vi.mocked(auth.signup);
const needsCode = vi.mocked(auth.inviteCodeRequired);
beforeEach(() => { vi.clearAllMocks(); needsCode.mockResolvedValue(false); });

describe('<AuthForm mode="login">', () => {
  it('signs in and goes to the dashboard', async () => {
    login.mockResolvedValue('T');
    render(<AuthForm mode="login" />);
    await userEvent.type(screen.getByLabelText('Email'), 'a@b.co');
    await userEvent.type(screen.getByLabelText('Password'), 'secret123');
    await userEvent.click(screen.getByRole('button', { name: 'Sign in' }));
    await waitFor(() => expect(replace).toHaveBeenCalledWith('/'));
    expect(login).toHaveBeenCalledWith('a@b.co', 'secret123');
  });
  it('shows the error and stays on the page', async () => {
    login.mockRejectedValue(new Error('Email or password is incorrect.'));
    render(<AuthForm mode="login" />);
    await userEvent.type(screen.getByLabelText('Email'), 'a@b.co');
    await userEvent.type(screen.getByLabelText('Password'), 'x');
    await userEvent.click(screen.getByRole('button', { name: 'Sign in' }));
    expect(await screen.findByRole('alert')).toHaveTextContent('Email or password is incorrect.');
    expect(replace).not.toHaveBeenCalled();
    expect(screen.getByRole('button', { name: 'Sign in' })).toBeEnabled();
  });
  it('links to sign up and has no confirm field', () => {
    render(<AuthForm mode="login" />);
    expect(screen.getByText('Western Insider Resources')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Sign up' })).toHaveAttribute('href', '/signup');
    expect(screen.queryByLabelText('Confirm password')).not.toBeInTheDocument();
  });
});

describe('<AuthForm mode="signup">', () => {
  const fill = async (pw: string, confirm: string) => {
    await userEvent.type(screen.getByLabelText('Email'), 'new@b.co');
    await userEvent.type(screen.getByLabelText(/^Password/), pw);
    await userEvent.type(screen.getByLabelText('Confirm password'), confirm);
    await userEvent.click(screen.getByRole('button', { name: 'Create account' }));
  };

  it('creates the account and goes to the dashboard', async () => {
    signup.mockResolvedValue('T');
    render(<AuthForm mode="signup" />);
    await fill('longenough1', 'longenough1');
    await waitFor(() => expect(replace).toHaveBeenCalledWith('/'));
    expect(signup).toHaveBeenCalledWith('new@b.co', 'longenough1', undefined);
  });
  it('rejects short passwords before calling the API', async () => {
    render(<AuthForm mode="signup" />);
    await fill('short', 'short');
    expect(await screen.findByRole('alert')).toHaveTextContent(/at least 8/);
    expect(signup).not.toHaveBeenCalled();
  });
  it('rejects mismatched passwords', async () => {
    render(<AuthForm mode="signup" />);
    await fill('longenough1', 'different123');
    expect(await screen.findByRole('alert')).toHaveTextContent(/do not match/);
    expect(signup).not.toHaveBeenCalled();
  });
  it('asks for an invite code when the server requires one and sends it', async () => {
    needsCode.mockResolvedValue(true);
    signup.mockResolvedValue('T');
    render(<AuthForm mode="signup" />);
    await userEvent.type(await screen.findByLabelText(/Invite code/), 'letmein');
    await fill('longenough1', 'longenough1');
    await waitFor(() => expect(signup).toHaveBeenCalledWith('new@b.co', 'longenough1', 'letmein'));
  });
  it('hides the invite code field when not required', async () => {
    render(<AuthForm mode="signup" />);
    await waitFor(() => expect(needsCode).toHaveBeenCalled());
    expect(screen.queryByLabelText(/Invite code/)).not.toBeInTheDocument();
  });
  it('shows server errors such as a duplicate email', async () => {
    signup.mockRejectedValue(new Error('An account with that email already exists.'));
    render(<AuthForm mode="signup" />);
    await fill('longenough1', 'longenough1');
    expect(await screen.findByRole('alert')).toHaveTextContent(/already exists/);
  });
});
