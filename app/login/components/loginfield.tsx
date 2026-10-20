'use client';
import { useEffect, useState, type FormEvent } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { clearLegacyToken, useLogin } from '@/hooks/api/useAuth';
import type { LoginPayload } from '@/services/api/types';
import { SITE_NAME } from '@/lib/api';
import { getErrorMessage } from '@/services/Client';
import { Button, Card, Notice, TextField } from '@/components/ui';
import PasswordField from '@/components/PasswordField';
import navyLogo from '@/assets/navy_logo_transparent.png';

export default function LoginField() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const loginMutation = useLogin();

  useEffect(() => {
    clearLegacyToken();
  }, []);

  function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError('');
    const payload: LoginPayload = { email, password };
    loginMutation.mutate(payload, { onSuccess: () => router.replace('/') });
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
          <h1 className="font-serif text-2xl font-bold">Admin sign in</h1>
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
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <Notice error={error || (loginMutation.error ? getErrorMessage(loginMutation.error) : '')} />
          <Button type="submit" variant="primary" className="w-full" disabled={loginMutation.isPending}>
            {loginMutation.isPending ? 'Signing in...' : 'Sign in'}
          </Button>
        </form>
        <p className="mt-4 text-center text-sm text-mute">
          Need an account?{' '}
          <Link href="/signup" className="font-semibold text-crimson">Sign up</Link>
        </p>
      </Card>
    </div>
  );
}
