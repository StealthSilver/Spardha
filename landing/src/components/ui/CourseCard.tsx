"use client";

import { motion } from "framer-motion";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Plus } from "lucide-react";

interface CourseCardProps {
  id: string;
  title: string;
  description: string;
  price: number;
  tags: string[];
  isDragging?: boolean;
  isInBag?: boolean;
  onAdd?: (id: string) => void;
  useFallback?: boolean;
}

export default function CourseCard({
  id,
  title,
  description,
  price,
  tags,
  isInBag = false,
  onAdd,
  useFallback = false,
}: CourseCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id, disabled: isInBag || useFallback });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      {...(!useFallback ? attributes : {})}
      {...(!useFallback ? listeners : {})}
      whileHover={!isInBag ? { scale: 1.02, y: -4 } : {}}
      animate={isDragging ? { scale: 1.03 } : {}}
      className={`relative bg-white/60 backdrop-blur-xl rounded-xl border border-[#070a05]/10 p-5 transition-all duration-200 ${
        isDragging
          ? "shadow-[0_0_30px_rgba(57,63,91,0.2)] z-50"
          : "shadow-lg hover:shadow-[0_0_20px_rgba(57,63,91,0.15)]"
      } ${isInBag ? "opacity-50" : ""} ${
        !useFallback ? "cursor-grab active:cursor-grabbing" : ""
      }`}
      role="article"
      aria-label={`Course: ${title}`}
    >
      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#393f5b]/5 via-transparent to-[#393f5b]/8 pointer-events-none rounded-xl" />

      {/* Content */}
      <div className="relative space-y-3">
        {/* Title */}
        <h3 className="text-base md:text-lg font-light text-[#393f5b] leading-snug">
          {title}
        </h3>

        {/* Description */}
        <p className="text-xs md:text-sm text-[#070a05]/70 font-light leading-relaxed">
          {description}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <span
              key={tag}
              className="px-2 py-1 text-xs font-light rounded-md bg-[#393f5b]/10 text-[#393f5b]/80 border border-[#393f5b]/10"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Price and Action */}
        <div className="flex items-center justify-between pt-2 border-t border-[#070a05]/5">
          <span className="text-xl font-light text-[#070a05]">
            ₹{price.toLocaleString()}
          </span>

          {/* Mobile Add Button */}
          {useFallback && !isInBag && onAdd && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onAdd(id)}
              className="flex items-center gap-1 px-3 py-2 bg-[#393f5b] text-white text-xs rounded-lg shadow-md hover:shadow-lg transition-all duration-200"
            >
              <Plus size={14} />
              <span>Add</span>
            </motion.button>
          )}
        </div>
      </div>
    </motion.div>
  );
}
