/** Format harga Rupiah (data backend dalam satuan rupiah penuh). */
export function formatIDR(value: number | string | null | undefined): string {
  const n = typeof value === 'string' ? Number(value) : value ?? 0;
  if (!Number.isFinite(n as number)) return 'Rp0';
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(n as number);
}

/** Resolusi URL gambar dari backend (relatif → absolut storage). */
export function resolveImage(url: string | null | undefined, fallback = ''): string {
  if (!url) return fallback;
  if (/^https?:\/\//i.test(url)) return url;
  const base = (import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000/api').replace(/\/api\/?$/, '');
  return `${base}/storage/${url.replace(/^\/?storage\/?/, '')}`;
}
