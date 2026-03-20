/**
 * Courses Section Component
 * 
 * An interactive course selection interface with drag-and-drop functionality
 * Features:
 * - Drag courses from library to prep bag (desktop)
 * - Click "Add" button (mobile fallback)
 * - Dynamic price calculation
 * - Learning outcomes aggregation
 * - Smooth animations with Framer Motion
 * - Accessibility support (ARIA labels, reduced motion)
 * - Responsive design (desktop & mobile)
 */

"use client";

import { useState, useEffect, useRef } from "react";
import { motion, useInView } from "framer-motion";
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverEvent,
} from "@dnd-kit/core";
import CourseCard from "../ui/CourseCard";
import PrepBag from "../ui/PrepBag";
import OutcomePanel from "../ui/OutcomePanel";
import PriceBar from "../ui/PriceBar";

interface Course {
  id: string;
  title: string;
  description: string;
  price: number;
  tags: string[];
  outcomes: string[];
}

const COURSES: Course[] = [
  {
    id: "physics-pressure",
    title: "Master Physics Under Exam Pressure",
    description:
      "Build speed and accuracy in solving complex physics problems under time constraints.",
    price: 1999,
    tags: ["Tests", "DPP", "Analytics"],
    outcomes: [
      "Improve Physics accuracy to 90%+",
      "Solve questions faster under pressure",
      "Master high-weightage topics in Mechanics & Electrodynamics",
    ],
  },
  {
    id: "chemistry-organic",
    title: "Organic Chemistry Mastery",
    description:
      "Master reaction mechanisms, synthesis, and problem-solving strategies for organic chemistry.",
    price: 1799,
    tags: ["Video Lectures", "DPP", "Notes"],
    outcomes: [
      "Understand complex reaction mechanisms",
      "Solve organic chemistry problems systematically",
      "Build confidence in GOC and aromatic compounds",
    ],
  },
  {
    id: "math-calculus",
    title: "Advanced Calculus & Integration",
    description:
      "Deep dive into calculus concepts with extensive practice and exam-oriented problem sets.",
    price: 2199,
    tags: ["Tests", "DPP", "Doubt Support"],
    outcomes: [
      "Master integration techniques and applications",
      "Solve complex differential equations",
      "Improve speed in calculus-based questions",
    ],
  },
  {
    id: "full-test-series",
    title: "Complete JEE Test Series",
    description:
      "Comprehensive test series covering all subjects with detailed performance analytics.",
    price: 2999,
    tags: ["Full-Length Tests", "Subject Tests", "Analytics"],
    outcomes: [
      "Experience real exam conditions regularly",
      "Track your all-India rank progress",
      "Identify and fix weak areas systematically",
    ],
  },
  {
    id: "weak-topics-dpp",
    title: "Personalized Weak Topics DPP",
    description:
      "AI-powered daily practice problems targeting your weakest areas based on performance.",
    price: 1499,
    tags: ["AI-Powered", "DPP", "Adaptive"],
    outcomes: [
      "Practice exactly what you're weak at",
      "See measurable improvement in problem areas",
      "Build consistent study habits with daily tasks",
    ],
  },
  {
    id: "revision-module",
    title: "Smart Revision & Retention System",
    description:
      "Scientifically designed revision schedules to ensure long-term retention of concepts.",
    price: 1299,
    tags: ["Spaced Repetition", "Quick Tests", "Notes"],
    outcomes: [
      "Remember concepts for longer periods",
      "Reduce time spent on re-learning",
      "Perform better in revision-based questions",
    ],
  },
];

