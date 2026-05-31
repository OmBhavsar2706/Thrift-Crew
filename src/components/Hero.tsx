import { motion } from 'motion/react';

interface HeroProps {
  onShopNow: () => void;
}

export function Hero({ onShopNow }: HeroProps) {
  const videoSrc = "/thrift.mp4";

  return (
    <section id="hero" className="relative w-full h-[calc(100vh-80px)] flex px-0 items-center justify-center overflow-hidden bg-black group mt-20">
      {/* Background Media Container */}
      <div className="absolute inset-0 w-full h-full overflow-hidden flex items-center justify-center bg-black">
        {/* Dark Cinematic Vignette */}
        <div className="absolute inset-0 bg-black/45 z-10 pointer-events-none" />

        {/* Responsive Full-Bleed Video Background */}
        <video
          src={videoSrc}
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover pointer-events-none transition-transform duration-700 hover:scale-[1.02] z-5"
        />
      </div>

      {/* Hero Content Overlay */}
      <div className="absolute z-20 bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center text-center px-4 w-full max-w-lg">
        {/* Curated Archive Badge */}
        <motion.div
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-4"
        >
          <span className="px-4 py-1.5 border border-white/20 rounded-full text-[10px] font-mono tracking-[0.25em] text-amber-100/90 uppercase bg-black/60 backdrop-blur-md">
            Streetwear & Aesthetic Outfits
          </span>
        </motion.div>

        {/* Quick CTA */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mb-6"
        >
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white uppercase leading-none drop-shadow-md">
            Built to Last
          </h2>
        </motion.div>

        {/* Call to Action Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          <button 
            onClick={onShopNow}
            className="px-12 py-5 md:px-16 md:py-6 bg-white text-black rounded-full text-xs md:text-sm uppercase tracking-[0.2em] font-bold transition-all hover:bg-neutral-100 hover:scale-105 shadow-2xl hover:shadow-black/70 active:scale-95"
          >
            Shop the Collection
          </button>
        </motion.div>
      </div>

      {/* Aesthetic Border Trim Line */}
      <div className="absolute bottom-0 left-0 right-0 h-1/4 bg-gradient-to-t from-black to-transparent z-15 pointer-events-none" />
    </section>
  );
}


