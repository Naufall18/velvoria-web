import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Star, Zap, ShieldCheck, ArrowRight, Play, BadgeCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import { categoriesApi, productsApi } from '../lib/api';
import type { Product, Category } from '../types';
import { Container, ProductCard, Skeleton } from '../components/ui';

/** Metadata tampilan kategori — nama Indonesia + gambar fallback (API belum
 *  menyimpan image kategori). Dipetakan per slug agar konsisten. */
const CATEGORY_META: Record<string, { label: string; image: string }> = {
  bags:        { label: 'Tas',        image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&q=80&w=500' },
  watches:     { label: 'Jam Tangan', image: 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?auto=format&fit=crop&q=80&w=500' },
  apparel:     { label: 'Busana',     image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&q=80&w=500' },
  footwear:    { label: 'Alas Kaki',  image: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&q=80&w=500' },
  accessories: { label: 'Aksesoris',  image: 'https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&q=80&w=500' },
  jewelry:     { label: 'Perhiasan',  image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&q=80&w=500' },
};

const FALLBACK_CAT_IMG = 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80&w=500';

export default function Home() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [featured, setFeatured] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    async function fetchData() {
      try {
        const [catRes, prodRes] = await Promise.allSettled([
          categoriesApi.list(),
          productsApi.featured(),
        ]);
        if (!active) return;
        if (catRes.status === 'fulfilled') {
          const list: Category[] = catRes.value.data?.data?.categories ?? catRes.value.data?.data ?? [];
          setCategories(Array.isArray(list) ? list : []);
        }
        if (prodRes.status === 'fulfilled') {
          const list: Product[] = prodRes.value.data?.data?.products ?? prodRes.value.data?.data ?? [];
          setFeatured(Array.isArray(list) ? list : []);
        }
      } finally {
        if (active) setLoading(false);
      }
    }
    fetchData();
    return () => { active = false; };
  }, []);

  const displayCategories = categories.slice(0, 4);
  const displayProducts = featured.slice(0, 8);

  return (
    <div className="pt-20">
      {/* ── Hero — kanvas navy editorial ── */}
      <section className="vv-hero relative overflow-hidden py-24 text-cream">
        <Container className="grid items-center gap-12 lg:grid-cols-2">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-gold/30 bg-white/5 px-3 py-1">
              <Zap className="h-4 w-4 text-gold" />
              <span className="text-xs font-bold uppercase tracking-wider text-gold">Marketplace Generasi Baru</span>
            </div>
            <h1 className="mb-6 font-serif text-5xl font-bold leading-tight text-cream lg:text-7xl">
              Angkat <span className="text-rose">Gaya Hidup</span> Anda dengan Barang Mewah.
            </h1>
            <p className="mb-8 max-w-xl text-lg leading-relaxed text-cream/70">
              Velvoria menghubungkan Anda dengan brand artisan dan vendor mewah kelas dunia. Nikmati pengalaman belanja premium yang terjamin keasliannya.
            </p>
            <div className="flex flex-col gap-4 sm:flex-row">
              <Link to="/products" className="group flex items-center justify-center gap-2 rounded-full bg-rose px-8 py-4 font-bold text-ink shadow-lg shadow-rose/25 transition-all hover:bg-rose-600">
                Jelajahi Koleksi
                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link to="/live" className="flex items-center justify-center gap-2 rounded-full border border-white/20 bg-white/5 px-8 py-4 font-bold text-cream transition-all hover:border-gold/50">
                <Play className="h-5 w-5 fill-current" />
                Live Shopping
              </Link>
            </div>

            <div className="mt-12 flex items-center gap-8">
              <div>
                <div className="font-mono text-3xl font-semibold text-cream">30+</div>
                <div className="text-sm text-cream/50">Produk Kurasi</div>
              </div>
              <div className="h-10 w-px bg-white/15" />
              <div>
                <div className="font-mono text-3xl font-semibold text-cream">6</div>
                <div className="text-sm text-cream/50">Brand Pilihan</div>
              </div>
              <div className="h-10 w-px bg-white/15" />
              <div>
                <div className="flex items-center gap-1">
                  <Star className="h-5 w-5 fill-current text-warning" />
                  <span className="font-mono text-3xl font-semibold text-cream">4.9</span>
                </div>
                <div className="text-sm text-cream/50">Rating Kepuasan</div>
              </div>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8 }} className="relative">
            <div className="relative z-10 overflow-hidden rounded-[2rem] border border-white/10 shadow-2xl">
              <img src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80&w=1000" alt="Belanja mewah Velvoria" className="h-auto w-full object-cover" />
            </div>
            <div className="absolute -right-6 -top-6 h-32 w-32 animate-pulse rounded-full bg-rose opacity-30 blur-3xl" />
            <div className="absolute -bottom-10 -left-10 h-48 w-48 rounded-full bg-emerald opacity-30 blur-3xl" />

            <motion.div animate={{ y: [0, -10, 0] }} transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
              className="absolute -right-4 bottom-10 z-20 flex items-center gap-4 rounded-2xl border border-gold/30 bg-surface p-4 shadow-xl">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-success-soft">
                <ShieldCheck className="h-6 w-6 text-success" />
              </div>
              <div>
                <div className="text-sm font-bold text-ink">Keaslian Terjamin</div>
                <div className="font-mono text-xs uppercase tracking-wider text-emerald">Autentikasi 100%</div>
              </div>
            </motion.div>
          </motion.div>
        </Container>
      </section>

      {/* ── Kategori — ruang napas cream ── */}
      <section className="bg-cream py-20">
        <Container>
          <div className="mb-12 flex items-end justify-between">
            <div>
              <h2 className="mb-4 font-serif text-4xl font-bold text-ink">Belanja per Kategori</h2>
              <p className="text-muted">Pilihan terkurasi untuk selera Anda yang berkelas.</p>
            </div>
            <Link to="/products" className="flex items-center gap-1 font-bold text-rose-600 hover:underline">
              Lihat Semua <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid gap-6 md:grid-cols-4">
            {(loading ? Array.from({ length: 4 }) : displayCategories).map((cat, i) => {
              if (loading || !cat) return <Skeleton key={i} className="aspect-[3/4] w-full rounded-3xl" />;
              const c = cat as Category;
              const meta = CATEGORY_META[c.slug];
              return (
                <motion.div key={c.id} whileHover={{ y: -8 }} transition={{ type: 'spring', stiffness: 300, damping: 24 }} className="group">
                  <Link to={`/products?category=${c.slug}`}>
                    <div className="relative mb-4 aspect-[3/4] overflow-hidden rounded-3xl shadow-md">
                      <img src={meta?.image ?? FALLBACK_CAT_IMG} alt={meta?.label ?? c.name}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" />
                      <div className="absolute inset-0 bg-gradient-to-t from-primary/85 via-primary/20 to-transparent" />
                      <div className="absolute inset-x-5 bottom-5">
                        <div className="mb-1 font-serif text-xl font-bold text-cream">{meta?.label ?? c.name}</div>
                        <div className="font-mono text-[11px] uppercase tracking-wider text-gold">
                          {typeof c.products_count === 'number' ? `${c.products_count} produk` : 'Lihat koleksi'}
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </Container>
      </section>

      {/* ── Produk unggulan — kanvas navy, kartu signature ── */}
      <section className="bg-primary py-20">
        <Container>
          <div className="mb-12 flex items-end justify-between">
            <div>
              <div className="mb-3 inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-[0.2em] text-gold">
                <BadgeCheck className="h-3.5 w-3.5" /> Terverifikasi Asli
              </div>
              <h2 className="mb-4 font-serif text-4xl font-bold text-cream">Sedang Tren</h2>
              <p className="text-cream/60">Kerajinan istimewa dengan estetika abadi.</p>
            </div>
            <Link to="/products" className="flex items-center gap-1 font-bold text-rose hover:underline">
              Lihat Semua Produk <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {loading
              ? Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="aspect-[4/5] w-full rounded-2xl" />)
              : displayProducts.map((prod) => <ProductCard key={prod.id} product={prod} />)}
          </div>
        </Container>
      </section>

      {/* ── Teaser Live Shopping ── */}
      <section className="relative overflow-hidden bg-primary-900 py-20 text-cream">
        <Container className="grid items-center gap-16 lg:grid-cols-2">
          <div className="relative z-10">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-danger/40 bg-danger/15 px-3 py-1">
              <span className="h-2 w-2 animate-pulse rounded-full bg-danger" />
              <span className="text-xs font-bold uppercase tracking-wider text-rose">Live Shopping</span>
            </div>
            <h2 className="mb-6 font-serif text-4xl font-bold lg:text-5xl">Pengalaman Belanja Interaktif.</h2>
            <p className="mb-8 text-lg leading-relaxed text-cream/60">
              Ikuti sesi live eksklusif bersama perwakilan brand. Ajukan pertanyaan, lihat detail produk secara langsung, dan dapatkan penawaran khusus live.
            </p>
            <Link to="/live" className="inline-block rounded-full bg-rose px-8 py-4 font-bold text-ink transition-all hover:bg-white">
              Lihat Sesi Live
            </Link>
          </div>

          <div className="relative">
            <div className="relative aspect-video overflow-hidden rounded-3xl border border-white/10 shadow-2xl">
              <img src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&q=80&w=800" className="h-full w-full object-cover opacity-50" alt="Sesi live" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="flex h-20 w-20 cursor-pointer items-center justify-center rounded-full border border-white/30 bg-white/20 backdrop-blur-md transition-transform hover:scale-110">
                  <Play className="h-8 w-8 fill-current" />
                </div>
              </div>
              <div className="absolute left-6 top-6 flex items-center gap-3">
                <div className="rounded bg-danger px-3 py-1 font-mono text-xs font-bold">LIVE</div>
                <div className="rounded bg-black/40 px-3 py-1 font-mono text-xs font-medium backdrop-blur-md">2.4k Penonton</div>
              </div>
            </div>
          </div>
        </Container>
        <div className="absolute left-1/2 top-1/2 h-[1000px] w-[1000px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-emerald/10 blur-[120px]" />
      </section>
    </div>
  );
}
