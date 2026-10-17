export default function Notice({ error, ok }: { error?: string; ok?: string }) {
  if (error) return <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-800">{error}</p>;
  if (ok) return <p role="status" className="rounded-lg bg-green-50 p-3 text-sm text-green-800">{ok}</p>;
  return null;
}
