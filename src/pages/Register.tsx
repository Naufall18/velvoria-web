import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, Mail, Lock, BadgeCheck, Gift, Crown } from 'lucide-react';
import { authApi } from '../lib/api';
import { useAuthStore } from '../store/authStore';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { VelvoriaLogo } from '../components/ui/VelvoriaLogo';

export default function Register() {
  const navigate = useNavigate();
  const login = useAuthStore((s) => s.login);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== passwordConfirmation) {
      setError('Konfirmasi kata sandi tidak cocok.');
      return;
    }

    setLoading(true);
    try {
      const { data } = await authApi.register({
        name,
        email,
        password,
        password_confirmation: passwordConfirmation,
      });
      login(data.data.user, data.data.token);
      navigate('/dashboard');
    } catch (err) {
      const res = (err as { response?: { data?: { message?: string; errors?: Record<string, string[]> } } })?.response?.data;
      const firstError = res?.errors ? Object.values(res.errors)[0]?.[0] : undefined;
      setError(firstError ?? res?.message ?? 'Pendaftaran gagal. Silakan coba lagi.');
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
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-white/10 p-2 backdrop-blur">
              <VelvoriaLogo className="h-full w-full" />
            </span>
            <span className="font-serif text-2xl font-bold text-white">VELVORIA</span>
          </div>

          <div className="relative z-10">
            <h2 className="font-serif text-4xl font-bold leading-tight">
              Bergabung dengan<br />dunia kemewahan.
            </h2>
            <p className="mt-4 max-w-sm text-white/70">
              Buat akun untuk menikmati pengalaman belanja barang mewah & lifestyle terbaik.
            </p>
            <ul className="mt-8 space-y-3 text-sm text-white/80">
              <li className="flex items-center gap-3"><Crown className="h-5 w-5 text-rose" /> Status member & poin loyalitas</li>
              <li className="flex items-center gap-3"><Gift className="h-5 w-5 text-rose" /> Penawaran & hadiah eksklusif</li>
              <li className="flex items-center gap-3"><BadgeCheck className="h-5 w-5 text-rose" /> Checkout cepat & aman</li>
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
            <h1 className="font-serif text-3xl font-bold text-ink">Buat Akun</h1>
            <p className="mt-1 text-sm text-muted">Sudah punya akun?{' '}
              <Link to="/login" className="font-semibold text-rose-600 hover:text-rose">Masuk di sini</Link>
            </p>
          </div>

          {error && (
            <div className="mb-6 rounded-xl border border-danger-soft bg-danger-soft px-4 py-3 text-sm font-medium text-danger">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <Input
              label="Nama Lengkap" name="name" type="text" required
              icon={<User className="h-4 w-4" />}
              placeholder="Nama Anda"
              value={name} onChange={(e) => setName(e.target.value)}
            />
            <Input
              label="Email" name="email" type="email" required
              icon={<Mail className="h-4 w-4" />}
              placeholder="anda@email.com"
              value={email} onChange={(e) => setEmail(e.target.value)}
            />
            <Input
              label="Kata Sandi" name="password" type="password" required
              icon={<Lock className="h-4 w-4" />}
              placeholder="Minimal 8 karakter"
              value={password} onChange={(e) => setPassword(e.target.value)}
            />
            <Input
              label="Konfirmasi Kata Sandi" name="password_confirmation" type="password" required
              icon={<Lock className="h-4 w-4" />}
              placeholder="Ulangi kata sandi"
              value={passwordConfirmation} onChange={(e) => setPasswordConfirmation(e.target.value)}
            />

            <Button type="submit" size="lg" isLoading={loading} className="w-full">
              {loading ? 'Membuat akun…' : 'Daftar'}
            </Button>
          </form>

          <p className="mt-6 text-center text-xs leading-relaxed text-muted-soft">
            Dengan mendaftar, Anda menyetujui Syarat & Ketentuan serta Kebijakan Privasi Velvoria.
          </p>
        </motion.div>
      </div>
    </div>
  );
}
