import { motion } from 'motion/react';
import { Truck, RotateCcw, AlertCircle, Image as ImageIcon, ChevronRight, ArrowLeft } from 'lucide-react';

interface PoliciesPageProps {
  onBackToShopping: () => void;
}

export function PoliciesPage({ onBackToShopping }: PoliciesPageProps) {
  const sections = [
    {
      id: 'delivery',
      title: 'Delivery Policy',
      icon: Truck,
      content: (
        <div className="space-y-4">
          <p className="text-sm text-neutral-300 leading-relaxed font-normal">
            At Thrift Crew, we deliver orders through trusted courier partners such as Delhivery, Shiprocket, and India Post.
          </p>
          <div className="space-y-2 mt-4 pl-4 border-l-2 border-[#BEB49B]/30 font-sans">
            <p className="text-xs text-neutral-400">
              • Once your order is dispatched, we will share the tracking number with you.
            </p>
            <p className="text-xs text-neutral-400">
              • Customers can use the tracking number to check the delivery status and estimated arrival time of their order.
            </p>
            <p className="text-xs text-neutral-400">
              • Delivery time may vary depending on your location and courier service availability.
            </p>
          </div>
        </div>
      )
    },
    {
      id: 'exchange',
      title: 'Exchange Policy',
      icon: RotateCcw,
      content: (
        <div className="space-y-4">
          <p className="text-sm text-neutral-300 leading-relaxed">
            We allow exchanges only in cases where the mistake is from our side, such as:
          </p>
          <ul className="list-disc pl-5 text-xs text-neutral-400 space-y-1">
            <li>Wrong product received</li>
            <li>Damaged product received</li>
          </ul>
          <div className="mt-4 p-4 rounded-xl bg-[#4C2D3C]/10 border border-[#4C2D3C]/20 space-y-2">
            <h4 className="text-xs font-mono font-bold text-red-300 tracking-wider uppercase">
              Important Conditions:
            </h4>
            <ul className="list-disc pl-5 text-[11px] text-neutral-300 space-y-1.5">
              <li>An unboxing video is mandatory for exchange requests.</li>
              <li>The issue must be reported within 24 hours of delivery.</li>
              <li>Without a proper unboxing video, exchange requests may not be accepted.</li>
            </ul>
          </div>
        </div>
      )
    },
    {
      id: 'availability',
      title: 'Product Availability Notice',
      icon: AlertCircle,
      content: (
        <div className="space-y-4">
          <p className="text-sm text-neutral-300 leading-relaxed">
            Due to high demand and inventory updates from our sourcing partners, some products or sizes may occasionally become unavailable after an order is placed.
          </p>
          <p className="text-xs text-neutral-400 leading-relaxed">
            In such rare cases, our team will contact you promptly on WhatsApp with the available alternatives, restock updates, or refund options if applicable.
          </p>
          <p className="text-xs font-mono text-[#BEB49B] mt-2">
            We appreciate your understanding and support.
          </p>
        </div>
      )
    },
    {
      id: 'disclaimer',
      title: 'Product Images Disclaimer',
      icon: ImageIcon,
      content: (
        <div className="space-y-3">
          <p className="text-sm text-neutral-300 leading-relaxed">
            Product images shown on our website and social media are for illustration purposes only.
          </p>
          <p className="text-xs text-neutral-400 leading-relaxed">
            Actual product color, design placement, or minor details may vary slightly due to lighting, screen settings, and manufacturing variations.
          </p>
        </div>
      )
    }
  ];

  return (
    <div className="min-h-screen bg-neutral-950 text-white relative overflow-hidden flex flex-col pt-32 pb-24">
      {/* Background radial effects */}
      <div className="absolute inset-0 bg-radial-gradient from-neutral-900/40 via-transparent to-transparent pointer-events-none" />
      <div className="absolute top-24 left-1/2 -translate-x-1/2 w-96 h-96 bg-[#BEB49B]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-4xl w-full mx-auto px-4 sm:px-6 relative z-10 flex-1 flex flex-col">
        {/* Back navigation */}
        <div className="mb-10">
          <button 
            onClick={onBackToShopping}
            className="text-xs font-mono tracking-widest text-[#BEB49B] uppercase hover:text-white transition-colors flex items-center gap-2 cursor-pointer group"
          >
            <ArrowLeft className="w-3 h-3 group-hover:-translate-x-1 transition-transform" /> 
            Back to Shop
          </button>
        </div>

        {/* Heading */}
        <div className="space-y-2 mb-12 text-center md:text-left">
          <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[9px] font-mono tracking-[0.2em] text-[#BEB49B] uppercase">
            Store Guidelines
          </span>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white uppercase font-heading mt-2">
            Our Policies
          </h1>
          <p className="text-xs text-neutral-400 max-w-lg font-sans">
            Please read our terms carefully. These parameters guarantee high standards of secure transit, fulfillment availability, and precise exchange support.
          </p>
        </div>

        {/* Main interactive list layout */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          
          {/* Quick links Sidebar Anchor (Desktop only) */}
          <div className="hidden md:block md:col-span-4 space-y-4 sticky top-36">
            <div className="p-5 bg-neutral-900/30 rounded-2xl border border-white/5 space-y-4">
              <h5 className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#BEB49B]">
                Quick Anchors
              </h5>
              <nav className="flex flex-col gap-2">
                {sections.map((sec) => (
                  <a
                    key={sec.id}
                    href={`#${sec.id}`}
                    className="flex items-center justify-between p-2.5 rounded-xl text-xs font-medium text-neutral-400 hover:text-white hover:bg-white/5 transition-all group"
                  >
                    <span>{sec.title}</span>
                    <ChevronRight className="w-3 h-3 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all text-[#BEB49B]" />
                  </a>
                ))}
              </nav>
            </div>
          </div>

          {/* Details flow */}
          <div className="md:col-span-8 space-y-6">
            {sections.map((sec, idx) => (
              <motion.section
                key={sec.id}
                id={sec.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1, duration: 0.4 }}
                className="p-6 sm:p-8 bg-neutral-900/45 rounded-3xl border border-white/5 hover:border-white/10 transition-all scroll-mt-32 backdrop-blur-md"
              >
                <div className="flex items-center gap-4 border-b border-white/5 pb-4 mb-5">
                  <div className="w-10 h-10 rounded-2xl bg-neutral-950 flex items-center justify-center border border-white/5 shrink-0">
                    <sec.icon className="w-5 h-5 text-[#BEB49B]" />
                  </div>
                  <h3 className="text-lg font-bold font-heading uppercase tracking-wide text-white">
                    {sec.title}
                  </h3>
                </div>

                <div className="font-sans leading-relaxed text-neutral-300">
                  {sec.content}
                </div>
              </motion.section>
            ))}
          </div>

        </div>

        {/* Footer help line */}
        <div className="mt-16 text-center border-t border-white/5 pt-8">
          <p className="text-xs text-neutral-500">
            For specific policy queries, reach out to us at <span className="text-[#BEB49B]">hello@thriftcrew.com</span> or via the Whatsapp channel.
          </p>
        </div>

      </div>
    </div>
  );
}
