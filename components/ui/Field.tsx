import { useId, type InputHTMLAttributes, type ReactNode, type SelectHTMLAttributes, type TextareaHTMLAttributes } from 'react';

interface FieldProps { label: ReactNode; hint?: ReactNode; className?: string }

function Wrap({ id, label, hint, className = '', children }: FieldProps & { id: string; children: ReactNode }) {
  return (
    <div className={className}>
      <label className="label" htmlFor={id}>{label}{hint && <span className="font-normal text-mute"> {hint}</span>}</label>
      {children}
    </div>
  );
}

// Labelled form controls. The label is wired to the control, so they are accessible and easy to find in tests.
export function TextField({ label, hint, className, ...rest }: FieldProps & InputHTMLAttributes<HTMLInputElement>) {
  const id = useId();
  return <Wrap id={id} label={label} hint={hint} className={className}><input id={id} className="input" {...rest} /></Wrap>;
}

export function TextArea({ label, hint, className, ...rest }: FieldProps & TextareaHTMLAttributes<HTMLTextAreaElement>) {
  const id = useId();
  return <Wrap id={id} label={label} hint={hint} className={className}><textarea id={id} className="input min-h-20" {...rest} /></Wrap>;
}

export function SelectField({ label, hint, className, children, ...rest }: FieldProps & SelectHTMLAttributes<HTMLSelectElement>) {
  const id = useId();
  return <Wrap id={id} label={label} hint={hint} className={className}><select id={id} className="input" {...rest}>{children}</select></Wrap>;
}
