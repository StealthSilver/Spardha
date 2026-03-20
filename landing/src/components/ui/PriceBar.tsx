"use client";

import { motion } from "framer-motion";
import { ArrowRight, ChevronRight } from "lucide-react";

interface PriceBarProps {
  totalPrice: number;
  hasItems: boolean;
}

export default function PriceBar({ totalPrice, hasItems }: PriceBarProps) {
  return (
    <motion.div
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="sticky bottom-0 left-0 right-0 w-full bg-[#f3f6f8] z-10"
    >
      {/* Container matching the vertical lines boundaries */}
      <div className="max-w-7xl mx-auto">
        {/* Horizontal separator line - matching LogoTicker */}
        <div className="w-[1230px] ml-6 border-t border-dotted border-[#393f5b]/15" />
        
        <div className="px-12 py-8">
          <div className="flex items-center justify-center">
            {/* CTA Button - Matching Hero Style */}
            <motion.button
              whileHover={{ scale: hasItems ? 1.02 : 1 }}
              whileTap={{ scale: hasItems ? 0.98 : 1 }}
              disabled={!hasItems}
              className={`group flex items-center gap-2 px-8 py-4 rounded-lg text-base font-medium transition-all duration-300 ${
                hasItems
                  ? "bg-[#393f5b] text-white shadow-sm hover:shadow-md hover:bg-[#2f3450] cursor-pointer"
                  : "bg-[#070a05]/10 text-[#070a05]/30 cursor-not-allowed"
              }`}
            >
              <span>Start Learning</span>
              
              {hasItems && (
                <span className="relative w-5 h-5 flex items-center justify-center overflow-hidden">
                  <ChevronRight
                    size={18}
                    className="absolute transition-all duration-300 group-hover:opacity-0 group-hover:translate-x-2"
                  />
                  <ArrowRight
                    size={18}
                    className="absolute opacity-0 -translate-x-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0"
                  />
                </span>
              )}
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
