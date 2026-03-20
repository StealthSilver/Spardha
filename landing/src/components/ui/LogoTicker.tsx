"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";

export default function LogoTicker() {
  const logos = [
    "/Logos/logo.svg",
    "/Logos/motion-logo.webp",
    "/Logos/allen-logo-kota.jpg",
    "/Logos/download.jpeg",
    "/Logos/logo.png",
    "/Logos/logo (1).svg",
  ];

  const scrollerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!scrollerRef.current) return;

    const scrollerContent = Array.from(scrollerRef.current.children);

    scrollerContent.forEach((item) => {
      const duplicatedItem = item.cloneNode(true) as HTMLElement;
      if (scrollerRef.current) {
        scrollerRef.current.appendChild(duplicatedItem);
      }
    });
  }, []);

  return (
    <div className="w-full bg-[#f3f6f8]">
      {/* Container matching the vertical lines boundaries */}
      <div className="max-w-7xl mx-auto">
        {/* Horizontal separator line - Responsive width */}
        <div className="w-full max-w-[1230px] ml-4 sm:ml-6 border-t border-dotted border-[#070a05]/10" />
        
        <div className="px-4 sm:px-8 md:px-12 pt-6 sm:pt-8 pb-6 sm:pb-8">
          <div className="text-center mb-4 sm:mb-6">
            <p className="text-[0.625rem] sm:text-xs font-light text-[#070a05]/40 tracking-[0.15em] sm:tracking-[0.2em] uppercase">
              Trusted by Leading Institutions
            </p>
          </div>

          <div className="relative">
            {/* Gradient Overlays - Responsive width */}
            <div className="absolute left-0 top-0 bottom-0 w-8 sm:w-12 bg-gradient-to-r from-[#f3f6f8] to-transparent z-10 pointer-events-none" />
            <div className="absolute right-0 top-0 bottom-0 w-8 sm:w-12 bg-gradient-to-l from-[#f3f6f8] to-transparent z-10 pointer-events-none" />

            {/* Logo Scroller - Responsive gaps and sizes */}
            <div className="overflow-hidden">
              <div
                ref={scrollerRef}
                className="flex gap-8 sm:gap-12 md:gap-16 animate-scroll-left"
                style={{
                  width: "max-content",
                }}
              >
                {logos.map((logo, index) => (
                  <div
                    key={index}
                    className="flex-shrink-0 flex items-center justify-center h-12 sm:h-14 md:h-16 w-24 sm:w-28 md:w-32 opacity-50 hover:opacity-100 transition-all duration-300"
                  >
                    <Image
                      src={logo}
                      alt={`Partner logo ${index + 1}`}
                      width={128}
                      height={64}
                      className="max-h-8 sm:max-h-10 md:max-h-12 w-auto object-contain"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
