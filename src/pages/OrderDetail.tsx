import { useState, useEffect } from 'react';
import { ArrowLeft, Package, MapPin, CreditCard } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { ordersApi } from '../lib/api';
import type { Order } from '../types';
import { Container, Badge, Skeleton } from '../components/ui';
import { formatIDR, resolveImage } from '../lib/format';

const STATUS: Record<string, { label: string; tone: 'success' | 'info' | 'warning' | 'danger' | 'neutral' }> = {
  delivered: { label: 'Selesai', tone: 'success' },
  shipped: { label: 'Dikirim', tone: 'info' },
  processing: { label: 'Diproses', tone: 'warning' },
  pending: { label: 'Menunggu', tone: 'warning' },
  cancelled: { label: 'Dibatalkan', tone: 'danger' },
};

const TIMELINE = ['pending', 'processing', 'shipped', 'delivered'];

type OrderFull = Order & {
  subtotal?: number;
  shipping_cost?: number;
  shipping_name?: string;
  shipping_phone?: string;
  shipping_address?: string;
  shipping_city?: string;
  shipping_postal_code?: string;
  payment?: { method?: string; status?: string } | null;
};

export default function OrderDetail() {
  const { id } = useParams();
  const [order, setOrder] = useState<OrderFull | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    let active = true;
    async function load() {
      try {
        const res = await ordersApi.detail(id!);
        const data = res.data?.order ?? res.data?.data ?? null;
        if (active) { setOrder(data); setNotFound(!data); }
      } catch {
        if (active) setNotFound(true);
      } finally {
        if (active) setLoading(false);
      }
    }
    load();
    return () => { active = false; };
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-cream pt-28 pb-20">
        <Container>
          <Skeleton className="mb-6 h-8 w-64" />
          <div className="grid gap-6 lg:grid-cols-3">
            <Skeleton className="h-80 lg:col-span-2" />
            <Skeleton className="h-80" />
          </div>
        </Container>
      </div>
    );
  }

  if (notFound || !order) {
    return (
      <div className="min-h-screen bg-cream pt-28 pb-20">
        <Container>
          <div className="flex flex-col items-center gap-4 py-24 text-center">
            <div className="grid h-14 w-14 place-items-center rounded-2xl bg-surface-alt text-muted"><Package className="h-6 w-6" /></div>
            <p className="text-muted">Pesanan tidak ditemukan.</p>
            <Link to="/dashboard" className="text-sm font-semibold text-rose-600 hover:underline">Kembali ke Dashboard</Link>
          </div>
        </Container>
      </div>
    );
  }

  const st = STATUS[order.status?.toLowerCase()] ?? { label: order.status, tone: 'neutral' as const };
  const stepIndex = TIMELINE.indexOf(order.status?.toLowerCase());
  const cancelled = order.status?.toLowerCase() === 'cancelled';

  return (
    <div className="min-h-screen bg-cream pt-28 pb-20">
      <Container>
        <Link to="/dashboard" className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-muted transition-colors hover:text-ink">
          <ArrowLeft className="h-4 w-4" /> Riwayat Pesanan
        </Link>

        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="font-serif text-3xl font-bold text-ink">{order.order_number ?? `VLV-${order.id}`}</h1>
            <p className="mt-1 font-mono text-sm text-muted">
              {order.created_at ? new Date(order.created_at).toLocaleDateString('id-ID', { dateStyle: 'long' }) : '—'}
            </p>
          </div>
          <Badge tone={st.tone}>{st.label}</Badge>
        </div>

        {/* Timeline status */}
        {!cancelled && (
          <div className="vv-card mb-8 p-6">
            <div className="flex items-center">
              {TIMELINE.map((step, i) => (
                <div key={step} className="flex flex-1 items-center last:flex-none">
                  <div className="flex flex-col items-center gap-2">
                    <span className={`grid h-8 w-8 place-items-center rounded-full text-xs font-bold ${i <= stepIndex ? 'bg-primary text-white' : 'bg-surface-alt text-muted'}`}>{i + 1}</span>
                    <span className={`text-[11px] font-medium uppercase tracking-wide ${i <= stepIndex ? 'text-ink' : 'text-muted'}`}>{STATUS[step].label}</span>
                  </div>
                  {i < TIMELINE.length - 1 && <div className={`mx-2 mb-6 h-0.5 flex-1 ${i < stepIndex ? 'bg-primary' : 'bg-line'}`} />}
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Items */}
          <div className="vv-card p-6 lg:col-span-2">
            <h2 className="mb-4 flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-ink"><Package className="h-4 w-4" /> Produk</h2>
            <div className="divide-y divide-line">
              {(order.items ?? []).map((it) => (
                <div key={it.id} className="flex items-center gap-4 py-4">
                  <img
                    src={resolveImage(it.product?.primary_image?.image_url ?? it.product?.primaryImage?.image_url ?? it.product?.images?.[0]?.image_url)}
                    alt={it.product_name ?? it.product?.name ?? 'Produk'}
                    className="h-16 w-16 rounded-xl bg-surface-alt object-cover"
                    loading="lazy"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="truncate font-semibold text-ink">{it.product_name ?? it.product?.name}</div>
                    <div className="font-mono text-xs text-muted">{it.quantity} × {formatIDR(it.price)}</div>
                  </div>
                  <div className="font-mono font-semibold text-ink">{formatIDR(it.quantity * it.price)}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Ringkasan + alamat */}
          <div className="space-y-6">
            <div className="vv-card p-6">
              <h2 className="mb-4 flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-ink"><CreditCard className="h-4 w-4" /> Ringkasan</h2>
              <div className="space-y-2 font-mono text-sm">
                <div className="flex justify-between text-muted"><span>Subtotal</span><span>{formatIDR(order.subtotal ?? order.total)}</span></div>
                <div className="flex justify-between text-muted"><span>Ongkir</span><span>{formatIDR(order.shipping_cost ?? 0)}</span></div>
                <div className="mt-2 flex justify-between border-t border-line pt-3 font-semibold text-ink"><span>Total</span><span>{formatIDR(order.total)}</span></div>
              </div>
              {order.payment?.method && (
                <div className="mt-4 border-t border-line pt-3 text-xs text-muted">
                  Metode: <span className="font-semibold uppercase text-ink">{order.payment.method}</span>
                </div>
              )}
            </div>

            <div className="vv-card p-6">
              <h2 className="mb-4 flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-ink"><MapPin className="h-4 w-4" /> Alamat Pengiriman</h2>
              <div className="space-y-1 text-sm text-muted">
                <div className="font-semibold text-ink">{order.shipping_name}</div>
                <div>{order.shipping_phone}</div>
                <div>{order.shipping_address}</div>
                <div>{order.shipping_city} {order.shipping_postal_code}</div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
