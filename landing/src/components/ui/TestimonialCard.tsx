"use client";

import { motion } from "framer-motion";
import { TrendingUp } from "lucide-react";

interface TestimonialCardProps {
  name: string;
  subtitle: string;
  problem: string;
  change: string;
  result: string;
  improvement?: string;
  rankChange?: string;
  index: number;
  isInView: boolean;
  prefersReducedMotion: boolean;
}

export default function TestimonialCard({
  name,
  subtitle,
  problem,
  change,
  result,
  improvement,
  rankChange,
  index,
  isInView,
  prefersReducedMotion,
}: TestimonialCardProps) {
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        delay: 0.1 + index * 0.15,
      },
    },
  };

  const sectionVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: (custom: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
        delay: 0.3 + index * 0.15 + custom * 0.15,
      },
    }),
  };

  return (
    <motion.div
      initial={prefersReducedMotion ? false : "hidden"}
      animate={isInView ? "visible" : "hidden"}
      variants={cardVariants}
      className="group relative bg-white/60 backdrop-blur-xl rounded-2xl border border-[#070a05]/10 shadow-lg p-5 overflow-hidden transition-all duration-300"
    >
      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#393f5b]/5 via-transparent to-[#393f5b]/8 pointer-events-none rounded-2xl" />

      {/* Hover glow */}
      <motion.div
        className="absolute inset-0 bg-[#393f5b]/10 rounded-2xl blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        initial={{ opacity: 0 }}
        whileHover={{ opacity: 1 }}
      />

      {/* Vertical progress line */}
      <div className="absolute left-5 top-20 bottom-5 w-px bg-gradient-to-b from-[#393f5b]/20 via-[#393f5b]/30 to-transparent" />
      <motion.div
        className="absolute left-5 top-20 w-px bg-gradient-to-b from-[#393f5b]/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        initial={{ height: 0 }}
        whileHover={{ height: "60%" }}
        transition={{ duration: 0.6 }}
      />

      {/* Card Content */}
      <div className="relative space-y-4">
        {/* Student Info */}
        <div className="mb-3">
          <h3 className="text-base md:text-lg font-medium text-[#393f5b]">
            {name}
          </h3>
          <p className="text-xs text-[#070a05]/50 font-light mt-0.5">
            {subtitle}
          </p>
        </div>

        {/* BEFORE Section */}
        <motion.div
          custom={0}
          initial={prefersReducedMotion ? false : "hidden"}
          animate={isInView ? "visible" : "hidden"}
          variants={sectionVariants}
          className="relative pl-5 space-y-1"
        >
          <div className="absolute left-0 top-1.5 w-2 h-2 rounded-full bg-red-400/40 ring-2 ring-white" />
          <span className="text-[10px] font-light text-[#070a05]/40 tracking-wider uppercase">
            Before
          </span>
          <p className="text-xs text-[#070a05]/70 font-light leading-relaxed">
            {problem}
          </p>
        </motion.div>

        {/* CHANGED Section */}
        <motion.div
          custom={1}
          initial={prefersReducedMotion ? false : "hidden"}
          animate={isInView ? "visible" : "hidden"}
          variants={sectionVariants}
          className="relative pl-5 space-y-1"
        >
          <div className="absolute left-0 top-1.5 w-2 h-2 rounded-full bg-amber-400/50 ring-2 ring-white" />
          <span className="text-[10px] font-light text-[#070a05]/40 tracking-wider uppercase">
            What Changed
          </span>
          <p className="text-xs text-[#070a05]/70 font-light leading-relaxed">
            {change}
          </p>
        </motion.div>

        {/* AFTER Section */}
        <motion.div
          custom={2}
          initial={prefersReducedMotion ? false : "hidden"}
          animate={isInView ? "visible" : "hidden"}
          variants={sectionVariants}
          className="relative pl-5 space-y-1"
        >
          <div className="absolute left-0 top-1.5 w-2 h-2 rounded-full bg-emerald-500/60 ring-2 ring-white" />
          <span className="text-[10px] font-light text-[#070a05]/40 tracking-wider uppercase">
            After
          </span>
          <p className="text-xs text-[#070a05]/70 font-light leading-relaxed">
            {result}
          </p>

          {/* Stat Badges */}
          {(improvement || rankChange) && (
            <div className="flex flex-wrap gap-1.5 pt-1.5">
              {improvement && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={isInView ? { opacity: 1, scale: 1 } : {}}
                  transition={{ duration: 0.4, delay: 0.5 + index * 0.15 }}
                  className="inline-flex items-center gap-1 px-2 py-0.5 bg-gradient-to-r from-emerald-500/15 to-teal-500/15 rounded-full border border-emerald-500/20"
                >
                  <TrendingUp size={10} className="text-emerald-700/70" />
                  <span className="text-[10px] font-medium text-emerald-700/80">
                    {improvement}
                  </span>
                </motion.div>
              )}
              {rankChange && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={isInView ? { opacity: 1, scale: 1 } : {}}
                  transition={{ duration: 0.4, delay: 0.6 + index * 0.15 }}
                  className="inline-flex items-center gap-1 px-2 py-0.5 bg-gradient-to-r from-blue-500/15 to-indigo-500/15 rounded-full border border-blue-500/20"
                >
                  <span className="text-[10px] font-medium text-blue-700/80">
                    {rankChange}
                  </span>
                </motion.div>
              )}
            </div>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
}
