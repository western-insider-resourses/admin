import type { HTMLAttributes } from 'react';

type Props = HTMLAttributes<HTMLElement> & { as?: 'div' | 'article' | 'section' };

// White rounded box. Use `as="article"` / `as="section"` to keep the right HTML semantics.
export default function Card({ as: Tag = 'div', className = '', ...rest }: Props) {
  return <Tag className={`card ${className}`.trim()} {...rest} />;
}
