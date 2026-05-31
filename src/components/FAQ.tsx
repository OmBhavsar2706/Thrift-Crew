import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Minus } from 'lucide-react';

interface FaqItem {
  question: string;
  answer: React.ReactNode;
}

export function FAQ() {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(1); // Default item 1 (index 1) as expanded like in the second image!

  const faqs: FaqItem[] = [
    {
      question: "Is Cash on Delivery (COD) Available?",
      answer: (
        <div className="space-y-2 text-[#475569] leading-relaxed text-sm md:text-base font-normal">
          <p>
            Yes, we offer Cash on Delivery (COD) across India. However, to ensure order sincerity, we require a small advance confirmation amount.
          </p>
        </div>
      )
    },
    {
      question: "Why Is ₹150 Advance Required For COD Orders?",
      answer: (
        <div className="space-y-4 text-[#475569] leading-relaxed text-sm md:text-base font-normal">
          <p>
            The ₹150 confirmation amount helps us reduce fake COD orders and process genuine orders faster.
          </p>
          <p>
            The remaining amount is payable at delivery.
          </p>
        </div>
      )
    },
    {
      question: "How do I track my order?",
      answer: (
        <div className="space-y-2 text-[#475569] leading-relaxed text-sm md:text-base font-normal">
          <p>
            Once your order is dispatched, we will share the tracking number with you. Customers can use this tracking number to check the delivery status and estimated arrival time through Delhivery, Shiprocket, or India Post.
          </p>
        </div>
      )
    },
    {
      question: "What is your exchange policy?",
      answer: (
        <div className="space-y-2 text-[#475569] leading-relaxed text-sm md:text-base font-normal">
          <p>
            We allow exchanges only in cases where the mistake is from our side (e.g., wrong product or damaged item). A continuous unboxing video is absolutely mandatory and issues must be reported within 24 hours of delivery.
          </p>
        </div>
      )
    }
  ];

  const toggleExpand = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  return (
    <section id="faq" className="py-20 bg-white border-t border-neutral-100 scroll-mt-24">
      <div className="max-w-4xl mx-auto px-6">
        
        {/* Section Heading */}
        <div className="text-center mb-12 space-y-3">
          <h2 className="text-3xl md:text-[40px] font-black text-[#1e293b] uppercase tracking-wide font-sans">
            Frequently Asked Questions
          </h2>
          <p className="text-sm md:text-base text-neutral-500">
            Everything you need to know before ordering from Thrift Crew.
          </p>
        </div>

        {/* FAQ list */}
        <div className="space-y-4">
          {faqs.map((faq, idx) => {
            const isExpanded = expandedIndex === idx;
            return (
              <div
                key={idx}
                className={`transition-all duration-300 rounded-2xl border ${
                  isExpanded
                    ? 'border-slate-800 shadow-sm bg-[#fafafa]'
                    : 'border-slate-100 hover:border-slate-200 bg-white'
                }`}
              >
                {/* Question Header */}
                <button
                  onClick={() => toggleExpand(idx)}
                  className="w-full flex items-center justify-between p-5 md:p-6 text-left cursor-pointer select-none group"
                >
                  <span className="text-base md:text-[17px] font-bold text-[#1e293b] leading-snug group-hover:text-black transition-colors">
                    {faq.question}
                  </span>
                  
                  {/* Plus/Minus Circular Buttons */}
                  <div className="ml-4 shrink-0">
                    {isExpanded ? (
                      <div className="w-8 h-8 rounded-full bg-[#1e293b] text-white flex items-center justify-center transition-all duration-300">
                        <Minus className="w-4 h-4 stroke-[3]" />
                      </div>
                    ) : (
                      <div className="w-8 h-8 rounded-full border border-slate-200 text-slate-400 flex items-center justify-center hover:bg-slate-50 transition-all duration-300">
                        <Plus className="w-4 h-4 stroke-[2]" />
                      </div>
                    )}
                  </div>
                </button>

                {/* Animated Answer Body */}
                <AnimatePresence initial={false}>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: 'easeInOut' }}
                      className="overflow-hidden"
                    >
                      <div className="px-5 pb-6 md:px-6 md:pb-7 pt-1 border-t border-slate-100">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
