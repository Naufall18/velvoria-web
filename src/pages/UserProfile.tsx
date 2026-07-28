import { useState } from 'react';
import { User, Mail, Lock, Save, Eye, EyeOff, ArrowLeft } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { userApi } from '../lib/api';
import { useAuthStore } from '../store/authStore';
import { Container } from '../components/ui';
import { cn } from '../lib/cn';

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted">{label}</label>
      {children}
    </div>
  );
}

const inputCls = (err?: string) =>
  cn(
    'h-11 w-full rounded-2xl border bg-surface px-4 text-sm text-ink placeholder:text-muted',
    'transition focus:outline-none focus:ring-2 focus:ring-primary/20',
    err ? 'border-danger focus:border-danger' : 'border-line-strong focus:border-primary',
  );

export default function UserProfile() {
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);

  // Profile form
  const [name, setName] = useState(user?.name ?? '');
  const [email, setEmail] = useState(user?.email ?? '');
  const [profileMsg, setProfileMsg] = useState('');
  const [profileErr, setProfileErr] = useState('');
  const [savingProfile, setSavingProfile] = useState(false);

  // Password form
  const [currentPw, setCurrentPw] = useState('');
  const [newPw, setNewPw] = useState('');
  const [confirmPw, setConfirmPw] = useState('');
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [pwMsg, setPwMsg] = useState('');
  const [pwErr, setPwErr] = useState('');
  const [savingPw, setSavingPw] = useState(false);

  async function handleSaveProfile(e: React.FormEvent) {
    e.preventDefault();
    setProfileMsg(''); setProfileErr('');
    if (!name.trim()) { setProfileErr('Nama tidak boleh kosong.'); return; }
    setSavingProfile(true);
    try {
      await userApi.updateProfile({ name, email });
      setProfileMsg('Profil berhasil diperbarui.');
    } catch {
      setProfileErr('Gagal menyimpan profil.');
    } finally {
      setSavingProfile(false);
    }
  }

  async function handleChangePassword(e: React.FormEvent) {
    e.preventDefault();
    setPwMsg(''); setPwErr('');
    if (newPw.length < 8) { setPwErr('Password baru minimal 8 karakter.'); return; }
    if (newPw !== confirmPw) { setPwErr('Konfirmasi password tidak cocok.'); return; }
    setSavingPw(true);
    try {
      await userApi.updatePassword({
        current_password: currentPw,
        password: newPw,
        password_confirmation: confirmPw,
      });
      setPwMsg('Password berhasil diubah. Silakan login ulang.');
      setTimeout(() => { useAuthStore.getState().logout(); navigate('/login'); }, 2000);
    } catch {
      setPwErr('Password saat ini salah atau terjadi kesalahan.');
    } finally {
      setSavingPw(false);
    }
  }

  return (
    <div className="min-h-screen bg-cream pt-28 pb-20">
      <Container>
        <div className="mx-auto max-w-lg">
          {/* Header */}
          <div className="mb-8 flex items-center gap-4">
            <Link
              to="/dashboard"
              className="grid h-10 w-10 place-items-center rounded-2xl border border-line-strong bg-surface text-ink hover:bg-surface-alt"
            >
              <ArrowLeft size={17} />
            </Link>
            <div>
              <h1 className="font-serif text-2xl font-bold text-ink">Pengaturan Akun</h1>
              <p className="text-sm text-muted">Kelola profil dan keamanan akunmu</p>
            </div>
          </div>

          {/* Avatar */}
          <div className="mb-8 flex items-center gap-4 rounded-3xl border border-gold/30 bg-surface p-6">
            <div className="grid h-16 w-16 place-items-center rounded-full bg-primary/10 font-serif text-2xl font-bold text-primary">
              {user?.name?.charAt(0).toUpperCase() ?? 'V'}
            </div>
            <div>
              <p className="font-semibold text-ink">{user?.name}</p>
              <p className="text-sm text-muted">{user?.email}</p>
            </div>
          </div>

          {/* Form Profil */}
          <form onSubmit={handleSaveProfile} className="mb-8 space-y-5 rounded-3xl border border-line-strong bg-surface p-6">
            <h2 className="flex items-center gap-2 font-serif text-lg font-semibold text-ink">
              <User size={18} className="text-primary" />
              Informasi Profil
            </h2>

            <Field label="Nama Lengkap">
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={inputCls(profileErr && !name.trim() ? profileErr : '')}
              />
            </Field>

            <Field label="Email">
              <div className="relative">
                <Mail size={15} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={cn(inputCls(), 'pl-10')}
                />
              </div>
            </Field>

            {profileMsg && <p className="text-sm font-medium text-success">{profileMsg}</p>}
            {profileErr && <p className="text-sm font-medium text-danger">{profileErr}</p>}

            <button
              type="submit"
              disabled={savingProfile}
              className="inline-flex items-center gap-2 rounded-2xl bg-ink px-5 py-2.5 text-sm font-semibold text-cream transition-opacity hover:opacity-80 disabled:opacity-50"
            >
              <Save size={15} />
              {savingProfile ? 'Menyimpan…' : 'Simpan Profil'}
            </button>
          </form>

          {/* Form Password */}
          <form onSubmit={handleChangePassword} className="space-y-5 rounded-3xl border border-line-strong bg-surface p-6">
            <h2 className="flex items-center gap-2 font-serif text-lg font-semibold text-ink">
              <Lock size={18} className="text-primary" />
              Ganti Password
            </h2>

            <Field label="Password Saat Ini">
              <input
                type="password"
                value={currentPw}
                onChange={(e) => setCurrentPw(e.target.value)}
                autoComplete="current-password"
                className={inputCls()}
              />
            </Field>

            <Field label="Password Baru">
              <div className="relative">
                <input
                  type={showNew ? 'text' : 'password'}
                  value={newPw}
                  onChange={(e) => setNewPw(e.target.value)}
                  autoComplete="new-password"
                  className={cn(inputCls(), 'pr-11')}
                />
                <button
                  type="button"
                  onClick={() => setShowNew((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-ink"
                >
                  {showNew ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
              <p className="mt-1 text-xs text-muted">Minimal 8 karakter</p>
            </Field>

            <Field label="Konfirmasi Password Baru">
              <div className="relative">
                <input
                  type={showConfirm ? 'text' : 'password'}
                  value={confirmPw}
                  onChange={(e) => setConfirmPw(e.target.value)}
                  autoComplete="new-password"
                  className={cn(inputCls(), 'pr-11')}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-ink"
                >
                  {showConfirm ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </Field>

            {pwMsg && <p className="text-sm font-medium text-success">{pwMsg}</p>}
            {pwErr && <p className="text-sm font-medium text-danger">{pwErr}</p>}

            <button
              type="submit"
              disabled={savingPw}
              className="inline-flex items-center gap-2 rounded-2xl border border-line-strong bg-surface px-5 py-2.5 text-sm font-semibold text-ink transition-colors hover:bg-surface-alt disabled:opacity-50"
            >
              <Lock size={15} />
              {savingPw ? 'Menyimpan…' : 'Ubah Password'}
            </button>
          </form>
        </div>
      </Container>
    </div>
  );
}
