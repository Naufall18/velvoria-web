import { ShoppingBag, Menu, X, User } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import ProductListing from './pages/ProductListing';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Register from './pages/Register';

function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-[#FAF8F5] font-sans text-[#2C2C2C]">
      {/* Navbar */}
      <nav className="fixed w-full z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-10 h-10 bg-[#1A1F3A] rounded-xl flex items-center justify-center">
                <ShoppingBag className="text-[#E8B4A0] w-6 h-6" />
              </div>
              <span className="text-2xl font-bold tracking-tight text-[#1A1F3A] font-serif">VELVORIA</span>
            </Link>
            
            <div className="hidden md:flex items-center gap-8">
              <Link to="/products" className="text-sm font-medium hover:text-[#E8B4A0] transition-colors">Categories</Link>
              <Link to="/products" className="text-sm font-medium hover:text-[#E8B4A0] transition-colors">Live Shopping</Link>
              <Link to="/products" className="text-sm font-medium hover:text-[#E8B4A0] transition-colors">Brands</Link>
              <Link to="/dashboard" className="text-sm font-medium hover:text-[#E8B4A0] transition-colors">Sell on Velvoria</Link>
            </div>

            <div className="hidden md:flex items-center gap-4">
              <Link to="/cart" className="relative p-2.5 text-[#1A1F3A] hover:text-[#E8B4A0] transition-colors">
                <ShoppingBag className="w-6 h-6" />
              </Link>
              <Link to="/login" className="p-2.5 text-[#1A1F3A] hover:text-[#E8B4A0] transition-colors">
                <User className="w-6 h-6" />
              </Link>
              <Link to="/login" className="px-6 py-2.5 text-sm font-medium bg-[#1A1F3A] text-white rounded-full hover:bg-[#2D5F5D] transition-all shadow-lg shadow-blue-900/10">Get Started</Link>
            </div>

            <div className="md:hidden">
              <button onClick={() => setIsMenuOpen(!isMenuOpen)}>
                {isMenuOpen ? <X /> : <Menu />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-b border-gray-100 px-4 py-4 space-y-3">
            <Link to="/products" onClick={() => setIsMenuOpen(false)} className="block text-sm font-medium hover:text-[#E8B4A0] transition-colors">Categories</Link>
            <Link to="/products" onClick={() => setIsMenuOpen(false)} className="block text-sm font-medium hover:text-[#E8B4A0] transition-colors">Live Shopping</Link>
            <Link to="/cart" onClick={() => setIsMenuOpen(false)} className="block text-sm font-medium hover:text-[#E8B4A0] transition-colors">Shopping Cart</Link>
            <Link to="/dashboard" onClick={() => setIsMenuOpen(false)} className="block text-sm font-medium hover:text-[#E8B4A0] transition-colors">Dashboard / Account</Link>
          </div>
        )}
      </nav>

      {/* Main Pages Switch */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<ProductListing />} />
        <Route path="/product/:slug" element={<ProductDetail />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-100 pt-20 pb-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-4 gap-12 mb-20">
          <div className="col-span-2">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-10 h-10 bg-[#1A1F3A] rounded-xl flex items-center justify-center">
                <ShoppingBag className="text-[#E8B4A0] w-6 h-6" />
              </div>
              <span className="text-2xl font-bold text-[#1A1F3A] font-serif uppercase">VELVORIA</span>
            </div>
            <p className="text-gray-500 max-w-sm mb-8 leading-relaxed">
              The world's premier multi-vendor marketplace for luxury and lifestyle goods. Redefining excellence in e-commerce.
            </p>
            <div className="flex gap-4">
              {['FB', 'IG', 'TW', 'LI'].map(social => (
                <div key={social} className="w-10 h-10 border border-gray-200 rounded-full flex items-center justify-center text-sm font-bold hover:border-[#E8B4A0] hover:text-[#E8B4A0] cursor-pointer transition-colors">
                  {social}
                </div>
              ))}
            </div>
          </div>
          
          <div>
            <h4 className="font-bold text-[#1A1F3A] mb-6 font-sans">Explore</h4>
            <ul className="space-y-4 text-gray-500 text-sm">
              <li><Link to="/products" className="hover:text-[#E8B4A0]">Categories</Link></li>
              <li><Link to="/products" className="hover:text-[#E8B4A0]">New Arrivals</Link></li>
              <li><Link to="/products" className="hover:text-[#E8B4A0]">Featured Brands</Link></li>
              <li><Link to="/products" className="hover:text-[#E8B4A0]">Live Shopping</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-[#1A1F3A] mb-6 font-sans">Company</h4>
            <ul className="space-y-4 text-gray-500 text-sm">
              <li><Link to="/dashboard" className="hover:text-[#E8B4A0]">About Us</Link></li>
              <li><Link to="/dashboard" className="hover:text-[#E8B4A0]">Sell on Velvoria</Link></li>
              <li><Link to="/dashboard" className="hover:text-[#E8B4A0]">Privacy Policy</Link></li>
              <li><Link to="/dashboard" className="hover:text-[#E8B4A0]">Terms of Service</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 border-t border-gray-100 flex flex-col md:row justify-between items-center gap-4">
          <p className="text-sm text-gray-500">© 2026 Velvoria Marketplace. All rights reserved.</p>
          <div className="flex gap-8">
            <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" className="h-4" alt="Visa" />
            <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" className="h-6" alt="Mastercard" />
            <img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" className="h-5" alt="Paypal" />
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;