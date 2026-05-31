import { Menu, Search, ShoppingCart, User as UserIcon, Sun, Moon } from 'lucide-react';
import { useEffect, useState } from 'react';
import { motion } from 'motion/react';

interface HeaderProps {
  onOpenMenu: () => void;
  onOpenCart: () => void;
  onOpenSearch: () => void;
  onGoHome: () => void;
  onOpenAuth: () => void;
  cartItemCount: number;
  user?: any;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
}

export function Header({ onOpenMenu, onOpenCart, onOpenSearch, onGoHome, onOpenAuth, cartItemCount, user, isDarkMode, onToggleDarkMode }: HeaderProps) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`fixed w-full top-0 z-40 transition-all duration-300 h-20 border-b border-[#111111]/5 bg-white flex items-center ${
        scrolled ? 'shadow-sm' : ''
      }`}
    >
      <div className="w-full px-6 sm:px-10 h-full flex items-center justify-between">
        {/* Left: Logo & Name */}
        <div className="flex-1 flex items-center">
          <div 
            className="flex items-center cursor-pointer group transition-transform hover:scale-105"
            onClick={onGoHome}
          >
            <svg 
              viewBox="0 0 280 125" 
              className="h-14 sm:h-16 w-auto object-contain"
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
        </div>

        {/* Center: Empty for balance */}
        <div className="hidden sm:flex flex-1 justify-center">
        </div>

        {/* Right: Actions */}
        <div className="flex-1 flex justify-end items-center gap-4 sm:gap-6">
          <button
            onClick={onToggleDarkMode}
            className="cursor-pointer transition-transform hover:scale-105 p-1 rounded-full text-[#111111] hover:text-[#BEB49B]"
            title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
          >
            {isDarkMode ? (
              <Sun className="w-5 h-5 text-amber-500 animate-pulse" />
            ) : (
              <Moon className="w-4 h-4 text-[#111111]" />
            )}
          </button>
          <button 
            onClick={onOpenAuth} 
            className="cursor-pointer transition-transform hover:scale-105"
            title="Shopper Identity"
          >
            {user?.photoURL ? (
              <img 
                src={user.photoURL} 
                alt="Account" 
                referrerPolicy="no-referrer"
                className="w-6 h-6 rounded-full border border-[#111111]/15 object-cover"
              />
            ) : (
              <UserIcon className="w-5 h-5 text-[#111111] hover:text-[#BEB49B] transition-colors" />
            )}
          </button>
          <button 
            onClick={onOpenSearch} 
            className="cursor-pointer hover:text-[#0A2540] transition-colors"
          >
            <Search className="w-5 h-5 text-[#111111]" />
          </button>
          <button
            onClick={onOpenCart}
            className="relative cursor-pointer hover:text-[#0A2540] transition-colors"
          >
            <ShoppingCart className="w-5 h-5 text-[#111111]" />
            {cartItemCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-[#0A2540] text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                {cartItemCount}
              </span>
            )}
          </button>
          <button
            onClick={onOpenMenu}
            className="flex flex-col gap-1.5 focus:outline-none cursor-pointer group ml-2"
          >
            <span className="w-6 h-[1.5px] bg-[#111111] group-hover:bg-[#0A2540] transition-colors"></span>
            <span className="w-6 h-[1.5px] bg-[#111111] group-hover:bg-[#0A2540] transition-colors"></span>
            <span className="w-4 h-[1.5px] bg-[#111111] group-hover:bg-[#0A2540] transition-colors self-end"></span>
          </button>
        </div>
      </div>
    </header>
  );
}
