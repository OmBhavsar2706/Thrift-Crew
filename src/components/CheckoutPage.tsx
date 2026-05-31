import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShoppingBag, ArrowLeft, ShieldCheck, CheckCircle2, QrCode, Smartphone, Loader2, CreditCard, Lock } from 'lucide-react';

interface CheckoutPageProps {
  cartItems: any[];
  onBackToShopping: () => void;
  onClearCart: () => void;
}

export function CheckoutPage({ cartItems, onBackToShopping, onClearCart }: CheckoutPageProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    address: '',
    city: '',
    zip: '',
    phone: '',
    paymentMethod: 'upi', // 'upi' or 'cod'
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSuccess, setIsSuccess] = useState(false);
  const [orderId, setOrderId] = useState('');

  // Razorpay simulated state
  const [isRazorpayOpen, setIsRazorpayOpen] = useState(false);
  const [razorpayApp, setRazorpayApp] = useState<string | null>(null);
  const [razorpayStatus, setRazorpayStatus] = useState<'idle' | 'processing' | 'verifying' | 'completed'>('idle');
  const [countdown, setCountdown] = useState(5);

  const subtotal = cartItems.reduce((acc, item) => acc + item.price, 0);
  const shipping = subtotal > 1500 ? 0 : 150;
  const codFee = formData.paymentMethod === 'cod' ? 100 : 0;
  const total = subtotal + shipping + codFee;

  // The amount to pay immediately via Razorpay
  const razorpayAmount = formData.paymentMethod === 'upi' ? total : 150;
  // The amount left to pay at delivery (only applicable for COD)
  const remainingCodAmount = formData.paymentMethod === 'cod' ? (total - 150) : 0;

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = 'Full name is required';
    if (!formData.email.trim() || !formData.email.includes('@')) newErrors.email = 'Valid email is required';
    if (!formData.address.trim()) newErrors.address = 'Shipping destination address is required';
    if (!formData.city.trim()) newErrors.city = 'City is required';
    if (!formData.zip.trim() || formData.zip.length < 6) newErrors.zip = 'Valid 6-digit PIN Code is required';
    if (!formData.phone.trim() || formData.phone.length < 10) newErrors.phone = 'Valid 10-digit Phone connection is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => {
        const u = { ...prev };
        delete u[field];
        return u;
      });
    }
  };

  const handleOpenRazorpay = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }
    // Reset Razorpay simulation states
    setRazorpayApp(null);
    setRazorpayStatus('idle');
    setIsRazorpayOpen(true);
  };

  const handleSimulatePayment = (appName: string) => {
    setRazorpayApp(appName);
    setRazorpayStatus('processing');
    
    // Simulate approval delay
    let timer = 3;
    const interval = setInterval(() => {
      timer--;
      if (timer <= 0) {
        clearInterval(interval);
        setRazorpayStatus('verifying');
        
        // Verifying delay before absolute order state completion
        setTimeout(() => {
          setRazorpayStatus('completed');
          setTimeout(() => {
            setIsRazorpayOpen(false);
            setOrderId('TC-' + Math.floor(100000 + Math.random() * 900000));
            setIsSuccess(true);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }, 1000);
        }, 1200);
      }
    }, 1000);
  };

  const handleFinish = () => {
    onClearCart();
    onBackToShopping();
  };

  const upiApps = [
    { id: 'gpay', name: 'Google Pay', color: 'bg-[#EA4335]/10 text-[#EA4335] hover:bg-[#EA4335]/25 border-red-200' },
    { id: 'phonepe', name: 'PhonePe', color: 'bg-[#5f259f]/10 text-[#5f259f] hover:bg-[#5f259f]/25 border-purple-200' },
    { id: 'paytm', name: 'Paytm UPI', color: 'bg-[#00b9f5]/10 text-[#00b9f5] hover:bg-[#00b9f5]/25 border-sky-200' },
    { id: 'bhim', name: 'BHIM UPI', color: 'bg-[#e0701b]/10 text-[#e0701b] hover:bg-[#e0701b]/25 border-orange-200' }
  ];

  if (cartItems.length === 0 && !isSuccess) {
    return (
      <div className="w-full min-h-screen bg-[#FDFBF7] dark:bg-[#0c0c0c] flex items-center justify-center py-20 px-4">
        <div className="max-w-md w-full text-center text-[#111111] dark:text-[#eeeeee]">
          <ShoppingBag className="w-16 h-16 mx-auto mb-6 text-[#A28F6E] stroke-1" />
          <h2 className="text-xl uppercase font-bold tracking-widest mb-2 font-heading">Your Cart is Empty</h2>
          <p className="text-xs text-[#111111]/65 mb-8 max-w-sm mx-auto font-sans">
            Please add some fresh selected streetwear thrift items to your shopping cart back on catalog before checkout.
          </p>
          <button
            onClick={onBackToShopping}
            className="px-8 py-3.5 bg-[#0A2540] hover:bg-[#4C2D3C] text-white text-[10px] uppercase tracking-widest font-bold transition-all cursor-pointer rounded-full"
          >
            Explore Catalog
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-[#FDFBF7] dark:bg-[#0c0c0c] text-[#111111] dark:text-[#eeeeee] font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16">
        
        {/* Back control */}
        {!isSuccess && (
          <button
            onClick={onBackToShopping}
            className="group inline-flex items-center gap-2 mb-8 text-[11px] uppercase tracking-widest font-bold hover:text-[#4C2D3C] text-neutral-500 font-mono transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            Back to Catalog
          </button>
        )}

        <AnimatePresence mode="wait">
          {!isSuccess ? (
            <motion.div
              key="checkout-form"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12"
            >
              
              {/* Form Input Section */}
              <div className="lg:col-span-7 space-y-8">
                
                <header className="border-b border-black/5 pb-4">
                  <h1 className="text-2xl font-bold uppercase tracking-widest font-heading text-[#0A2540]">Secure Checkout</h1>
                  <p className="text-xs text-neutral-500 font-mono mt-1">Authorized with dual pre-authorization safeguards</p>
                </header>

                <form onSubmit={handleOpenRazorpay} className="space-y-6">
                  
                  {/* Address part */}
                  <div className="p-6 bg-white dark:bg-[#121212] border border-black/5 dark:border-white/10 rounded-lg space-y-4 shadow-sm">
                    <h3 className="text-xs uppercase tracking-widest font-extrabold text-[#4C2D3C] flex items-center gap-2 mb-2">
                      <span className="w-5 h-5 rounded-full bg-[#4C2D3C]/10 text-xs flex items-center justify-center font-mono">1</span>
                      Delivery & Address Coordinates
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-[10px] font-mono uppercase tracking-wider text-neutral-500 block">Full Name</label>
                        <input
                          type="text"
                          value={formData.name}
                          onChange={(e) => handleInputChange('name', e.target.value)}
                          placeholder="Om Bhavsar"
                          className={`w-full bg-neutral-50 dark:bg-zinc-900 border ${errors.name ? 'border-red-500 font-bold bg-red-50 dark:bg-red-950/20' : 'border-neutral-200 dark:border-white/10'} rounded px-3 py-2 text-xs focus:ring-1 focus:ring-[#BEB49B] outline-none text-[#111111] dark:text-white`}
                        />
                        {errors.name && <p className="text-[10px] text-red-500 font-mono">{errors.name}</p>}
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-mono uppercase tracking-wider text-neutral-500 block">Email Address</label>
                        <input
                          type="email"
                          value={formData.email}
                          onChange={(e) => handleInputChange('email', e.target.value)}
                          placeholder="ombhavsar552@gmail.com"
                          className={`w-full bg-neutral-50 dark:bg-zinc-900 border ${errors.email ? 'border-red-500 font-bold bg-red-50 dark:bg-red-950/20' : 'border-neutral-200 dark:border-white/10'} rounded px-3 py-2 text-xs focus:ring-1 focus:ring-[#BEB49B] outline-none text-[#111111] dark:text-white`}
                        />
                        {errors.email && <p className="text-[10px] text-red-500 font-mono">{errors.email}</p>}
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-mono uppercase tracking-wider text-neutral-500 block">Shipping Destination Address</label>
                      <input
                        type="text"
                        value={formData.address}
                        onChange={(e) => handleInputChange('address', e.target.value)}
                        placeholder="Street address, Apartment, Suite number"
                        className={`w-full bg-neutral-50 dark:bg-zinc-900 border ${errors.address ? 'border-red-500 font-bold bg-red-50 dark:bg-red-950/20' : 'border-neutral-200 dark:border-white/10'} rounded px-3 py-2 text-xs focus:ring-1 focus:ring-[#BEB49B] outline-none text-[#111111] dark:text-white`}
                      />
                      {errors.address && <p className="text-[10px] text-red-500 font-mono">{errors.address}</p>}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-[10px] font-mono uppercase tracking-wider text-neutral-500 block">City / Town</label>
                        <input
                          type="text"
                          value={formData.city}
                          onChange={(e) => handleInputChange('city', e.target.value)}
                          placeholder="Mumbai"
                          className={`w-full bg-neutral-50 dark:bg-zinc-900 border ${errors.city ? 'border-red-500 font-bold bg-red-50 dark:bg-red-950/20' : 'border-neutral-200 dark:border-white/10'} rounded px-3 py-2 text-xs focus:ring-1 focus:ring-[#BEB49B] outline-none text-[#111111] dark:text-white`}
                        />
                        {errors.city && <p className="text-[10px] text-red-500 font-mono">{errors.city}</p>}
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div className="space-y-1">
                          <label className="text-[10px] font-mono uppercase tracking-wider text-neutral-500 block">PIN Code</label>
                          <input
                            type="text"
                            value={formData.zip}
                            onChange={(e) => handleInputChange('zip', e.target.value)}
                            placeholder="400001"
                            maxLength={6}
                            className={`w-full bg-neutral-50 dark:bg-zinc-900 border ${errors.zip ? 'border-red-500 font-bold bg-red-50 dark:bg-red-950/20' : 'border-neutral-200 dark:border-white/10'} rounded px-3 py-2 text-xs focus:ring-1 focus:ring-[#BEB49B] outline-none text-[#111111] dark:text-white`}
                          />
                          {errors.zip && <p className="text-[10px] text-red-500 font-mono">{errors.zip}</p>}
                        </div>

                        <div className="space-y-1">
                          <label className="text-[10px] font-mono uppercase tracking-wider text-neutral-500 block">Phone Connection</label>
                          <input
                            type="tel"
                            value={formData.phone}
                            onChange={(e) => handleInputChange('phone', e.target.value)}
                            placeholder="9876543210"
                            maxLength={12}
                            className={`w-full bg-neutral-50 dark:bg-zinc-900 border ${errors.phone ? 'border-red-500' : 'border-neutral-200 dark:border-white/10'} rounded px-3 py-2 text-xs focus:ring-1 focus:ring-[#BEB49B] outline-none text-[#111111] dark:text-white`}
                          />
                          {errors.phone && <p className="text-[10px] text-red-500 font-mono">{errors.phone}</p>}
                        </div>
                      </div>
                    </div>

                  </div>

                  {/* Payment selection */}
                  <div className="p-6 bg-white dark:bg-[#121212] border border-black/5 dark:border-white/10 rounded-lg space-y-4 shadow-sm">
                    <h3 className="text-xs uppercase tracking-widest font-extrabold text-[#4C2D3C] flex items-center gap-2 mb-2">
                      <span className="w-5 h-5 rounded-full bg-[#4C2D3C]/10 text-xs flex items-center justify-center font-mono">2</span>
                      Payment Method
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                      {/* UPI */}
                      <button
                        type="button"
                        onClick={() => handleInputChange('paymentMethod', 'upi')}
                        className={`p-4 border text-left rounded-lg transition-all flex flex-col justify-between h-24 cursor-pointer ${
                          formData.paymentMethod === 'upi'
                            ? 'border-[#0A2540] bg-[#0A2540]/5 dark:border-[#BEB49B] dark:bg-[#BEB49B]/5'
                            : 'border-neutral-200 hover:border-neutral-400 dark:border-zinc-800 dark:hover:border-zinc-700'
                        }`}
                      >
                        <div className="flex justify-between items-center w-full">
                          <span className="text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 text-[#0A2540] dark:text-[#BEB49B]">
                            <QrCode className="w-4 h-4 text-[#0A2540] dark:text-[#BEB49B]" />
                            UPI Gateway
                          </span>
                          <span className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${
                            formData.paymentMethod === 'upi' ? 'border-[#0A2540] dark:border-[#BEB49B]' : 'border-neutral-400 dark:border-zinc-600'
                          }`}>
                            {formData.paymentMethod === 'upi' && <span className="w-2 h-2 rounded-full bg-[#0A2540] dark:bg-[#BEB49B]" />}
                          </span>
                        </div>
                        <span className="text-[10px] text-neutral-500 dark:text-neutral-400 font-mono">No extra fee. Secure online UPI checkout popups.</span>
                      </button>

                      {/* Cash on Delivery with Booking Fee */}
                      <button
                        type="button"
                        onClick={() => handleInputChange('paymentMethod', 'cod')}
                        className={`p-4 border text-left rounded-lg transition-all flex flex-col justify-between h-24 cursor-pointer ${
                          formData.paymentMethod === 'cod'
                            ? 'border-[#0A2540] bg-[#0A2540]/5 dark:border-[#BEB49B] dark:bg-[#BEB49B]/5'
                            : 'border-neutral-200 hover:border-neutral-400 dark:border-zinc-800 dark:hover:border-zinc-700'
                        }`}
                      >
                        <div className="flex justify-between items-center w-full">
                          <span className="text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 text-amber-700 dark:text-amber-500">
                            <span className="font-heading font-extrabold font-mono">COD</span>
                            COD with ₹150 Booking Fee
                          </span>
                          <span className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${
                            formData.paymentMethod === 'cod' ? 'border-[#0A2540] dark:border-[#BEB49B]' : 'border-neutral-400 dark:border-zinc-600'
                          }`}>
                            {formData.paymentMethod === 'cod' && <span className="w-2 h-2 rounded-full bg-[#0A2540] dark:bg-[#BEB49B]" />}
                          </span>
                        </div>
                        <span className="text-[10px] text-neutral-500 dark:text-neutral-400 font-mono">Pay ₹150 shipping assurance now, balance at delivery. Let's prevent fake order returns.</span>
                      </button>
                    </div>

                    <div className="p-4 bg-[#F5F1E8]/50 dark:bg-neutral-800/40 border border-neutral-200/60 dark:border-zinc-800 rounded text-xs space-y-2 select-none">
                      {formData.paymentMethod === 'upi' ? (
                        <>
                          <p className="font-semibold text-[#0A2540] dark:text-[#BEB49B]">💸 Direct instant Razorpay settlement:</p>
                          <p className="text-[11px] text-neutral-600 dark:text-neutral-300 leading-relaxed font-mono">
                            You will pay the full amount of <strong>₹{total.toLocaleString('en-IN')}</strong> directly via secure Razorpay checkout overlay.
                          </p>
                        </>
                      ) : (
                        <>
                          <p className="font-semibold text-amber-800 dark:text-amber-500">📦 Cash On Delivery Smart pre-authorization fee:</p>
                          <div className="text-[11px] text-neutral-600 dark:text-neutral-300 leading-relaxed space-y-1 font-mono">
                            <div className="flex justify-between border-b border-black/5 dark:border-white/10 pb-1">
                              <span>Advance Assurance Booking Fee (Pay Now):</span>
                              <span className="font-bold text-[#0A2540] dark:text-[#BEB49B]">₹150</span>
                            </div>
                            <div className="flex justify-between pt-1">
                              <span>Cash Collectable on Delivery (Pay Later):</span>
                              <span className="font-bold text-[#4C2D3C] dark:text-[#BEB49B]">₹{(remainingCodAmount).toLocaleString('en-IN')}</span>
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Submission and trust indicator */}
                  <div className="flex flex-col sm:flex-row items-center gap-4 pt-2">
                    <button
                      type="submit"
                      className="w-full sm:w-auto px-10 py-5 bg-[#0A2540] text-white hover:bg-[#4C2D3C] text-xs uppercase tracking-widest font-bold transition-all shadow-lg active:scale-95 cursor-pointer rounded-sm"
                    >
                      {formData.paymentMethod === 'upi' 
                        ? `Pay ₹${total.toLocaleString('en-IN')} via Razorpay` 
                        : 'Book COD — Pay ₹150 Assurance Fee'}
                    </button>
                    <div className="text-[10px] text-neutral-500 font-mono flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-emerald-600" />
                      Razorpay Verified Partner Merchant
                    </div>
                  </div>

                </form>
              </div>

              {/* Order summary section */}
              <div className="lg:col-span-5 lg:pl-4">
                <div className="bg-white dark:bg-[#121212] border border-black/5 dark:border-white/10 shadow-md rounded-lg p-6 sticky top-24 space-y-6">
                  
                  <div>
                    <h3 className="text-xs uppercase tracking-widest font-extrabold pb-3 border-b border-black/5 dark:border-white/10">
                      Your Order ({cartItems.length} grails)
                    </h3>
                  </div>

                  {/* Products review list */}
                  <div className="max-h-60 overflow-y-auto pr-2 divide-y divide-black/5 dark:divide-white/10">
                    {cartItems.map((item) => (
                      <div key={item.id} className="py-3 flex gap-3 items-center">
                        <div className="w-12 h-14 bg-[#F5F1E8] dark:bg-zinc-800 rounded overflow-hidden shrink-0">
                          <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-xs font-bold uppercase truncate">{item.name}</h4>
                          <p className="text-[10px] text-neutral-400 truncate">Category: {item.category || 'streetwear'}</p>
                        </div>
                        <p className="text-xs font-semibold font-mono shrink-0">₹{item.price.toLocaleString('en-IN')}</p>
                      </div>
                    ))}
                  </div>

                  {/* Calculations breakdown */}
                  <div className="space-y-2 pt-4 border-t border-black/5 dark:border-white/10 text-xs font-medium">
                    <div className="flex justify-between font-mono">
                      <span className="text-neutral-500">Cart Subtotal</span>
                      <span>₹{subtotal.toLocaleString('en-IN')}</span>
                    </div>

                    <div className="flex justify-between font-mono">
                      <span className="text-neutral-500">Premium Shipping</span>
                      <span>{shipping === 0 ? 'FREE' : `₹${shipping}`}</span>
                    </div>

                    {formData.paymentMethod === 'cod' && (
                      <div className="flex justify-between font-mono">
                        <span className="text-neutral-500">COD Process Fee</span>
                        <span>₹100</span>
                      </div>
                    )}

                    <div className="flex justify-between text-sm font-bold pt-3 border-t border-black/5 dark:border-white/10">
                      <span>Total Invoice</span>
                      <span className="text-[#4C2D3C] dark:text-[#BEB49B]">₹{total.toLocaleString('en-IN')}</span>
                    </div>

                    {formData.paymentMethod === 'cod' && (
                      <div className="pt-2 mt-2 bg-neutral-50 dark:bg-zinc-900/60 p-2 rounded border border-neutral-150 dark:border-zinc-800 text-[10px] font-mono leading-normal text-neutral-500">
                        <div className="flex justify-between text-neutral-700 dark:text-neutral-300">
                          <span>Pay Now (Razorpay):</span>
                          <span className="font-extrabold text-blue-600 dark:text-blue-400">₹150</span>
                        </div>
                        <div className="flex justify-between text-neutral-700 dark:text-neutral-300 mt-0.5">
                          <span>Pay on Delivery (COD):</span>
                          <span className="font-extrabold text-[#4C2D3C] dark:text-[#BEB49B]">₹{(remainingCodAmount).toLocaleString('en-IN')}</span>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="p-3 bg-[#BEB49B]/15 dark:bg-[#BEB49B]/5 border border-[#BEB49B]/20 dark:border-[#BEB49B]/10 rounded text-[10px] font-mono leading-relaxed text-neutral-600 dark:text-neutral-400">
                    💡 <strong>Eco Thrift Impact:</strong> Shipping vintage streetwear items prevents landfills and reduces carbon fashion footprints by ~84%. Thanks for choosing Thrift Crew!
                  </div>

                </div>
              </div>

            </motion.div>
          ) : (
            
            /* Order success view state */
            <motion.div
              key="checkout-success"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="max-w-xl mx-auto px-6 py-12 md:py-16 bg-white dark:bg-[#121212] border border-[#BEB49B]/30 rounded-lg text-center space-y-6 shadow-2xl"
            >
              <div className="w-16 h-16 rounded-full bg-[#0A2540]/10 text-[#0A2540] mx-auto flex items-center justify-center">
                <CheckCircle2 className="w-10 h-10 text-emerald-600" />
              </div>

              <div className="space-y-2">
                <span className="text-[10px] font-mono uppercase bg-emerald-50 dark:bg-emerald-950/20 text-emerald-800 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900 px-3 py-1.5 rounded-full font-bold">
                  Order Successfully Authorized
                </span>
                <h1 className="text-2xl font-bold uppercase tracking-widest font-heading pt-2 text-[#0A2540]">Thrift Spot Secured!</h1>
                <p className="text-xs text-neutral-500 font-mono mt-1">
                  Order ID Number: <strong className="text-[#111111] dark:text-[#eeeeee] font-bold">{orderId}</strong>
                </p>
              </div>

              <div className="p-4 bg-neutral-50 dark:bg-zinc-90 w-full text-left border border-black/5 dark:border-white/10 rounded space-y-2 text-xs">
                <p className="text-[10px] font-bold text-[#4C2D3C] dark:text-[#BEB49B] uppercase tracking-widest">Courier Coordinates:</p>
                <p className="text-neutral-500 dark:text-neutral-400 font-mono leading-relaxed">
                  Sent to <strong>{formData.name}</strong> at <strong>{formData.address}, {formData.city}, {formData.zip}</strong>. 
                </p>
                
                <div className="border-t border-black/5 dark:border-white/10 pt-2 mt-1 space-y-1 font-mono text-[11px] text-[#111111]/85 dark:text-[#eeeeee]/85">
                  {formData.paymentMethod === 'upi' ? (
                    <div className="flex justify-between items-center bg-emerald-50/50 dark:bg-emerald-950/10 p-2 border border-emerald-100 dark:border-emerald-900 rounded text-emerald-800 dark:text-emerald-400">
                      <span>Full Payment Method:</span>
                      <strong>₹{total.toLocaleString('en-IN')} fully cleared via Razorpay UPI</strong>
                    </div>
                  ) : (
                    <div className="bg-amber-50/70 dark:bg-amber-950/10 p-2.5 border border-amber-200 dark:border-amber-900 rounded text-amber-900 dark:text-amber-400 space-y-1">
                      <div className="flex justify-between font-bold">
                        <span>Advance booking fee paid:</span>
                        <span className="text-emerald-700 dark:text-emerald-400">₹150 Razorpay UPI</span>
                      </div>
                      <div className="flex justify-between font-extrabold border-t border-amber-700/10 dark:border-amber-800/20 pt-1 mt-1 text-sm">
                        <span>Collectable Cash at Delivery:</span>
                        <span>₹{(remainingCodAmount).toLocaleString('en-IN')}</span>
                      </div>
                    </div>
                  )}
                  <p className="text-neutral-500 dark:text-neutral-400 text-[10px] leading-relaxed pt-1">
                     🔔 A real-time shipping tracking token has been allocated to <strong>{formData.phone}</strong>.
                  </p>
                </div>
                
                <p className="text-[10px] text-[#A28F6E] italic mt-2">
                  * Note: As per our exchange terms, please remember to record an continuous unboxing video when your package arrives!
                </p>
              </div>

              <button
                onClick={handleFinish}
                className="w-full py-4 bg-[#0A2540] text-white hover:bg-[#4C2D3C] text-[10px] uppercase tracking-widest font-bold transition-all shadow-md cursor-pointer rounded-full"
              >
                Complete & Go Back Shopping
              </button>
            </motion.div>
          )}
        </AnimatePresence>

      </div>

      {/* SECURE RAZORPAY DIALOG OVERLAY */}
      <AnimatePresence>
        {isRazorpayOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <motion.div
              initial={{ scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.92, opacity: 0 }}
              className="bg-white dark:bg-[#121212] rounded-xl shadow-2xl w-full max-w-md overflow-hidden border border-[#0A2540]/10 dark:border-white/10 select-none"
            >
              
              {/* Header */}
              <div className="bg-[#1A337E] text-white p-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center select-none font-bold text-xs text-[#1A337E] border border-white/20">
                    TC
                  </div>
                  <div>
                    <h4 className="text-xs font-extrabold uppercase tracking-widest">Thrift Crew checkout</h4>
                    <p className="text-[9px] text-[#a4bcfc] font-mono leading-none">trusted by 50M+ users</p>
                  </div>
                </div>
                
                <div className="text-right">
                  <span className="text-[9px] uppercase tracking-wider text-[#a4bcfc] block font-mono">Amount to authorize</span>
                  <span className="text-sm font-extrabold font-mono text-white">₹{razorpayAmount.toLocaleString('en-IN')}</span>
                </div>
              </div>

              {/* Secure strip */}
              <div className="bg-[#F3F6FD] dark:bg-zinc-900 px-4 py-2 flex items-center justify-between border-b border-neutral-200 dark:border-white/5 text-[10px] font-mono text-neutral-600 dark:text-neutral-400">
                <span className="flex items-center gap-1">
                  <Lock className="w-3.5 h-3.5 text-blue-700 dark:text-blue-400" /> Secure 256-Bit Razorpay clearance
                </span>
                <span className="text-[9px] text-neutral-400">Merchant ID: mid_tc8w8a9010</span>
              </div>

              {/* Dynamic steps content */}
              <div className="p-6">
                
                {razorpayStatus === 'idle' && (
                  <div className="space-y-4">
                    <div className="text-center pb-2">
                      <h5 className="text-xs uppercase font-extrabold tracking-widest text-[#111111] dark:text-[#eeeeee]">
                        {formData.paymentMethod === 'upi' ? 'Pay Full Order with UPI App' : 'Pay shipping assurance with UPI App'}
                      </h5>
                      <p className="text-[11px] text-neutral-400 mt-1 font-mono">Instant routing to UPI terminal interface</p>
                    </div>

                    <div className="grid grid-cols-2 gap-3.5">
                      {upiApps.map((app) => (
                        <button
                          key={app.id}
                          type="button"
                          onClick={() => handleSimulatePayment(app.name)}
                          className={`p-3 border rounded-lg text-center flex flex-col items-center justify-center gap-2 transition-all group cursor-pointer ${app.color}`}
                        >
                          <Smartphone className="w-5 h-5 group-hover:scale-110 transition-transform" />
                          <span className="text-[10px] font-bold uppercase tracking-wider">{app.name}</span>
                        </button>
                      ))}
                    </div>

                    <div className="pt-4 border-t border-neutral-100 dark:border-white/5 flex justify-between items-center">
                      <button
                        onClick={() => setIsRazorpayOpen(false)}
                        className="text-[10px] uppercase font-bold tracking-wider text-neutral-400 hover:text-black dark:hover:text-white cursor-pointer"
                      >
                        Cancel payment
                      </button>
                      <span className="text-[9px] text-neutral-400 font-mono">powered by Razorpay Standard</span>
                    </div>
                  </div>
                )}

                {razorpayStatus === 'processing' && (
                  <div className="text-center py-8 space-y-6">
                    <div className="relative inline-flex items-center justify-center">
                      <Loader2 className="w-12 h-12 text-[#10309e] animate-spin" />
                      <span className="absolute text-[10px] font-bold text-[#10309e] font-mono animate-pulse">UPI</span>
                    </div>

                    <div className="space-y-2">
                      <h5 className="text-sm font-extrabold uppercase tracking-wide">Awaiting approval in {razorpayApp}</h5>
                      <p className="text-xs text-neutral-500 max-w-xs mx-auto font-sans leading-relaxed">
                        Please open the official <strong className="text-neutral-900">{razorpayApp}</strong> application on your mobile smartphone device to authorize the push-notification token for <strong>₹{razorpayAmount.toLocaleString('en-IN')}</strong>.
                      </p>
                    </div>

                    <div className="bg-blue-50/50 p-3 rounded-lg border border-blue-100/50 max-w-sm mx-auto text-[10px] font-mono text-blue-800 text-left leading-relaxed">
                      💡 <strong>Razorpay Tip:</strong> Do not refresh or minimize this browser card unit. Once secure approval is completed, you'll be automatically routed back securely.
                    </div>
                  </div>
                )}

                {razorpayStatus === 'verifying' && (
                  <div className="text-center py-10 space-y-4">
                    <Loader2 className="w-10 h-10 text-emerald-600 animate-spin mx-auto" />
                    <div className="space-y-1">
                      <h5 className="text-xs uppercase font-extrabold tracking-widest text-[#1A337E]">Verifying with RBI Server</h5>
                      <p className="text-[10px] text-neutral-400 font-mono">Syncing double-entry ledger coordinates securely...</p>
                    </div>
                  </div>
                )}

                {razorpayStatus === 'completed' && (
                  <div className="text-center py-10 space-y-4">
                    <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto animate-bounce">
                      <CheckCircle2 className="w-7 h-7" />
                    </div>
                    <div className="space-y-1">
                      <h5 className="text-xs uppercase font-extrabold tracking-widest text-emerald-800">Clearance Secured!</h5>
                      <p className="text-[10px] text-emerald-600 font-mono">Routing back to Thrift Crew clearance engine...</p>
                    </div>
                  </div>
                )}

              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
