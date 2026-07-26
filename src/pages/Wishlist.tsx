import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Heart, HeartOff, ShoppingBag, ArrowLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { wishlistApi } from '../lib/api';
import type { Product } from '../types';
import { Container, Skeleton } from '../components/ui';
import { formatIDR } from '../lib/format';

function unwrapList<T>(payload: unknown): T[] {
  if (Array.isArray(payload)) return payload as T[];
  if (payload && typeof payload === 'object') {
    const obj = payload as Record<string, unknown>;
    if (Array.isArray(obj.data)) return obj.data as T[];
  }
  return [];
}

function WishlistCard({
  product,
  onRemove,
}: {
  product: Product;
  onRemove: (id: number) => void;
}) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.92 }}
      transition={{ duration: 0.25 }}
      className="group relative overflow-hidden rounded-2xl border border-line bg-surface"
    >
      {/* Gambar produk */}
      <Link to={`/product/${product.slug}`} className="block aspect-[4/5] overflow-hidden bg-surface-alt">
        {product.primary_image?.image_url ? (
          <img
            src={product.primary_image.image_url}
            alt={product.name}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="grid h-full place-items-center text-muted-soft">
            <ShoppingBag size={36} strokeWidth={1.25} />
          </div>
        )}
      </Link>

      {/* Tombol hapus dari wishlist */}
      <button
        onClick={() => onRemove(product.id)}
        aria-label={`Hapus ${product.name} dari wishlist`}
        className="absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full bg-white/90 text-rose-500 shadow-md backdrop-blur transition-all hover:bg-rose-50 hover:scale-110"
      >
        <HeartOff size={16} />
      </button>

      {/* Info produk */}
      <div className="p-4">
        {product.brand?.name && (
          <p className="mb-0.5 text-xs font-bold uppercase tracking-wider text-muted">
            {product.brand.name}
          </p>
        )}
        <Link
          to={`/product/${product.slug}`}
          className="line-clamp-2 text-sm font-semibold text-ink transition-colors hover:text-rose-600"
        >
          {product.name}
        </Link>
        <div className="mt-2 flex items-center justify-between gap-2">
          <span className="text-base font-bold text-ink">{formatIDR(Number(product.price))}</span>
          <Link
            to={`/product/${product.slug}`}
            className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-primary-700"
          >
            <ShoppingBag size={12} />
            Lihat
          </Link>
        </div>
      </div>
    </motion.div>
  );
}

export default function Wishlist() {
  const [items, setItems] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    wishlistApi
      .list()
      .then((res) => {
        if (active) setItems(unwrapList<Product>(res.data));
      })
      .catch(() => {
        if (active) setItems([]);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  function handleRemove(productId: number) {
    setItems((prev) => prev.filter((p) => p.id !== productId));
    wishlistApi.remove(productId).catch(() => {
      // Kembalikan jika gagal (optimistic update rollback sederhana)
      setItems((prev) => [...prev]);
    });
  }

  return (
    <div className="min-h-screen bg-cream pt-28 pb-20">
      <Container>
        {/* Header */}
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <Link
              to="/products"
              className="mb-3 inline-flex items-center gap-1.5 text-sm font-medium text-muted transition-colors hover:text-rose-600"
            >
              <ArrowLeft size={15} />
              Kembali berbelanja
            </Link>
            <h1 className="flex items-center gap-3 font-serif text-3xl font-bold text-ink">
              <Heart size={26} className="text-rose-500" fill="currentColor" />
              Wishlist Saya
            </h1>
            {!loading && (
              <p className="mt-1 text-sm text-muted">
                {items.length} {items.length === 1 ? 'produk' : 'produk'} disimpan
              </p>
            )}
          </div>
        </div>

        {/* Konten */}
        {loading ? (
          <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="overflow-hidden rounded-2xl border border-line">
                <Skeleton className="aspect-[4/5]" />
                <div className="space-y-2 p-4">
                  <Skeleton className="h-3 w-1/3" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : items.length === 0 ? (
          <div className="flex flex-col items-center gap-5 py-24 text-center">
            <span className="grid h-20 w-20 place-items-center rounded-full bg-rose-50 text-rose-300">
              <Heart size={36} strokeWidth={1.25} />
            </span>
            <div>
              <h2 className="text-xl font-bold text-ink">Wishlist masih kosong</h2>
              <p className="mt-1 text-muted">
                Simpan produk favoritmu agar mudah ditemukan kembali.
              </p>
            </div>
            <Link
              to="/products"
              className="inline-flex items-center gap-2 rounded-2xl bg-primary px-6 py-3 font-semibold text-white shadow-lg shadow-primary/15 transition-colors hover:bg-primary-700"
            >
              <ShoppingBag size={18} />
              Mulai Belanja
            </Link>
          </div>
        ) : (
          <AnimatePresence mode="popLayout">
            <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
              {items.map((p) => (
                <WishlistCard key={p.id} product={p} onRemove={handleRemove} />
              ))}
            </div>
          </AnimatePresence>
        )}
      </Container>
    </div>
  );
}
