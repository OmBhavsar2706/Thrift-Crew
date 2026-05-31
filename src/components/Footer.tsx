import { Instagram, Phone, Mail } from 'lucide-react';

interface FooterProps {
  onOpenPolicies?: (anchor?: string) => void;
  onGoToFAQ?: () => void;
  onGoToShop?: () => void;
  onGoToHome?: () => void;
}

export function Footer({ onOpenPolicies, onGoToFAQ, onGoToShop, onGoToHome }: FooterProps) {
  
  // Custom WhatsApp SVG Icon
  const WhatsAppIcon = () => (
    <svg 
      viewBox="0 0 24 24" 
      className="w-5 h-5 fill-current"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M12.004 2C6.48 2 2 6.48 2 12c0 1.95.56 3.77 1.52 5.31L2 22l4.83-1.46c1.47.88 3.19 1.39 5.01 1.39 5.52 0 10-4.48 10-10S17.52 2 12.004 2zm4.31 14.07c-.18.52-.9 1.01-1.44 1.07-.48.05-.18.25-2.88-1.04-3.41-1.62-5.45-5.22-5.59-5.44-.14-.21-1.12-1.6-1.12-3.04 0-1.44.7-2.14 1.01-2.45.21-.21.57-.31.85-.31.09 0 .16.01.23.01.27.01.41.03.59.45.23.55.77 1.97.84 2.12.07.15.11.33.01.53-.1.21-.15.34-.31.53-.16.19-.34.33-.49.51-.16.18-.33.37-.14.71.19.33.84 1.45 1.81 2.36 1.25 1.17 2.3 1.53 2.63 1.69.31.15.49.12.68-.09.19-.23.82-.99 1.04-1.33.22-.34.44-.28.74-.16.32.12 2 .99 2.34 1.17.34.18.57.27.65.41.09.15.09.84-.09 1.36z" />
    </svg>
  );

  return (
    <footer id="footer" className="px-6 md:px-12 pt-16 pb-8 bg-[#0c0c0c] text-neutral-300 border-t border-white/5">
      <div className="max-w-7xl mx-auto flex flex-col gap-12 md:gap-16">
        
        {/* Main top columns */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12">
          
          {/* Column 1: Brand details (occupies 4/12 spaces) */}
          <div className="md:col-span-4 flex flex-col gap-6">
            <div 
              onClick={onGoToHome}
              className="cursor-pointer group w-fit transition-transform hover:scale-[1.03]"
            >
              {/* SVG Header Logo customized for Dark Background */}
              <svg 
                viewBox="0 0 280 125" 
                className="h-14 w-auto object-contain"
                fill="none" 
                xmlns="http://www.w3.org/2000/svg"
              >
                {/* THRIFT (White on Dark Background) */}
                <path 
                  d="M30,30 h40 v4 c-1,1 -1.5,2 -1.5,3.5 v2.5 h-13.5 v25 c0,2.5 0.5,3.5 2,3.5 h2 v2 h-18 v-2 h2 c1.5,0 2,-1 2,-3.5 v-25 h-13.5 v-2.5 c0,-1.5 -0.5,-2.5 -1.5,-3.5 Z" 
                  fill="#FFFFFF" 
                />
                <path 
                  d="M75,30 h14 v2 c-1,1 -1.5,2 -1.5,3.5 v11 h15 v-11 C 102.5,34 102,33 101,32 v-2 h14 v2 c-1,1 -1.5,2 -1.5,3.5 v25 c0,2.5 0.5,3.5 2,3.5 h2 v2 h-18 v-2 h2 c1.5,0 2,-1 2,-3.5 v-11 h-15 v11 c0,2.5 0.5,3.5 2,3.5 h2 v2 h-18 v-2 h2 c1.5,0 2,-1 2,-3.5 V35.5 c0,-1.5 -0.5,-2.5 -1.5,-3.5 Z" 
                  fill="#FFFFFF" 
                />
                {/* R: Stem */}
                <path 
                  d="M121,30 h14 v2 c-1,1 -1.5,2 -1.5,3.5 v25 c0,2.5 0.5,3.5 2,3.5 h2 v2 h-18 v-2 h2 c1.5,0 2,-1 2,-3.5 V35.5 c0,-1.5 -0.5,-2.5 -1.5,-3.5 Z" 
                  fill="#FFFFFF" 
                />
                {/* R: Bowl */}
                <path 
                  d="M129,30 c6,0 14,0.5 17.5,4.5 c3.5,3.5 4,9 1.5,13 c-2.5,4 -8,5.5 -13,5.5 h-6 Z M129,33.5 v11.5 h4 C136.5,45 139.5,44 139.5,39.5 c0,-4.5 -3,-6 -6.5,-6 Z" 
                  fill="#FFFFFF" 
                />
                {/* R: Calligraphic Loop Leg */}
                <path 
                  d="M129,48 c3,-1.5 6,-2.5 8,-1 c2.5,1.5 2.5,5.5 0.5,8.5 c-2,3 -5.5,5.5 -8.5,5.5 c-3,0 -4.5,-2.5 -3,-5.5 c1.5,-3 4,-5.5 7.5,-7.5 c3,-1.5 6,-2.5 9,-2.5 c4,0 7,2.5 9,6.5 c1.5,3 2.5,7 2.5,9 c0,1.5 -1,2.5 -2.5,2.5 c-1.5,0 -2.5,-1 -3.5,-3 c-1.5,-3 -3,-6 -5.5,-8 c-2.5,-2 -5,-3 -7.5,-3 Z" 
                  fill="#FFFFFF" 
                />
                <path 
                  d="M162,30 h18 v2 c-1,1 -1.5,2 -1.5,3.5 v25 c0,2.5 0.5,3.5 2,3.5 h2 v2 h-18 v-2 h2 c1.5,0 2,-1 2,-3.5 V35.5 c0,-1.5 -0.5,-2.5 -1.5,-3.5 Z" 
                  fill="#FFFFFF" 
                />
                <path 
                  d="M184,30 h26 v4 c-0.8,0.8 -1.5,1.5 -1.5,2.5 v2 h-11.5 v11 h10 v2 c-0.8,0.8 -1.5,1.5 -1.5,2.5 v2 h-8.5 v9.5 c0,2.5 0.5,3.5 2,3.5 h2 v2 h-18 v-2 h2 c1.5,0 2,-1 2,-3.5 V35.5 c0,-1.5 -0.5,-2.5 -1.5,-3.5 Z" 
                  fill="#FFFFFF" 
                />
                <path 
                  d="M214,30 h36 v4 c-1,1 -1.5,2 -1.5,3.5 v2.5 h-12 v25 c0,2.5 0.5,3.5 2,3.5 h2 v2 h-18 v-2 h2 c1.5,0 2,-1 2,-3.5 v-25 h-12 v-2.5 c0,-1.5 -0.5,-2.5 -1.5,-3.5 Z" 
                  fill="#FFFFFF" 
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
            
            <p className="text-xs md:text-sm text-neutral-400 max-w-sm leading-relaxed font-sans font-normal">
              Redefining curated streetwear in India. Premium vintage & archival apparel handpicked and verified for true collectors.
            </p>

            {/* Social Icons matching mockup */}
            <div className="flex gap-4 items-center">
              <a 
                href="https://instagram.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full border border-white/10 hover:border-white/30 text-neutral-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a 
                href="https://wa.me/918788965436?text=Hello%20Thrift%20Crew!%20I'd%20like%20to%20inquire%20about%20exclusive%20streetwear%20items." 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full border border-white/10 hover:border-white/30 text-neutral-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
              >
                <WhatsAppIcon />
              </a>
            </div>
          </div>

          {/* Column 2: SHOP (2/12) */}
          <div className="md:col-span-2 flex flex-col gap-4 font-sans">
            <h4 className="text-[11px] font-extrabold uppercase tracking-[.2em] text-[#eeeeee]">
              Shop
            </h4>
            <ul className="flex flex-col gap-3 text-sm">
              <li>
                <a 
                  href="https://thriftcrew.shiprocket.co"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-neutral-400 hover:text-white transition-colors cursor-pointer"
                >
                  Track Order
                </a>
              </li>
              <li>
                <button 
                  onClick={onGoToShop}
                  className="text-neutral-400 hover:text-white transition-colors cursor-pointer text-left block w-full bg-transparent border-0 p-0"
                >
                  All Products
                </button>
              </li>
              <li>
                <button 
                  onClick={onGoToFAQ}
                  className="text-neutral-400 hover:text-white transition-colors cursor-pointer text-left block w-full bg-transparent border-0 p-0"
                >
                  FAQ
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: SUPPORT (2/12) */}
          <div className="md:col-span-2 flex flex-col gap-4 font-sans">
            <h4 className="text-[11px] font-extrabold uppercase tracking-[.2em] text-[#eeeeee]">
              Support
            </h4>
            <ul className="flex flex-col gap-3 text-sm">
              <li>
                <button 
                  onClick={onGoToHome}
                  className="text-neutral-400 hover:text-white transition-colors cursor-pointer text-left block w-full bg-transparent border-0 p-0"
                >
                  About Us
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onOpenPolicies?.('delivery')}
                  className="text-neutral-400 hover:text-white transition-colors cursor-pointer text-left block w-full bg-transparent border-0 p-0"
                >
                  Shipping Policy
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onOpenPolicies?.('exchange')}
                  className="text-neutral-400 hover:text-white transition-colors cursor-pointer text-left block w-full bg-transparent border-0 p-0"
                >
                  Exchange Policy
                </button>
              </li>
            </ul>
          </div>

          {/* Column 4: CONTACT US (4/12) */}
          <div className="md:col-span-4 flex flex-col gap-4 font-sans">
            <h4 className="text-[11px] font-extrabold uppercase tracking-[.2em] text-[#eeeeee]">
              Contact Us
            </h4>
            <div className="flex flex-col gap-4">
              {/* Contact number */}
              <a 
                href="https://wa.me/918788965436?text=Hello%20Thrift%20Crew!%20I'd%20like%20to%20get%20in%20touch."
                target="_blank" 
                rel="noopener noreferrer" 
                className="flex items-start gap-3 hover:text-white transition-all text-neutral-400 cursor-pointer group"
              >
                <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center border border-white/5 transition-colors group-hover:bg-white/10 shrink-0 mt-0.5">
                  <Phone className="w-3.5 h-3.5 text-white" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[14px] md:text-sm font-semibold text-neutral-200">
                    +91 8788965436
                  </span>
                  <span className="text-[11px] text-neutral-500 font-normal">
                    Available on WhatsApp
                  </span>
                </div>
              </a>

              {/* Email */}
              <a 
                href="mailto:thriftcrew1@gmail.com" 
                className="flex items-start gap-3 hover:text-white transition-all text-neutral-400 cursor-pointer group"
              >
                <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center border border-white/5 transition-colors group-hover:bg-white/10 shrink-0 mt-0.5">
                  <Mail className="w-3.5 h-3.5 text-white" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[14px] md:text-sm font-semibold text-neutral-200">
                    thriftcrew1@gmail.com
                  </span>
                </div>
              </a>
            </div>
          </div>

        </div>

        {/* Separator Line */}
        <div className="h-[1px] bg-white/5 w-full mt-4" />

        {/* Footer bottom bar details */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-center">
          <p className="text-[10px] font-mono uppercase tracking-[0.2em] font-medium opacity-40">
            &copy; {new Date().getFullYear()} Thrift Crew. All rights reserved.
          </p>
          <span className="text-[10px] font-mono uppercase tracking-[0.2em] font-medium opacity-40">
            Designed for true collectors.
          </span>
        </div>

      </div>
    </footer>
  );
}
