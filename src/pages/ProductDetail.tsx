import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Star, ShieldCheck, Heart, ShoppingBag, Plus, Minus, ArrowLeft, Truck, RefreshCw } from 'lucide-react';
import { productsApi, cartApi } from '../lib/api';
import type { Product } from '../types';
import { Container, Button, Badge, Skeleton } from '../components/ui';
import { formatIDR, resolveImage } from '../lib/format';
import { cn } from '../lib/cn';

export default function ProductDetail() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<string>('');
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'desc' | 'spec' | 'reviews'>('desc');
  const [selectedVariant, setSelectedVariant] = useState<number | null>(null);
  const [isWished, setIsWished] = useState(false);
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    let active = true;
    async function loadProduct() {
      if (!slug) return;
      try {
        const res = await productsApi.detail(slug);
        const p: Product | undefined = res.data?.data?.product ?? res.data?.data;
        if (active && p) {
          setProduct(p);
          const first = p.images?.[0]?.image_url ?? p.primaryImage?.image_url;
          if (first) setSelectedImage(resolveImage(first));
        }
      } finally {
        if (active) setLoading(false);
      }
    }
    loadProduct();
    return () => { active = false; };
  }, [slug]);

  const handleAddToCart = async () => {
    if (!product) return;
    setAdding(true);
    try {
      await cartApi.add({
        product_id: product.id,
        product_variant_id: selectedVariant || undefined,
        quantity,
      });
      navigate('/cart');
    } catch {
      const localCart = JSON.parse(localStorage.getItem('mock_cart') || '[]');
      localCart.push({ id: Math.floor(Math.random() * 100000), product, quantity });
      localStorage.setItem('mock_cart', JSON.stringify(localCart));
      navigate('/cart');
    } finally {
      setAdding(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-cream pt-28 pb-20">
        <Container>
          <div className="grid gap-12 lg:grid-cols-2">
            <Skeleton className="aspect-[4/5] w-full rounded-[2rem]" />
            <div className="space-y-4">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-10 w-3/4" />
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-13 w-full" />
            </div>
          </div>
        </Container>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-cream pt-32 pb-20 text-center">
        <h2 className="font-serif text-3xl font-bold text-ink">Produk Tidak Ditemukan</h2>
        <Link to="/products" className="mt-4 inline-block font-semibold text-rose-600 hover:text-rose">← Kembali ke Koleksi</Link>
      </div>
    );
  }

  const discount = product.compare_price && product.compare_price > product.price
    ? Math.round(((product.compare_price - product.price) / product.compare_price) * 100) : 0;
  const gallery = (product.images?.length ? product.images : product.primaryImage ? [product.primaryImage] : []);

  return (
    <div className="min-h-screen bg-cream pt-28 pb-20">
      <Container>
        <Link to="/products" className="mb-8 inline-flex items-center gap-2 text-sm font-semibold text-muted transition-colors hover:text-ink">
          <ArrowLeft className="h-4 w-4" /> Kembali ke Koleksi
        </Link>

        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
          className="vv-card grid gap-10 p-6 sm:p-10 lg:grid-cols-2 lg:gap-16">
          {/* Galeri */}
          <div>
            <div className="mb-5 aspect-[4/5] overflow-hidden rounded-[1.5rem] border border-line bg-surface-alt">
              {selectedImage ? (
                <img src={selectedImage} alt={product.name} className="h-full w-full object-cover transition-transform duration-700 hover:scale-105" />
              ) : (
                <div className="grid h-full w-full place-items-center font-serif text-5xl text-muted-soft">V</div>
              )}
            </div>
            {gallery.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-1">
                {gallery.map((img, idx) => {
                  const url = resolveImage(img.image_url);
                  return (
                    <button key={idx} onClick={() => setSelectedImage(url)}
                      className={cn('h-20 w-16 flex-shrink-0 overflow-hidden rounded-xl border-2 transition',
                        selectedImage === url ? 'border-rose' : 'border-transparent opacity-70 hover:opacity-100')}>
                      <img src={url} className="h-full w-full object-cover" alt="" />
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Info */}
          <div className="flex flex-col">
            {product.brand?.name && (
              <span className="mb-2 text-xs font-bold uppercase tracking-wider text-emerald">{product.brand.name}</span>
            )}
            <h1 className="mb-4 font-serif text-4xl font-bold leading-tight text-ink">{product.name}</h1>

            <div className="mb-6 flex items-center gap-4">
              {product.rating ? (
                <span className="flex items-center gap-1.5 rounded-full bg-surface-alt px-3 py-1 text-sm font-bold text-ink">
                  <Star className="h-4 w-4 fill-warning text-warning" /> {Number(product.rating).toFixed(1)}
                </span>
              ) : null}
              <span className="text-sm text-muted">({product.total_reviews ?? 0} ulasan)</span>
            </div>

            <div className="mb-8 flex items-baseline gap-3 border-b border-line pb-6">
              <span className="text-3xl font-bold text-ink">{formatIDR(product.price)}</span>
              {discount > 0 && (
                <>
                  <span className="text-lg text-muted-soft line-through">{formatIDR(product.compare_price!)}</span>
                  <Badge tone="danger">-{discount}%</Badge>
                </>
              )}
            </div>

            {product.short_description && <p className="mb-6 leading-relaxed text-muted">{product.short_description}</p>}

            {product.variants && product.variants.length > 0 && (
              <div className="mb-6">
                <h4 className="mb-3 text-xs font-bold uppercase tracking-wider text-ink">Pilihan</h4>
                <div className="flex flex-wrap gap-3">
                  {product.variants.map((v) => (
                    <button key={v.id} onClick={() => setSelectedVariant(v.id)}
                      className={cn('rounded-full border px-5 py-2 text-sm font-medium transition-all',
                        selectedVariant === v.id ? 'border-primary bg-primary text-white' : 'border-line-strong text-muted hover:border-rose')}>
                      {v.name}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="mb-8">
              <h4 className="mb-3 text-xs font-bold uppercase tracking-wider text-ink">Jumlah</h4>
              <div className="inline-flex items-center rounded-full border border-line-strong bg-surface-alt px-2">
                <button onClick={() => setQuantity((q) => Math.max(1, q - 1))} className="grid h-10 w-10 place-items-center text-muted transition-colors hover:text-ink"><Minus className="h-4 w-4" /></button>
                <span className="w-12 text-center text-sm font-bold text-ink">{quantity}</span>
                <button onClick={() => setQuantity((q) => q + 1)} className="grid h-10 w-10 place-items-center text-muted transition-colors hover:text-ink"><Plus className="h-4 w-4" /></button>
              </div>
            </div>

            <div className="mb-8 flex gap-3">
              <Button onClick={handleAddToCart} isLoading={adding} size="lg" className="flex-grow">
                <ShoppingBag className="h-5 w-5" /> Tambah ke Keranjang
              </Button>
              <button onClick={() => setIsWished(!isWished)}
                className={cn('grid h-13 w-13 place-items-center rounded-full border transition-colors',
                  isWished ? 'border-danger-soft bg-danger-soft text-danger' : 'border-line-strong text-muted hover:border-rose')}>
                <Heart className={cn('h-6 w-6', isWished && 'fill-current')} />
              </button>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              {[
                { icon: ShieldCheck, t: '100% Asli', s: 'Terverifikasi ahli' },
                { icon: Truck, t: 'Pengiriman Aman', s: 'Terlacak penuh' },
                { icon: RefreshCw, t: 'Bisa COD', s: 'Bayar di tempat' },
              ].map((b) => (
                <div key={b.t} className="flex items-center gap-3 rounded-2xl bg-surface-alt p-3">
                  <span className="grid h-9 w-9 flex-shrink-0 place-items-center rounded-full bg-success-soft text-success"><b.icon className="h-4 w-4" /></span>
                  <div className="text-xs"><div className="font-bold text-ink">{b.t}</div><div className="text-muted">{b.s}</div></div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Tab info */}
        <div className="vv-card mt-12 p-6 sm:p-10">
          <div className="mb-8 flex gap-8 overflow-x-auto border-b border-line">
            {([['desc', 'Deskripsi'], ['spec', 'Spesifikasi'], ['reviews', `Ulasan (${product.total_reviews ?? 0})`]] as const).map(([key, label]) => (
              <button key={key} onClick={() => setActiveTab(key)}
                className={cn('-mb-px border-b-2 pb-4 text-sm font-bold uppercase tracking-wider transition-all',
                  activeTab === key ? 'border-primary text-ink' : 'border-transparent text-muted')}>
                {label}
              </button>
            ))}
          </div>

          {activeTab === 'desc' && (
            <p className="leading-relaxed text-muted">{product.description || product.short_description || 'Belum ada deskripsi.'}</p>
          )}
          {activeTab === 'spec' && (
            <table className="w-full max-w-xl text-left text-sm">
              <tbody>
                <tr className="border-b border-line"><th className="w-1/3 py-3 font-semibold text-ink">Brand</th><td className="py-3 text-muted">{product.brand?.name || '—'}</td></tr>
                <tr className="border-b border-line"><th className="py-3 font-semibold text-ink">Kategori</th><td className="py-3 text-muted">{product.category?.name || '—'}</td></tr>
                <tr className="border-b border-line"><th className="py-3 font-semibold text-ink">SKU</th><td className="py-3 text-muted">{product.sku || '—'}</td></tr>
                <tr className="border-b border-line"><th className="py-3 font-semibold text-ink">Stok</th><td className="py-3 text-muted">{product.stock} unit</td></tr>
              </tbody>
            </table>
          )}
          {activeTab === 'reviews' && (
            <div className="space-y-6">
              {product.reviews && product.reviews.length > 0 ? (
                product.reviews.map((r) => (
                  <div key={r.id} className="border-b border-line pb-6 last:border-0">
                    <div className="mb-2 flex items-center gap-2">
                      <div className="flex text-warning">{Array.from({ length: Math.round(r.rating) }).map((_, i) => <Star key={i} className="h-4 w-4 fill-current" />)}</div>
                      <span className="text-sm font-bold text-ink">{r.user?.name ?? 'Pembeli'}</span>
                    </div>
                    <p className="text-sm leading-relaxed text-muted">{r.comment}</p>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted">Belum ada ulasan untuk produk ini.</p>
              )}
            </div>
          )}
        </div>
      </Container>
    </div>
  );
}
