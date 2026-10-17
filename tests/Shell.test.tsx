import { beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Shell, { isActive, NAV } from '@/components/Shell';
import { logout } from '@/lib/auth';

let path = '/niches';
const replace = vi.fn();
vi.mock('next/navigation', () => ({ usePathname: () => path, useRouter: () => ({ replace }) }));
vi.mock('@/lib/auth', () => ({ logout: vi.fn(async () => {}) }));
beforeEach(() => { localStorage.clear(); replace.mockClear(); vi.mocked(logout).mockClear(); });

describe('<Shell>', () => {
  it('has a Niches link (and no old "Categories" label)', () => {
    render(<Shell>content</Shell>);
    expect(screen.getByText('Western Insider Resources')).toBeInTheDocument();
    expect(NAV.map(([, l]) => l)).toContain('Niches');
    expect(screen.getByRole('link', { name: 'Niches' })).toHaveAttribute('href', '/niches');
    expect(screen.queryByRole('link', { name: 'Categories' })).not.toBeInTheDocument();
  });
  it('marks the current page', () => {
    render(<Shell>content</Shell>);
    expect(screen.getByRole('link', { name: 'Niches' })).toHaveAttribute('aria-current', 'page');
    expect(screen.getByRole('link', { name: 'Dashboard' })).not.toHaveAttribute('aria-current');
  });
  it('signs out by clearing the cookie and goes to /login', async () => {
    render(<Shell>content</Shell>);
    await userEvent.click(screen.getByRole('button', { name: 'Sign out' }));
    expect(logout).toHaveBeenCalled();
    await waitFor(() => expect(replace).toHaveBeenCalledWith('/login'));
  });
  it('opens the public site in a new tab', () => {
    render(<Shell>content</Shell>);
    expect(screen.getByRole('link', { name: 'View site' })).toHaveAttribute('target', '_blank');
  });
});

describe('isActive', () => {
  it('matches exactly for the dashboard and by prefix elsewhere', () => {
    expect(isActive('/', '/')).toBe(true);
    expect(isActive('/', '/posts')).toBe(false);
    expect(isActive('/posts', '/posts/new')).toBe(true);
  });
});