export default function Courses() {
  const [selectedCourses, setSelectedCourses] = useState<Course[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [isOver, setIsOver] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.2 });

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mediaQuery.matches);

    const handler = (e: MediaQueryListEvent) =>
      setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener("change", handler);

    // Detect mobile devices
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => {
      mediaQuery.removeEventListener("change", handler);
      window.removeEventListener("resize", checkMobile);
    };
  }, []);

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { over } = event;
    setIsOver(over?.id === "prep-bag");
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && over.id === "prep-bag") {
      const course = COURSES.find((c) => c.id === active.id);
      if (course && !selectedCourses.find((c) => c.id === course.id)) {
        setSelectedCourses([...selectedCourses, course]);
      }
    }

    setActiveId(null);
    setIsOver(false);
  };

  const handleAddCourse = (id: string) => {
    const course = COURSES.find((c) => c.id === id);
    if (course && !selectedCourses.find((c) => c.id === course.id)) {
      setSelectedCourses([...selectedCourses, course]);
    }
  };

  const handleRemoveCourse = (id: string) => {
    setSelectedCourses(selectedCourses.filter((c) => c.id !== id));
  };

  const totalPrice = selectedCourses.reduce(
    (sum, course) => sum + course.price,
    0
  );

  const allOutcomes = Array.from(
    new Set(selectedCourses.flatMap((course) => course.outcomes))
  );

  const activeCourse = COURSES.find((c) => c.id === activeId);

  return (
    <section
      ref={sectionRef}
      className="relative w-full bg-[#f3f6f8] text-[#070a05] overflow-hidden py-20 md:py-32"
    >
      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20">
        {/* Section Heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 md:mb-16"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-light leading-tight tracking-tight mb-4">
            Build Your Own{" "}
            <span className="text-[#393f5b]">Prep Stack</span>
          </h2>
          <p className="text-sm md:text-base text-[#070a05]/60 font-light">
            Choose courses that match your goals. See exactly what you&apos;ll achieve.
          </p>
          {!isMobile && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-xs text-[#070a05]/40 font-light mt-2"
            >
              Drag courses into your prep bag to get started
            </motion.p>
          )}
        </motion.div>

        {/* Main Layout */}
        <DndContext
          sensors={sensors}
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDragEnd={handleDragEnd}
        >
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 mb-24">
            {/* LEFT SIDE - Courses Library */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="space-y-6"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-xl md:text-2xl font-light text-[#393f5b]">
                  Choose Your Courses
                </h3>

                {/* Total Price - Inline Display */}
                <div className="flex items-center gap-3">
                  <span className="text-xs text-[#070a05]/50 font-light">Total:</span>
                  <div className="relative bg-white/60 backdrop-blur-xl rounded-lg border border-[#070a05]/10 px-4 py-2 shadow-lg">
                    {/* Subtle gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-br from-[#393f5b]/5 via-transparent to-[#393f5b]/8 pointer-events-none rounded-lg" />
                    
                    <motion.div className="relative flex items-baseline gap-1">
                      <motion.span
                        key={totalPrice}
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-xl font-light text-[#393f5b]"
                      >
                        ₹{totalPrice.toLocaleString()}
                      </motion.span>
                    </motion.div>
                  </div>
                </div>
              </div>

              {/* Scrollable Course List */}
              <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                {COURSES.map((course, index) => (
                  <motion.div
                    key={course.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                  >
                    <CourseCard
                      {...course}
                      isInBag={selectedCourses.some((c) => c.id === course.id)}
                      useFallback={isMobile}
                      onAdd={handleAddCourse}
                    />
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* RIGHT SIDE - Prep Bag & Outcomes */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="space-y-6"
            >
              <PrepBag
                selectedCourses={selectedCourses}
                onRemoveCourse={handleRemoveCourse}
                isOver={isOver}
              />

              {/* Outcome Panel */}
              {allOutcomes.length > 0 && (
                <OutcomePanel outcomes={allOutcomes} />
              )}
            </motion.div>
          </div>

          {/* Drag Overlay */}
          <DragOverlay>
            {activeCourse && !prefersReducedMotion ? (
              <div className="rotate-3 opacity-90">
                <CourseCard {...activeCourse} isDragging />
              </div>
            ) : null}
          </DragOverlay>
        </DndContext>
      </div>

      {/* Price Bar - Sticky at bottom */}
      <PriceBar totalPrice={totalPrice} hasItems={selectedCourses.length > 0} />

      {/* Subtle Background Decoration */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(57,63,91,0.03),transparent_70%)] pointer-events-none" />

      {/* Custom Scrollbar Styles */}
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(7, 10, 5, 0.05);
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(57, 63, 91, 0.2);
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(57, 63, 91, 0.3);
        }
      `}</style>
    </section>
  );
}
