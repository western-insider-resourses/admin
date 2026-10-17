import { beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import AuthGuard from '@/components/AuthGuard';
import { checkSession } from '@/lib/auth';

const replace = vi.fn();
vi.mock('next/navigation', () => ({ useRouter: () => ({ replace }) }));
vi.mock('@/lib/auth', () => ({ checkSession: vi.fn() }));
const session = vi.mocked(checkSession);
beforeEach(() => { localStorage.clear(); replace.mockClear(); session.mockReset(); });

describe('<AuthGuard>', () => {
  it('redirects to /login when the API has no session cookie', async () => {
    session.mockResolvedValue(false);
    render(<AuthGuard><p>secret</p></AuthGuard>);
    await waitFor(() => expect(replace).toHaveBeenCalledWith('/login'));
    expect(screen.queryByText('secret')).not.toBeInTheDocument();
  });
  it('renders children when the API confirms the cookie session', async () => {
    session.mockResolvedValue(true);
    render(<AuthGuard><p>secret</p></AuthGuard>);
    expect(await screen.findByText('secret')).toBeInTheDocument();
    expect(replace).not.toHaveBeenCalled();
  });
});
