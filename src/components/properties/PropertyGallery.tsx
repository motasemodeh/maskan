'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, X, Maximize2, Camera } from 'lucide-react';
import { Locale } from '@/lib/types';
import { Dictionary } from '@/locales/dictionary';

interface PropertyGalleryProps {
  images: string[];
  title: string;
  locale: Locale;
  dict: Dictionary;
}

export function PropertyGallery({ images, title, locale, dict }: PropertyGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  const isAr = locale === 'ar';
  const totalImages = images.length;

  const nextImage = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % totalImages);
  }, [totalImages]);

  const prevImage = useCallback(() => {
    setActiveIndex((prev) => (prev - 1 + totalImages) % totalImages);
  }, [totalImages]);

  // Keyboard navigation for lightbox
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isLightboxOpen) return;
      if (e.key === 'Escape') setIsLightboxOpen(false);
      if (e.key === 'ArrowRight') isAr ? prevImage() : nextImage();
      if (e.key === 'ArrowLeft') isAr ? nextImage() : prevImage();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isLightboxOpen, nextImage, prevImage, isAr]);

  if (!images || images.length === 0) return null;

  return (
    <div className="space-y-4">
      {/* Main Big Photo */}
      <div className="relative aspect-[16/9] sm:aspect-[21/10] w-full rounded-2xl sm:rounded-3xl overflow-hidden bg-[#11161d] shadow-lg group">
        <Image
          src={images[activeIndex]}
          alt={`${title} - Photo ${activeIndex + 1}`}
          fill
          priority
          sizes="(max-width: 1200px) 100vw, 1200px"
          className="object-cover object-center transition-all duration-300"
        />

        {/* Floating Photo Counter Badge */}
        <div className="absolute top-4 start-4 px-3.5 py-1.5 rounded-full bg-black/60 backdrop-blur-md text-white text-xs font-bold flex items-center gap-2 border border-white/10 shadow-sm pointer-events-none">
          <Camera className="w-3.5 h-3.5 text-[#c5a880]" />
          <span>
            {activeIndex + 1} / {totalImages}
          </span>
        </div>

        {/* Expand / Lightbox Action */}
        <button
          onClick={() => setIsLightboxOpen(true)}
          type="button"
          className="absolute top-4 end-4 p-2.5 rounded-full bg-black/60 hover:bg-black/85 text-white backdrop-blur-md border border-white/10 transition-all shadow-md cursor-pointer hover:scale-105"
          title="Open Lightbox"
        >
          <Maximize2 className="w-4 h-4" />
        </button>

        {/* Prev / Next overlay arrows on main photo */}
        {totalImages > 1 && (
          <div className="absolute inset-y-0 inset-x-3 flex items-center justify-between pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={(e) => {
                e.stopPropagation();
                prevImage();
              }}
              type="button"
              className="p-2.5 rounded-full bg-black/60 hover:bg-black/85 text-white backdrop-blur-md pointer-events-auto transition-transform hover:scale-110 cursor-pointer"
            >
              <ChevronLeft className="w-5 h-5 rtl:rotate-180" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                nextImage();
              }}
              type="button"
              className="p-2.5 rounded-full bg-black/60 hover:bg-black/85 text-white backdrop-blur-md pointer-events-auto transition-transform hover:scale-110 cursor-pointer"
            >
              <ChevronRight className="w-5 h-5 rtl:rotate-180" />
            </button>
          </div>
        )}
      </div>

      {/* Thumbnail Strip */}
      {totalImages > 1 && (
        <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-thin">
          {images.map((img, idx) => (
            <button
              key={idx}
              onClick={() => setActiveIndex(idx)}
              type="button"
              className={`relative aspect-[16/10] w-24 sm:w-28 shrink-0 rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${
                activeIndex === idx
                  ? 'border-[#c5a880] ring-2 ring-[#c5a880]/30 scale-102'
                  : 'border-transparent opacity-70 hover:opacity-100'
              }`}
            >
              <Image
                src={img}
                alt={`${title} thumb ${idx + 1}`}
                fill
                sizes="120px"
                className="object-cover object-center"
              />
            </button>
          ))}
        </div>
      )}

      {/* Fullscreen Lightbox Modal */}
      {isLightboxOpen && (
        <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-xl flex flex-col items-center justify-between p-4 sm:p-8 animate-fade-in">
          {/* Top Bar */}
          <div className="w-full flex items-center justify-between text-white max-w-6xl pb-4">
            <div className="flex items-center gap-3">
              <span className="text-sm font-bold text-[#c5a880] font-serif-luxury truncate max-w-md">
                {title}
              </span>
              <span className="text-xs text-white/60 bg-white/10 px-2.5 py-1 rounded-full">
                {activeIndex + 1} / {totalImages}
              </span>
            </div>
            <button
              onClick={() => setIsLightboxOpen(false)}
              type="button"
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
              title="Close (Esc)"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Central Image with Nav */}
          <div className="relative w-full max-w-6xl flex-1 flex items-center justify-center min-h-0 py-2">
            <div className="relative w-full h-full max-h-[78vh]">
              <Image
                src={images[activeIndex]}
                alt={`${title} - Fullscreen ${activeIndex + 1}`}
                fill
                className="object-contain object-center"
                priority
              />
            </div>

            {totalImages > 1 && (
              <>
                <button
                  onClick={prevImage}
                  type="button"
                  className="absolute start-2 sm:start-4 p-3 rounded-full bg-white/10 hover:bg-white/25 text-white backdrop-blur-md transition-all hover:scale-110 cursor-pointer"
                >
                  <ChevronLeft className="w-6 h-6 rtl:rotate-180" />
                </button>
                <button
                  onClick={nextImage}
                  type="button"
                  className="absolute end-2 sm:end-4 p-3 rounded-full bg-white/10 hover:bg-white/25 text-white backdrop-blur-md transition-all hover:scale-110 cursor-pointer"
                >
                  <ChevronRight className="w-6 h-6 rtl:rotate-180" />
                </button>
              </>
            )}
          </div>

          {/* Bottom Thumbnails */}
          {totalImages > 1 && (
            <div className="flex items-center justify-center gap-2 overflow-x-auto max-w-3xl pt-4">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveIndex(idx)}
                  type="button"
                  className={`relative aspect-[16/10] w-16 sm:w-20 shrink-0 rounded-lg overflow-hidden border-2 transition-all cursor-pointer ${
                    activeIndex === idx
                      ? 'border-[#c5a880] scale-105'
                      : 'border-transparent opacity-50 hover:opacity-90'
                  }`}
                >
                  <Image
                    src={img}
                    alt="thumb"
                    fill
                    sizes="80px"
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
