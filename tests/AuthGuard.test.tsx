import { beforeEach, describe, expect, it, vi } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import AuthGuard from '@/components/AuthGuard';
import { useAuthSession } from '@/hooks/api/useAuth';
import { renderWithQueryClient } from './render';

const replace = vi.fn();
vi.mock('next/navigation', () => ({ useRouter: () => ({ replace }) }));
vi.mock('@/hooks/api/useAuth', () => ({ useAuthSession: vi.fn() }));
const session = vi.mocked(useAuthSession);
beforeEach(() => { localStorage.clear(); replace.mockClear(); session.mockReset(); });

describe('<AuthGuard>', () => {
  it('redirects to /login when the API has no session cookie', async () => {
    session.mockReturnValue({ data: null } as ReturnType<typeof useAuthSession>);
    renderWithQueryClient(<AuthGuard><p>secret</p></AuthGuard>);
    await waitFor(() => expect(replace).toHaveBeenCalledWith('/login'));
    expect(screen.queryByText('secret')).not.toBeInTheDocument();
  });
  it('renders children when the API confirms the cookie session', async () => {
    session.mockReturnValue({ data: { email: 'admin@example.com' } } as ReturnType<typeof useAuthSession>);
    renderWithQueryClient(<AuthGuard><p>secret</p></AuthGuard>);
    expect(await screen.findByText('secret')).toBeInTheDocument();
    expect(replace).not.toHaveBeenCalled();
  });
});
