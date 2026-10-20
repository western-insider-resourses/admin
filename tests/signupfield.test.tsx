import { beforeEach, describe, expect, it, vi } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SignupField from '@/app/signup/components/signupfield';
import { clearLegacyToken, useSignup, useSignupConfig } from '@/hooks/api/useAuth';
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
  useSignup: vi.fn(() => ({ mutate, isPending: false, error: null })),
  useSignupConfig: vi.fn(() => ({ data: { inviteCodeRequired: false }, error: null })),
}));

const signup = vi.mocked(useSignup);
const signupConfig = vi.mocked(useSignupConfig);
beforeEach(() => {
  vi.clearAllMocks();
  vi.mocked(clearLegacyToken).mockImplementation(() => {});
  signup.mockReturnValue({ mutate, isPending: false, error: null } as never);
  signupConfig.mockReturnValue({ data: { inviteCodeRequired: false }, error: null } as never);
});

describe('<SignupField>', () => {
  const fill = async (password: string, confirm: string) => {
    await userEvent.type(screen.getByLabelText('Email'), 'new@b.co');
    await userEvent.type(screen.getByLabelText(/^Password/), password);
    await userEvent.type(screen.getByLabelText('Confirm password'), confirm);
    await userEvent.click(screen.getByRole('button', { name: 'Create account' }));
  };

  it('can reveal the password and confirmation independently', async () => {
    renderWithQueryClient(<SignupField />);
    const password = screen.getByLabelText(/^Password/);
    const confirm = screen.getByLabelText('Confirm password');

    await userEvent.click(screen.getAllByRole('button', { name: 'Show password' })[0]!);
    expect(password).toHaveAttribute('type', 'text');
    expect(confirm).toHaveAttribute('type', 'password');

    await userEvent.click(screen.getByRole('button', { name: 'Show password' }));
    expect(confirm).toHaveAttribute('type', 'text');
  });

  it('creates the account and goes to the dashboard', async () => {
    renderWithQueryClient(<SignupField />);
    await fill('longenough1', 'longenough1');
    await waitFor(() => expect(replace).toHaveBeenCalledWith('/'));
    expect(mutate).toHaveBeenCalledWith(
      { email: 'new@b.co', password: 'longenough1' },
      expect.objectContaining({ onSuccess: expect.any(Function) }),
    );
  });

  it('rejects short passwords', async () => {
    renderWithQueryClient(<SignupField />);
    await fill('short', 'short');
    expect(await screen.findByRole('alert')).toHaveTextContent(/at least 8/);
    expect(mutate).not.toHaveBeenCalled();
  });

  it('rejects mismatched passwords', async () => {
    renderWithQueryClient(<SignupField />);
    await fill('longenough1', 'different123');
    expect(await screen.findByRole('alert')).toHaveTextContent(/do not match/);
    expect(mutate).not.toHaveBeenCalled();
  });

  it('requires and sends an invite code when configured', async () => {
    signupConfig.mockReturnValue({ data: { inviteCodeRequired: true }, error: null } as never);
    renderWithQueryClient(<SignupField />);
    await userEvent.type(await screen.findByLabelText(/Invite code/), 'letmein');
    await fill('longenough1', 'longenough1');
    expect(mutate).toHaveBeenCalledWith(
      { email: 'new@b.co', password: 'longenough1', inviteCode: 'letmein' },
      expect.objectContaining({ onSuccess: expect.any(Function) }),
    );
  });

  it('shows API errors and links to login', async () => {
    signup.mockReturnValue({
      mutate,
      isPending: false,
      error: new Error('An account with that email already exists.'),
    } as never);
    renderWithQueryClient(<SignupField />);
    expect(screen.getByRole('link', { name: 'Sign in' })).toHaveAttribute('href', '/login');
    await fill('longenough1', 'longenough1');
    expect(await screen.findByRole('alert')).toHaveTextContent(/already exists/);
  });
});
