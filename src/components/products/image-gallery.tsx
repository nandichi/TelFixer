'use client';

import { useState } from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

interface ImageGalleryProps {
  images: string[];
  productName: string;
}

export function ImageGallery({ images, productName }: ImageGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);

  // If no images, show placeholder
  const hasImages = images && images.length > 0;
  const displayImages = hasImages ? images : ['/images/placeholder-product.jpg'];

  const handlePrevious = () => {
    setSelectedIndex((prev) =>
      prev === 0 ? displayImages.length - 1 : prev - 1
    );
  };

  const handleNext = () => {
    setSelectedIndex((prev) =>
      prev === displayImages.length - 1 ? 0 : prev + 1
    );
  };

  return (
    <div className="space-y-4">
      {/* Main Image */}
      <div className="relative aspect-square bg-white rounded-3xl overflow-hidden border border-sand" style={{ boxShadow: 'var(--shadow-sm)' }}>
        {hasImages ? (
          <Image
            src={displayImages[selectedIndex]}
            alt={`${productName} - Afbeelding ${selectedIndex + 1}`}
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            className={cn(
              'object-contain transition-transform duration-500',
              isZoomed && 'scale-150 cursor-zoom-out'
            )}
            onClick={() => setIsZoomed(!isZoomed)}
            priority
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-muted">
            <svg
              className="w-24 h-24 opacity-30"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
        )}

        {/* Navigation Arrows */}
        {displayImages.length > 1 && (
          <>
            <button
              onClick={handlePrevious}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-2xl bg-white/90 backdrop-blur-sm hover:bg-white flex items-center justify-center transition-all duration-200 hover:shadow-md"
              style={{ boxShadow: 'var(--shadow-sm)' }}
              aria-label="Vorige afbeelding"
            >
              <svg className="w-5 h-5 text-soft-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={handleNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-2xl bg-white/90 backdrop-blur-sm hover:bg-white flex items-center justify-center transition-all duration-200 hover:shadow-md"
              style={{ boxShadow: 'var(--shadow-sm)' }}
              aria-label="Volgende afbeelding"
            >
              <svg className="w-5 h-5 text-soft-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </>
        )}

        {/* Zoom Indicator */}
        <button
          onClick={() => setIsZoomed(!isZoomed)}
          className="absolute bottom-4 right-4 w-12 h-12 rounded-2xl bg-white/90 backdrop-blur-sm hover:bg-white flex items-center justify-center transition-all duration-200 hover:shadow-md"
          style={{ boxShadow: 'var(--shadow-sm)' }}
          aria-label={isZoomed ? 'Uitzoomen' : 'Inzoomen'}
        >
          <svg className="w-5 h-5 text-soft-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
          </svg>
        </button>

        {/* Image Counter */}
        {displayImages.length > 1 && (
          <div className="absolute bottom-4 left-4 px-4 py-2 rounded-xl bg-soft-black/80 text-white text-sm font-medium">
            {selectedIndex + 1} / {displayImages.length}
          </div>
        )}
      </div>

      {/* Thumbnails */}
      {displayImages.length > 1 && (
        <div className="flex gap-3 overflow-x-auto pb-2">
          {displayImages.map((image, index) => (
            <button
              key={index}
              onClick={() => setSelectedIndex(index)}
              className={cn(
                'relative w-24 h-24 rounded-2xl overflow-hidden shrink-0 border-2 transition-all duration-200',
                selectedIndex === index
                  ? 'border-primary shadow-md'
                  : 'border-sand hover:border-primary/50'
              )}
            >
              <Image
                src={image}
                alt={`${productName} - Thumbnail ${index + 1}`}
                fill
                sizes="96px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
