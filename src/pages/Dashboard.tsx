import { useState, useEffect } from 'react';
import { User, ShieldCheck, ShoppingBag, Award, LogOut, Package } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { authApi, ordersApi } from '../lib/api';
import { useAuthStore } from '../store/authStore';
import type { Order } from '../types';
import { Container, Badge, Skeleton } from '../components/ui';
import { formatIDR } from '../lib/format';
import { cn } from '../lib/cn';

const STATUS: Record<string, { label: string; tone: 'success' | 'info' | 'warning' | 'danger' | 'neutral' }> = {
  delivered: { label: 'Selesai', tone: 'success' },
  shipped: { label: 'Dikirim', tone: 'info' },
  processing: { label: 'Diproses', tone: 'warning' },
  pending: { label: 'Menunggu', tone: 'warning' },
  cancelled: { label: 'Dibatalkan', tone: 'danger' },
};

export default function Dashboard() {
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const [activeTab, setActiveTab] = useState<'profile' | 'orders' | 'loyalty'>('profile');
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    async function load() {
      try {
        const res = await ordersApi.list();
        const list = res.data?.orders ?? res.data?.data?.orders ?? res.data?.data ?? [];
        if (active) setOrders(Array.isArray(list) ? list : (list?.data ?? []));
      } catch {
        if (active) setOrders([]);
      } finally {
        if (active) setLoading(false);
      }
    }
    load();
    return () => { active = false; };
  }, []);

  const handleLogout = async () => {
    try { await authApi.logout(); } catch { /* local logout below */ }
    useAuthStore.getState().logout();
    navigate('/');
  };

  const name = user?.name ?? 'Tamu';
  const email = user?.email ?? '—';
  const points = orders.length * 250;

  const tabs = [
    { key: 'profile' as const, label: 'Profil Saya', icon: User },
    { key: 'orders' as const, label: 'Riwayat Pesanan', icon: ShoppingBag },
    { key: 'loyalty' as const, label: 'Klub Loyalitas', icon: Award },
  ];

  return (
    <div className="min-h-screen bg-cream pt-28 pb-20">
      <Container>
        <div className="flex flex-col gap-10 lg:flex-row">
          {/* Sidebar */}
          <aside className="vv-card h-fit w-full flex-shrink-0 p-6 lg:w-72">
            <div className="mb-6 flex items-center gap-4 border-b border-line pb-6">
              <div className="grid h-12 w-12 place-items-center rounded-full bg-primary font-serif text-xl font-bold text-rose">
                {name.charAt(0).toUpperCase()}
              </div>
              <div className="min-w-0">
                <h3 className="truncate font-bold text-ink">{name}</h3>
                <span className="truncate text-xs text-muted">{email}</span>
              </div>
            </div>
            <div className="space-y-1">
              {tabs.map((t) => (
                <button key={t.key} onClick={() => setActiveTab(t.key)}
                  className={cn('flex w-full items-center gap-3 rounded-xl px-4 py-2.5 text-left text-sm font-medium transition-colors',
                    activeTab === t.key ? 'bg-primary text-white' : 'text-muted hover:bg-surface-alt')}>
                  <t.icon className="h-4 w-4" /> {t.label}
                </button>
              ))}
              <div className="my-3 h-px bg-line" />
              <button onClick={handleLogout} className="flex w-full items-center gap-3 rounded-xl px-4 py-2.5 text-left text-sm font-medium text-danger transition-colors hover:bg-danger-soft">
                <LogOut className="h-4 w-4" /> Keluar
              </button>
            </div>
          </aside>

          {/* Konten */}
          <main className="vv-card min-h-[500px] flex-grow p-8 sm:p-10">
            {activeTab === 'profile' && (
              <div>
                <h2 className="mb-8 border-b border-line pb-4 font-serif text-3xl font-bold text-ink">Profil Akun</h2>
                <div className="mb-10 grid gap-6 sm:grid-cols-3">
                  {[
                    { icon: ShoppingBag, tone: 'text-info bg-info-soft', label: 'Total Pesanan', value: orders.length },
                    { icon: Award, tone: 'text-rose-600 bg-rose-soft', label: 'Level Klub', value: 'Platinum' },
                    { icon: ShieldCheck, tone: 'text-success bg-success-soft', label: 'Status', value: 'Terverifikasi' },
                  ].map((s) => (
                    <div key={s.label} className="flex items-center gap-4 rounded-2xl bg-surface-alt p-5">
                      <span className={cn('grid h-10 w-10 place-items-center rounded-full', s.tone)}><s.icon className="h-5 w-5" /></span>
                      <div>
                        <div className="text-xs font-bold uppercase text-muted">{s.label}</div>
                        <div className="text-xl font-bold text-ink">{s.value}</div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="max-w-xl space-y-1 text-sm">
                  {[['Nama Lengkap', name], ['Email', email], ['Bergabung', '2026']].map(([k, v]) => (
                    <div key={k} className="grid grid-cols-2 border-b border-line py-3">
                      <span className="font-medium text-muted">{k}</span><span className="font-bold text-ink">{v}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'orders' && (
              <div>
                <h2 className="mb-8 border-b border-line pb-4 font-serif text-3xl font-bold text-ink">Riwayat Pesanan</h2>
                {loading ? (
                  <div className="space-y-3">{Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-16 w-full" />)}</div>
                ) : orders.length === 0 ? (
                  <div className="flex flex-col items-center gap-3 py-16 text-center">
                    <div className="grid h-14 w-14 place-items-center rounded-2xl bg-surface-alt text-muted"><Package className="h-6 w-6" /></div>
                    <p className="text-muted">Belum ada pesanan.</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                      <thead>
                        <tr className="border-b border-line text-xs uppercase tracking-wide text-muted">
                          <th className="pb-3 font-bold">No. Pesanan</th><th className="pb-3 font-bold">Tanggal</th>
                          <th className="pb-3 font-bold">Total</th><th className="pb-3 font-bold">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-line">
                        {orders.map((o) => {
                          const st = STATUS[o.status?.toLowerCase()] ?? { label: o.status, tone: 'neutral' as const };
                          return (
                            <tr key={o.id} onClick={() => navigate(`/order/${o.id}`)}
                              className="cursor-pointer transition hover:bg-surface-alt/50">
                              <td className="py-4 font-mono font-semibold text-ink">{o.order_number ?? `VLV-${o.id}`}</td>
                              <td className="py-4 font-mono text-muted">{o.created_at ? new Date(o.created_at).toLocaleDateString('id-ID') : '—'}</td>
                              <td className="py-4 font-mono font-semibold text-ink">{formatIDR(o.total)}</td>
                              <td className="py-4"><Badge tone={st.tone}>{st.label}</Badge></td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'loyalty' && (
              <div>
                <h2 className="mb-8 border-b border-line pb-4 font-serif text-3xl font-bold text-ink">Klub Loyalitas</h2>
                <div className="vv-hero vv-card-gold mb-8 rounded-3xl p-8 text-white">
                  <div className="mb-1 font-mono text-xs font-medium uppercase tracking-widest text-gold">Poin Tersedia</div>
                  <div className="mb-6 font-mono text-5xl font-semibold">{points.toLocaleString('id-ID')}<span className="ml-2 font-sans text-xl font-normal text-white/70">poin</span></div>
                  <div className="flex items-center justify-between border-t border-white/10 pt-4 font-mono text-xs text-white/80">
                    <span>Level: <strong className="text-gold">Platinum</strong></span><span>1.000 poin = Rp100.000</span>
                  </div>
                </div>
                <h4 className="mb-4 text-xs font-bold uppercase tracking-wider text-ink">Keistimewaan Platinum</h4>
                <ul className="space-y-3 text-sm text-muted">
                  <li>✓ Gratis ongkir tanpa minimum belanja</li>
                  <li>✓ Akses lebih awal ke koleksi edisi terbatas</li>
                  <li>✓ Layanan concierge pribadi 24/7</li>
                </ul>
              </div>
            )}
          </main>
        </div>
      </Container>
    </div>
  );
}
