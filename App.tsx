import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import About from './components/About';
import Weather from './components/Weather';
import News from './components/News';
import Schemes from './components/Schemes';
import Mandi from './components/Mandi';
import AgriMarket from './components/Equipments';
import CropRecommender from './components/CropRecommender';
import DiseaseDetection from './components/DiseaseDetection';
import EquipmentRecommender from './components/EquipmentRecommender';
import Footer from './components/Footer';
import Login from './components/Login';
import Signup from './components/Signup';
import Cart from './components/Cart';
import Payment from './components/Payment';
import { Section, User, CartItem, Product } from './types';
import { NAV_ITEMS } from './constants';

const App: React.FC = () => {
  const [activeSection, setActiveSection] = useState<Section>(Section.HERO);
  const [user, setUser] = useState<User | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [paymentTotal, setPaymentTotal] = useState<number>(0);

  const handleKnowMore = () => {
    setActiveSection(Section.ABOUT);
    document.getElementById(Section.ABOUT)?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleLogin = (loggedInUser: User) => {
    setUser(loggedInUser);
    setActiveSection(Section.HERO); // Redirect to home after login
  };
  
  const handleSignup = (signedUpUser: User) => {
    setUser(signedUpUser);
    setActiveSection(Section.HERO); // Redirect to home after signup
  };

  const handleLogout = () => {
    setUser(null);
    setCart([]); // Clear cart on logout
    setActiveSection(Section.HERO);
  };
  
  const handleSetActiveSection = (section: Section) => {
      setActiveSection(section);
      if (section !== Section.LOGIN && section !== Section.SIGNUP && section !== Section.CART && section !== Section.PAYMENT) {
        const element = document.getElementById(section);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }
  };
  
  // Cart Functions
  const addToCart = (product: Product, type: CartItem['type']) => {
    const id = `${type.toLowerCase()}-${product.id}`;
    let price = 0;
    let image = 'https://picsum.photos/200'; // Default image

    if ('expectedPrice' in product) price = Number(product.expectedPrice);
    else if ('rentPerDay' in product) price = product.rentPerDay;
    else if ('pricePerBag' in product) price = product.pricePerBag;
    else if ('pricePerKg' in product) price = product.pricePerKg;
    else if ('pricePerLiter' in product) price = product.pricePerLiter;

    if ('image' in product) image = product.image;


    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === id);
      if (existingItem) {
        return prevCart.map(item =>
          item.id === id ? { ...item, quantity: item.quantity + 1 } : item
        );
      } else {
        return [...prevCart, { id, name: product.name, price, quantity: 1, image, type }];
      }
    });
    alert(`${product.name} has been added to your cart!`);
  };

  const removeFromCart = (itemId: string) => {
    setCart(prevCart => prevCart.filter(item => item.id !== itemId));
  };

  const updateQuantity = (itemId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(itemId);
    } else {
      setCart(prevCart =>
        prevCart.map(item =>
          item.id === itemId ? { ...item, quantity: newQuantity } : item
        )
      );
    }
  };

  const clearCart = () => {
    setCart([]);
  };

  const handleProceedToCheckout = (total: number) => {
    setPaymentTotal(total);
    setActiveSection(Section.PAYMENT);
  };

  const handlePaymentSuccess = () => {
    clearCart();
    setActiveSection(Section.HERO);
    // In a real app, you might show an order confirmation page first
    // For now, we'll just redirect to home.
    alert('Payment successful! Your order has been placed.');
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
             const sectionId = entry.target.id as Section;
             if (NAV_ITEMS.some(item => item.section === sectionId)) {
                // To avoid conflict with click navigation
                if (activeSection !== Section.LOGIN && activeSection !== Section.SIGNUP && activeSection !== Section.CART && activeSection !== Section.PAYMENT) {
                    setActiveSection(sectionId);
                }
             }
          }
        });
      },
      { rootMargin: '-40% 0px -40% 0px' }
    );

    const sections = Array.from(document.querySelectorAll('section[id]')).filter(
        (el) => el.id !== Section.LOGIN && el.id !== Section.SIGNUP
    );
    sections.forEach((section) => observer.observe(section));

    return () => sections.forEach((section) => observer.unobserve(section));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const renderContent = () => {
    if (activeSection === Section.LOGIN) {
      return <Login onLogin={handleLogin} onSwitchToSignup={() => setActiveSection(Section.SIGNUP)} />;
    }
    if (activeSection === Section.SIGNUP) {
      return <Signup onSignup={handleSignup} onSwitchToLogin={() => setActiveSection(Section.LOGIN)} />;
    }
    if (activeSection === Section.CART) {
        return <Cart cartItems={cart} onUpdateQuantity={updateQuantity} onRemoveItem={removeFromCart} onProceedToCheckout={handleProceedToCheckout} onBackToShopping={() => setActiveSection(Section.AGRI_MARKET)} />;
    }
    if (activeSection === Section.PAYMENT) {
        return <Payment total={paymentTotal} onPaymentSuccess={handlePaymentSuccess} onBackToCart={() => setActiveSection(Section.CART)} />;
    }
    return (
      <>
        <Hero onKnowMore={handleKnowMore} />
        <About />
        <Weather />
        <CropRecommender />
        <DiseaseDetection />
        <News />
        <Schemes />
        <Mandi onAddToCart={addToCart} />
        <EquipmentRecommender />
        <AgriMarket onAddToCart={addToCart} />
      </>
    );
  };

  return (
    <div className="App">
      <Header
        activeSection={activeSection}
        setActiveSection={handleSetActiveSection}
        user={user}
        onLogout={handleLogout}
        cartCount={cart.reduce((sum, item) => sum + item.quantity, 0)}
      />
      <main>
        {renderContent()}
      </main>
      {activeSection !== Section.LOGIN && activeSection !== Section.SIGNUP && activeSection !== Section.CART && activeSection !== Section.PAYMENT && <Footer />}
    </div>
  );
};

export default App;
