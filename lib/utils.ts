// Ask Cloudinary for a resized, auto-format version of an uploaded image
export function cl(url: string | null | undefined, width = 800): string {
  if (!url) return "";
  if (!url.includes("/upload/")) return url;
  return url.replace("/upload/", `/upload/f_auto,q_auto,w_${width}/`);
}

export const fmtDate = (d?: string | null): string =>
  d
    ? new Date(d).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : "";

export function timeAgo(d: string): string {
  const s = Math.max(
    1,
    Math.floor((Date.now() - new Date(d).getTime()) / 1000),
  );
  const steps: Array<[number, string]> = [
    [31536000, "year"],
    [2592000, "month"],
    [86400, "day"],
    [3600, "hour"],
    [60, "minute"],
  ];
  for (const [n, label] of steps) {
    if (s >= n) {
      const v = Math.floor(s / n);
      return `${v} ${label}${v > 1 ? "s" : ""} ago`;
    }
  }
  return "just now";
}

export const errorMessage = (e: unknown): string =>
  e instanceof Error ? e.message : "Something went wrong.";

export const PLATFORMS = [
  "Facebook",
  "X",
  "Instagram",
  "TikTok",
  "YouTube",
  "WhatsApp",
  "Telegram",
  "LinkedIn",
  "Google News",
];
