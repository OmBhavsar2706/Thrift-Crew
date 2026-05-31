import { motion } from 'motion/react';
import { useEffect, useState } from 'react';

const messages = [
  "COD Available",
  "Fast Dispatch",
  "Premium Thrift Store",
  "Trusted Streetwear Store",
  "Easy Returns"
];

export function TopBar() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % messages.length);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="bg-[#0A2540] h-8 w-full flex items-center justify-center relative overflow-hidden z-50">
      <div className="relative w-full max-w-sm h-4 overflow-hidden flex justify-center items-center">
        {messages.map((msg, i) => (
          <motion.div
            key={i}
            initial={{ y: 20, opacity: 0 }}
            animate={{
              y: index === i ? 0 : (index > i || (index === 0 && i === messages.length - 1) ? -20 : 20),
              opacity: index === i ? 1 : 0
            }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className="absolute whitespace-nowrap text-white text-[10px] uppercase tracking-[0.2em] font-medium"
          >
            {msg}
          </motion.div>
        ))}
      </div>
    </div>
  );
}
