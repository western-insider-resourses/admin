import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import BarChart from '@/components/BarChart';
import RankedList from '@/components/RankedList';
import { Notice, SelectField, Stat, TextArea, TextField } from '@/components/ui';

describe('Field components', () => {
  it('wire labels to controls', () => {
    render(<><TextField label="Name" /><TextArea label="Bio" hint="(short)" /><SelectField label="Niche"><option>A</option></SelectField></>);
    expect(screen.getByLabelText('Name')).toBeInstanceOf(HTMLInputElement);
    expect(screen.getByLabelText(/Bio/)).toBeInstanceOf(HTMLTextAreaElement);
    expect(screen.getByLabelText('Niche')).toBeInstanceOf(HTMLSelectElement);
  });
});

describe('Notice / Stat', () => {
  it('Notice renders errors as alerts, successes as status, nothing otherwise', () => {
    const { rerender, container } = render(<Notice error="bad" />);
    expect(screen.getByRole('alert')).toHaveTextContent('bad');
    rerender(<Notice ok="saved" />);
    expect(screen.getByRole('status')).toHaveTextContent('saved');
    rerender(<Notice />);
    expect(container).toBeEmptyDOMElement();
  });
  it('Stat shows label, value and sub', () => {
    render(<Stat label="Views" value="1,200" sub="30 days" />);
    expect(screen.getByText('Views')).toBeInTheDocument();
    expect(screen.getByText('1,200')).toBeInTheDocument();
    expect(screen.getByText('30 days')).toBeInTheDocument();
  });
});

describe('RankedList', () => {
  it('shows rows with numbers, or an empty message', () => {
    const { rerender } = render(<RankedList title="Top" rows={[{ path: '/a', views: 1500 }]} label="path" value="views" />);
    expect(screen.getByText('/a')).toBeInTheDocument();
    expect(screen.getByText('1,500')).toBeInTheDocument();
    rerender(<RankedList title="Top" rows={[]} label="path" value="views" />);
    expect(screen.getByText('No data yet.')).toBeInTheDocument();
  });
  it('links rows when href is given', () => {
    render(<RankedList title="Top" rows={[{ title: 'Story', slug: 's', views: 2 }]} label="title" value="views" href={(r) => `/post/${r.slug}`} />);
    expect(screen.getByRole('link', { name: 'Story' })).toHaveAttribute('href', '/post/s');
  });
});

describe('BarChart', () => {
  it('scales bars to the largest value', () => {
    const rows = [{ day: '2026-10-01', views: 10, clicks: 0 }, { day: '2026-10-02', views: 5, clicks: 0 }];
    const { container } = render(<BarChart rows={rows} field="views" color="bg-ink" />);
    const bars = container.querySelectorAll<HTMLElement>('div[style]');
    expect(bars[0]!.style.height).toBe('100%');
    expect(bars[1]!.style.height).toBe('50%');
    expect(screen.getByRole('img', { name: 'Daily views' })).toBeInTheDocument();
  });
});
