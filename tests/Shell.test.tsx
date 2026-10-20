import { beforeEach, describe, expect, it, vi } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Shell, { isActive, NAV } from '@/components/Shell';
import { getProfileInitials, getProfileName } from '@/lib/profile';
import { useAuthSession, useLogout } from '@/hooks/api/useAuth';
import { renderWithQueryClient } from './render';

let path = '/niches';
const replace = vi.fn();
vi.mock('next/navigation', () => ({ usePathname: () => path, useRouter: () => ({ replace }) }));
const { mutate } = vi.hoisted(() => ({
  mutate: vi.fn((...args: unknown[]) => {
    const options = args[1] as { onSettled?: () => void } | undefined;
    options?.onSettled?.();
  }),
}));
vi.mock('@/hooks/api/useAuth', () => ({
  useAuthSession: vi.fn(() => ({ data: { email: 'jane.doe@example.com' } })),
  useLogout: vi.fn(() => ({ mutate, isPending: false })),
}));
beforeEach(() => {
  localStorage.clear();
  replace.mockClear();
  mutate.mockClear();
  vi.mocked(useAuthSession).mockReturnValue({ data: { email: 'jane.doe@example.com' } } as ReturnType<typeof useAuthSession>);
});

describe('<Shell>', () => {
  it('has a Niches link (and no old "Categories" label)', () => {
    renderWithQueryClient(<Shell>content</Shell>);
    expect(screen.getByText('Western Insider Resources')).toBeInTheDocument();
    expect(NAV.map(([, l]) => l)).toContain('Niches');
    expect(screen.getByRole('link', { name: 'Niches' })).toHaveAttribute('href', '/niches');
    expect(screen.queryByRole('link', { name: 'Categories' })).not.toBeInTheDocument();
  });
  it('marks the current page', () => {
    renderWithQueryClient(<Shell>content</Shell>);
    expect(screen.getByRole('link', { name: 'Niches' })).toHaveAttribute('aria-current', 'page');
    expect(screen.getByRole('link', { name: 'Dashboard' })).not.toHaveAttribute('aria-current');
  });
  it('shows a profile menu with account links and signs out', async () => {
    renderWithQueryClient(<Shell>content</Shell>);
    await userEvent.click(screen.getByRole('button', { name: 'Open profile menu for jane.doe@example.com' }));
    expect(screen.getAllByText('jane.doe@example.com')).toHaveLength(2);
    expect(screen.getByRole('menuitem', { name: 'Profile' })).toHaveAttribute('href', '/profile');
    expect(screen.getByRole('menuitem', { name: 'Settings' })).toHaveAttribute('href', '/settings');
    await userEvent.click(screen.getByRole('menuitem', { name: 'Log out' }));
    expect(mutate).toHaveBeenCalled();
    await waitFor(() => expect(replace).toHaveBeenCalledWith('/login'));
  });
  it('closes the profile menu when Escape is pressed', async () => {
    renderWithQueryClient(<Shell>content</Shell>);
    await userEvent.click(screen.getByRole('button', { name: 'Open profile menu for jane.doe@example.com' }));
    expect(screen.getByRole('menu')).toBeInTheDocument();
    await userEvent.keyboard('{Escape}');
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
  });
  it('opens the public site in a new tab', () => {
    renderWithQueryClient(<Shell>content</Shell>);
    expect(screen.getByRole('link', { name: 'View site' })).toHaveAttribute('target', '_blank');
  });
});

describe('getProfileInitials', () => {
  it('creates initials from the account name and handles missing names', () => {
    expect(getProfileInitials('jane.doe@example.com')).toBe('JD');
    expect(getProfileInitials('admin@example.com')).toBe('AD');
    expect(getProfileInitials()).toBe('AD');
    expect(getProfileName('jane.doe@example.com')).toBe('Jane Doe');
    expect(getProfileName()).toBe('Admin');
  });
});

describe('isActive', () => {
  it('matches exactly for the dashboard and by prefix elsewhere', () => {
    expect(isActive('/', '/')).toBe(true);
    expect(isActive('/', '/posts')).toBe(false);
    expect(isActive('/posts', '/posts/new')).toBe(true);
  });
});
