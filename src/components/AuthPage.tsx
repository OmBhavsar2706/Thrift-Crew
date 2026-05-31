import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { LogIn, LogOut, Shield, Sparkles, User, AlertCircle, ShoppingBag, Eye, HelpCircle } from 'lucide-react';
import { signInWithGoogle, logoutUser, saveUserProfile, isFirebaseConfigured, auth } from '../services/firebase';

interface AuthPageProps {
  onBackToShopping: () => void;
}

export function AuthPage({ onBackToShopping }: AuthPageProps) {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [authChecking, setAuthChecking] = useState(true);

  // Monitor Auth Changes
  useEffect(() => {
    if (!isFirebaseConfigured || !auth) {
      setAuthChecking(false);
      return;
    }

    const unsubscribe = auth.onAuthStateChanged((currentUser: any) => {
      setUser(currentUser);
      setAuthChecking(false);
    }, (err: any) => {
      console.error("Auth state error:", err);
      setAuthChecking(false);
    });

    return () => unsubscribe();
  }, []);

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError(null);
    try {
      if (!isFirebaseConfigured) {
        // Safe interactive demo simulation
        setTimeout(() => {
          const mockUser = {
            uid: "demo-shopper-123",
            displayName: "Premium Shopper",
            email: "shopper@thriftcrew.com",
            photoURL: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300",
          };
          setUser(mockUser);
          setLoading(false);
        }, 1200);
        return;
      }

      const signedInUser = await signInWithGoogle();
      if (signedInUser) {
        await saveUserProfile(signedInUser);
        setUser(signedInUser);
      }
    } catch (err: any) {
      console.error(err);
      setError(err?.message || "Authentication failed. Please verify your settings.");
    } finally {
      if (isFirebaseConfigured) {
        setLoading(false);
      }
    }
  };

  const handleLogout = async () => {
    setLoading(true);
    try {
      if (!isFirebaseConfigured) {
        setUser(null);
      } else {
        await logoutUser();
        setUser(null);
      }
    } catch (err: any) {
      console.error(err);
      setError("Failed to sign out.");
    } finally {
      setLoading(false);
    }
  };

  if (authChecking) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center p-6">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-full border-2 border-white/10 border-t-white animate-spin" />
          <span className="font-mono text-xs tracking-[0.2em] uppercase text-neutral-400">Loading Session...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-950 text-white flex flex-col justify-center items-center px-4 py-24 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background Decoratives */}
      <div className="absolute inset-0 bg-radial-gradient from-neutral-800/20 via-transparent to-transparent pointer-events-none select-none" />
      <div className="absolute top-24 left-1/2 -translate-x-1/2 w-72 h-72 bg-[#4C2D3C]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-md w-full space-y-8 bg-neutral-900/40 p-8 sm:p-10 rounded-3xl border border-white/5 backdrop-blur-xl shadow-2xl">
        
        {/* Banner if in Demo mode */}
        {!isFirebaseConfigured && (
          <div className="bg-amber-500/10 border border-amber-500/20 rounded-2xl p-4 flex gap-3 text-left">
            <AlertCircle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <h4 className="text-xs font-mono font-bold text-amber-300 tracking-wide uppercase">DEMO SIMULATOR ACTIVE</h4>
              <p className="text-[11px] text-neutral-400 leading-relaxed font-normal">
                To connect real Google Auth, run the Firebase provisioner from AI Studio. You can click the Google sign-in below to test driving this experience instantly!
              </p>
            </div>
          </div>
        )}

        {/* Back Arrow / Standard Button */}
        <div className="flex justify-between items-center">
          <button 
            onClick={onBackToShopping}
            className="text-xs font-mono tracking-widest text-neutral-400 uppercase hover:text-white transition-colors flex items-center gap-2 cursor-pointer group"
          >
            <span className="group-hover:-translate-x-1 transition-transform inline-block">&larr;</span> Back to Gallery
          </button>
          
          <div className="flex items-center gap-1.5 px-3 py-1 bg-white/5 border border-white/10 rounded-full">
            <Shield className="w-3 h-3 text-[#BEB49B]" />
            <span className="text-[9px] font-mono tracking-widest text-[#BEB49B] uppercase font-bold">Secure Access</span>
          </div>
        </div>

        {/* Dynamic Inner Layout */}
        {!user ? (
          /* Sign-In View */
          <div className="text-center space-y-6">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tight text-white uppercase font-heading">
                Welcome to Thrift Crew
              </h2>
              <p className="text-xs text-neutral-400 max-w-sm mx-auto leading-relaxed">
                Sign in to save your favorite items, track your deliveries, and enjoy a faster checkout experience.
              </p>
            </div>

            <div className="py-2">
              <div className="h-[1px] bg-gradient-to-r from-transparent via-white/5 to-transparent relative">
                <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#121212] px-4 text-[10px] font-mono uppercase tracking-[0.25em] text-neutral-500 font-bold">
                  Quick Access
                </span>
              </div>
            </div>

            {error && (
              <div className="p-3.5 bg-red-500/10 border border-red-500/20 text-red-400 text-xs rounded-xl font-mono text-left leading-relaxed">
                {error}
              </div>
            )}

            <button
              onClick={handleGoogleLogin}
              disabled={loading}
              className="w-full flex items-center justify-center gap-3 px-6 py-4 border border-white/10 hover:border-white/20 bg-neutral-950 hover:bg-neutral-900 text-white rounded-2xl text-xs uppercase tracking-[0.15em] font-semibold transition-all shadow-xl active:scale-98 select-none cursor-pointer group relative overflow-hidden"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white/10 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  {/* Custom Google Vector Icon */}
                  <svg className="w-4 h-4 text-white group-hover:scale-110 transition-transform" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05" />
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335" />
                  </svg>
                  <span>Sign in with Google</span>
                </>
              )}
            </button>

            <p className="text-[10px] text-neutral-500 font-mono tracking-wider leading-relaxed">
              Safe, secure, and instant. No password required.
            </p>
          </div>
        ) : (
          /* Logged In Shopper Profile View */
          <div className="space-y-6">
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-tr from-[#BEB49B] to-[#4C2D3C] rounded-full blur-md opacity-50 scale-105" />
                {user.photoURL ? (
                  <img 
                    src={user.photoURL} 
                    alt={user.displayName || "Shopper"} 
                    referrerPolicy="no-referrer"
                    className="w-20 h-20 rounded-full border border-white/20 relative z-10 object-cover"
                  />
                ) : (
                  <div className="w-20 h-20 rounded-full bg-neutral-800 border border-white/15 flex items-center justify-center relative z-10">
                    <User className="w-8 h-8 text-neutral-400" />
                  </div>
                )}
                <span className="absolute bottom-0 right-0 w-5.5 h-5.5 bg-[#BEB49B] border border-neutral-900 rounded-full flex items-center justify-center z-20">
                  <Sparkles className="w-3 h-3 text-black" />
                </span>
              </div>

              <div>
                <h3 className="text-xl font-bold uppercase tracking-tight text-white font-heading">
                  Hello, {user.displayName ? user.displayName.split(' ')[0] : "Shopper"}
                </h3>
                <p className="text-xs font-mono text-neutral-400 mt-1">{user.email}</p>
              </div>
            </div>

            <div className="bg-neutral-950/60 rounded-2xl p-5 border border-white/5 space-y-4 text-left font-sans">
              <div className="border-b border-white/5 pb-3 flex justify-between items-center text-[11px] font-mono text-neutral-400 uppercase tracking-widest">
                <span>Account Benefits</span>
                <span className="text-[#BEB49B] font-bold">Active</span>
              </div>

              <div className="space-y-3">
                <div className="flex items-start gap-2.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#BEB49B] mt-2" />
                  <div>
                    <h5 className="text-[11px] font-semibold text-white uppercase tracking-wider">Fast Checkout</h5>
                    <p className="text-[10px] text-neutral-400">Save your shipping address for quicker orders next time.</p>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#BEB49B] mt-2" />
                  <div>
                    <h5 className="text-[11px] font-semibold text-white uppercase tracking-wider">Order Status</h5>
                    <p className="text-[10px] text-neutral-400">Track all your current and past purchases in one place.</p>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#BEB49B] mt-2" />
                  <div>
                    <h5 className="text-[11px] font-semibold text-white uppercase tracking-wider">Early Restocks</h5>
                    <p className="text-[10px] text-neutral-400">Get notified when exclusive collections restock.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                onClick={onBackToShopping}
                className="flex items-center justify-center gap-2 px-4 py-3.5 bg-white text-black hover:bg-neutral-100 rounded-xl text-[10px] uppercase tracking-widest font-bold transition-all cursor-pointer active:scale-95"
              >
                <ShoppingBag className="w-3.5 h-3.5" /> Shop Now
              </button>

              <button
                onClick={handleLogout}
                disabled={loading}
                className="flex items-center justify-center gap-2 px-4 py-3.5 bg-neutral-950 hover:bg-neutral-900 border border-white/5 hover:border-white/10 text-white rounded-xl text-[10px] uppercase tracking-widest font-bold transition-all cursor-pointer active:scale-95 text-red-400/90 hover:text-red-400"
              >
                {loading ? (
                  <div className="w-3 h-3 border-2 border-white/10 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <LogOut className="w-3.5 h-3.5" /> Sign Out
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
