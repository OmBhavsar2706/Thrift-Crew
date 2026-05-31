import { motion } from 'motion/react';

const categories = [
  { id: 1, name: "T-Shirts", image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&q=80&w=400" },
  { id: 2, name: "Jackets", image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&q=80&w=400" },
  { id: 3, name: "Trackpants", image: "https://images.unsplash.com/photo-1506629082955-511b1aa562c8?auto=format&fit=crop&q=80&w=400" },
  { id: 4, name: "Jeans", image: "https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&q=80&w=400" },
  { id: 5, name: "Jerseys", image: "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?auto=format&fit=crop&q=80&w=400" },
  { id: 6, name: "Caps", image: "https://images.unsplash.com/photo-1533827432537-70133748f5c8?auto=format&fit=crop&q=80&w=400" }
];

interface CategoriesProps {
  onCategoryClick: (category: string) => void;
}

export function Categories({ onCategoryClick }: CategoriesProps) {
  return (
    <section className="flex-1 px-6 md:px-20 py-16 flex flex-col justify-center">
      <div className="text-center mb-8">
        <h2 className="text-xs uppercase tracking-[0.5em] text-[#0A2540] font-bold font-mono">Shop by Category</h2>
      </div>
      
      <div className="grid grid-cols-3 gap-8 sm:gap-12 md:gap-16 justify-items-center max-w-4xl mx-auto w-full">
        {categories.map((cat, i) => (
          <motion.div 
            key={cat.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            className="flex flex-col items-center group cursor-pointer w-full select-none"
            onClick={() => onCategoryClick(cat.name)}
          >
            <div className="w-18 h-18 sm:w-24 sm:h-24 rounded-full border border-[#0A2540]/20 p-1 mb-3 transition-all group-hover:border-[#0A2540] group-hover:scale-105 bg-white shadow-sm flex-shrink-0">
              <div 
                className="w-full h-full rounded-full bg-[#F5F1E8] bg-cover bg-center overflow-hidden" 
                style={{ backgroundImage: `url('${cat.image}')` }}
              ></div>
            </div>
            <span className="text-[10px] uppercase tracking-widest font-bold text-[#111111]">
              {cat.name}
            </span>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
