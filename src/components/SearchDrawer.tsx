import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Search } from 'lucide-react';

interface SearchDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onSearch: (query: string) => void;
}

export function SearchDrawer({ isOpen, onClose, onSearch }: SearchDrawerProps) {
  const [query, setQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query);
    }
  };

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
            initial={{ y: '-100%' }}
            animate={{ y: 0 }}
            exit={{ y: '-100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 left-0 w-full bg-white z-50 shadow-2xl flex flex-col justify-center px-6 sm:px-10 h-24"
          >
            <div className="flex justify-between items-center max-w-7xl mx-auto w-full gap-4">
              <Search className="w-6 h-6 text-[#111111]/50 flex-shrink-0" />
              <form onSubmit={handleSearch} className="flex-1">
                <input
                  type="text"
                  autoFocus
                  placeholder="Search for rare fits, products, categories..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="w-full bg-transparent border-none outline-none text-base sm:text-xl text-[#111111] placeholder:text-[#111111]/30 font-light"
                />
              </form>
              <button 
                onClick={onClose}
                className="p-2 -mr-2 rounded-full text-[#111111] hover:bg-[#111111]/5 transition-colors cursor-pointer flex-shrink-0"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            {query && (
              <div className="absolute top-24 left-0 w-full bg-white border-t border-[#111111]/5 shadow-xl max-h-60 overflow-y-auto">
                <div className="max-w-7xl mx-auto px-6 sm:px-10 py-6 text-sm text-[#111111]/50 uppercase tracking-widest text-center">
                  Press enter to search for "{query}"
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
