import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, Star } from 'lucide-react';
import type { Product } from '../../types';
import { formatIDR, resolveImage } from '../../lib/format';
import { cn } from '../../lib/cn';

interface ProductCardProps {
  product: Product;
  onWish?: (p: Product) => void;
  wished?: boolean;
  className?: string;
}

export function ProductCard({ product, onWish, wished, className }: ProductCardProps) {
  const img = product.primaryImage?.image_url ?? product.primary_image?.image_url ?? product.images?.[0]?.image_url;
  const discount =
    product.compare_price && product.compare_price > product.price
      ? Math.round(((product.compare_price - product.price) / product.compare_price) * 100)
      : 0;

  return (
    <motion.div whileHover={{ y: -6 }} transition={{ type: 'spring', stiffness: 300, damping: 24 }} className={cn('group', className)}>
      <Link to={`/product/${product.slug}`} className="block vv-card vv-card-gold overflow-hidden">
        {/* Gambar */}
        <div className="relative aspect-[4/5] overflow-hidden bg-surface-alt">
          {img ? (
            <img
              src={resolveImage(img)}
              alt={product.name}
              loading="lazy"
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-muted-soft">
              <span className="font-serif text-2xl">V</span>
            </div>
          )}

          {discount > 0 && (
            <span className="absolute left-3 top-3 rounded-full bg-danger px-2.5 py-1 text-xs font-bold text-white">
              -{discount}%
            </span>
          )}

          {onWish && (
            <button
              type="button"
              aria-label="Tambah ke wishlist"
              onClick={(e) => { e.preventDefault(); onWish(product); }}
              className="absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full bg-white/85 text-ink backdrop-blur transition-colors hover:bg-white"
            >
              <Heart className={cn('h-4 w-4', wished && 'fill-danger text-danger')} />
            </button>
          )}
        </div>

        {/* Info */}
        <div className="p-4">
          {product.brand?.name && (
            <p className="mb-1 text-[11px] font-bold uppercase tracking-wider text-emerald">{product.brand.name}</p>
          )}
          <h3 className="truncate font-serif text-base font-semibold text-ink">{product.name}</h3>
          <div className="mt-2 flex items-center justify-between">
            <div className="flex items-baseline gap-2">
              <span className="text-sm font-bold text-ink">{formatIDR(product.price)}</span>
              {discount > 0 && (
                <span className="text-xs text-muted-soft line-through">{formatIDR(product.compare_price!)}</span>
              )}
            </div>
            {product.rating ? (
              <span className="flex items-center gap-1 text-xs font-semibold text-muted">
                <Star className="h-3.5 w-3.5 fill-warning text-warning" />
                {Number(product.rating).toFixed(1)}
              </span>
            ) : null}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
