/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { Categories } from './components/Categories';
import { FeaturedProducts } from './components/FeaturedProducts';
import { Footer } from './components/Footer';
import { CartDrawer } from './components/CartDrawer';
import { MenuDrawer } from './components/MenuDrawer';
import { SearchDrawer } from './components/SearchDrawer';
import { ProductPage } from './components/ProductPage';
import { AuthPage } from './components/AuthPage';
import { PoliciesPage } from './components/PoliciesPage';
import { CheckoutPage } from './components/CheckoutPage';
import { FAQ } from './components/FAQ';
import { AIAssistant } from './components/AIAssistant';
import { isFirebaseConfigured, auth } from './services/firebase';

type ViewState = { type: 'home' } | { type: 'product', id: number } | { type: 'auth' } | { type: 'policies' } | { type: 'checkout' };

export default function App() {
  const [view, setView] = useState<ViewState>({ type: 'home' });
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');

  const handleCategoryClick = (categoryName: string) => {
    setSelectedCategory(categoryName);
    setTimeout(() => {
      const shopSection = document.getElementById('shop');
      if (shopSection) {
        shopSection.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  useEffect(() => {
    // When opening the website each time, it should default to light mode (already set to false in useState).
    // Dynamically manage the dark class on root document to drive tailwind transitions.
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  useEffect(() => {
    if (!isFirebaseConfigured || !auth) return;
    const unsubscribe = auth.onAuthStateChanged((user: any) => {
      setCurrentUser(user);
    });
    return () => unsubscribe();
  }, []);

  const handleProductClick = (id: number) => {
    setView({ type: 'product', id });
    window.scrollTo(0, 0);
  };

  const handleGoHome = () => {
    setView({ type: 'home' });
    window.scrollTo(0, 0);
  };

  const handleGoHomeAndScrollToHero = () => {
    if (view.type !== 'home') {
      setView({ type: 'home' });
      setTimeout(() => {
        const heroSection = document.getElementById('hero');
        if (heroSection) {
          heroSection.scrollIntoView({ behavior: 'smooth' });
        } else {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      }, 100);
    } else {
      const heroSection = document.getElementById('hero');
      if (heroSection) {
        heroSection.scrollIntoView({ behavior: 'smooth' });
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  };

  const handleAddToCart = (product: any, paymentMethod: string = 'online') => {
    const price = paymentMethod === 'cod' ? product.price + 100 : product.price;
    const newItem = {
      ...product,
      cartItemId: Date.now(),
      paymentMethod,
      price
    };
    
    setCartItems(prev => {
      // Check if same item exists
      const existingIdx = prev.findIndex(item => item.id === product.id);
      if (existingIdx >= 0) {
        return prev;
      }
      return [...prev, newItem];
    });
    
    setIsCartOpen(true);
  };

  const handleRemoveItem = (cartItemId: number) => {
    setCartItems(prev => prev.filter(item => item.cartItemId !== cartItemId));
  };

  const handleShopNow = () => {
    if (view.type !== 'home') {
      setView({ type: 'home' });
      setTimeout(() => {
        const shopSection = document.getElementById('shop');
        if (shopSection) shopSection.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      const shopSection = document.getElementById('shop');
      if (shopSection) shopSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleGoToFooter = () => {
    const footerElement = document.getElementById('footer');
    if (footerElement) {
      footerElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleOpenPolicies = (anchor?: string) => {
    setView({ type: 'policies' });
    if (anchor) {
      setTimeout(() => {
        const element = document.getElementById(anchor);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 150);
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleGoToFAQ = () => {
    if (view.type !== 'home') {
      setView({ type: 'home' });
      setTimeout(() => {
        const faqElement = document.getElementById('faq');
        if (faqElement) {
          faqElement.scrollIntoView({ behavior: 'smooth' });
        }
      }, 150);
    } else {
      const faqElement = document.getElementById('faq');
      if (faqElement) {
        faqElement.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const handleAIAssistantAction = (action: string, payload?: string) => {
    switch (action) {
      case 'NAVIGATE_HOME':
        handleGoHome();
        break;
      case 'NAVIGATE_POLICIES':
        handleOpenPolicies(payload);
        break;
      case 'NAVIGATE_AUTH':
        setView({ type: 'auth' });
        break;
      case 'TOGGLE_DARK_MODE':
        setIsDarkMode(prev => !prev);
        break;
      case 'SCROLL_TO_FAQ':
        handleGoToFAQ();
        break;
      case 'SCROLL_TO_SHOP':
        handleShopNow();
        break;
      case 'OPEN_CART':
        setIsCartOpen(true);
        break;
      case 'NAVIGATE_CHECKOUT':
        setView({ type: 'checkout' });
        window.scrollTo(0, 0);
        break;
      case 'VIEW_PRODUCT':
        if (payload) {
          handleProductClick(Number(payload));
        }
        break;
      case 'FILTER_CATEGORY':
        if (payload) {
          handleCategoryClick(payload);
        }
        break;
      default:
        break;
    }
  };

  const cartItemCount = cartItems.length;

  return (
    <div className="relative min-h-screen flex flex-col selection:bg-navy selection:text-white">
      <Header 
        onOpenMenu={() => setIsMenuOpen(true)}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenSearch={() => setIsSearchOpen(true)}
        onGoHome={handleGoHomeAndScrollToHero}
        onOpenAuth={() => setView({ type: 'auth' })}
        cartItemCount={cartItemCount}
        user={currentUser}
        isDarkMode={isDarkMode}
        onToggleDarkMode={() => setIsDarkMode(prev => !prev)}
      />

      <main className="flex-1 w-full relative">
        {view.type === 'home' ? (
          <>
            <Hero onShopNow={handleShopNow} />
            <Categories onCategoryClick={handleCategoryClick} />
            <FeaturedProducts 
              onProductClick={handleProductClick} 
              onAddToCart={(p) => handleAddToCart(p, 'online')} 
              selectedCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
              searchQuery={searchQuery}
              onSearchQueryChange={setSearchQuery}
            />
            <FAQ />
          </>
        ) : view.type === 'product' ? (
          <ProductPage 
            productId={view.id} 
            onBack={handleGoHome}
            onAddToCart={handleAddToCart}
          />
        ) : view.type === 'policies' ? (
          <PoliciesPage onBackToShopping={handleGoHome} />
        ) : view.type === 'checkout' ? (
          <CheckoutPage 
            cartItems={cartItems}
            onBackToShopping={handleGoHome}
            onClearCart={() => setCartItems([])}
          />
        ) : (
          <AuthPage onBackToShopping={handleGoHome} />
        )}
      </main>

      <Footer 
        onOpenPolicies={handleOpenPolicies}
        onGoToFAQ={handleGoToFAQ}
        onGoToShop={handleShopNow}
        onGoToHome={handleGoHomeAndScrollToHero}
      />

      <CartDrawer 
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onRemoveItem={handleRemoveItem}
        onCheckout={() => {
          setIsCartOpen(false);
          setView({ type: 'checkout' });
          window.scrollTo(0, 0);
        }}
      />

      <MenuDrawer
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        onOpenAuth={() => setView({ type: 'auth' })}
        onGoHome={handleGoHomeAndScrollToHero}
        onOpenPolicies={() => setView({ type: 'policies' })}
        onGoToFooter={handleGoToFooter}
        isDarkMode={isDarkMode}
        onToggleDarkMode={() => setIsDarkMode(prev => !prev)}
        user={currentUser}
      />

      <SearchDrawer
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSearch={(query) => {
          setIsSearchOpen(false);
          setSearchQuery(query);
          setView({ type: 'home' });
          setTimeout(() => {
            const shopSection = document.getElementById('shop');
            if (shopSection) {
              shopSection.scrollIntoView({ behavior: 'smooth' });
            }
          }, 150);
        }}
      />

      <AIAssistant 
        onExecuteAction={handleAIAssistantAction} 
        isDarkMode={isDarkMode} 
      />
    </div>
  );
}
