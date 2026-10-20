export function getProfileInitials(email?: string): string {
  const name = email?.split('@')[0]?.trim() ?? '';
  const parts = name.split(/[._-]+/).filter(Boolean);
  if (!parts.length) return 'AD';
  if (parts.length > 1) return `${parts[0]![0]}${parts[1]![0]}`.toUpperCase();
  return name.slice(0, 2).toUpperCase();
}

export function getProfileName(email?: string): string {
  const accountName = email?.split('@')[0]?.trim();
  if (!accountName) return 'Admin';
  return accountName
    .split(/[._-]+/)
    .filter(Boolean)
    .map((part) => part[0]!.toUpperCase() + part.slice(1))
    .join(' ');
}
