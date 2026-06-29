import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { SlidersHorizontal, Search } from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';
import { productsApi, categoriesApi } from '../lib/api';
import type { Product, Category } from '../types';
import { Container, ProductCard, Skeleton } from '../components/ui';
import { formatIDR } from '../lib/format';
import { cn } from '../lib/cn';

/** Ambil array dari berbagai bentuk respons (paginator Laravel, {data:[]}, atau array). */
function unwrapList<T>(payload: unknown): T[] {
  if (Array.isArray(payload)) return payload as T[];
  if (payload && typeof payload === 'object') {
    const obj = payload as Record<string, unknown>;
    if (Array.isArray(obj.data)) return obj.data as T[];
    if (obj.data && typeof obj.data === 'object' && Array.isArray((obj.data as Record<string, unknown>).data)) {
      return (obj.data as Record<string, unknown>).data as T[];
    }
  }
  return [];
}

const PRICE_MAX = 100_000_000;

export default function ProductListing() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  const [searchQuery, setSearchQuery] = useState('');
  const [priceRange, setPriceRange] = useState(PRICE_MAX);
  const [sortBy, setSortBy] = useState('relevance');

  const selectedCategory = searchParams.get('category') || '';

  useEffect(() => {
    let active = true;
    async function loadData() {
      try {
        const [catRes, prodRes] = await Promise.allSettled([categoriesApi.list(), productsApi.list({ per_page: 60 })]);
        if (!active) return;
        if (catRes.status === 'fulfilled') setCategories(unwrapList<Category>(catRes.value.data));
        if (prodRes.status === 'fulfilled') setProducts(unwrapList<Product>(prodRes.value.data));
      } finally {
        if (active) setLoading(false);
      }
    }
    loadData();
    return () => { active = false; };
  }, []);

  const filteredProducts = useMemo(() => {
    const q = searchQuery.toLowerCase();
    return products
      .filter((p) => {
        const matchesSearch = !q || p.name.toLowerCase().includes(q) || (p.brand?.name?.toLowerCase().includes(q) ?? false);
        const matchesCategory = !selectedCategory || p.category?.slug === selectedCategory;
        const matchesPrice = Number(p.price) <= priceRange;
        return matchesSearch && matchesCategory && matchesPrice;
      })
      .sort((a, b) => {
        if (sortBy === 'price-low') return Number(a.price) - Number(b.price);
        if (sortBy === 'price-high') return Number(b.price) - Number(a.price);
        if (sortBy === 'rating') return Number(b.rating ?? 0) - Number(a.rating ?? 0);
        return 0;
      });
  }, [products, searchQuery, selectedCategory, priceRange, sortBy]);

  const selectCategory = (slug: string) => setSearchParams(slug ? { category: slug } : {});
  const clearFilters = () => { setSearchQuery(''); selectCategory(''); setPriceRange(PRICE_MAX); setSortBy('relevance'); };

  return (
    <div className="min-h-screen bg-cream pt-28 pb-20">
      <Container>
        {/* Breadcrumb + judul */}
        <nav className="mb-6 text-sm text-muted">
          <Link to="/" className="hover:text-rose-600">Beranda</Link>
          <span className="mx-2 text-muted-soft">/</span>
          <span className="font-medium text-ink">Koleksi</span>
        </nav>
        <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="font-serif text-4xl font-bold text-ink">Koleksi Mewah</h1>
            <p className="mt-2 text-muted">Temukan barang pilihan dari brand & vendor kelas dunia.</p>
          </div>
          <span className="text-sm text-muted">
            Menampilkan <span className="font-bold text-ink">{filteredProducts.length}</span> produk
          </span>
        </div>

        <div className="flex flex-col gap-10 lg:flex-row">
          {/* Sidebar filter */}
          <aside className="vv-card vv-card-gold h-fit w-full flex-shrink-0 p-6 lg:sticky lg:top-28 lg:w-72">
            <div className="mb-6 flex items-center justify-between border-b border-line pb-4">
              <span className="font-serif text-lg font-bold text-ink">Filter</span>
              <SlidersHorizontal className="h-4 w-4 text-muted" />
            </div>

            <div className="mb-6">
              <h4 className="mb-3 text-xs font-bold uppercase tracking-wider text-muted">Kategori</h4>
              <div className="space-y-1">
                <button onClick={() => selectCategory('')}
                  className={cn('w-full rounded-xl px-3 py-2 text-left text-sm transition-colors',
                    selectedCategory === '' ? 'bg-rose-soft font-semibold text-rose-600' : 'text-muted hover:bg-surface-alt')}>
                  Semua Kategori
                </button>
                {categories.map((cat) => (
                  <button key={cat.id} onClick={() => selectCategory(cat.slug)}
                    className={cn('w-full rounded-xl px-3 py-2 text-left text-sm transition-colors',
                      selectedCategory === cat.slug ? 'bg-rose-soft font-semibold text-rose-600' : 'text-muted hover:bg-surface-alt')}>
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-6">
              <h4 className="mb-3 text-xs font-bold uppercase tracking-wider text-muted">Harga Maksimum</h4>
              <input type="range" min={500_000} max={PRICE_MAX} step={500_000} value={priceRange}
                onChange={(e) => setPriceRange(Number(e.target.value))}
                className="mb-2 w-full cursor-pointer accent-primary" />
              <div className="flex justify-between text-xs font-medium text-muted">
                <span>{formatIDR(500_000)}</span>
                <span className="font-bold text-ink">{formatIDR(priceRange)}</span>
              </div>
            </div>

            <button onClick={clearFilters}
              className="w-full rounded-xl bg-surface-alt py-2.5 text-xs font-bold text-muted transition-colors hover:bg-line">
              Hapus Semua Filter
            </button>
          </aside>

          {/* Konten */}
          <main className="flex-grow">
            <div className="vv-card mb-8 flex flex-col items-center justify-between gap-4 p-4 md:flex-row">
              <div className="relative w-full md:w-80">
                <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
                <input type="text" placeholder="Cari koleksi…" value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-2xl border border-line-strong bg-surface py-2.5 pl-10 pr-4 text-sm focus:border-rose focus:outline-none focus:ring-2 focus:ring-rose/20" />
              </div>
              <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}
                className="w-full cursor-pointer rounded-xl border border-line-strong bg-surface px-3 py-2.5 text-sm font-semibold text-ink focus:outline-none md:w-auto">
                <option value="relevance">Paling Relevan</option>
                <option value="price-low">Harga: Termurah</option>
                <option value="price-high">Harga: Termahal</option>
                <option value="rating">Rating Tertinggi</option>
              </select>
            </div>

            {loading ? (
              <div className="grid grid-cols-2 gap-6 lg:grid-cols-3">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="space-y-3">
                    <Skeleton className="aspect-[4/5] w-full" />
                    <Skeleton className="h-4 w-2/3" />
                    <Skeleton className="h-4 w-1/3" />
                  </div>
                ))}
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="vv-card flex flex-col items-center gap-4 py-20 text-center">
                <div className="grid h-16 w-16 place-items-center rounded-2xl bg-surface-alt text-muted">
                  <Search className="h-7 w-7" />
                </div>
                <p className="font-medium text-muted">Tidak ada produk yang cocok dengan kriteria Anda.</p>
                <button onClick={clearFilters}
                  className="rounded-full bg-primary px-6 py-2.5 text-xs font-bold text-white transition-colors hover:bg-primary-700">
                  Reset Filter
                </button>
              </div>
            ) : (
              <motion.div layout className="grid grid-cols-2 gap-6 lg:grid-cols-3">
                {filteredProducts.map((p) => <ProductCard key={p.id} product={p} />)}
              </motion.div>
            )}
          </main>
        </div>
      </Container>
    </div>
  );
}
