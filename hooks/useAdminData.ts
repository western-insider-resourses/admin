'use client';
import { useCallback, useEffect, useState } from 'react';
import { admin } from '@/lib/client';
import { errorMessage } from '@/lib/utils';

// Load admin data from the API and expose reload + error state
export function useAdminData<T>(path: string) {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState('');
  const load = useCallback(
    () => admin<T>(path).then((d) => { setData(d); setError(''); }).catch((e: unknown) => setError(errorMessage(e))),
    [path]);
  useEffect(() => { void load(); }, [load]);
  return { data, error, reload: load, setData };
}
