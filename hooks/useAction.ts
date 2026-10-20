'use client';
import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { errorMessage } from '@/lib/utils';

export function useAction() {
  const [message, setMessage] = useState('');
  const mutation = useMutation({ mutationFn: (action: () => Promise<unknown>) => action() });

  const run = async (action: () => Promise<unknown>) => {
    setMessage('');
    try {
      await mutation.mutateAsync(action);
    } catch (e) {
      setMessage(errorMessage(e));
    }
  };
  return { run, message, clear: () => setMessage(''), busy: mutation.isPending };
}
