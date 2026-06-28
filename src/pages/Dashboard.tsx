import { useState } from 'react';
import { User, ShieldCheck, ShoppingBag, Award, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { authApi } from '../lib/api';
import { useAuthStore } from '../store/authStore';

export default function Dashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'profile' | 'orders' | 'loyalty'>('profile');

  const userProfile = {
    name: 'Naufal',
    email: 'naufal@velvoria.com',
    tier: 'Platinum Member',
    points: 4250,
    memberSince: 'May 2026'
  };

  const orders = [
    { id: 'VV-98432', date: '2026-05-28', total: '$12,400', status: 'Processing', item: 'Vanguard Chronograph' },
    { id: 'VV-98011', date: '2026-05-15', total: '$3,200', status: 'Delivered', item: 'Oud Imperial Extrait' }
  ];

   const handleLogout = async () => {
     try {
       await authApi.logout();
     } catch {
       console.warn('API logout failed, performing local logout.');
     }
    useAuthStore.getState().logout();
    navigate('/');
  };

  return (
    <div className="pt-28 pb-20 bg-[#FAF8F5] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-10">
          
          {/* Left Sidebar */}
          <aside className="w-full lg:w-64 bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex-shrink-0 h-fit">
            <div className="flex items-center gap-4 pb-6 border-b border-gray-100 mb-6">
              <div className="w-12 h-12 bg-[#1A1F3A] text-[#E8B4A0] rounded-full flex items-center justify-center font-serif text-xl font-bold">
                {userProfile.name[0].toUpperCase()}
              </div>
              <div>
                <h3 className="font-bold text-[#1A1F3A] leading-tight">{userProfile.name}</h3>
                <span className="text-xs text-gray-400">{userProfile.email}</span>
              </div>
            </div>

            <div className="space-y-2">
              <button 
                onClick={() => setActiveTab('profile')}
                className={`w-full text-left py-2.5 px-4 rounded-xl text-sm font-medium flex items-center gap-3 transition-colors ${activeTab === 'profile' ? 'bg-[#1A1F3A] text-white shadow-md' : 'text-gray-600 hover:bg-gray-50'}`}
              >
                <User className="w-4 h-4" /> My Profile
              </button>
              <button 
                onClick={() => setActiveTab('orders')}
                className={`w-full text-left py-2.5 px-4 rounded-xl text-sm font-medium flex items-center gap-3 transition-colors ${activeTab === 'orders' ? 'bg-[#1A1F3A] text-white shadow-md' : 'text-gray-600 hover:bg-gray-50'}`}
              >
                <ShoppingBag className="w-4 h-4" /> Order History
              </button>
              <button 
                onClick={() => setActiveTab('loyalty')}
                className={`w-full text-left py-2.5 px-4 rounded-xl text-sm font-medium flex items-center gap-3 transition-colors ${activeTab === 'loyalty' ? 'bg-[#1A1F3A] text-white shadow-md' : 'text-gray-600 hover:bg-gray-50'}`}
              >
                <Award className="w-4 h-4" /> Loyalty Club
              </button>
              
              <div className="h-px bg-gray-100 my-4" />
              
              <button 
                onClick={handleLogout}
                className="w-full text-left py-2.5 px-4 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 flex items-center gap-3 transition-colors"
              >
                <LogOut className="w-4 h-4" /> Logout
              </button>
            </div>
          </aside>

          {/* Main Dashboard Panel */}
          <main className="flex-grow bg-white p-8 sm:p-12 rounded-[2.5rem] border border-gray-100 shadow-xl min-h-[500px]">
            
            {/* PROFILE TAB */}
            {activeTab === 'profile' && (
              <div>
                <h2 className="text-3xl font-serif font-bold text-[#1A1F3A] mb-8 pb-4 border-b border-gray-100">
                  Profile Account
                </h2>
                
                {/* Stats cards */}
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
                  <div className="bg-[#FAF8F5] p-6 rounded-2xl border border-gray-50 flex items-center gap-4">
                    <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center">
                      <ShoppingBag className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-xs text-gray-400 font-bold uppercase">Total Orders</div>
                      <div className="text-xl font-bold text-[#1A1F3A]">{orders.length}</div>
                    </div>
                  </div>

                  <div className="bg-[#FAF8F5] p-6 rounded-2xl border border-gray-50 flex items-center gap-4">
                    <div className="w-10 h-10 bg-[#E8B4A0]/10 text-[#E8B4A0] rounded-full flex items-center justify-center">
                      <Award className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-xs text-gray-400 font-bold uppercase">Club Level</div>
                      <div className="text-xl font-bold text-[#1A1F3A]">Platinum</div>
                    </div>
                  </div>

                  <div className="bg-[#FAF8F5] p-6 rounded-2xl border border-gray-50 flex items-center gap-4">
                    <div className="w-10 h-10 bg-green-50 text-green-600 rounded-full flex items-center justify-center">
                      <ShieldCheck className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-xs text-gray-400 font-bold uppercase">Security Status</div>
                      <div className="text-xl font-bold text-[#1A1F3A]">Verified</div>
                    </div>
                  </div>
                </div>

                <div className="space-y-6 max-w-xl text-sm font-sans">
                  <div className="grid grid-cols-2 py-3 border-b border-gray-50">
                    <span className="text-gray-400 font-medium">Full Name</span>
                    <span className="font-bold text-[#1A1F3A]">{userProfile.name}</span>
                  </div>
                  <div className="grid grid-cols-2 py-3 border-b border-gray-50">
                    <span className="text-gray-400 font-medium">Email Address</span>
                    <span className="font-bold text-[#1A1F3A]">{userProfile.email}</span>
                  </div>
                  <div className="grid grid-cols-2 py-3 border-b border-gray-50">
                    <span className="text-gray-400 font-medium">Member Since</span>
                    <span className="font-bold text-[#1A1F3A]">{userProfile.memberSince}</span>
                  </div>
                </div>
              </div>
            )}

            {/* ORDERS TAB */}
            {activeTab === 'orders' && (
              <div>
                <h2 className="text-3xl font-serif font-bold text-[#1A1F3A] mb-8 pb-4 border-b border-gray-100">
                  Order History
                </h2>

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-sm font-sans">
                    <thead>
                      <tr className="border-b border-gray-100 text-gray-400">
                        <th className="pb-3 font-bold">Order ID</th>
                        <th className="pb-3 font-bold">Date</th>
                        <th className="pb-3 font-bold">Item</th>
                        <th className="pb-3 font-bold">Total</th>
                        <th className="pb-3 font-bold">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.map(order => (
                        <tr key={order.id} className="border-b border-gray-50">
                          <td className="py-4 font-bold text-[#1A1F3A]">{order.id}</td>
                          <td className="py-4 text-gray-500">{order.date}</td>
                          <td className="py-4 text-[#1A1F3A] font-medium">{order.item}</td>
                          <td className="py-4 font-bold text-[#1A1F3A]">{order.total}</td>
                          <td className="py-4">
                            <span className={`px-3 py-1 rounded-full text-xs font-bold ${order.status === 'Delivered' ? 'bg-green-50 text-green-600' : 'bg-blue-50 text-blue-600'}`}>
                              {order.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* LOYALTY CLUB TAB */}
            {activeTab === 'loyalty' && (
              <div>
                <h2 className="text-3xl font-serif font-bold text-[#1A1F3A] mb-8 pb-4 border-b border-gray-100">
                  Loyalty Club Rewards
                </h2>

                <div className="bg-gradient-to-r from-[#1A1F3A] to-[#2D5F5D] p-8 rounded-3xl text-white mb-8">
                  <div className="text-sm font-medium opacity-80 uppercase tracking-widest mb-1">Available Points</div>
                  <div className="text-5xl font-bold mb-6 font-serif">{userProfile.points.toLocaleString()} pts</div>
                  <div className="flex justify-between items-center text-xs opacity-90 border-t border-white/10 pt-4">
                    <span>Active Level: <strong>{userProfile.tier}</strong></span>
                    <span>1,000 points = $10 Reward</span>
                  </div>
                </div>

                <h4 className="font-bold text-sm text-[#1A1F3A] uppercase tracking-wider mb-4">Platinum Privileges</h4>
                <ul className="space-y-3 text-sm text-gray-600">
                  <li className="flex items-center gap-2">✓ Free global shipping with no minimum checkout value</li>
                  <li className="flex items-center gap-2">✓ Early access to limited-edition watch releases</li>
                  <li className="flex items-center gap-2">✓ 24/7 dedicated personal concierge support</li>
                </ul>
              </div>
            )}

          </main>

        </div>
      </div>
    </div>
  );
}
