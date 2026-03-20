"use client";

import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2 } from "lucide-react";

interface OutcomePanelProps {
  outcomes: string[];
}

export default function OutcomePanel({ outcomes }: OutcomePanelProps) {
  if (outcomes.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.4 }}
      className="relative bg-white/60 backdrop-blur-xl rounded-xl border border-[#070a05]/10 shadow-lg p-6 mt-6"
    >
      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#393f5b]/5 via-transparent to-[#393f5b]/8 pointer-events-none rounded-xl" />

      {/* Content */}
      <div className="relative space-y-4">
        {/* Title */}
        <h3 className="text-lg md:text-xl font-light text-[#393f5b]">
          What You&apos;ll Achieve
        </h3>

        {/* Outcomes List */}
        <ul className="space-y-3">
          <AnimatePresence mode="popLayout">
            {outcomes.map((outcome, index) => (
              <motion.li
                key={outcome}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="flex items-start gap-3"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.3, delay: index * 0.1 + 0.1 }}
                  className="flex-shrink-0 mt-0.5"
                >
                  <CheckCircle2
                    size={16}
                    className="text-teal-700/60"
                  />
                </motion.div>
                <span className="text-sm text-[#070a05]/70 font-light leading-relaxed">
                  {outcome}
                </span>
              </motion.li>
            ))}
          </AnimatePresence>
        </ul>
      </div>
    </motion.div>
  );
}
