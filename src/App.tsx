import { ShoppingBag, Menu, X, User, Search as SearchIcon, Heart } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Routes, Route, Link, useLocation, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/authStore';
import Home from './pages/Home';
import ProductListing from './pages/ProductListing';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Dashboard from './pages/Dashboard';
import OrderDetail from './pages/OrderDetail';
import Login from './pages/Login';
import Register from './pages/Register';
import Wishlist from './pages/Wishlist';
import NotFound from './pages/NotFound';
import Search from './pages/Search';
import UserProfile from './pages/UserProfile';
import { Container, VelvoriaLogo } from './components/ui';
import { cn } from './lib/cn';

const NAV = [
  { label: 'Koleksi', to: '/products' },
  { label: 'Baru', to: '/products?sort=new' },
  { label: 'Brand', to: '/products' },
  { label: 'Live Shopping', to: '/products' },
];

function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <nav className={cn(
      'fixed inset-x-0 top-0 z-50 transition-all duration-300',
      scrolled ? 'bg-cream/85 backdrop-blur-md border-b border-line shadow-sm' : 'bg-transparent',
    )}>
      <Container>
        <div className="flex h-20 items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-primary p-2">
              <VelvoriaLogo className="h-full w-full" />
            </span>
            <span className="font-serif text-2xl font-bold tracking-tight text-ink">VELVORIA</span>
          </Link>

          <div className="hidden items-center gap-8 lg:flex">
            {NAV.map((n) => (
              <Link key={n.label} to={n.to} className="text-sm font-medium text-ink/80 transition-colors hover:text-rose-600">
                {n.label}
              </Link>
            ))}
          </div>

          <div className="hidden items-center gap-1 md:flex">
            <Link to="/search" aria-label="Cari" className="grid h-11 w-11 place-items-center rounded-full text-ink transition-colors hover:bg-surface-alt">
              <SearchIcon className="h-5 w-5" />
            </Link>
            <Link to="/dashboard" aria-label="Wishlist" className="grid h-11 w-11 place-items-center rounded-full text-ink transition-colors hover:bg-surface-alt">
              <Heart className="h-5 w-5" />
            </Link>
            <Link to="/cart" aria-label="Keranjang" className="grid h-11 w-11 place-items-center rounded-full text-ink transition-colors hover:bg-surface-alt">
              <ShoppingBag className="h-5 w-5" />
            </Link>
            <Link to="/login" className="ml-2 inline-flex h-11 items-center gap-2 rounded-full bg-primary px-5 text-sm font-semibold text-white shadow-lg shadow-primary/15 transition-colors hover:bg-primary-700">
              <User className="h-4 w-4" /> Masuk
            </Link>
          </div>

          <button className="md:hidden" aria-label="Menu" onClick={() => setOpen(!open)}>
            {open ? <X /> : <Menu />}
          </button>
        </div>
      </Container>

      {open && (
        <div className="border-b border-line bg-cream px-6 py-4 md:hidden">
          <div className="space-y-1">
            {NAV.map((n) => (
              <Link key={n.label} to={n.to} onClick={() => setOpen(false)} className="block rounded-xl px-3 py-2.5 text-sm font-medium hover:bg-surface-alt">
                {n.label}
              </Link>
            ))}
            <div className="grid grid-cols-2 gap-2 pt-2">
              <Link to="/cart" onClick={() => setOpen(false)} className="rounded-xl bg-surface-alt px-3 py-2.5 text-center text-sm font-medium">Keranjang</Link>
              <Link to="/login" onClick={() => setOpen(false)} className="rounded-xl bg-primary px-3 py-2.5 text-center text-sm font-semibold text-white">Masuk</Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}

function Footer() {
  const cols = [
    { title: 'Jelajahi', links: ['Koleksi', 'New Arrivals', 'Brand Pilihan', 'Live Shopping'] },
    { title: 'Perusahaan', links: ['Tentang Kami', 'Jual di Velvoria', 'Kebijakan Privasi', 'Syarat & Ketentuan'] },
  ];
  return (
    <footer className="mt-24 border-t border-line bg-surface pt-16 pb-10">
      <Container>
        <div className="grid gap-12 md:grid-cols-4">
          <div className="md:col-span-2">
            <div className="mb-5 flex items-center gap-2.5">
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-primary p-2">
                <VelvoriaLogo className="h-full w-full" />
              </span>
              <span className="font-serif text-2xl font-bold text-ink">VELVORIA</span>
            </div>
            <p className="mb-6 max-w-sm leading-relaxed text-muted">
              Marketplace premier untuk barang mewah & lifestyle. Mendefinisikan ulang keunggulan dalam e-commerce.
            </p>
            <div className="flex gap-3">
              {['FB', 'IG', 'TW', 'LI'].map((s) => (
                <span key={s} className="grid h-10 w-10 cursor-pointer place-items-center rounded-full border border-line-strong text-xs font-bold text-muted transition-colors hover:border-rose hover:text-rose-600">
                  {s}
                </span>
              ))}
            </div>
          </div>
          {cols.map((c) => (
            <div key={c.title}>
              <h4 className="mb-5 font-serif text-lg font-bold text-ink">{c.title}</h4>
              <ul className="space-y-3 text-sm text-muted">
                {c.links.map((l) => (
                  <li key={l}><Link to="/products" className="transition-colors hover:text-rose-600">{l}</Link></li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-line pt-8 md:flex-row">
          <p className="text-sm text-muted">© 2026 Velvoria Marketplace. Seluruh hak cipta dilindungi.</p>
          <div className="flex items-center gap-2 text-xs font-semibold text-muted-soft">
            <span className="rounded-md border border-line-strong px-2 py-1">VISA</span>
            <span className="rounded-md border border-line-strong px-2 py-1">Mastercard</span>
            <span className="rounded-md border border-line-strong px-2 py-1">COD</span>
          </div>
        </div>
      </Container>
    </footer>
  );
}

function RequireAuth({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const location = useLocation();
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }
  return <>{children}</>;
}

function App() {
  const location = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [location.pathname]);

  return (
    <div className="min-h-screen bg-cream font-sans text-ink">
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<ProductListing />} />
        <Route path="/product/:slug" element={<ProductDetail />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<RequireAuth><Checkout /></RequireAuth>} />
        <Route path="/dashboard" element={<RequireAuth><Dashboard /></RequireAuth>} />
        <Route path="/order/:id" element={<RequireAuth><OrderDetail /></RequireAuth>} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/wishlist" element={<RequireAuth><Wishlist /></RequireAuth>} />
        <Route path="/search" element={<Search />} />
        <Route path="/profile" element={<RequireAuth><UserProfile /></RequireAuth>} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Footer />
    </div>
  );
}

export default App;
