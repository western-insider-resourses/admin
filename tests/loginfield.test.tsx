import { beforeEach, describe, expect, it, vi } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import LoginField from '@/app/login/components/loginfield';
import { useLogin } from '@/hooks/api/useAuth';
import { renderWithQueryClient } from './render';

const replace = vi.fn();
vi.mock('next/navigation', () => ({ useRouter: () => ({ replace }) }));
const { mutate } = vi.hoisted(() => ({
  mutate: vi.fn((...args: unknown[]) => {
    const options = args[1] as { onSuccess?: () => void } | undefined;
    options?.onSuccess?.();
  }),
}));
vi.mock('@/hooks/api/useAuth', () => ({
  clearLegacyToken: vi.fn(),
  useLogin: vi.fn(() => ({ mutate, isPending: false, error: null })),
}));

beforeEach(() => { vi.clearAllMocks(); });

describe('<LoginField>', () => {
  it('can reveal and mask the password', async () => {
    renderWithQueryClient(<LoginField />);
    const password = screen.getByLabelText('Password');
    expect(password).toHaveAttribute('type', 'password');
    await userEvent.click(screen.getByRole('button', { name: 'Show password' }));
    expect(password).toHaveAttribute('type', 'text');
    await userEvent.click(screen.getByRole('button', { name: 'Hide password' }));
    expect(password).toHaveAttribute('type', 'password');
  });

  it('signs in and goes to the dashboard', async () => {
    renderWithQueryClient(<LoginField />);
    await userEvent.type(screen.getByLabelText('Email'), 'a@b.co');
    await userEvent.type(screen.getByLabelText('Password'), 'secret123');
    await userEvent.click(screen.getByRole('button', { name: 'Sign in' }));
    await waitFor(() => expect(replace).toHaveBeenCalledWith('/'));
    expect(mutate).toHaveBeenCalledWith(
      { email: 'a@b.co', password: 'secret123' },
      expect.objectContaining({ onSuccess: expect.any(Function) }),
    );
  });

  it('shows errors and links to signup', async () => {
    vi.mocked(useLogin).mockReturnValue({
      mutate: vi.fn(),
      isPending: false,
      error: new Error('Email or password is incorrect.'),
    } as never);
    renderWithQueryClient(<LoginField />);
    expect(screen.getByText('Western Insider Resources')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Sign up' })).toHaveAttribute('href', '/signup');
    await userEvent.type(screen.getByLabelText('Email'), 'a@b.co');
    await userEvent.type(screen.getByLabelText('Password'), 'x');
    await userEvent.click(screen.getByRole('button', { name: 'Sign in' }));
    expect(await screen.findByRole('alert')).toHaveTextContent('Email or password is incorrect.');
    expect(replace).not.toHaveBeenCalled();
  });
});
