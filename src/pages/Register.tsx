import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Lock, Loader2, ShoppingBag } from 'lucide-react';
import { authApi } from '../lib/api';
import { useAuthStore } from '../store/authStore';

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
      setError('Passwords do not match.');
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
      setError(firstError ?? res?.message ?? 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-28 pb-20 bg-[#FAF8F5] flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-[2rem] border border-gray-100 shadow-xl p-8 sm:p-10">
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 bg-[#1A1F3A] rounded-xl flex items-center justify-center mb-4">
            <ShoppingBag className="text-[#E8B4A0] w-6 h-6" />
          </div>
          <h1 className="text-3xl font-serif font-bold text-[#1A1F3A]">Join Velvoria</h1>
          <p className="text-sm text-gray-400 mt-1">Create your account to start shopping</p>
        </div>

        {error && (
          <div className="mb-6 rounded-xl bg-red-50 border border-red-100 px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">Full Name</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Jane Doe"
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#1A1F3A]/20 focus:border-[#1A1F3A]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#1A1F3A]/20 focus:border-[#1A1F3A]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#1A1F3A]/20 focus:border-[#1A1F3A]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">Confirm Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
              <input
                type="password"
                required
                value={passwordConfirmation}
                onChange={(e) => setPasswordConfirmation(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#1A1F3A]/20 focus:border-[#1A1F3A]"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-full bg-[#1A1F3A] text-white text-sm font-medium hover:bg-[#2D5F5D] transition-all shadow-lg shadow-blue-900/10 flex items-center justify-center gap-2 disabled:opacity-60"
          >
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            {loading ? 'Creating account…' : 'Create Account'}
          </button>
        </form>

        <p className="text-center text-sm text-gray-400 mt-8">
          Already have an account?{' '}
          <Link to="/login" className="font-bold text-[#1A1F3A] hover:text-[#E8B4A0] transition-colors">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
