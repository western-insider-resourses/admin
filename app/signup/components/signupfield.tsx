'use client';
import { useEffect, useState, type FormEvent } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { clearLegacyToken, useSignup, useSignupConfig } from '@/hooks/api/useAuth';
import type { SignupPayload } from '@/services/api/types';
import { SITE_NAME } from '@/lib/api';
import { getErrorMessage } from '@/services/Client';
import { Button, Card, Notice, TextField } from '@/components/ui';
import PasswordField from '@/components/PasswordField';
import navyLogo from '@/assets/navy_logo_transparent.png';

export const MIN_PASSWORD = 8;

export default function SignupField() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [inviteCode, setInviteCode] = useState('');
  const [error, setError] = useState('');
  const inviteQuery = useSignupConfig();
  const signupMutation = useSignup();
  const needsCode = inviteQuery.data?.inviteCodeRequired ?? false;

  useEffect(() => {
    clearLegacyToken();
  }, []);

  function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError('');
    if (password.length < MIN_PASSWORD)
      return setError(`Use a password of at least ${MIN_PASSWORD} characters.`);
    if (password !== confirm)
      return setError('The two passwords do not match.');
    const payload: SignupPayload = {
      email,
      password,
      ...(needsCode && inviteCode ? { inviteCode } : {}),
    };
    signupMutation.mutate(payload, { onSuccess: () => router.replace('/') });
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-sm p-6">
        <div className="mb-3 flex flex-col items-center">
          <Image src={navyLogo} alt="" width={147} height={111} priority className="h-16 w-auto object-contain" />
          <p className="mt-1 font-serif text-lg font-extrabold leading-tight text-ink">{SITE_NAME}</p>
          <p className="mt-1 text-sm font-semibold text-mute">Admin portal</p>
        </div>
        <form onSubmit={submit} className="mt-1 space-y-4">
          <h1 className="font-serif text-2xl font-bold">Create admin account</h1>
          <TextField
            label="Email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoFocus
          />
          <PasswordField
            label="Password"
            autoComplete="new-password"
            hint={`(at least ${MIN_PASSWORD} characters)`}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <PasswordField
            label="Confirm password"
            autoComplete="new-password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            required
          />
          {needsCode && (
            <TextField
              label="Invite code"
              hint="(ask the site owner)"
              value={inviteCode}
              onChange={(e) => setInviteCode(e.target.value)}
              required
            />
          )}
          <Notice error={error || (signupMutation.error ? getErrorMessage(signupMutation.error) : '') || (inviteQuery.error ? getErrorMessage(inviteQuery.error) : '')} />
          <Button type="submit" variant="primary" className="w-full" disabled={signupMutation.isPending}>
            {signupMutation.isPending ? 'Creating account...' : 'Create account'}
          </Button>
        </form>
        <p className="mt-4 text-center text-sm text-mute">
          Already have an account?{' '}
          <Link href="/login" className="font-semibold text-crimson">Sign in</Link>
        </p>
      </Card>
    </div>
  );
}
