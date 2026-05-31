import { motion, AnimatePresence } from 'motion/react';
import { X, ShoppingBag } from 'lucide-react';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: any[];
  onRemoveItem: (id: number) => void;
  onCheckout: () => void;
}

export function CartDrawer({ isOpen, onClose, cartItems, onRemoveItem, onCheckout }: CartDrawerProps) {
  const subtotal = cartItems.reduce((acc, item) => acc + item.price, 0);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-ink/40 backdrop-blur-sm z-50 transition-opacity"
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-y-0 right-0 w-full sm:w-80 bg-white z-50 border-l border-[#111111]/10 flex flex-col shadow-2xl"
          >
            {/* Header */}
            <div className="p-6 flex items-center justify-between border-b border-[#111111]/5">
              <h3 className="text-sm uppercase font-bold tracking-widest text-[#111111]">
                Shopping Cart ({cartItems.length})
              </h3>
              <button 
                onClick={onClose}
                className="text-xs uppercase text-[#111111] opacity-50 hover:opacity-100 transition-opacity"
              >
                Close
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto p-6 flex flex-col text-[#111111]">
              {cartItems.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center text-center opacity-50">
                  <ShoppingBag className="w-8 h-8 mb-4 stroke-1" />
                  <p className="text-[10px] uppercase font-bold tracking-widest">Your cart is empty</p>
                </div>
              ) : (
                cartItems.map((item) => (
                  <div key={item.id} className="flex gap-4 mb-6 group">
                    <div className="w-20 h-24 bg-[#F5F1E8] rounded-lg overflow-hidden flex-shrink-0">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex flex-col flex-1">
                      <div className="flex justify-between items-start mb-1">
                        <p className="text-xs font-bold uppercase mb-1 pr-2">{item.name}</p>
                        <button 
                          onClick={() => onRemoveItem(item.cartItemId)}
                          className="text-[#111111]/40 hover:text-red-500 transition-colors shrink-0"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                      <p className="text-[10px] text-gray-500 mb-2 italic">1 of 1 (Thrift Edition)</p>
                      
                      <div className="mt-auto flex justify-end items-center">
                        <p className="text-xs font-semibold">₹{item.price.toLocaleString('en-IN')}</p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            {cartItems.length > 0 && (
              <div className="p-6 bg-white border-t border-[#111111]/5 text-[#111111]">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-[10px] uppercase font-medium">Subtotal</span>
                  <span className="font-bold">₹{subtotal.toLocaleString('en-IN')}</span>
                </div>
                <button 
                  id="checkout-now-button"
                  onClick={onCheckout}
                  className="w-full py-4 bg-[#111111] text-white rounded-full text-[10px] uppercase tracking-widest font-bold shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all text-center cursor-pointer"
                >
                  Checkout Now
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
