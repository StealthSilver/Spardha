"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useDroppable } from "@dnd-kit/core";
import { X, Package } from "lucide-react";

interface PrepBagProps {
  selectedCourses: Array<{
    id: string;
    title: string;
    price: number;
  }>;
  onRemoveCourse: (id: string) => void;
  isOver?: boolean;
}

export default function PrepBag({
  selectedCourses,
  onRemoveCourse,
  isOver = false,
}: PrepBagProps) {
  const { setNodeRef } = useDroppable({
    id: "prep-bag",
  });

  return (
    <div
      ref={setNodeRef}
      className={`relative bg-white/60 backdrop-blur-xl rounded-xl border border-[#070a05]/10 shadow-lg p-6 min-h-[400px] transition-all duration-300 ${
        isOver
          ? "border-[#393f5b]/30 shadow-[0_0_30px_rgba(57,63,91,0.25)] bg-white/80"
          : ""
      }`}
      role="region"
      aria-label="Prep Bag - Drop courses here"
    >
      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#393f5b]/5 via-transparent to-[#393f5b]/8 pointer-events-none rounded-xl" />

      {/* Highlight on hover */}
      <motion.div
        className="absolute inset-0 bg-[#393f5b]/10 rounded-xl blur-2xl opacity-0 transition-opacity duration-500 pointer-events-none"
        animate={{ opacity: isOver ? 1 : 0 }}
      />

      {/* Content */}
      <div className="relative space-y-4">
        {/* Title */}
        <h3 className="text-xl md:text-2xl font-light text-[#393f5b]">
          Your Prep Stack
        </h3>

        {/* Empty State */}
        {selectedCourses.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-12 text-center"
          >
            <motion.div
              animate={{
                y: [0, -8, 0],
                opacity: [0.3, 0.5, 0.3],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <Package size={48} className="text-[#393f5b]/20 mb-4" />
            </motion.div>
            <p className="text-sm text-[#070a05]/50 font-light">
              Drag courses here to build your preparation
            </p>
          </motion.div>
        )}

        {/* Course List */}
        <AnimatePresence mode="popLayout">
          {selectedCourses.map((course) => (
            <motion.div
              key={course.id}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="group relative bg-[#f3f6f8]/60 rounded-lg border border-[#070a05]/5 p-4 flex items-center justify-between hover:bg-[#f3f6f8]/80 transition-colors"
            >
              <div className="flex-1 pr-4">
                <h4 className="text-sm font-light text-[#393f5b] mb-1">
                  {course.title}
                </h4>
                <p className="text-xs text-[#070a05]/60">
                  ₹{course.price.toLocaleString()}
                </p>
              </div>

              {/* Remove Button */}
              <button
                onClick={() => onRemoveCourse(course.id)}
                className="flex-shrink-0 w-6 h-6 rounded-full bg-[#070a05]/5 hover:bg-red-500/10 flex items-center justify-center transition-all duration-200 group-hover:scale-110"
                aria-label="Remove course"
              >
                <X size={14} className="text-[#070a05]/40 group-hover:text-red-500/70" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
