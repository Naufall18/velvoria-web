import { Link } from 'react-router-dom';
import { Home, Search, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import { Container } from '../components/ui';

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center bg-cream pt-20">
      <Container>
        <div className="mx-auto flex max-w-lg flex-col items-center gap-6 py-24 text-center">
          {/* Angka 404 animasi */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="select-none font-serif text-[8rem] font-bold leading-none tracking-tighter text-ink/8"
            aria-hidden
          >
            404
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="space-y-3"
          >
            <h1 className="font-serif text-3xl font-bold text-ink">
              Halaman Tidak Ditemukan
            </h1>
            <p className="leading-relaxed text-muted">
              Halaman yang kamu cari mungkin sudah dipindahkan, dihapus,
              atau tidak pernah ada.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="flex flex-wrap justify-center gap-3"
          >
            <Link
              to="/"
              className="inline-flex items-center gap-2 rounded-2xl bg-primary px-5 py-3 font-semibold text-white shadow-lg shadow-primary/15 transition-colors hover:bg-primary-700"
            >
              <Home size={17} />
              Kembali ke Beranda
            </Link>
            <Link
              to="/products"
              className="inline-flex items-center gap-2 rounded-2xl border border-line-strong bg-surface px-5 py-3 font-semibold text-ink transition-colors hover:border-primary/30 hover:text-rose-600"
            >
              <Search size={17} />
              Jelajahi Koleksi
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.35 }}
          >
            <button
              onClick={() => window.history.back()}
              className="inline-flex items-center gap-1.5 text-sm font-medium text-muted transition-colors hover:text-rose-600"
            >
              <ArrowLeft size={14} />
              Kembali ke halaman sebelumnya
            </button>
          </motion.div>
        </div>
      </Container>
    </div>
  );
}
