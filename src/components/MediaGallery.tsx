"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ProjectMedia } from '@/lib/data';

interface MediaGalleryProps {
  media: ProjectMedia[];
  title: string;
}

export function MediaGallery({ media, title }: MediaGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % media.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + media.length) % media.length);
  };

  if (!media || media.length === 0) {
    return (
      <div className="relative w-full h-[400px] rounded-xl overflow-hidden bg-muted flex items-center justify-center">
        <p className="text-muted-foreground">No media available</p>
      </div>
    );
  }

  const currentMedia = media[currentIndex];

  return (
    <div className="relative w-full h-[400px] rounded-xl overflow-hidden shadow-2xl group">
      {/* Media Content */}
      <div className="relative w-full h-full bg-black/5">
        {currentMedia.type === 'video' ? (
          <video
            src={currentMedia.url}
            controls
            poster={currentMedia.thumbnail}
            className="w-full h-full object-contain"
          >
            Your browser does not support the video tag.
          </video>
        ) : (
          <Image
            src={currentMedia.url}
            alt={currentMedia.alt || title}
            fill
            className="object-cover"
            priority={currentIndex === 0}
          />
        )}
      </div>

      {/* Navigation Controls (only if more than 1 item) */}
      {media.length > 1 && (
        <>
          <div className="absolute inset-y-0 left-0 flex items-center p-4 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              variant="secondary"
              size="icon"
              className="rounded-full bg-background/80 backdrop-blur-sm hover:bg-background"
              onClick={prevSlide}
            >
              <ChevronLeft className="w-5 h-5" />
            </Button>
          </div>
          <div className="absolute inset-y-0 right-0 flex items-center p-4 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              variant="secondary"
              size="icon"
              className="rounded-full bg-background/80 backdrop-blur-sm hover:bg-background"
              onClick={nextSlide}
            >
              <ChevronRight className="w-5 h-5" />
            </Button>
          </div>

          {/* Dots Indicators */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
            {media.map((_, index) => (
              <button
                key={index}
                className={`w-2 h-2 rounded-full transition-colors ${
                  index === currentIndex
                    ? 'bg-white'
                    : 'bg-white/50 hover:bg-white/75'
                }`}
                onClick={() => setCurrentIndex(index)}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
