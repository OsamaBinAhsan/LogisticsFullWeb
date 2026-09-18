'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';

interface ProductGalleryProps {
  images: string[];
  title: string;
}

export function ProductGallery({ images, title }: ProductGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const displayImages = images && images.length > 0 ? images : ['/images/placeholder.jpg'];
  const currentImage = displayImages[selectedIndex] || displayImages[0];

  return (
    <div className="flex flex-col-reverse md:flex-row gap-4">
      {/* Thumbnails */}
      {displayImages.length > 1 && (
        <div className="flex md:flex-col gap-3 overflow-x-auto md:overflow-y-auto max-h-[520px] scrollbar-none">
          {displayImages.map((img, idx) => {
            const isSelected = selectedIndex === idx;
            return (
              <button
                key={idx}
                type="button"
                onClick={() => setSelectedIndex(idx)}
                className={`relative w-16 h-16 md:w-20 md:h-20 rounded-lg overflow-hidden border-2 transition-all shrink-0 bg-[#0E121B] ${
                  isSelected
                    ? 'border-[#14B8A6] shadow-[0_0_12px_rgba(20,184,166,0.35)]'
                    : 'border-[#1E293B]/70 opacity-60 hover:opacity-100'
                }`}
              >
                <Image
                  src={img}
                  alt={`${title} thumbnail ${idx + 1}`}
                  fill
                  className="object-cover"
                  sizes="80px"
                />
              </button>
            );
          })}
        </div>
      )}

      {/* Main Showcase Image */}
      <div className="relative flex-1 aspect-square rounded-2xl overflow-hidden bg-[#0E121B]/90 border border-[#1E293B]/70 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06)] group">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentImage}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.2 }}
            className="relative w-full h-full"
          >
            <Image
              src={currentImage}
              alt={title}
              fill
              priority
              className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </motion.div>
        </AnimatePresence>

        {/* Ambient Gradient Overlay */}
        <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-[#06080A]/60 via-transparent to-transparent" />
      </div>
    </div>
  );
}
