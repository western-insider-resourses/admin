import Link from 'next/link';
import type { AnchorHTMLAttributes, ButtonHTMLAttributes } from 'react';

export type ButtonVariant = 'default' | 'primary' | 'danger';
const variantClass: Record<ButtonVariant, string> = { default: 'btn', primary: 'btn btn-primary', danger: 'btn btn-danger' };

type Common = { variant?: ButtonVariant; className?: string };

// A <button>, or a Next <Link> styled as a button when `href` is given.
export default function Button(props: (Common & ButtonHTMLAttributes<HTMLButtonElement> & { href?: undefined }) | (Common & AnchorHTMLAttributes<HTMLAnchorElement> & { href: string })) {
  const { variant = 'default', className = '', ...rest } = props;
  const cls = `${variantClass[variant]} ${className}`.trim();
  if ('href' in rest && rest.href !== undefined) {
    return <Link {...(rest as AnchorHTMLAttributes<HTMLAnchorElement> & { href: string })} className={cls} />;
  }
  const { type = 'button', ...btn } = rest as ButtonHTMLAttributes<HTMLButtonElement>;
  return <button type={type} {...btn} className={cls} />;
}
