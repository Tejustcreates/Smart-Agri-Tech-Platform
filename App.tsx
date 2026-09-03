import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useNavigate, useLocation, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster, toast } from 'react-hot-toast';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import './i18n';
import Header from './components/Header';
import Footer from './components/Footer';
import BottomNav from './components/BottomNav';
import ProtectedRoute from './components/ProtectedRoute';
import HomePage from './components/pages/HomePage';
import Weather from './components/Weather';
import CropRecommender from './components/CropRecommender';
import DiseaseDetection from './components/DiseaseDetection';
import FarmerNewsSection from './components/farmer-news/FarmerNewsSection';
import GovernmentSchemes from './components/schemes/GovernmentSchemes';
import DigitalMandi from './components/mandi/DigitalMandi';
import CommunityEquipment from './components/equipment/CommunityEquipment';
import AuthPage from './components/pages/AuthPage';
import AuthModal from './components/AuthModal';
import BackToTop from './components/BackToTop';
import DashboardPreview from './components/DashboardPreview';
import Onboarding from './components/pages/Onboarding';
import CartPage from './components/pages/CartPage';
import PaymentPage from './components/pages/PaymentPage';
import FarmerDashboard from './components/pages/FarmerDashboard';
import FarmerNews from './components/farmer-news/FarmerNews';
import AdminPanel from './components/pages/AdminPanel';
import { exportToExcel } from './services/sheetService';
import { User as UserType, CartItem, Product } from './types';
import { ROUTES } from './constants';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const NotFound: React.FC = () => (
  <section className="py-20 bg-gray-50 flex items-center justify-center min-h-[calc(100vh-64px)]">
    <div className="text-center">
      <div className="w-24 h-24 bg-brand-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <i className="fas fa-question text-brand-600 text-4xl"></i>
      </div>
      <h2 className="text-3xl font-bold text-gray-800">Page Not Found</h2>
      <p className="text-gray-600 mt-2 mb-6">The page you're looking for doesn't exist.</p>
      <a href="/" className="px-6 py-3 bg-brand-600 text-white rounded-lg hover:bg-brand-700 font-semibold transition-colors">
        <i className="fas fa-home mr-2"></i>Go Home
      </a>
    </div>
  </section>
);

const loadFromStorage = <T,>(key: string, fallback: T): T => {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : fallback;
  } catch {
    return fallback;
  }
};

const AppContent: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const [cart, setCart] = useState<CartItem[]>(() => loadFromStorage<CartItem[]>('growsmart_cart', []));
  const [paymentTotal, setPaymentTotal] = useState<number>(0);
  const [authOpen, setAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');


  useEffect(() => {
    localStorage.setItem('growsmart_cart', JSON.stringify(cart));
  }, [cart]);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const addToCart = (product: Product, type: CartItem['type']) => {
    const id = `${type.toLowerCase()}-${product.id || Date.now()}`;
    let price = 0;
    let image = 'https://picsum.photos/200';

    if ('expectedPrice' in product) price = Number(product.expectedPrice);
    else if ('rentPerDay' in product) price = product.rentPerDay;
    else if ('pricePerBag' in product) price = product.pricePerBag;
    else if ('pricePerKg' in product) price = product.pricePerKg;
    else if ('pricePerLiter' in product) price = product.pricePerLiter;

    if ('image' in product) image = product.image;

    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === id);
      if (existingItem) {
        return prevCart.map((item) => (item.id === id ? { ...item, quantity: item.quantity + 1 } : item));
      }
      return [...prevCart, { id, name: product.name, price, quantity: 1, image, type }];
    });
    toast.success(`${product.name} added to cart!`);
  };

  const removeFromCart = (itemId: string) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== itemId));
  };

  const updateQuantity = (itemId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(itemId);
    } else {
      setCart((prevCart) => prevCart.map((item) => (item.id === itemId ? { ...item, quantity: newQuantity } : item)));
    }
  };

  const handleProceedToCheckout = (total: number) => {
    setPaymentTotal(total);
    navigate('/payment');
  };

  const handlePaymentSuccess = () => {
    setCart([]);
    toast.success('Payment successful! Your order has been placed.');
    navigate('/');
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'A') {
        e.preventDefault();
        if (user) {
          exportToExcel();
          toast.success('Excel downloaded successfully!');
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [user]);

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const isHomePage = location.pathname === ROUTES.HOME;

  return (
    <div className="min-h-screen flex flex-col">
      <Toaster
        position="top-center"
        containerStyle={{ top: 80 }}
        toastOptions={{
          duration: 3000,
          style: { borderRadius: '10px', background: '#333', color: '#fff', maxWidth: '90vw' },
          success: { position: 'top-center' },
          error: { position: 'top-center' },
        }}
      />
      {!location.pathname.startsWith('/auth') && !location.pathname.startsWith('/onboarding') && (
        <Header user={user as unknown as UserType | null} onLogout={handleLogout} cartCount={cartCount} onOpenAuth={(m) => { setAuthMode(m); setAuthOpen(true); }} />
      )}
      <main className="flex-1 overflow-x-hidden">
        <Routes>
          <Route path="/" element={
            <>
              <HomePage />
              <DashboardPreview />
              <Weather />
              <CropRecommender />
              <DiseaseDetection />
              <DigitalMandi />
              <CommunityEquipment />
              <GovernmentSchemes />
              <FarmerNewsSection />
            </>
          } />
          <Route path="/login" element={<AuthPage />} />
          <Route path="/signup" element={<AuthPage />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/onboarding" element={
            <ProtectedRoute requireOnboarding>
              <Onboarding />
            </ProtectedRoute>
          } />
          <Route path="/cart" element={<CartPage cartItems={cart} onUpdateQuantity={updateQuantity} onRemoveItem={removeFromCart} onProceedToCheckout={handleProceedToCheckout} />} />
          <Route path="/payment" element={<PaymentPage total={paymentTotal} onPaymentSuccess={handlePaymentSuccess} />} />
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <FarmerDashboard />
            </ProtectedRoute>
          } />
          <Route path="/news" element={<FarmerNews />} />
          <Route path="/admin" element={
            <ProtectedRoute requiredRole={['ADMIN', 'FIELD_OFFICER']}>
              <AdminPanel />
            </ProtectedRoute>
          } />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      {isHomePage && <Footer />}
      {!location.pathname.startsWith('/auth') && !location.pathname.startsWith('/onboarding') && (
        <BottomNav user={user as unknown as UserType | null} onLogout={handleLogout} cartCount={cartCount} />
      )}
      <BackToTop />
      <AuthModal open={authOpen} onClose={() => setAuthOpen(false)} initialMode={authMode} />
    </div>
  );
};

const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <AppContent />
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
};

export default App;