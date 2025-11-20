
import React, { useState, useEffect } from 'react';
import { AppView, Routine, Product } from './types';
import Studio from './components/Studio';
import DeepGettyGo from './components/DeepGettyGo';
import LiveCoach from './components/LiveCoach';
import RoutinePlayer from './components/RoutinePlayer';
import Life from './components/Life';
import Merch from './components/Merch';
import Cart from './components/Cart';
import Journal from './components/Journal';
import Auth from './components/Auth';
import Subscription from './components/Subscription';
import Admin from './components/Admin';
import Dashboard from './components/Dashboard';
import BodyScan from './components/BodyScan';
import Home from './components/Home';
import Support from './components/Support';
import Legal from './components/Legal';
import { LayoutGrid, Activity, ShoppingBag, Dna, LogOut, ShieldCheck, Home as HomeIcon, HelpCircle } from 'lucide-react';
import { PRODUCTS as DEFAULT_PRODUCTS, DEFAULT_HERO_VIDEO_URL } from './constants';
import { auth } from './firebaseConfig';
import { onAuthStateChanged } from 'firebase/auth';

// Helper for safe storage access
const getStorageItem = (key: string) => {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      return localStorage.getItem(key) === 'true';
    }
  } catch (e) {
    console.warn('LocalStorage access failed', e);
  }
  return false;
};

