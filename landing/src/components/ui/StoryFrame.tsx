"use client";

import { motion, MotionValue, useTransform } from "framer-motion";
import { ReactNode } from "react";

interface StoryFrameProps {
  children: ReactNode;
  ctaProgress: MotionValue<number>;
}

export default function StoryFrame({ children, ctaProgress }: StoryFrameProps) {
  // Only show CTA when ctaProgress > 0.7 (near the end)
  const ctaOpacity = useTransform(ctaProgress, [0, 0.7, 1], [0, 0, 1]);
  const ctaScale = useTransform(ctaProgress, [0.7, 1], [0.9, 1]);

  return (
    <div className="relative w-full max-w-5xl h-[650px] md:h-[750px] mt-8 md:mt-12">
      {/* Main Story Card - Glassmorphism */}
      <motion.div
        className="relative w-full h-full bg-white/60 backdrop-blur-xl rounded-2xl border border-[#070a05]/10 shadow-2xl overflow-hidden"
        animate={{
          y: [0, -5, 0],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        {/* Subtle gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#393f5b]/5 via-transparent to-[#393f5b]/8 pointer-events-none" />

        {/* Soft glow effect */}
        <div className="absolute inset-0 shadow-[inset_0_0_60px_rgba(57,63,91,0.1)] pointer-events-none rounded-2xl" />

        {/* Content Container */}
        <div className="relative w-full h-full p-8 md:p-12 flex items-center justify-center">
          {children}
        </div>

        {/* Final CTA - Centered in the box, appears only at the end */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center px-6 pointer-events-none"
          style={{
            opacity: ctaOpacity,
            scale: ctaScale,
          }}
        >
          <div className="text-center pointer-events-auto">
            <p className="text-xl md:text-2xl lg:text-3xl font-light text-[#393f5b] mb-6 leading-relaxed">
              Small daily improvements.
              <br />
              Massive rank shifts.
            </p>
            <button className="group relative bg-[#393f5b] text-white px-8 py-4 rounded-lg text-base font-medium shadow-lg hover:shadow-xl transition-all duration-300 hover:bg-[#2f3450] overflow-hidden">
              <span className="relative z-10">Start Competing</span>
              <motion.div
                className="absolute inset-0 bg-white/10"
                initial={{ x: "-100%" }}
                whileHover={{ x: "100%" }}
                transition={{ duration: 0.5 }}
              />
            </button>
          </div>
        </motion.div>
      </motion.div>

      {/* Subtle background blur elements */}
      <div className="absolute -z-10 top-8 left-8 w-32 h-32 bg-[#393f5b]/5 rounded-full blur-3xl" />
      <div className="absolute -z-10 bottom-8 right-8 w-40 h-40 bg-teal-500/5 rounded-full blur-3xl" />
    </div>
  );
}
