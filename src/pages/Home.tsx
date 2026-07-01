import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Star, Zap, ShieldCheck, ArrowRight, Play } from 'lucide-react';
import { Link } from 'react-router-dom';
import { categoriesApi, productsApi } from '../lib/api';
import { formatIDR, resolveImage } from '../lib/format';

interface Category {
  id: number;
  name: string;
  slug: string;
  image?: string;
  description?: string;
}

interface Product {
  id: number;
  name: string;
  slug: string;
  price: string;
  rating?: number;
  reviews_count?: number;
  images?: Array<{ image_path: string }>;
  brand?: { name: string };
}

export default function Home() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // Fallback tampilan (harga Rupiah, brand Velvoria) — hanya dipakai bila API
  // belum siap; data asli tetap diambil dari backend di bawah.
  const mockCategories = [
    { id: 1, name: 'Jam Tangan', slug: 'watches', image: 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?auto=format&fit=crop&q=80&w=400', count: 'Koleksi' },
    { id: 2, name: 'Tas', slug: 'bags', image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&q=80&w=400', count: 'Koleksi' },
    { id: 3, name: 'Aksesoris', slug: 'accessories', image: 'https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&q=80&w=400', count: 'Koleksi' },
    { id: 4, name: 'Perhiasan', slug: 'jewelry', image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&q=80&w=400', count: 'Koleksi' }
  ];

  const mockProducts: Product[] = [
    { id: 1, name: 'Aurelia Leather Tote', slug: 'aurelia-leather-tote', price: '2500000', brand: { name: 'Aurelia' }, rating: 4.8, reviews_count: 85, images: [{ image_path: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&q=80&w=500' }] },
    { id: 2, name: 'Noir Minimalist Watch', slug: 'noir-minimalist-watch', price: '4200000', brand: { name: 'Noir & Co' }, rating: 4.9, reviews_count: 120, images: [{ image_path: 'https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?auto=format&fit=crop&q=80&w=500' }] },
    { id: 3, name: 'Maison Vela Extrait', slug: 'maison-vela-extrait', price: '3200000', brand: { name: 'Maison Vela' }, rating: 5.0, reviews_count: 42, images: [{ image_path: 'https://images.unsplash.com/photo-1547887537-6158d64c35b3?auto=format&fit=crop&q=80&w=500' }] },
    { id: 4, name: 'Étoile Diamond Studs', slug: 'etoile-diamond-studs', price: '5400000', brand: { name: 'Étoile' }, rating: 4.9, reviews_count: 67, images: [{ image_path: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&q=80&w=500' }] }
  ];

  useEffect(() => {
    async function fetchData() {
      try {
        const catRes = await categoriesApi.list();
        if (catRes.data && catRes.data.data) {
          setCategories(catRes.data.data);
        }
       } catch {
         console.warn('Backend categories fetch failed, using fallback.');
       }

       try {
         const prodRes = await productsApi.featured();
         if (prodRes.data && prodRes.data.data) {
           setFeaturedProducts(prodRes.data.data);
         }
       } catch {
         console.warn('Backend featured products fetch failed, using fallback.');
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const displayCategories = categories.length > 0 ? categories : mockCategories;
  const displayProducts = featuredProducts.length > 0 ? featuredProducts : mockProducts;

  if (loading) {
    return (
      <div className="pt-32 pb-20 text-center text-gray-500">
        <div className="animate-pulse max-w-7xl mx-auto px-4">
          <div className="h-96 bg-white rounded-3xl"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-20">
      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-[#FAF8F5]">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E8B4A0]/10 border border-[#E8B4A0]/20 mb-6">
              <Zap className="w-4 h-4 text-[#E8B4A0]" />
              <span className="text-xs font-bold uppercase tracking-wider text-[#E8B4A0]">Marketplace Generasi Baru</span>
            </div>
            <h1 className="text-5xl lg:text-7xl font-serif font-bold text-[#1A1F3A] leading-tight mb-6">
              Angkat <span className="text-[#E8B4A0]">Gaya Hidup</span> Anda dengan Barang Mewah.
            </h1>
            <p className="text-lg text-gray-600 mb-8 max-w-xl leading-relaxed">
              Velvoria menghubungkan Anda dengan brand artisan dan vendor mewah kelas dunia. Nikmati pengalaman belanja premium yang terjamin keasliannya.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/products" className="flex items-center justify-center gap-2 px-8 py-4 bg-[#1A1F3A] text-white rounded-full font-bold hover:bg-[#2D5F5D] transition-all group shadow-xl shadow-blue-900/20">
                Jelajahi Koleksi
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <button className="flex items-center justify-center gap-2 px-8 py-4 bg-white text-[#1A1F3A] border border-gray-200 rounded-full font-bold hover:border-[#E8B4A0] transition-all">
                <Play className="w-5 h-5 fill-current" />
                Lihat Demo
              </button>
            </div>

            <div className="mt-12 flex items-center gap-8">
              <div>
                <div className="text-3xl font-bold text-[#1A1F3A]">30+</div>
                <div className="text-sm text-gray-500">Produk Kurasi</div>
              </div>
              <div className="w-px h-10 bg-gray-200" />
              <div>
                <div className="text-3xl font-bold text-[#1A1F3A]">6</div>
                <div className="text-sm text-gray-500">Brand Pilihan</div>
              </div>
              <div className="w-px h-10 bg-gray-200" />
              <div>
                <div className="flex items-center gap-1">
                  <Star className="w-5 h-5 text-yellow-400 fill-current" />
                  <span className="text-3xl font-bold text-[#1A1F3A]">4.9</span>
                </div>
                <div className="text-sm text-gray-500">Rating Kepuasan</div>
              </div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="relative z-10 rounded-[2rem] overflow-hidden shadow-2xl">
              <img 
                src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80&w=1000" 
                alt="Luxury Shopping" 
                className="w-full h-auto object-cover"
              />
            </div>
            <div className="absolute -top-6 -right-6 w-32 h-32 bg-[#E8B4A0] rounded-full blur-3xl opacity-30 animate-pulse" />
            <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-[#2D5F5D] rounded-full blur-3xl opacity-20" />
            
            <motion.div 
              animate={{ y: [0, -10, 0] }}
              transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
              className="absolute bottom-10 -right-4 z-20 bg-white p-4 rounded-2xl shadow-xl border border-gray-100 flex items-center gap-4"
            >
              <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center">
                <ShieldCheck className="text-green-600 w-6 h-6" />
              </div>
              <div>
                <div className="text-sm font-bold">Keaslian Terjamin</div>
                <div className="text-xs text-gray-500">Autentikasi 100%</div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Featured Categories */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-4xl font-serif font-bold text-[#1A1F3A] mb-4">Belanja per Kategori</h2>
              <p className="text-gray-500">Pilihan terkurasi untuk selera Anda yang berkelas.</p>
            </div>
            <Link to="/products" className="text-[#E8B4A0] font-bold hover:underline flex items-center gap-1">
              Lihat Semua <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            {displayCategories.map((cat, i) => (
              <motion.div 
                key={cat.id || i}
                whileHover={{ y: -10 }}
                className="group cursor-pointer"
              >
                <Link to={`/products?category=${cat.slug}`}>
                  <div className="relative aspect-[3/4] rounded-3xl overflow-hidden mb-4 shadow-md">
                    <img 
                      src={cat.image || 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80&w=400'} 
                      alt={cat.name} 
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#1A1F3A]/80 to-transparent" />
                    <div className="absolute bottom-6 left-6 text-white">
                      <div className="text-xl font-bold mb-1">{cat.name}</div>
                      <div className="text-xs opacity-80">{(cat as { count?: string }).count || 'Lihat koleksi'}</div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20 bg-[#FAF8F5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-4xl font-serif font-bold text-[#1A1F3A] mb-4">Sedang Tren</h2>
              <p className="text-gray-500">Kerajinan istimewa dengan estetika abadi.</p>
            </div>
            <Link to="/products" className="text-[#E8B4A0] font-bold hover:underline flex items-center gap-1">
              Lihat Semua Produk <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {displayProducts.map((prod, i) => (
              <motion.div 
                key={prod.id || i}
                whileHover={{ y: -5 }}
                className="bg-white rounded-3xl overflow-hidden shadow-lg border border-gray-100 flex flex-col h-full"
              >
                <Link to={`/product/${prod.slug}`} className="relative block aspect-[4/5] overflow-hidden bg-gray-100">
                  <img
                    src={resolveImage(prod.images?.[0]?.image_path, 'https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?auto=format&fit=crop&q=80&w=500')}
                    alt={prod.name}
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                  />
                  {prod.rating && (
                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-full flex items-center gap-1 text-xs font-bold shadow-sm">
                      <Star className="w-3.5 h-3.5 text-yellow-400 fill-current" />
                      <span>{prod.rating}</span>
                    </div>
                  )}
                </Link>
                <div className="p-6 flex flex-col flex-grow">
                  <span className="text-xs font-bold text-[#E8B4A0] tracking-wider uppercase mb-1">
                    {prod.brand?.name || 'Velvoria'}
                  </span>
                  <Link to={`/product/${prod.slug}`} className="text-lg font-bold text-[#1A1F3A] hover:text-[#E8B4A0] transition-colors mb-2 line-clamp-1">
                    {prod.name}
                  </Link>
                  <div className="mt-auto pt-4 border-t border-gray-50 flex items-center justify-between">
                    <span className="text-xl font-bold text-[#1A1F3A]">
                      {formatIDR(prod.price)}
                    </span>
                    <Link to={`/product/${prod.slug}`} className="text-xs font-bold bg-[#1A1F3A] text-white px-4 py-2 rounded-full hover:bg-[#E8B4A0] hover:text-white transition-all">
                      Lihat Detail
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Live Shopping Teaser */}
      <section className="py-20 bg-[#1A1F3A] text-white overflow-hidden relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-16 items-center">
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/20 border border-red-500/30 mb-6">
              <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
              <span className="text-xs font-bold uppercase tracking-wider text-red-500">Live Shopping</span>
            </div>
            <h2 className="text-4xl lg:text-5xl font-serif font-bold mb-6">Pengalaman Belanja Interaktif.</h2>
            <p className="text-gray-400 text-lg mb-8 leading-relaxed">
              Ikuti sesi live eksklusif bersama perwakilan brand. Ajukan pertanyaan, lihat detail produk secara langsung, dan dapatkan penawaran khusus live.
            </p>
            <button className="px-8 py-4 bg-[#E8B4A0] text-[#1A1F3A] rounded-full font-bold hover:bg-white transition-all">
              Lihat Sesi Live
            </button>
          </div>
          
          <div className="relative">
            <div className="aspect-video bg-gray-800 rounded-3xl border border-white/10 overflow-hidden relative shadow-2xl">
              <img 
                src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&q=80&w=800" 
                className="w-full h-full object-cover opacity-50" 
                alt="Live stream" 
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-20 h-20 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border border-white/30 cursor-pointer hover:scale-110 transition-transform">
                  <Play className="w-8 h-8 fill-current" />
                </div>
              </div>
              <div className="absolute top-6 left-6 flex items-center gap-3">
                <div className="px-3 py-1 bg-red-600 rounded text-xs font-bold">LIVE</div>
                <div className="px-3 py-1 bg-black/40 backdrop-blur-md rounded text-xs font-medium">2.4k Viewers</div>
              </div>
            </div>
          </div>
        </div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-blue-600/10 rounded-full blur-[120px]" />
      </section>
    </div>
  );
}
