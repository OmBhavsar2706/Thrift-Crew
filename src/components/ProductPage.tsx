import { useState } from 'react';
import { motion } from 'motion/react';
import { ChevronLeft, Info, Truck, Share2 } from 'lucide-react';
import { DUMMY_PRODUCTS } from './FeaturedProducts';

interface ProductPageProps {
  productId: number;
  onBack: () => void;
  onAddToCart: (product: any, paymentMethod: string) => void;
}

export function ProductPage({ productId, onBack, onAddToCart }: ProductPageProps) {
  const product = DUMMY_PRODUCTS.find(p => p.id === productId) || DUMMY_PRODUCTS[0];
  const [paymentMethod, setPaymentMethod] = useState<'online' | 'cod'>('online');
  const [copied, setCopied] = useState(false);

  const handleAdd = () => {
    onAddToCart(product, paymentMethod);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: product.name,
          text: `Check out this amazing thrift find: ${product.name}!`,
          url: window.location.href,
        });
      } catch (err) {
        console.warn("Native share cancelled or failed:", err);
      }
    } else {
      try {
        await navigator.clipboard.writeText(window.location.href);
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
      } catch (err) {
        console.error("Failed to copy URL:", err);
      }
    }
  };

  return (
    <div className="bg-white min-h-screen pt-[80px]"> {/* Add padding for fixed header */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-sm uppercase tracking-widest text-ink/60 hover:text-ink transition-colors mb-8"
        >
          <ChevronLeft className="w-4 h-4" /> Back to Home
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-24">
          
          {/* Left: Image Gallery */}
          <div className="flex flex-col gap-4">
            <div className="aspect-[3/4] bg-cream rounded-sm overflow-hidden sticky top-28">
              <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
            </div>
          </div>

          {/* Right: Details */}
          <div className="flex flex-col py-4">
            <h1 className="text-3xl md:text-4xl font-heading font-semibold uppercase tracking-tight text-ink mb-2">
              {product.name}
            </h1>
            <p className="text-2xl font-light text-ink mb-8 tracking-wider">
              ₹{product.price.toLocaleString('en-IN')}
            </p>

            <div className="space-y-8">
              {/* Payment Logic */}
              <div>
                <span className="text-sm font-medium uppercase tracking-widest block mb-4">Payment Method</span>
                <div className="flex flex-col gap-3">
                  <label 
                    className={`flex items-start gap-3 p-4 border rounded-sm cursor-pointer transition-colors ${
                      paymentMethod === 'online' ? 'border-navy bg-navy/5' : 'border-ink/20 hover:border-ink/50'
                    }`}
                    onClick={() => setPaymentMethod('online')}
                  >
                    <div className="mt-0.5">
                      <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${paymentMethod === 'online' ? 'border-navy' : 'border-ink/30'}`}>
                        {paymentMethod === 'online' && <div className="w-2 h-2 rounded-full bg-navy"></div>}
                      </div>
                    </div>
                    <div>
                      <h4 className="font-medium text-sm">Full Payment Online</h4>
                      <p className="text-xs text-ink/60 mt-1">Normal product price. Recommended.</p>
                    </div>
                  </label>

                  <label 
                    className={`flex items-start gap-3 p-4 border rounded-sm cursor-pointer transition-colors ${
                      paymentMethod === 'cod' ? 'border-navy bg-navy/5' : 'border-ink/20 hover:border-ink/50'
                    }`}
                    onClick={() => setPaymentMethod('cod')}
                  >
                    <div className="mt-0.5">
                      <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${paymentMethod === 'cod' ? 'border-navy' : 'border-ink/30'}`}>
                        {paymentMethod === 'cod' && <div className="w-2 h-2 rounded-full bg-navy"></div>}
                      </div>
                    </div>
                    <div>
                      <h4 className="font-medium text-sm">Cash on Delivery (COD)</h4>
                      <p className="text-xs text-ink/60 mt-1 flex items-center gap-1">
                        <Info className="w-3 h-3" />
                        Adds ₹100 extra charge. ₹200 advance online payment required. Remaining on delivery.
                      </p>
                    </div>
                  </label>
                </div>
              </div>

              {/* Action */}
              <div className="pt-4 sticky bottom-4 z-30 flex flex-col gap-2 bg-transparent">
                <div className="flex gap-3">
                  <button 
                    onClick={handleAdd}
                    className="flex-1 bg-navy text-white py-4 font-semibold uppercase tracking-widest hover:bg-ink transition-colors rounded-sm shadow-[0_10px_30px_rgba(10,37,64,0.15)] hover:shadow-[0_10px_30px_rgba(17,17,17,0.25)] cursor-pointer"
                  >
                    Add to Cart — ₹{paymentMethod === 'cod' ? (product.price + 100).toLocaleString('en-IN') : product.price.toLocaleString('en-IN')}
                  </button>
                  <button 
                    onClick={handleShare}
                    className="px-5 bg-white dark:bg-[#121212] border border-navy/20 dark:border-white/10 text-navy dark:text-white rounded-sm hover:bg-navy/5 dark:hover:bg-white/5 flex items-center justify-center transition-all cursor-pointer shadow-[0_10px_30px_rgba(0,0,0,0.02)]"
                    title="Share this product"
                  >
                    <Share2 className="w-5 h-5" />
                  </button>
                </div>
                {copied && (
                  <motion.span 
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="text-[10px] font-mono font-bold tracking-[0.15em] text-[#BEB49B] uppercase text-center block mt-1"
                  >
                    ✓ Product link copied to clipboard
                  </motion.span>
                )}
              </div>

              {/* Delivery Details */}
              <div className="border-t border-ink/10 pt-8 space-y-4">
                <div className="flex items-start gap-3">
                  <Truck className="w-5 h-5 text-ink/60" />
                  <div>
                    <h4 className="text-sm font-medium uppercase tracking-widest mb-1">Fast Dispatch</h4>
                    <p className="text-xs text-ink/60 leading-relaxed">Orders are dispatched within 24-48 hours. Expected delivery within 4-7 business days.</p>
                  </div>
                </div>
              </div>
              
            </div>
          </div>
        </div>

        {/* Similar Products */}
        <div className="mt-32 mb-16 border-t border-ink/10 pt-16">
          <h2 className="text-2xl font-heading font-semibold uppercase tracking-widest text-ink mb-12 text-center">You May Also Like</h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
             {DUMMY_PRODUCTS.filter(p => p.id !== productId).slice(0, 4).map((prod) => (
                <div key={prod.id} className="group cursor-pointer">
                  <div className="aspect-[3/4] mb-4 overflow-hidden bg-cream rounded-sm">
                    <img src={prod.image} alt={prod.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                  </div>
                  <h3 className="text-xs uppercase tracking-wide text-ink/80 mb-1 truncate">{prod.name}</h3>
                  <p className="text-sm font-medium text-ink">₹{prod.price.toLocaleString('en-IN')}</p>
                </div>
             ))}
          </div>
        </div>

      </div>
    </div>
  );
}
