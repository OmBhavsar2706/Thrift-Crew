import { motion, AnimatePresence } from 'motion/react';
import { X, Home, Phone, Instagram, MessageCircle, FileText, LogIn } from 'lucide-react';

interface MenuDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenAuth: () => void;
  onGoHome: () => void;
  onOpenPolicies: () => void;
  onGoToFooter: () => void;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  user?: any;
}

const menuLinks = [
  { name: "HOME", icon: Home, href: "#", external: false },
  { name: "CONTACT US", icon: Phone, href: "#", external: false },
  { name: "JOIN INSTAGRAM", icon: Instagram, color: "text-[#E1306C]", href: "https://instagram.com", external: true },
  { name: "CHAT WITH US", icon: MessageCircle, href: "https://wa.me/918788965436?text=Hello%20Thrift%20Crew!%20I'd%20like%20to%20get%20in%20touch.", external: true },
  { name: "OUR POLICIES", icon: FileText, href: "#", external: false },
  { name: "REGISTER/LOGIN", icon: LogIn, href: "#", external: false }
];

export function MenuDrawer({ isOpen, onClose, onOpenAuth, onGoHome, onOpenPolicies, onGoToFooter, isDarkMode, onToggleDarkMode, user }: MenuDrawerProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 transition-opacity"
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-y-0 right-0 w-[75vw] sm:w-[400px] bg-white z-50 flex flex-col shadow-2xl text-[#111111]"
          >
            <div className="p-6 flex justify-between items-center bg-[#F5F1E8]">
              <span className="font-heading font-semibold text-lg tracking-wider text-[#111111] uppercase">
                MENU
              </span>
              <button 
                onClick={onClose}
                className="p-2 -mr-2 rounded-full text-[#111111] hover:bg-[#111111]/5 transition-colors cursor-pointer"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="flex-1 flex flex-col pt-4 overflow-y-auto">
              {/* User Identity Banner */}
              <div className="px-6 py-5 border-b border-[#111111]/5 flex flex-col gap-3 bg-[#F5F1E8]/20">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full border border-[#0A2540]/10 flex items-center justify-center p-0.5 overflow-hidden bg-white shrink-0 shadow-sm">
                    {user?.photoURL ? (
                      <img 
                        src={user.photoURL} 
                        alt="Profile" 
                        referrerPolicy="no-referrer"
                        className="w-full h-full rounded-full object-cover" 
                      />
                    ) : (
                      <div className="w-full h-full rounded-full bg-[#0A2540]/5 flex items-center justify-center font-bold font-mono text-[#0A2540] text-sm">
                        {user?.email ? user.email.slice(0, 1).toUpperCase() : '?'}
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[9px] font-bold uppercase tracking-[0.15em] text-[#111111]/40 mb-0.5">
                      {user ? "AUTHENTICATED CUSTOMER" : "GUEST VISITOR"}
                    </p>
                    <p className="text-xs font-mono font-bold text-[#111111] truncate" title={user?.email || "Not signed in"}>
                      {user?.email || "GUEST@THRIFTCREW.COM"}
                    </p>
                  </div>
                  {user && (
                    <span className="w-2 h-2 rounded-full bg-[#8EA885] animate-pulse shrink-0" title="Active Session" />
                  )}
                </div>
              </div>

              {/* Elegant Mode Toggle Segment */}
              <div className="px-6 py-4 border-b border-[#111111]/5 flex items-center justify-between bg-[#F5F1E8]/40">
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#111111]/60">COLOR PREFERENCE</span>
                <button
                  type="button"
                  onClick={onToggleDarkMode}
                  className="flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#111111]/15 hover:border-[#111111]/40 transition-all text-[10px] font-bold font-mono tracking-widest cursor-pointer select-none text-[#111111]"
                >
                  <span className="w-2 h-2 rounded-full bg-[#BEB49B] animate-pulse" />
                  {isDarkMode ? 'DARK THEME' : 'LIGHT THEME'}
                </button>
              </div>

              <nav className="flex flex-col">
                {menuLinks.map((item, i) => {
                  const isAuthLink = item.name === "REGISTER/LOGIN";
                  const label = isAuthLink && user ? "MY IDENTITY & LOGOUT" : item.name;
                  return (
                    <motion.a
                      key={item.name}
                      href={item.href}
                      target={item.external ? "_blank" : undefined}
                      rel={item.external ? "noopener noreferrer" : undefined}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05, duration: 0.3 }}
                      onClick={(e) => { 
                        onClose();
                        if (item.external) {
                          return;
                        }
                        e.preventDefault(); 
                        if (item.name === "REGISTER/LOGIN") {
                          onOpenAuth();
                        } else if (item.name === "HOME") {
                          onGoHome();
                        } else if (item.name === "OUR POLICIES") {
                          onOpenPolicies();
                        } else if (item.name === "CONTACT US") {
                          onGoToFooter();
                        }
                      }}
                      className="flex items-center gap-4 px-6 py-5 border-b border-[#111111]/5 hover:bg-[#111111]/5 transition-colors cursor-pointer"
                    >
                      <item.icon className={`w-5 h-5 ${item.color || 'text-[#111111]'}`} />
                      <span className={`font-semibold tracking-wide text-sm ${item.color || 'text-[#111111]'}`}>
                        {label}
                      </span>
                    </motion.a>
                  );
                })}
              </nav>
            </div>

            <div className="p-6 bg-[#F5F1E8] flex justify-center items-center">
              <svg 
                viewBox="0 0 280 125" 
                className="h-11 w-auto object-contain"
                fill="none" 
                xmlns="http://www.w3.org/2000/svg"
              >
                {/* THRIFT (Dark Plum #4C2D3C) */}
                <path 
                  d="M30,30 h40 v4 c-1,1 -1.5,2 -1.5,3.5 v2.5 h-13.5 v25 c0,2.5 0.5,3.5 2,3.5 h2 v2 h-18 v-2 h2 c1.5,0 2,-1 2,-3.5 v-25 h-13.5 v-2.5 c0,-1.5 -0.5,-2.5 -1.5,-3.5 Z" 
                  fill="#4C2D3C" 
                />
                <path 
                  d="M75,30 h14 v2 c-1,1 -1.5,2 -1.5,3.5 v11 h15 v-11 C 102.5,34 102,33 101,32 v-2 h14 v2 c-1,1 -1.5,2 -1.5,3.5 v25 c0,2.5 0.5,3.5 2,3.5 h2 v2 h-18 v-2 h2 c1.5,0 2,-1 2,-3.5 v-11 h-15 v11 c0,2.5 0.5,3.5 2,3.5 h2 v2 h-18 v-2 h2 c1.5,0 2,-1 2,-3.5 V35.5 c0,-1.5 -0.5,-2.5 -1.5,-3.5 Z" 
                  fill="#4C2D3C" 
                />
                {/* R: Stem */}
                <path 
                  d="M121,30 h14 v2 c-1,1 -1.5,2 -1.5,3.5 v25 c0,2.5 0.5,3.5 2,3.5 h2 v2 h-18 v-2 h2 c1.5,0 2,-1 2,-3.5 V35.5 c0,-1.5 -0.5,-2.5 -1.5,-3.5 Z" 
                  fill="#4C2D3C" 
                />
                {/* R: Bowl */}
                <path 
                  d="M129,30 c6,0 14,0.5 17.5,4.5 c3.5,3.5 4,9 1.5,13 c-2.5,4 -8,5.5 -13,5.5 h-6 Z M129,33.5 v11.5 h4 C136.5,45 139.5,44 139.5,39.5 c0,-4.5 -3,-6 -6.5,-6 Z" 
                  fill="#4C2D3C" 
                />
                {/* R: Calligraphic Loop Leg */}
                <path 
                  d="M129,48 c3,-1.5 6,-2.5 8,-1 c2.5,1.5 2.5,5.5 0.5,8.5 c-2,3 -5.5,5.5 -8.5,5.5 c-3,0 -4.5,-2.5 -3,-5.5 c1.5,-3 4,-5.5 7.5,-7.5 c3,-1.5 6,-2.5 9,-2.5 c4,0 7,2.5 9,6.5 c1.5,3 2.5,7 2.5,9 c0,1.5 -1,2.5 -2.5,2.5 c-1.5,0 -2.5,-1 -3.5,-3 c-1.5,-3 -3,-6 -5.5,-8 c-2.5,-2 -5,-3 -7.5,-3 Z" 
                  fill="#4C2D3C" 
                />
                <path 
                  d="M162,30 h18 v2 c-1,1 -1.5,2 -1.5,3.5 v25 c0,2.5 0.5,3.5 2,3.5 h2 v2 h-18 v-2 h2 c1.5,0 2,-1 2,-3.5 V35.5 c0,-1.5 -0.5,-2.5 -1.5,-3.5 Z" 
                  fill="#4C2D3C" 
                />
                <path 
                  d="M184,30 h26 v4 c-0.8,0.8 -1.5,1.5 -1.5,2.5 v2 h-11.5 v11 h10 v2 c-0.8,0.8 -1.5,1.5 -1.5,2.5 v2 h-8.5 v9.5 c0,2.5 0.5,3.5 2,3.5 h2 v2 h-18 v-2 h2 c1.5,0 2,-1 2,-3.5 V35.5 c0,-1.5 -0.5,-2.5 -1.5,-3.5 Z" 
                  fill="#4C2D3C" 
                />
                <path 
                  d="M214,30 h36 v4 c-1,1 -1.5,2 -1.5,3.5 v2.5 h-12 v25 c0,2.5 0.5,3.5 2,3.5 h2 v2 h-18 v-2 h2 c1.5,0 2,-1 2,-3.5 v-25 h-12 v-2.5 c0,-1.5 -0.5,-2.5 -1.5,-3.5 Z" 
                  fill="#4C2D3C" 
                />

                {/* CREW (Gold/Taupe #BEB49B) */}
                <path 
                  d="M 71,81 C 67.5,81 63.5,83 61.5,86 C 59,89.5 59,94 61.5,97.5 C 63.5,100.5 67.5,102.5 71,102.5 c 2.5,0 4.5,-1 5.5,-2 h -2.5 c -1,0.5 -2.2,1 -3,1 c -2.8,0 -5.5,-1.8 -6.8,-4.5 C 62.5,94.5 62.5,89 64.2,86.2 c 1.3,-2.7 4,-4.2 6.8,-4.2 c 1,0 2,0.5 3,1 h 2.5 c -1,-1 -3,-2 -5.5,-2 z" 
                  fill="#BEB49B" 
                />
                <path 
                  d="M 105,81 h 12 c 4,0 6.5,2 6.5,5.5 v 0.5 c 0,3 -2,4.5 -4.5,5 L 124,101.5 h -3.5 L 114,92 h -6 v 9.5 h -3 Z M 108,83.5 v 6 h 8.5 c 2.5,0 4,-1 4,-3 c 0,-2 -1.5,-3 -4,-3 Z" 
                  fill="#BEB49B" 
                />
                <path 
                  d="M 153,81 h 14 v 2.5 h -11 v 5.5 h 9.5 v 2.5 H 156 v 7 h 11 v 2.5 h -14 Z" 
                  fill="#BEB49B" 
                />
                <path 
                  d="M 198,81 H 201.5 L 207,97 L 212.5,81 h 3.5 L 221,97 L 226.5,81 H 230 L 222.5,101.5 h -3.5 L 214,86 L 209,101.5 h -3.5 Z" 
                  fill="#BEB49B" 
                />
              </svg>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
