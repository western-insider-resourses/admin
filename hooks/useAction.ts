'use client';
import { useState } from 'react';
import { errorMessage } from '@/lib/utils';

// Run an async action, remember its error message, and (optionally) reload afterwards
export function useAction(after?: () => unknown) {
  const [message, setMessage] = useState('');
  const run = async (fn: () => Promise<unknown>) => {
    setMessage('');
    try { await fn(); await after?.(); } catch (e) { setMessage(errorMessage(e)); }
  };
  return { run, message, clear: () => setMessage('') };
}
