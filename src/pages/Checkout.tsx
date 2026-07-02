import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Truck, Wallet, CheckCircle2, ChevronRight, ShieldCheck } from 'lucide-react';
import { cartApi, ordersApi } from '../lib/api';
import type { CartItem } from '../types';
import { Container, Button, Input, Skeleton } from '../components/ui';
import { formatIDR, resolveImage } from '../lib/format';
import { cn } from '../lib/cn';

const FREE_SHIPPING_MIN = 2_000_000;
const SHIPPING_FEE = 35_000;

export default function Checkout() {
  const navigate = useNavigate();
  const [step, setStep] = useState<1 | 2>(1);
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [placing, setPlacing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState({
    shipping_name: '', shipping_email: '', shipping_phone: '',
    shipping_address: '', shipping_city: '', shipping_postal_code: '', notes: '',
  });

  useEffect(() => {
    let active = true;
    async function load() {
      try {
        const res = await cartApi.list();
        const list = res.data?.data?.items ?? res.data?.data ?? [];
        if (active) setItems(Array.isArray(list) ? list : []);
      } catch {
        const local = localStorage.getItem('mock_cart');
        if (local && active) { try { setItems(JSON.parse(local)); } catch { /* ignore */ } }
      } finally {
        if (active) setLoading(false);
      }
    }
    load();
    return () => { active = false; };
  }, []);

  const subtotal = items.reduce((acc, it) => acc + Number(it.product?.price ?? 0) * it.quantity, 0);
  const shipping = subtotal === 0 || subtotal >= FREE_SHIPPING_MIN ? 0 : SHIPPING_FEE;
  const total = subtotal + shipping;

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) => setForm({ ...form, [k]: e.target.value });

  const submitShipping = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.shipping_name || !form.shipping_phone || !form.shipping_address || !form.shipping_city) {
      setError('Mohon lengkapi data pengiriman wajib.');
      return;
    }
    setError(null);
    setStep(2);
  };

  const placeOrder = async () => {
    setPlacing(true);
    setError(null);
    try {
      await ordersApi.create(form);
      localStorage.removeItem('mock_cart');
      navigate('/dashboard');
    } catch (err) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      setError(msg ?? 'Gagal membuat pesanan. Pastikan Anda sudah masuk dan keranjang tidak kosong.');
    } finally {
      setPlacing(false);
    }
  };

  return (
    <div className="min-h-screen bg-cream pt-28 pb-20">
      <Container className="max-w-6xl">
        <h1 className="mb-8 text-center font-serif text-4xl font-bold text-ink">Checkout</h1>

        {/* Stepper */}
        <div className="mb-10 flex items-center justify-center gap-3 text-sm font-medium text-muted">
          {[[1, 'Pengiriman'], [2, 'Pembayaran']].map(([n, label], i) => (
            <div key={n as number} className="flex items-center gap-3">
              <button onClick={() => (n as number) < step && setStep(n as 1 | 2)} className={cn('flex items-center gap-2', step >= (n as number) && 'font-bold text-ink')}>
                <span className={cn('grid h-6 w-6 place-items-center rounded-full text-xs', step >= (n as number) ? 'bg-primary text-white' : 'bg-surface-alt text-muted')}>{n}</span>
                {label}
              </button>
              {i === 0 && <ChevronRight className="h-4 w-4 text-muted-soft" />}
            </div>
          ))}
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Form */}
          <div className="lg:col-span-2">
            {error && <div className="mb-6 rounded-xl bg-danger-soft px-4 py-3 text-sm font-medium text-danger">{error}</div>}

            {step === 1 && (
              <form onSubmit={submitShipping} className="vv-card space-y-5 p-7">
                <h2 className="flex items-center gap-3 font-serif text-2xl font-bold text-ink"><Truck className="text-rose" /> Alamat Pengiriman</h2>
                <div className="grid gap-5 sm:grid-cols-2">
                  <Input label="Nama Penerima *" value={form.shipping_name} onChange={set('shipping_name')} required />
                  <Input label="Email" type="email" value={form.shipping_email} onChange={set('shipping_email')} />
                </div>
                <Input label="Nomor Telepon *" value={form.shipping_phone} onChange={set('shipping_phone')} required />
                <Input label="Alamat Lengkap *" value={form.shipping_address} onChange={set('shipping_address')} required />
                <div className="grid gap-5 sm:grid-cols-2">
                  <Input label="Kota *" value={form.shipping_city} onChange={set('shipping_city')} required />
                  <Input label="Kode Pos" value={form.shipping_postal_code} onChange={set('shipping_postal_code')} />
                </div>
                <Input label="Catatan (opsional)" value={form.notes} onChange={set('notes')} />
                <Button type="submit" size="lg" className="w-full">Lanjut ke Pembayaran</Button>
              </form>
            )}

            {step === 2 && (
              <div className="vv-card space-y-6 p-7">
                <h2 className="flex items-center gap-3 font-serif text-2xl font-bold text-ink"><Wallet className="text-rose" /> Metode Pembayaran</h2>
                <div className="flex items-center justify-between rounded-2xl border-2 border-primary bg-surface-alt p-5">
                  <div className="flex items-center gap-3">
                    <span className="grid h-10 w-10 place-items-center rounded-full bg-primary text-white"><Wallet className="h-5 w-5" /></span>
                    <div>
                      <div className="font-bold text-ink">Bayar di Tempat (COD)</div>
                      <div className="text-xs text-muted">Bayar tunai saat pesanan tiba</div>
                    </div>
                  </div>
                  <CheckCircle2 className="h-5 w-5 text-success" />
                </div>
                <p className="text-xs text-muted">Metode pembayaran lain (kartu/transfer) akan tersedia segera.</p>

                <div className="rounded-2xl bg-surface-alt p-5 text-sm">
                  <h4 className="mb-2 font-bold text-ink">Kirim ke</h4>
                  <p className="font-medium text-ink">{form.shipping_name} · {form.shipping_phone}</p>
                  <p className="text-muted">{form.shipping_address}, {form.shipping_city} {form.shipping_postal_code}</p>
                </div>

                <Button onClick={placeOrder} isLoading={placing} size="lg" className="w-full">
                  <ShieldCheck className="h-5 w-5" /> Buat Pesanan
                </Button>
              </div>
            )}
          </div>

          {/* Ringkasan */}
          <div className="vv-card vv-card-gold h-fit p-7 lg:sticky lg:top-28">
            <h3 className="mb-5 font-serif text-xl font-bold text-ink">Ringkasan</h3>
            {loading ? (
              <div className="space-y-3">{Array.from({ length: 2 }).map((_, i) => <Skeleton key={i} className="h-14 w-full" />)}</div>
            ) : (
              <div className="mb-5 space-y-4 border-b border-line pb-5">
                {items.map((it) => {
                  const img = it.product?.primaryImage?.image_url ?? it.product?.images?.[0]?.image_url;
                  return (
                    <div key={it.id} className="flex items-center gap-3">
                      <div className="h-14 w-12 flex-shrink-0 overflow-hidden rounded-xl bg-surface-alt">
                        {img && <img src={resolveImage(img)} className="h-full w-full object-cover" alt="" />}
                      </div>
                      <div className="flex-grow text-sm">
                        <div className="line-clamp-1 font-medium text-ink">{it.product?.name}</div>
                        <div className="font-mono text-xs text-muted">{it.quantity} × {formatIDR(it.product?.price)}</div>
                      </div>
                      <span className="font-mono text-sm font-semibold text-ink">{formatIDR(Number(it.product?.price ?? 0) * it.quantity)}</span>
                    </div>
                  );
                })}
                {items.length === 0 && <p className="text-sm text-muted">Keranjang kosong.</p>}
              </div>
            )}
            <div className="space-y-3 text-sm">
              <div className="flex justify-between text-muted"><span>Subtotal</span><span className="font-mono font-semibold text-ink">{formatIDR(subtotal)}</span></div>
              <div className="flex justify-between text-muted"><span>Ongkos kirim</span><span className="font-mono font-semibold text-ink">{shipping === 0 ? 'Gratis' : formatIDR(shipping)}</span></div>
              <div className="flex justify-between border-t border-gold/30 pt-3 text-base"><span className="font-semibold text-ink">Total</span><span className="font-mono text-xl font-semibold text-ink">{formatIDR(total)}</span></div>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
