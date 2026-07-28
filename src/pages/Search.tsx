import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Search as SearchIcon, SlidersHorizontal, X, ArrowLeft } from 'lucide-react';
import { searchApi } from '../lib/api';
import type { Product } from '../types';
import { Container, ProductCard, Skeleton } from '../components/ui';
import { cn } from '../lib/cn';

const SORT_OPTIONS = [
  { value: 'relevance', label: 'Relevansi' },
  { value: 'price_asc', label: 'Harga Terendah' },
  { value: 'price_desc', label: 'Harga Tertinggi' },
  { value: 'rating', label: 'Rating Terbaik' },
  { value: 'newest', label: 'Terbaru' },
];

function unwrapProducts(payload: unknown): Product[] {
  if (!payload || typeof payload !== 'object') return [];
  const obj = payload as Record<string, unknown>;
  const data = obj.data as Record<string, unknown> | undefined;
  if (data && Array.isArray(data.data)) return data.data as Product[];
  if (Array.isArray((data?.products as Record<string, unknown> | undefined)?.data)) {
    return ((data?.products as Record<string, unknown>).data) as Product[];
  }
  return [];
}

export default function Search() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('q') ?? '');
  const [inputValue, setInputValue] = useState(query);
  const [sort, setSort] = useState('relevance');
  const [showFilter, setShowFilter] = useState(false);
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [products, setProducts] = useState<Product[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const q = searchParams.get('q') ?? '';
    setQuery(q);
    setInputValue(q);
  }, [searchParams]);

  useEffect(() => {
    let active = true;
    if (!query.trim()) { setProducts([]); setTotal(0); return; }
    setLoading(true);
    searchApi.search({
      q: query,
      sort,
      min_price: minPrice ? Number(minPrice) : undefined,
      max_price: maxPrice ? Number(maxPrice) : undefined,
    })
      .then((res) => {
        if (!active) return;
        setProducts(unwrapProducts(res.data));
        const data = (res.data as Record<string, unknown>)?.data as Record<string, unknown> | undefined;
        setTotal(Number(data?.total ?? 0));
      })
      .catch(() => { if (active) setProducts([]); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [query, sort, minPrice, maxPrice]);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    setSearchParams(inputValue.trim() ? { q: inputValue.trim() } : {});
  }

  function clearSearch() {
    setInputValue('');
    setSearchParams({});
    setProducts([]);
    setTotal(0);
  }

  return (
    <div className="min-h-screen bg-cream pt-28 pb-20">
      <Container>
        {/* Search bar */}
        <form onSubmit={handleSearch} className="mb-8 flex gap-3">
          <Link to="/" className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl border border-line-strong bg-surface text-ink hover:bg-surface-alt">
            <ArrowLeft size={18} />
          </Link>
          <div className="relative flex-1">
            <SearchIcon className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted" />
            <input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Cari produk mewah…"
              className="h-12 w-full rounded-2xl border border-line-strong bg-surface pl-12 pr-10 text-sm text-ink placeholder:text-muted focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              autoFocus
            />
            {inputValue && (
              <button
                type="button"
                onClick={clearSearch}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-ink"
              >
                <X size={16} />
              </button>
            )}
          </div>
          <button
            type="button"
            onClick={() => setShowFilter((v) => !v)}
            className={cn(
              'grid h-12 w-12 shrink-0 place-items-center rounded-2xl border transition-colors',
              showFilter
                ? 'border-primary bg-primary text-white'
                : 'border-line-strong bg-surface text-ink hover:bg-surface-alt',
            )}
          >
            <SlidersHorizontal size={18} />
          </button>
        </form>

        {/* Filter panel */}
        {showFilter && (
          <div className="mb-6 rounded-2xl border border-line-strong bg-surface p-5">
            <div className="flex flex-wrap items-end gap-4">
              <div className="flex-1 min-w-40">
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted">Harga Minimum</label>
                <input
                  type="number"
                  placeholder="Rp 0"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                  className="h-10 w-full rounded-xl border border-line-strong bg-bg px-3 text-sm text-ink focus:border-primary focus:outline-none"
                />
              </div>
              <div className="flex-1 min-w-40">
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted">Harga Maksimum</label>
                <input
                  type="number"
                  placeholder="Tidak terbatas"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  className="h-10 w-full rounded-xl border border-line-strong bg-bg px-3 text-sm text-ink focus:border-primary focus:outline-none"
                />
              </div>
              <div className="flex-1 min-w-40">
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted">Urutkan</label>
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value)}
                  className="h-10 w-full rounded-xl border border-line-strong bg-bg px-3 text-sm text-ink focus:border-primary focus:outline-none"
                >
                  {SORT_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
              </div>
              <button
                onClick={() => { setMinPrice(''); setMaxPrice(''); setSort('relevance'); }}
                className="h-10 rounded-xl border border-line-strong px-4 text-sm font-semibold text-muted hover:bg-surface-alt"
              >
                Reset
              </button>
            </div>
          </div>
        )}

        {/* Sort chips (collapsed) */}
        {!showFilter && query && (
          <div className="mb-6 flex flex-wrap gap-2">
            {SORT_OPTIONS.map((o) => (
              <button
                key={o.value}
                onClick={() => setSort(o.value)}
                className={cn(
                  'rounded-full border px-3 py-1 text-xs font-semibold transition-colors',
                  sort === o.value
                    ? 'border-ink bg-ink text-cream'
                    : 'border-line-strong bg-surface text-muted hover:border-ink/40',
                )}
              >
                {o.label}
              </button>
            ))}
          </div>
        )}

        {/* Hasil */}
        {query && (
          <p className="mb-4 text-sm text-muted">
            {loading ? 'Mencari…' : `${total} hasil untuk "${query}"`}
          </p>
        )}

        {loading ? (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i}>
                <Skeleton className="aspect-[4/5] rounded-2xl" />
                <div className="mt-2 space-y-1.5">
                  <Skeleton className="h-3 w-2/3 rounded" />
                  <Skeleton className="h-4 w-1/2 rounded" />
                </div>
              </div>
            ))}
          </div>
        ) : products.length > 0 ? (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {products.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        ) : query ? (
          <div className="flex flex-col items-center gap-4 py-20 text-center">
            <span className="grid h-20 w-20 place-items-center rounded-full bg-surface-alt text-muted">
              <SearchIcon size={36} strokeWidth={1.25} />
            </span>
            <div>
              <p className="font-serif text-lg font-semibold text-ink">Tidak ada hasil</p>
              <p className="mt-1 text-sm text-muted">Coba kata kunci lain atau ubah filter.</p>
            </div>
            <Link to="/products" className="text-sm font-semibold text-rose-600 hover:underline">
              Jelajahi semua koleksi
            </Link>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3 py-20 text-center">
            <SearchIcon size={48} className="text-muted-soft" strokeWidth={1} />
            <p className="text-muted">Ketik kata kunci untuk mencari produk</p>
          </div>
        )}
      </Container>
    </div>
  );
}
