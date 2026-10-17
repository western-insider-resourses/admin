import { beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { DEFAULT_NICHES, missingNiches } from '@/lib/niches';
import Niches from '@/app/(dashboard)/niches/page';
import { admin } from '@/lib/client';

vi.mock('@/lib/client', () => ({ admin: vi.fn() }));
const api = vi.mocked(admin);

describe('missingNiches', () => {
  it('lists default niches that do not exist yet, ignoring case', () => {
    expect(DEFAULT_NICHES).toEqual(['Business', 'Career', 'Technology', 'Investment', 'Finance']);
    expect(missingNiches([{ name: 'business' }, { name: ' Career ' }])).toEqual(['Technology', 'Investment', 'Finance']);
    expect(missingNiches(DEFAULT_NICHES.map((name) => ({ name })))).toEqual([]);
  });
});

describe('Niches admin page', () => {
  const rows = [{ id: 1, name: 'Business', slug: 'business', position: 0, posts: 3 }];
  beforeEach(() => {
    api.mockReset();
    api.mockImplementation(async (path: string, opts?: { method?: string }) => (path === '/categories' && !opts?.method ? rows : { ok: true }) as never);
  });

  it('lists niches with story counts', async () => {
    render(<Niches />);
    expect(await screen.findByText('Business')).toBeInTheDocument();
    expect(screen.getByText('(3 stories)')).toBeInTheDocument();
  });

  it('adds a niche', async () => {
    render(<Niches />);
    await screen.findByText('Business');
    await userEvent.type(screen.getByLabelText('Niche name'), 'Health');
    await userEvent.click(screen.getByRole('button', { name: 'Add' }));
    await waitFor(() => expect(api).toHaveBeenCalledWith('/categories', { method: 'POST', body: { name: 'Health' } }));
  });

  it('offers to add the missing default niches', async () => {
    render(<Niches />);
    expect(await screen.findByText(/Missing default niches: Career, Technology, Investment, Finance/)).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: 'Add them' }));
    await waitFor(() => expect(api).toHaveBeenCalledWith('/categories', { method: 'POST', body: { name: 'Finance' } }));
    for (const name of ['Career', 'Technology', 'Investment']) {
      expect(api).toHaveBeenCalledWith('/categories', { method: 'POST', body: { name } });
    }
  });

  it('shows API errors', async () => {
    api.mockImplementation(async (_p: string, opts?: { method?: string }) => { if (opts?.method) throw new Error('That category already exists.'); return rows as never; });
    render(<Niches />);
    await screen.findByText('Business');
    await userEvent.type(screen.getByLabelText('Niche name'), 'Business');
    await userEvent.click(screen.getByRole('button', { name: 'Add' }));
    expect(await screen.findByRole('alert')).toHaveTextContent('already exists');
  });
});
