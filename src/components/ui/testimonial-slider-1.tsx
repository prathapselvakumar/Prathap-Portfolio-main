'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface Review {
  id: number;
  name: string;
  affiliation: string;
  quote: string;
  imageSrc: string;
  thumbnailSrc: string;
}

interface TestimonialSliderProps {
  reviews: Review[];
}

export function TestimonialSlider({ reviews }: TestimonialSliderProps) {
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const [direction, setDirection] = React.useState(0);

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
    }),
  };

  const swipeConfidenceThreshold = 10000;
  const swipePower = (offset: number, velocity: number) => {
    return Math.abs(offset) * velocity;
  };

  const paginate = (newDirection: number) => {
    setDirection(newDirection);
    setCurrentIndex((prevIndex) => {
      let nextIndex = prevIndex + newDirection;
      if (nextIndex < 0) nextIndex = reviews.length - 1;
      if (nextIndex >= reviews.length) nextIndex = 0;
      return nextIndex;
    });
  };

  const goToSlide = (index: number) => {
    setDirection(index > currentIndex ? 1 : -1);
    setCurrentIndex(index);
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-12">
      {/* Title */}
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-16 text-center"
      >
        Testimonials
      </motion.h2>

      <div className="relative">
        {/* Main Slider */}
        <div className="relative h-[500px] md:h-[600px] overflow-hidden">
          <AnimatePresence initial={false} custom={direction}>
            <motion.div
              key={currentIndex}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                x: { type: 'spring', stiffness: 300, damping: 30 },
                opacity: { duration: 0.2 },
              }}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={1}
              onDragEnd={(e, { offset, velocity }) => {
                const swipe = swipePower(offset.x, velocity.x);
                if (swipe < -swipeConfidenceThreshold) {
                  paginate(1);
                } else if (swipe > swipeConfidenceThreshold) {
                  paginate(-1);
                }
              }}
              className="absolute w-full h-full flex items-center justify-center"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center max-w-6xl mx-auto">
                {/* Image */}
                <div className="relative h-[300px] md:h-[500px] rounded-2xl overflow-hidden">
                  <img
                    src={reviews[currentIndex].imageSrc}
                    alt={reviews[currentIndex].name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                </div>

                {/* Content */}
                <div className="space-y-6 px-4">
                  <div className="text-6xl text-foreground/20">"</div>
                  <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
                    {reviews[currentIndex].quote}
                  </p>
                  <div className="pt-4">
                    <h3 className="text-2xl font-bold text-foreground">
                      {reviews[currentIndex].name}
                    </h3>
                    <p className="text-muted-foreground mt-1">
                      {reviews[currentIndex].affiliation}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation Arrows */}
          <button
            onClick={() => paginate(-1)}
            className="absolute left-12 md:left-16 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full bg-foreground/10 backdrop-blur-sm border border-foreground/20 flex items-center justify-center hover:bg-foreground/20 transition-colors"
            aria-label="Previous testimonial"
          >
            <ChevronLeft className="w-6 h-6 text-foreground" />
          </button>
          <button
            onClick={() => paginate(1)}
            className="absolute right-12 md:right-16 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full bg-foreground/10 backdrop-blur-sm border border-foreground/20 flex items-center justify-center hover:bg-foreground/20 transition-colors"
            aria-label="Next testimonial"
          >
            <ChevronRight className="w-6 h-6 text-foreground" />
          </button>
        </div>

        {/* Thumbnails */}
        <div className="flex justify-center gap-3 mt-8 flex-wrap">
          {reviews.map((review, index) => (
            <button
              key={review.id}
              onClick={() => goToSlide(index)}
              className={`relative w-16 h-20 rounded-lg overflow-hidden transition-all ${
                index === currentIndex
                  ? 'ring-2 ring-foreground scale-110'
                  : 'ring-1 ring-foreground/30 opacity-60 hover:opacity-100'
              }`}
              aria-label={`Go to ${review.name}'s testimonial`}
            >
              <img
                src={review.thumbnailSrc}
                alt={review.name}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>

        {/* Pagination Dots */}
        <div className="flex justify-center gap-2 mt-6">
          {reviews.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`h-2 rounded-full transition-all ${
                index === currentIndex
                  ? 'w-8 bg-foreground'
                  : 'w-2 bg-foreground/30 hover:bg-foreground/50'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}