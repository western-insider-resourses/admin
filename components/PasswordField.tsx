'use client';
import { useState, type InputHTMLAttributes, type ReactNode } from 'react';
import { TextField } from '@/components/ui';

interface PasswordFieldProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label: ReactNode;
  hint?: ReactNode;
}

export default function PasswordField({ label, hint, ...inputProps }: PasswordFieldProps) {
  const [visible, setVisible] = useState(false);

  return (
    <div className="relative">
      <TextField
        {...inputProps}
        label={label}
        hint={hint}
        type={visible ? 'text' : 'password'}
        className="[&_input]:pr-16"
      />
      <button
        type="button"
        className="absolute right-2 top-[2.125rem] rounded px-2 py-1 text-xs font-semibold text-mute hover:text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-crimson"
        aria-label={visible ? 'Hide password' : 'Show password'}
        aria-pressed={visible}
        onClick={() => setVisible((current) => !current)}
      >
        {visible ? 'Hide' : 'Show'}
      </button>
    </div>
  );
}