const App: React.FC = () => {
  // Application Logic State - Initialized from LocalStorage for Dev Persistence
  const [isAuthenticated, setIsAuthenticated] = useState(() => getStorageItem('dg_auth'));
  const [isSubscribed, setIsSubscribed] = useState(() => getStorageItem('dg_sub'));
  const [isAdmin, setIsAdmin] = useState(() => getStorageItem('dg_admin'));
  
  // Config State (Lifted for Admin Control)
  const [products, setProducts] = useState<Product[]>(DEFAULT_PRODUCTS);
  const [heroVideoUrl, setHeroVideoUrl] = useState<string>(DEFAULT_HERO_VIDEO_URL);

  // View State - Default to Dashboard/Admin if logged in
  const [currentView, setCurrentView] = useState<AppView>(() => {
     if (getStorageItem('dg_auth')) {
         return getStorageItem('dg_admin') ? AppView.ADMIN : AppView.DASHBOARD;
     }
     return AppView.HOME;
  });

  const [activeRoutine, setActiveRoutine] = useState<Routine | null>(null);
  const [isLive, setIsLive] = useState(false);

  // Cart State (Lifted)
  const [cart, setCart] = useState<Product[]>([]);

  // Firebase Auth Listener
  useEffect(() => {
    if (auth) {
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        if (user) {
          setIsAuthenticated(true);
          if (user.email?.endsWith('@deepgetty.com')) {
            setIsAdmin(true);
          }
          // In a real app, check Firestore for subscriptionStatus here
        } else {
          // Only logout if we are not using the local dev persistence override
          // This logic is tricky in mixed mode. We prioritize Firebase if connected.
        }
      });
      return () => unsubscribe();
    }
  }, []);

  const addToCart = (product: Product) => {
    setCart([...cart, product]);
  };

  const removeFromCart = (index: number) => {
    const newCart = [...cart];
    newCart.splice(index, 1);
    setCart(newCart);
  };

  const clearCart = () => {
    setCart([]);
    setCurrentView(AppView.DASHBOARD);
  };

  const handleStartRoutine = (routine: Routine) => {
    setActiveRoutine(routine);
  };

  const handleLogin = (email: string) => {
    setIsAuthenticated(true);
    try { localStorage.setItem('dg_auth', 'true'); } catch(e){}
    
    // Admin Logic Check: Any email ending in @deepgetty.com is an admin
    if (email.endsWith('@deepgetty.com')) {
      setIsAdmin(true);
      try { localStorage.setItem('dg_admin', 'true'); } catch(e){}
      setCurrentView(AppView.ADMIN);
    } else {
      setIsAdmin(false);
      try { localStorage.setItem('dg_admin', 'false'); } catch(e){}
      // Check for subscription (In real app this is an API call)
      setCurrentView(AppView.STUDIO); // Start at Studio/Subscription gate
    }
  };

  const handleSubscribe = () => {
    setIsSubscribed(true);
    try { localStorage.setItem('dg_sub', 'true'); } catch(e){}
    setCurrentView(AppView.DASHBOARD);
  };

  const handleLogout = () => {
      if (auth) { auth.signOut(); }
      setIsAuthenticated(false);
      setIsAdmin(false);
      setIsSubscribed(false);
      try {
        localStorage.removeItem('dg_auth');
        localStorage.removeItem('dg_admin');
        localStorage.removeItem('dg_sub');
      } catch(e){}
      setCurrentView(AppView.HOME);
  };

  const renderMainContent = () => {
    // 1. Home Landing Page (Public)
    if (currentView === AppView.HOME && !isAuthenticated) {
       return <Home onJoin={() => setCurrentView(AppView.STUDIO)} onLogin={() => setCurrentView(AppView.STUDIO)} heroVideoUrl={heroVideoUrl} />;
    }

    // 2. Check Authentication
    if (!isAuthenticated) {
      return <Auth onLogin={handleLogin} />;
    }

    // 3. Check Subscription (Gate Studio/Life/Go)
    // Admin skips subscription check
    if (!isSubscribed && !isAdmin) {
       return <Subscription onSubscribe={handleSubscribe} />;
    }

    // 4. If Routine is Active
    if (activeRoutine) {
      return (
        <RoutinePlayer 
          routine={activeRoutine} 
          onClose={() => setActiveRoutine(null)} 
        />
      );
    }

    // 5. Standard Routing
    switch (currentView) {
      case AppView.DASHBOARD:
        return <Dashboard onNavigate={(view) => setCurrentView(view as AppView)} />;
      case AppView.STUDIO:
        return <Studio onStartRoutine={handleStartRoutine} />;
      case AppView.GO:
        return <DeepGettyGo />;
      case AppView.LIFE:
        return <Life />;
      case AppView.JOURNAL:
        return <Journal />;
      case AppView.MERCH:
        return (
          <Merch 
            addToCart={addToCart} 
            onNavigateToCart={() => setCurrentView(AppView.CART)} 
            cartCount={cart.length}
          />
        );
      case AppView.CART:
        return <Cart items={cart} onRemove={removeFromCart} onCheckout={clearCart} />;
      case AppView.ADMIN:
        return isAdmin ? (
          <Admin 
            products={products} 
            setProducts={setProducts} 
            setHeroVideo={setHeroVideoUrl} 
            currentHeroVideo={heroVideoUrl}
          />
        ) : (
          <Dashboard onNavigate={(view) => setCurrentView(view as AppView)} />
        );
      case AppView.BODY_SCAN:
        return <BodyScan onClose={() => setCurrentView(AppView.DASHBOARD)} />;
      case AppView.SUPPORT:
        return <Support />;
      case AppView.LEGAL:
        return <Legal />;
      case AppView.HOME:
        return <Dashboard onNavigate={(view) => setCurrentView(view as AppView)} />;
      default:
        return <Dashboard onNavigate={(view) => setCurrentView(view as AppView)} />;
    }
  };

  return (
    <div className="min-h-screen bg-deep-black text-deep-accent font-sans selection:bg-blue-500/30 flex flex-col">
      {/* Standalone Live Coach Overlay */}
      {isLive && <LiveCoach onClose={() => setIsLive(false)} />}

      {/* Sticky Navigation */}
      {(isAuthenticated || currentView !== AppView.HOME) && (
        <nav className="sticky top-0 z-30 bg-deep-black/80 backdrop-blur-lg border-b border-zinc-900 animate-in fade-in slide-in-from-top-4 duration-500">
          <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
            <div 
              className="text-2xl font-serif font-bold text-white cursor-pointer"
              onClick={() => setCurrentView(isAuthenticated ? AppView.DASHBOARD : AppView.HOME)}
            >
              DG.
            </div>
            
            {isAuthenticated && (
              <div className="hidden md:flex items-center gap-8">
                <button 
                  onClick={() => setCurrentView(AppView.STUDIO)}
                  className={`text-sm font-medium transition-colors ${currentView === AppView.STUDIO ? 'text-white' : 'text-gray-500 hover:text-white'}`}
                >
                  STUDIO
                </button>
                <button 
                  onClick={() => setCurrentView(AppView.GO)}
                  className={`text-sm font-medium transition-colors ${currentView === AppView.GO ? 'text-white' : 'text-gray-500 hover:text-white'}`}
                >
                  GO
                </button>
                <button 
                  onClick={() => setCurrentView(AppView.LIFE)}
                  className={`text-sm font-medium transition-colors ${currentView === AppView.LIFE ? 'text-white' : 'text-gray-500 hover:text-white'}`}
                >
                  LIFE
                </button>
                <button 
                  onClick={() => setCurrentView(AppView.JOURNAL)}
                  className={`text-sm font-medium transition-colors ${currentView === AppView.JOURNAL ? 'text-white' : 'text-gray-500 hover:text-white'}`}
                >
                  JOURNAL
                </button>
                <button 
                  onClick={() => setCurrentView(AppView.MERCH)}
                  className={`text-sm font-medium transition-colors ${currentView === AppView.MERCH ? 'text-white' : 'text-gray-500 hover:text-white'}`}
                >
                  SHOP
                </button>
              </div>
            )}

            <div className="flex items-center gap-4">
              {isAuthenticated ? (
                  <div className="flex items-center gap-4">
                    {/* Cart Icon (Visible globally when authenticated) */}
                    <button 
                      onClick={() => setCurrentView(AppView.CART)}
                      className="relative text-gray-500 hover:text-white transition-colors"
                    >
                      <ShoppingBag className="w-5 h-5" />
                      {cart.length > 0 && (
                        <span className="absolute -top-1 -right-1 w-4 h-4 bg-blue-600 text-white text-[10px] font-bold flex items-center justify-center rounded-full">
                          {cart.length}
                        </span>
                      )}
                    </button>

                    {isAdmin && (
                      <button onClick={() => setCurrentView(AppView.ADMIN)} className="text-xs text-red-500 hover:text-red-400 uppercase font-bold border border-red-500/20 px-2 py-1 rounded">Admin</button>
                    )}
                    <button onClick={() => setCurrentView(AppView.SUPPORT)} className="text-gray-500 hover:text-white" title="Support">
                      <HelpCircle className="w-5 h-5" />
                    </button>
                    <button onClick={handleLogout} className="text-gray-500 hover:text-white" title="Logout">
                      <LogOut className="w-5 h-5" />
                    </button>
                  </div>
              ) : (
                <span className="text-sm font-bold text-blue-500">GUEST</span>
              )}
            </div>
          </div>
        </nav>
      )}

      {/* Main Content Area */}
      <main className={`flex-grow w-full ${currentView === AppView.HOME && !isAuthenticated ? 'p-0' : 'max-w-7xl mx-auto px-6 py-12'}`}>
        {renderMainContent()}
      </main>

      {/* Footer - Only show inside app */}
      {(isAuthenticated || currentView !== AppView.HOME) && (
        <footer className="border-t border-zinc-900 bg-black py-12">
          <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-8 text-sm text-gray-500">
            <div className="col-span-1 md:col-span-2">
              <h3 className="text-white font-serif font-bold text-xl mb-4">DEEPGETTY.</h3>
              <p className="max-w-sm mb-4">The complete ecosystem for physical and cognitive optimization.</p>
              <div className="flex items-center gap-2 text-blue-500">
                <ShieldCheck className="w-4 h-4" />
                <span className="font-bold text-xs tracking-wider">HIPAA COMPLIANT</span>
              </div>
            </div>
            
            <div>
              <h4 className="text-white font-bold mb-4">Legal</h4>
              <ul className="space-y-2">
                <li className="hover:text-white cursor-pointer" onClick={() => setCurrentView(AppView.LEGAL)}>Privacy Policy</li>
                <li className="hover:text-white cursor-pointer" onClick={() => setCurrentView(AppView.LEGAL)}>Terms of Service</li>
                <li className="hover:text-white cursor-pointer" onClick={() => setCurrentView(AppView.LEGAL)}>Medical Disclaimer</li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-bold mb-4">Support</h4>
              <ul className="space-y-2">
                <li className="hover:text-white cursor-pointer" onClick={() => setCurrentView(AppView.SUPPORT)}>Contact Concierge</li>
                <li className="hover:text-white cursor-pointer" onClick={() => setCurrentView(AppView.SUPPORT)}>Device Help</li>
                <li className="hover:text-white cursor-pointer" onClick={() => setCurrentView(AppView.SUPPORT)}>Protocol FAQ</li>
              </ul>
            </div>
          </div>
          <div className="max-w-7xl mx-auto px-6 mt-12 pt-8 border-t border-zinc-900 text-center text-xs text-gray-600">
            © 2025 DeepGetty Corp. All rights reserved.
          </div>
        </footer>
      )}

      {/* Mobile Bottom Nav */}
      {isAuthenticated && (
        <div className="md:hidden fixed bottom-0 left-0 w-full bg-zinc-950 border-t border-zinc-900 p-4 flex justify-around z-30">
          <button onClick={() => setCurrentView(AppView.DASHBOARD)} className={currentView === AppView.DASHBOARD ? 'text-white' : 'text-gray-600'}><HomeIcon className="w-6 h-6" /></button>
          <button onClick={() => setCurrentView(AppView.STUDIO)} className={currentView === AppView.STUDIO ? 'text-white' : 'text-gray-600'}><LayoutGrid className="w-6 h-6" /></button>
          <button onClick={() => setCurrentView(AppView.GO)} className={currentView === AppView.GO ? 'text-white' : 'text-gray-600'}><Activity className="w-6 h-6" /></button>
          <button onClick={() => setCurrentView(AppView.LIFE)} className={currentView === AppView.LIFE ? 'text-white' : 'text-gray-600'}><Dna className="w-6 h-6" /></button>
          <button onClick={() => setCurrentView(AppView.SUPPORT)} className={currentView === AppView.SUPPORT ? 'text-white' : 'text-gray-600'}><HelpCircle className="w-6 h-6" /></button>
        </div>
      )}
    </div>
  );
};

export default App;
