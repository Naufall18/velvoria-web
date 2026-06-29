import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, Trash2, Plus, Minus, ArrowRight, ShieldCheck } from 'lucide-react';
import { cartApi } from '../lib/api';
import type { CartItem } from '../types';
import { Container, Button, Skeleton } from '../components/ui';
import { formatIDR, resolveImage } from '../lib/format';

const FREE_SHIPPING_MIN = 2_000_000;
const SHIPPING_FEE = 35_000;

export default function Cart() {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    function loadLocalCart() {
      const local = localStorage.getItem('mock_cart');
      if (local && active) {
        try { setCartItems(JSON.parse(local)); } catch { /* ignore */ }
      }
    }
    async function loadCart() {
      try {
        const res = await cartApi.list();
        const items = res.data?.data?.items ?? res.data?.data ?? [];
        if (active) setCartItems(Array.isArray(items) ? items : []);
      } catch {
        loadLocalCart();
      } finally {
        if (active) setLoading(false);
      }
    }
    loadCart();
    return () => { active = false; };
  }, []);

  const persistLocal = (items: CartItem[]) => {
    setCartItems(items);
    localStorage.setItem('mock_cart', JSON.stringify(items));
  };

  const updateQuantity = async (id: number, qty: number) => {
    if (qty < 1) return;
    setCartItems((items) => items.map((it) => (it.id === id ? { ...it, quantity: qty } : it)));
    try { await cartApi.update(id, qty); } catch { /* local fallback already applied */ }
  };

  const removeItem = async (id: number) => {
    const next = cartItems.filter((it) => it.id !== id);
    setCartItems(next);
    try { await cartApi.remove(id); } catch { persistLocal(next); }
  };

  const subtotal = cartItems.reduce((acc, it) => acc + Number(it.product?.price ?? 0) * it.quantity, 0);
  const shipping = subtotal === 0 || subtotal >= FREE_SHIPPING_MIN ? 0 : SHIPPING_FEE;
  const total = subtotal + shipping;

  if (loading) {
    return (
      <div className="min-h-screen bg-cream pt-28 pb-20">
        <Container>
          <Skeleton className="mb-10 h-10 w-64" />
          <div className="grid gap-12 lg:grid-cols-3">
            <div className="space-y-6 lg:col-span-2">{Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-32 w-full rounded-3xl" />)}</div>
            <Skeleton className="h-80 w-full rounded-3xl" />
          </div>
        </Container>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream pt-28 pb-20">
      <Container>
        <h1 className="mb-10 font-serif text-4xl font-bold text-ink">Keranjang Belanja</h1>

        {cartItems.length === 0 ? (
          <div className="vv-card vv-card-gold flex flex-col items-center py-20 text-center">
            <div className="mb-6 grid h-16 w-16 place-items-center rounded-2xl bg-surface-alt text-muted">
              <ShoppingBag className="h-7 w-7" />
            </div>
            <h3 className="mb-2 font-serif text-2xl font-bold text-ink">Keranjang Anda kosong</h3>
            <p className="mb-8 text-sm text-muted">Jelajahi koleksi untuk menambahkan barang mewah pilihan.</p>
            <Link to="/products"><Button size="lg">Jelajahi Koleksi</Button></Link>
          </div>
        ) : (
          <div className="grid items-start gap-12 lg:grid-cols-3">
            {/* Daftar item */}
            <div className="space-y-5 lg:col-span-2">
              {cartItems.map((item) => {
                const img = item.product?.primaryImage?.image_url ?? item.product?.images?.[0]?.image_url;
                return (
                  <div key={item.id} className="vv-card flex flex-col items-center gap-5 p-5 sm:flex-row">
                    <Link to={`/product/${item.product?.slug}`} className="h-28 w-24 flex-shrink-0 overflow-hidden rounded-2xl bg-surface-alt">
                      {img ? <img src={resolveImage(img)} className="h-full w-full object-cover" alt={item.product?.name} />
                        : <div className="grid h-full w-full place-items-center font-serif text-2xl text-muted-soft">V</div>}
                    </Link>
                    <div className="flex-grow text-center sm:text-left">
                      {item.product?.brand?.name && <span className="text-xs font-bold uppercase tracking-wider text-emerald">{item.product.brand.name}</span>}
                      <Link to={`/product/${item.product?.slug}`} className="block font-serif text-lg font-semibold text-ink hover:text-rose-600">{item.product?.name}</Link>
                      <span className="text-sm text-muted">{formatIDR(item.product?.price)}</span>
                    </div>
                    <div className="inline-flex items-center rounded-full border border-line-strong bg-surface-alt px-2">
                      <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="grid h-9 w-9 place-items-center text-muted hover:text-ink"><Minus className="h-3.5 w-3.5" /></button>
                      <span className="w-9 text-center text-sm font-bold text-ink">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="grid h-9 w-9 place-items-center text-muted hover:text-ink"><Plus className="h-3.5 w-3.5" /></button>
                    </div>
                    <div className="flex w-full items-center justify-between gap-4 sm:w-auto sm:flex-col sm:items-end">
                      <span className="text-lg font-bold text-ink">{formatIDR(Number(item.product?.price ?? 0) * item.quantity)}</span>
                      <button onClick={() => removeItem(item.id)} className="p-2 text-muted transition-colors hover:text-danger"><Trash2 className="h-4 w-4" /></button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Ringkasan */}
            <div className="vv-card vv-card-gold p-7 lg:sticky lg:top-28">
              <h3 className="mb-6 font-serif text-xl font-bold text-ink">Ringkasan Pesanan</h3>
              <div className="mb-6 space-y-4 border-b border-line pb-6 text-sm">
                <div className="flex justify-between text-muted"><span>Subtotal</span><span className="font-bold text-ink">{formatIDR(subtotal)}</span></div>
                <div className="flex justify-between text-muted"><span>Ongkos kirim</span><span className="font-bold text-ink">{shipping === 0 ? 'Gratis' : formatIDR(shipping)}</span></div>
              </div>
              <div className="mb-8 flex items-end justify-between">
                <span className="font-semibold text-ink">Total</span>
                <span className="text-2xl font-bold text-ink">{formatIDR(total)}</span>
              </div>
              <Button onClick={() => navigate('/checkout')} size="lg" className="w-full">
                Lanjut ke Pembayaran <ArrowRight className="h-4 w-4" />
              </Button>
              <p className="mt-4 flex items-center justify-center gap-2 text-xs text-muted">
                <ShieldCheck className="h-4 w-4 text-success" /> Transaksi aman & terenkripsi
              </p>
            </div>
          </div>
        )}
      </Container>
    </div>
  );
}
