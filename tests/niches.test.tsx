import { beforeEach, describe, expect, it, vi } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { DEFAULT_NICHES, missingNiches } from '@/lib/niches';
import Niches from '@/app/(dashboard)/niches/page';
import {
  useCategories,
  useCreateCategory,
  useDeleteCategory,
  useUpdateCategory,
} from '@/hooks/api/useCategories';
import { renderWithQueryClient } from './render';

vi.mock('@/hooks/api/useCategories', () => ({
  useCategories: vi.fn(),
  useCreateCategory: vi.fn(),
  useDeleteCategory: vi.fn(),
  useUpdateCategory: vi.fn(),
}));

const categoriesQuery = vi.mocked(useCategories);
const createCategoryMutation = vi.mocked(useCreateCategory);
const updateCategoryMutation = vi.mocked(useUpdateCategory);
const deleteCategoryMutation = vi.mocked(useDeleteCategory);

describe('missingNiches', () => {
  it('lists default niches that do not exist yet, ignoring case', () => {
    expect(DEFAULT_NICHES).toEqual(['Business', 'Career', 'Technology', 'Investment', 'Finance']);
    expect(missingNiches([{ name: 'business' }, { name: ' Career ' }])).toEqual(['Technology', 'Investment', 'Finance']);
    expect(missingNiches(DEFAULT_NICHES.map((name) => ({ name })))).toEqual([]);
  });
});

describe('Niches admin page', () => {
  const rows = [{ id: 1, name: 'Business', slug: 'business', position: 0, posts: 3 }];
  const create = vi.fn();
  const update = vi.fn();
  const remove = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    categoriesQuery.mockReturnValue({ data: rows, error: null } as never);
    createCategoryMutation.mockReturnValue({ mutateAsync: create } as never);
    updateCategoryMutation.mockReturnValue({ mutateAsync: update } as never);
    deleteCategoryMutation.mockReturnValue({ mutateAsync: remove } as never);
  });

  it('lists niches with story counts', async () => {
    renderWithQueryClient(<Niches />);
    expect(await screen.findByText('Business')).toBeInTheDocument();
    expect(screen.getByText('(3 stories)')).toBeInTheDocument();
  });

  it('adds a niche', async () => {
    renderWithQueryClient(<Niches />);
    await screen.findByText('Business');
    await userEvent.type(screen.getByLabelText('Niche name'), 'Health');
    await userEvent.click(screen.getByRole('button', { name: 'Add' }));
    await waitFor(() => expect(create).toHaveBeenCalledWith({ name: 'Health' }));
  });

  it('offers to add the missing default niches', async () => {
    renderWithQueryClient(<Niches />);
    expect(await screen.findByText(/Missing default niches: Career, Technology, Investment, Finance/)).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: 'Add them' }));
    await waitFor(() => expect(create).toHaveBeenCalledWith({ name: 'Finance' }));
    for (const name of ['Career', 'Technology', 'Investment']) {
      expect(create).toHaveBeenCalledWith({ name });
    }
  });

  it('shows API errors', async () => {
    create.mockRejectedValue(new Error('That category already exists.'));
    renderWithQueryClient(<Niches />);
    await screen.findByText('Business');
    await userEvent.type(screen.getByLabelText('Niche name'), 'Business');
    await userEvent.click(screen.getByRole('button', { name: 'Add' }));
    expect(await screen.findByRole('alert')).toHaveTextContent('already exists');
  });
});
