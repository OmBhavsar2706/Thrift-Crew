import { Heart, Filter, ArrowDownUp, X, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

import { useState } from 'react';

export const DUMMY_PRODUCTS = [
  // T-Shirts
  { id: 1, name: "Vintage Oversized Tee", price: 1299, image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&q=80&w=800", isNew: true, size: 'L', brand: 'Nike', color: 'Black', material: 'Cotton', category: 'T-Shirts' },
  { id: 101, name: "Classic Athletic Tee", price: 999, image: "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&q=80&w=800", size: 'M', brand: 'Champion', color: 'Grey', material: 'Cotton', category: 'T-Shirts' },
  
  // Jackets
  { id: 3, name: "Olive Quilted Jacket", price: 3499, image: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&q=80&w=800", size: 'M', brand: 'Patagonia', color: 'Olive', material: 'Nylon', category: 'Jackets' },
  { id: 4, name: "Retro Graphic Hoodie", price: 1899, image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&q=80&w=800", isSale: true, size: 'XL', brand: 'Champion', color: 'Grey', material: 'Cotton', category: 'Jackets' },
  { id: 102, name: "Suede Varsity Jacket", price: 4299, image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&q=80&w=800", size: 'L', brand: 'Nike', color: 'Black', material: 'Suede', category: 'Jackets', isNew: true },
  
  // Trackpants
  { id: 103, name: "Classic Fleece Joggers", price: 1799, image: "https://images.unsplash.com/photo-1506629082955-511b1aa562c8?auto=format&fit=crop&q=80&w=800", size: 'M', brand: 'Carhartt', color: 'Olive', material: 'Canvas', category: 'Trackpants' },
  { id: 104, name: "Signature Side-Stripe Trackpants", price: 1999, image: "https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&q=80&w=800", size: 'L', brand: 'Nike', color: 'Black', material: 'Polyester', category: 'Trackpants' },
  
  // Jeans & Cargoes
  { id: 2, name: "Utility Cargo Pants", price: 2499, image: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&q=80&w=800", size: '32', brand: 'Carhartt', color: 'Grey', material: 'Canvas', category: 'Jeans' },
  { id: 105, name: "Vaporwash Relaxed Denim", price: 2799, image: "https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&q=80&w=800", size: '34', brand: 'Carhartt', color: 'Blue', material: 'Cotton', category: 'Jeans' },
  
  // Jerseys
  { id: 106, name: "Vintage Football Jersey", price: 1499, image: "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?auto=format&fit=crop&q=80&w=800", size: 'M', brand: 'Nike', color: 'Blue', material: 'Polyester', category: 'Jerseys', isNew: true },
  { id: 107, name: "All-Star Basketball Jersey", price: 1599, image: "https://images.unsplash.com/photo-1518063319789-7217e6706b04?auto=format&fit=crop&q=80&w=800", size: 'L', brand: 'Champion', color: 'Black', material: 'Polyester', category: 'Jerseys' },
  
  // Caps
  { id: 108, name: "Classic Corduroy Cap", price: 799, image: "https://images.unsplash.com/photo-1533827432537-70133748f5c8?auto=format&fit=crop&q=80&w=800", size: 'S', brand: 'Patagonia', color: 'Olive', material: 'Cotton', category: 'Caps' },
  { id: 109, name: "Retro Snapback Cap", price: 999, image: "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?auto=format&fit=crop&q=80&w=800", size: 'S', brand: 'Champion', color: 'Grey', material: 'Cotton', category: 'Caps', isSale: true }
];

interface FeaturedProductsProps {
  onProductClick: (id: number) => void;
  onAddToCart: (product: any) => void;
  selectedCategory: string | null;
  onSelectCategory: (category: string | null) => void;
  searchQuery?: string;
  onSearchQueryChange?: (query: string) => void;
}

export function FeaturedProducts({ onProductClick, onAddToCart, selectedCategory, onSelectCategory, searchQuery = '', onSearchQueryChange }: FeaturedProductsProps) {
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedBrand, setSelectedBrand] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [selectedMaterial, setSelectedMaterial] = useState<string | null>(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [sortBy, setSortBy] = useState<string>('relevance');

  const [activeFilterTab, setActiveFilterTab] = useState<'size' | 'brand' | 'color' | 'material'>('size');

  const sizes = ['S', 'M', 'L', 'XL', 'XXL'];
  const pantSizes = ['28', '30', '32', '34', '36', '38'];
  
  const brands = Array.from(new Set(DUMMY_PRODUCTS.map(p => p.brand).filter(Boolean)));
  const colors = Array.from(new Set(DUMMY_PRODUCTS.map(p => p.color).filter(Boolean)));
  const materials = Array.from(new Set(DUMMY_PRODUCTS.map(p => p.material).filter(Boolean)));

  let filteredProducts = DUMMY_PRODUCTS.filter(p => {
    if (selectedCategory && p.category !== selectedCategory) return false;
    if (selectedSize && p.size !== selectedSize) return false;
    if (selectedBrand && p.brand !== selectedBrand) return false;
    if (selectedColor && p.color !== selectedColor) return false;
    if (selectedMaterial && p.material !== selectedMaterial) return false;
    
    if (searchQuery && searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase().trim();
      const matchName = p.name ? p.name.toLowerCase().includes(q) : false;
      const matchCategory = p.category ? p.category.toLowerCase().includes(q) : false;
      const matchBrand = p.brand ? p.brand.toLowerCase().includes(q) : false;
      const matchColor = p.color ? p.color.toLowerCase().includes(q) : false;
      const matchMaterial = p.material ? p.material.toLowerCase().includes(q) : false;
      return matchName || matchCategory || matchBrand || matchColor || matchMaterial;
    }
    
    return true;
  });

  // Apply Sorting
  filteredProducts = [...filteredProducts];
  if (sortBy === 'price_low') {
    filteredProducts.sort((a, b) => a.price - b.price);
  } else if (sortBy === 'price_high') {
    filteredProducts.sort((a, b) => b.price - a.price);
  } else if (sortBy === 'newest') {
    filteredProducts.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
  }

  const sortOptions = [
    { id: 'relevance', label: 'Relevance' },
    { id: 'price_low', label: 'Price -- Low to High' },
    { id: 'price_high', label: 'Price -- High to Low' },
    { id: 'newest', label: 'Newest First' },
  ];

  const clearFilters = () => {
    setSelectedSize(null);
    setSelectedBrand(null);
    setSelectedColor(null);
    setSelectedMaterial(null);
  };

  const getActiveFilterCount = () => {
    let count = 0;
    if (selectedSize) count++;
    if (selectedBrand) count++;
    if (selectedColor) count++;
    if (selectedMaterial) count++;
    return count;
  };

  return (
    <section className="py-24 px-6 bg-white" id="shop">
      <div className="max-w-7xl mx-auto">
        {/* Header & Sort/Filter Bar */}
        <div className="mb-6">
          {searchQuery && (
            <div className="mb-6 flex items-center justify-between bg-[#FDFBF7] dark:bg-zinc-900 border border-[#0A2540]/10 dark:border-white/10 rounded px-4 py-3 shadow-sm select-none">
              <span className="text-xs font-mono tracking-wider text-neutral-600 dark:text-neutral-300 flex items-center gap-1.5">
                🔎 Active Search Filter: <strong className="text-[#0A2540] dark:text-[#BEB49B] uppercase font-bold px-1.5 py-0.5 bg-[#0A2540]/5 dark:bg-[#BEB49B]/10 rounded font-mono">"{searchQuery}"</strong>
              </span>
              <button
                onClick={() => onSearchQueryChange && onSearchQueryChange('')}
                className="text-[10px] font-mono tracking-widest uppercase text-[#4C2D3C] dark:text-[#BEB49B] font-bold border border-[#4C2D3C]/20 dark:border-[#BEB49B]/20 px-2.5 py-1.5 rounded hover:bg-[#4C2D3C] hover:text-white dark:hover:bg-[#BEB49B]/20 transition-all cursor-pointer flex items-center gap-1"
              >
                Clear Search &times;
              </button>
            </div>
          )}
          <div className="flex justify-between items-end mb-6">
            <div>
              <h2 className="text-3xl font-heading font-semibold uppercase tracking-widest text-ink mb-4">New Arrivals</h2>
              <div className="w-16 h-0.5 bg-navy"></div>
            </div>
            <button 
              onClick={() => onSelectCategory(null)}
              className="text-sm font-medium tracking-widest uppercase hover:text-navy transition-colors underline underline-offset-4 hidden sm:block shrink-0 cursor-pointer"
            >
              View All
            </button>
          </div>

          {/* Quick Category Chips */}
          <div className="flex gap-2.5 overflow-x-auto pb-4 mb-4 -mx-6 px-6 sm:mx-0 sm:px-0 scrollbar-none select-none">
            <button
              onClick={() => onSelectCategory(null)}
              className={`px-4 py-2 rounded-full border text-[10px] font-bold font-mono tracking-widest transition-all uppercase whitespace-nowrap cursor-pointer ${
                selectedCategory === null 
                  ? 'bg-navy text-white border-navy shadow-sm' 
                  : 'bg-transparent text-ink/60 border-ink/10 hover:border-ink/30 hover:text-ink'
              }`}
            >
              ALL ITEMS
            </button>
            {['T-Shirts', 'Jackets', 'Trackpants', 'Jeans', 'Jerseys', 'Caps'].map(cat => (
              <button
                key={cat}
                onClick={() => onSelectCategory(cat)}
                className={`px-4 py-2 rounded-full border text-[10px] font-bold font-mono tracking-widest transition-all uppercase whitespace-nowrap cursor-pointer ${
                  selectedCategory === cat 
                    ? 'bg-navy text-white border-navy shadow-sm' 
                    : 'bg-transparent text-ink/60 border-ink/10 hover:border-ink/30 hover:text-ink'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
          
          <div className="flex border-y border-ink/10 bg-white sticky top-0 sm:top-16 z-20 shadow-sm relative">
            <button 
              onClick={() => setIsSortOpen(true)} 
              className="flex-1 flex items-center justify-center gap-2 py-4 text-[11px] font-bold uppercase tracking-widest text-ink/80 border-r border-ink/10 hover:bg-ink/5 transition-colors"
            >
              <ArrowDownUp className="w-4 h-4" /> Sort
            </button>
            <button 
              onClick={() => setIsFilterOpen(true)} 
              className="flex-1 flex items-center justify-center gap-2 py-4 text-[11px] font-bold uppercase tracking-widest text-ink/80 hover:bg-ink/5 transition-colors relative"
            >
              <Filter className="w-4 h-4" /> Filter
              {getActiveFilterCount() > 0 && (
                <span className="w-2 h-2 rounded-full bg-navy absolute top-4 right-[calc(50%-35px)]"></span>
              )}
            </button>
          </div>
        </div>
        
        {filteredProducts.length === 0 ? (
          <div className="py-20 text-center text-ink/50 text-sm uppercase tracking-widest">
            No items match your selected filters right now.
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 gap-y-8 sm:gap-x-8 sm:gap-y-12">
            {filteredProducts.map((prod, i) => (
            <motion.div 
              key={prod.id} 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="group flex flex-col"
            >
              <div 
                className="relative aspect-square sm:aspect-[3/4] mb-4 sm:mb-6 overflow-hidden bg-cream cursor-pointer rounded-sm"
                onClick={() => onProductClick(prod.id)}
              >
                <img 
                  src={prod.image} 
                  alt={prod.name} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  loading="lazy"
                />
                
                {/* Badges */}
                <div className="absolute top-4 left-4 flex flex-col gap-2">
                  {prod.isNew && <span className="bg-ink text-white text-xs px-2 py-1 uppercase tracking-wider">New</span>}
                  {prod.isSale && <span className="bg-red-600 text-white text-xs px-2 py-1 uppercase tracking-wider">Sale</span>}
                </div>

                {/* Wishlist */}
                <button 
                  className="absolute top-4 right-4 p-2 bg-white/80 hover:bg-white backdrop-blur-sm rounded-full text-ink hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100 lg:-translate-y-2 lg:group-hover:translate-y-0 duration-300"
                  onClick={(e) => { e.stopPropagation(); }}
                >
                  <Heart className="w-4 h-4" />
                </button>

                {/* Add to cart quick button on hover */}
                <div className="absolute bottom-4 left-4 right-4 translate-y-full opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                  <button 
                    onClick={(e) => { e.stopPropagation(); onAddToCart(prod); }}
                    className="w-full bg-white/90 backdrop-blur-md text-ink py-3 text-sm font-medium uppercase tracking-wider hover:bg-ink hover:text-white transition-colors"
                  >
                    Quick Add
                  </button>
                </div>
              </div>
              
              <div 
                className="flex flex-col flex-1 cursor-pointer"
                onClick={() => onProductClick(prod.id)}
              >
                <h3 className="text-[10px] sm:text-sm uppercase tracking-wide text-ink/80 mb-1 sm:mb-2 truncate group-hover:text-ink transition-colors">
                  {prod.name}
                </h3>
                <p className="text-xs sm:text-base font-medium text-ink">
                  ₹{prod.price.toLocaleString('en-IN')}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
        )}
        
        <button className="mt-12 w-full border border-ink py-4 text-sm font-medium tracking-widest uppercase hover:bg-ink hover:text-white transition-colors sm:hidden">
          View All Products
        </button>
      </div>

      <AnimatePresence>
        {isSortOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSortOpen(false)}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 transition-opacity"
            />
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed bottom-0 left-0 w-full bg-white z-50 flex flex-col rounded-t-xl"
            >
              <div className="p-4 border-b border-ink/10 flex justify-between items-center bg-gray-50 rounded-t-xl">
                <span className="font-heading font-semibold uppercase tracking-widest text-sm text-ink/80">Sort By</span>
                <button onClick={() => setIsSortOpen(false)} className="p-2 hover:bg-ink/5 rounded-full"><X className="w-5 h-5" /></button>
              </div>
              <div className="flex flex-col pb-4">
                {sortOptions.map(option => (
                  <button
                    key={option.id}
                    onClick={() => { setSortBy(option.id); setIsSortOpen(false); }}
                    className={`flex justify-between items-center p-4 border-b border-ink/5 text-sm uppercase tracking-wider ${sortBy === option.id ? 'text-navy font-bold' : 'text-ink/80'}`}
                  >
                    {option.label}
                    {sortBy === option.id && <Check className="w-5 h-5" />}
                  </button>
                ))}
              </div>
            </motion.div>
          </>
        )}

        {isFilterOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsFilterOpen(false)}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 transition-opacity"
            />
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed bottom-0 left-0 w-full h-[80vh] md:h-[60vh] md:max-w-xl md:left-1/2 md:-translate-x-1/2 bg-white z-50 flex flex-col rounded-t-xl overflow-hidden"
              style={{ bottom: 0 }}
            >
              <div className="p-4 border-b border-ink/10 flex justify-between items-center bg-gray-50">
                <span className="font-heading font-semibold uppercase tracking-widest text-sm text-ink/80">Filters</span>
                <div className="flex items-center gap-4">
                  <button onClick={clearFilters} className="text-xs uppercase tracking-widest text-ink/60 underline">Clear</button>
                  <button onClick={() => setIsFilterOpen(false)} className="p-2 hover:bg-ink/5 rounded-full"><X className="w-5 h-5" /></button>
                </div>
              </div>
              
              <div className="flex flex-1 overflow-hidden">
                {/* Filter Tabs Left (Flipkart Style) */}
                <div className="w-1/3 border-r border-ink/10 bg-gray-50 flex flex-col overflow-y-auto">
                  <button 
                    onClick={() => setActiveFilterTab('size')} 
                    className={`p-4 text-xs font-bold uppercase tracking-widest text-left ${activeFilterTab === 'size' ? 'bg-white border-l-4 border-navy text-navy' : 'text-ink/60 border-l-4 border-transparent'}`}
                  >
                    Size {selectedSize && '•'}
                  </button>
                  <button 
                    onClick={() => setActiveFilterTab('brand')} 
                    className={`p-4 text-xs font-bold uppercase tracking-widest text-left ${activeFilterTab === 'brand' ? 'bg-white border-l-4 border-navy text-navy' : 'text-ink/60 border-l-4 border-transparent'}`}
                  >
                    Brand {selectedBrand && '•'}
                  </button>
                  <button 
                    onClick={() => setActiveFilterTab('color')} 
                    className={`p-4 text-xs font-bold uppercase tracking-widest text-left ${activeFilterTab === 'color' ? 'bg-white border-l-4 border-navy text-navy' : 'text-ink/60 border-l-4 border-transparent'}`}
                  >
                    Color {selectedColor && '•'}
                  </button>
                  <button 
                    onClick={() => setActiveFilterTab('material')} 
                    className={`p-4 text-xs font-bold uppercase tracking-widest text-left ${activeFilterTab === 'material' ? 'bg-white border-l-4 border-navy text-navy' : 'text-ink/60 border-l-4 border-transparent'}`}
                  >
                    Material {selectedMaterial && '•'}
                  </button>
                </div>
                
                {/* Filter Options Right */}
                <div className="w-2/3 bg-white flex flex-col overflow-y-auto p-4 gap-2">
                  {activeFilterTab === 'size' && (
                    <>
                      <button
                        onClick={() => setSelectedSize(null)}
                        className={`p-3 text-sm text-left border rounded-sm ${selectedSize === null ? 'border-navy text-navy font-bold bg-navy/5' : 'border-ink/10'}`}
                      >
                        All Sizes
                      </button>
                      <div className="my-2 text-[10px] uppercase font-bold text-ink/40 tracking-widest">Tops</div>
                      {sizes.map(size => (
                        <button
                          key={size}
                          onClick={() => setSelectedSize(size)}
                          className={`p-3 text-sm text-left border rounded-sm flex justify-between ${selectedSize === size ? 'border-navy text-navy font-bold bg-navy/5' : 'border-ink/10'}`}
                        >
                          {size}
                          {selectedSize === size && <Check className="w-4 h-4" />}
                        </button>
                      ))}
                      <div className="my-2 text-[10px] uppercase font-bold text-ink/40 tracking-widest">Bottoms</div>
                      {pantSizes.map(size => (
                        <button
                          key={size}
                          onClick={() => setSelectedSize(size)}
                          className={`p-3 text-sm text-left border rounded-sm flex justify-between ${selectedSize === size ? 'border-navy text-navy font-bold bg-navy/5' : 'border-ink/10'}`}
                        >
                          {size}
                          {selectedSize === size && <Check className="w-4 h-4" />}
                        </button>
                      ))}
                    </>
                  )}
                  
                  {activeFilterTab === 'brand' && (
                    <>
                      <button
                        onClick={() => setSelectedBrand(null)}
                        className={`p-3 text-sm text-left border rounded-sm ${selectedBrand === null ? 'border-navy text-navy font-bold bg-navy/5' : 'border-ink/10'}`}
                      >
                        All Brands
                      </button>
                      {brands.map(brand => (
                        <button
                          key={brand}
                          onClick={() => setSelectedBrand(brand)}
                          className={`p-3 text-sm text-left border rounded-sm flex justify-between ${selectedBrand === brand ? 'border-navy text-navy font-bold bg-navy/5' : 'border-ink/10'}`}
                        >
                          {brand}
                          {selectedBrand === brand && <Check className="w-4 h-4" />}
                        </button>
                      ))}
                    </>
                  )}
                  
                  {activeFilterTab === 'color' && (
                    <>
                      <button
                        onClick={() => setSelectedColor(null)}
                        className={`p-3 text-sm text-left border rounded-sm ${selectedColor === null ? 'border-navy text-navy font-bold bg-navy/5' : 'border-ink/10'}`}
                      >
                        All Colors
                      </button>
                      {colors.map(color => (
                        <button
                          key={color}
                          onClick={() => setSelectedColor(color)}
                          className={`p-3 text-sm text-left border rounded-sm flex justify-between ${selectedColor === color ? 'border-navy text-navy font-bold bg-navy/5' : 'border-ink/10'}`}
                        >
                          {color}
                          {selectedColor === color && <Check className="w-4 h-4" />}
                        </button>
                      ))}
                    </>
                  )}
                  
                  {activeFilterTab === 'material' && (
                    <>
                      <button
                        onClick={() => setSelectedMaterial(null)}
                        className={`p-3 text-sm text-left border rounded-sm ${selectedMaterial === null ? 'border-navy text-navy font-bold bg-navy/5' : 'border-ink/10'}`}
                      >
                        All Materials
                      </button>
                      {materials.map(material => (
                        <button
                          key={material}
                          onClick={() => setSelectedMaterial(material)}
                          className={`p-3 text-sm text-left border rounded-sm flex justify-between ${selectedMaterial === material ? 'border-navy text-navy font-bold bg-navy/5' : 'border-ink/10'}`}
                        >
                          {material}
                          {selectedMaterial === material && <Check className="w-4 h-4" />}
                        </button>
                      ))}
                    </>
                  )}
                </div>
              </div>
              
              <div className="p-4 border-t border-ink/10 bg-white">
                <button
                  onClick={() => setIsFilterOpen(false)}
                  className="w-full bg-navy text-white text-sm uppercase tracking-widest font-bold py-4 hover:opacity-90"
                >
                  Apply Filters
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </section>
  );
}
