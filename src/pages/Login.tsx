import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, ShoppingBag, ShieldCheck, Truck, Sparkles } from 'lucide-react';
import { authApi } from '../lib/api';
import { useAuthStore } from '../store/authStore';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';

export default function Login() {
  const navigate = useNavigate();
  const login = useAuthStore((s) => s.login);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const { data } = await authApi.login({ email, password });
      login(data.data.user, data.data.token);
      navigate('/dashboard');
    } catch (err) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ??
        'Login gagal. Periksa kembali email dan kata sandi Anda.';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-cream px-4 pt-24 pb-16">
      <div className="mx-auto grid w-full max-w-5xl overflow-hidden rounded-[2rem] border border-line bg-surface shadow-xl lg:grid-cols-2">
        {/* Panel brand (kiri) */}
        <div className="vv-hero relative hidden flex-col justify-between p-10 text-white lg:flex">
          <div className="relative z-10 flex items-center gap-2.5">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-white/10 backdrop-blur">
              <ShoppingBag className="h-5 w-5 text-rose" />
            </span>
            <span className="font-serif text-2xl font-bold">VELVORIA</span>
          </div>

          <div className="relative z-10">
            <h2 className="font-serif text-4xl font-bold leading-tight">
              Selamat datang<br />kembali.
            </h2>
            <p className="mt-4 max-w-sm text-white/70">
              Lanjutkan pengalaman belanja mewah Anda bersama brand & vendor kelas dunia.
            </p>
            <ul className="mt-8 space-y-3 text-sm text-white/80">
              <li className="flex items-center gap-3"><ShieldCheck className="h-5 w-5 text-rose" /> Jaminan keaslian setiap produk</li>
              <li className="flex items-center gap-3"><Truck className="h-5 w-5 text-rose" /> Pengiriman aman & terlacak</li>
              <li className="flex items-center gap-3"><Sparkles className="h-5 w-5 text-rose" /> Akses koleksi eksklusif lebih dulu</li>
            </ul>
          </div>

          <span className="relative z-10 text-xs text-white/50">© 2026 Velvoria Marketplace</span>
        </div>

        {/* Form (kanan) */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="p-8 sm:p-12"
        >
          <div className="mb-8">
            <h1 className="font-serif text-3xl font-bold text-ink">Masuk ke Akun</h1>
            <p className="mt-1 text-sm text-muted">Belum punya akun?{' '}
              <Link to="/register" className="font-semibold text-rose-600 hover:text-rose">Daftar sekarang</Link>
            </p>
          </div>

          {error && (
            <div className="mb-6 rounded-xl border border-danger-soft bg-danger-soft px-4 py-3 text-sm font-medium text-danger">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <Input
              label="Email" name="email" type="email" required
              icon={<Mail className="h-4 w-4" />}
              placeholder="anda@email.com"
              value={email} onChange={(e) => setEmail(e.target.value)}
            />
            <Input
              label="Kata Sandi" name="password" type="password" required
              icon={<Lock className="h-4 w-4" />}
              placeholder="••••••••"
              value={password} onChange={(e) => setPassword(e.target.value)}
            />

            <div className="flex items-center justify-between text-sm">
              <label className="flex cursor-pointer items-center gap-2 text-muted">
                <input type="checkbox" className="h-4 w-4 rounded border-line-strong accent-primary" />
                Ingat saya
              </label>
              <Link to="/login" className="font-semibold text-rose-600 hover:text-rose">Lupa sandi?</Link>
            </div>

            <Button type="submit" size="lg" isLoading={loading} className="w-full">
              {loading ? 'Memproses…' : 'Masuk'}
            </Button>
          </form>

          <div className="my-7 flex items-center gap-4">
            <span className="h-px flex-1 bg-line" />
            <span className="text-xs font-medium uppercase tracking-wider text-muted-soft">atau lanjut dengan</span>
            <span className="h-px flex-1 bg-line" />
          </div>

          <div className="grid grid-cols-3 gap-3">
            {['Google', 'Apple', 'Facebook'].map((p) => (
              <button key={p} type="button" className="rounded-2xl border border-line-strong py-3 text-sm font-semibold text-ink transition-colors hover:border-primary hover:bg-surface-alt">
                {p}
              </button>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
