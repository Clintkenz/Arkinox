import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, ChevronRight, Quote, Star } from 'lucide-react';
import { Testimonial } from '../types';
import { cleanImageUrl } from '../lib/utils';

interface TestimonialSliderProps {
  testimonials: Testimonial[];
}

export default function TestimonialSlider({ testimonials }: TestimonialSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState<'left' | 'right'>('right');

  const visibleTestimonials = testimonials.filter(t => t.isVisible !== false);

  useEffect(() => {
    if (visibleTestimonials.length <= 1) return;
    const interval = setInterval(() => {
      setDirection('right');
      setCurrentIndex((prev) => (prev + 1) % visibleTestimonials.length);
    }, 8000); // Auto-scroll every 8 seconds
    return () => clearInterval(interval);
  }, [visibleTestimonials.length]);

  if (visibleTestimonials.length === 0) {
    return null;
  }

  const handlePrev = () => {
    setDirection('left');
    setCurrentIndex((prev) => (prev - 1 + visibleTestimonials.length) % visibleTestimonials.length);
  };

  const handleNext = () => {
    setDirection('right');
    setCurrentIndex((prev) => (prev + 1) % visibleTestimonials.length);
  };

  const current = visibleTestimonials[currentIndex];

  const slideVariants = {
    initial: (dir: 'left' | 'right') => ({
      opacity: 0,
      x: dir === 'right' ? 80 : -80,
    }),
    animate: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.5, ease: 'easeOut' as any }
    },
    exit: (dir: 'left' | 'right') => ({
      opacity: 0,
      x: dir === 'right' ? -80 : 80,
      transition: { duration: 0.4, ease: 'easeIn' as any }
    })
  };

  return (
    <div id="testimonial-section-container" className="relative w-full max-w-4xl mx-auto px-4 md:px-12 py-12">
      {/* Testimonials Frame */}
      <div className="relative overflow-hidden min-h-[360px] md:min-h-[280px] bg-white rounded-3xl p-8 md:p-12 shadow-2xl shadow-primary/5 border border-gray-100 flex flex-col justify-between">
        
        {/* Large Decorative Quote Background */}
        <div className="absolute right-8 top-6 text-secondary/10 pointer-events-none transform translate-x-2 -translate-y-2">
          <Quote size={120} strokeWidth={1} />
        </div>

        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={current.id || currentIndex}
            custom={direction}
            variants={slideVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="space-y-6 md:space-y-8 flex-grow flex flex-col justify-between relative z-10"
          >
            {/* Rating Stars & Feedback */}
            <div className="space-y-4">
              <div className="flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star 
                    key={i} 
                    size={18} 
                    className={i < (current.rating || 5) ? "fill-amber-400 text-amber-400" : "text-gray-200"} 
                  />
                ))}
              </div>
              <p className="text-gray-600 text-lg md:text-xl font-medium leading-relaxed italic">
                "{current.feedback}"
              </p>
            </div>

            {/* Author Profile */}
            <div className="flex items-center gap-4 pt-4 border-t border-gray-100">
              <img 
                src={current.imageUrl ? cleanImageUrl(current.imageUrl) : `https://picsum.photos/seed/${encodeURIComponent(current.authorName)}/100/100`} 
                alt={current.authorName} 
                className="w-14 h-14 rounded-2xl object-cover shadow-sm bg-accent aspect-square border"
                referrerPolicy="no-referrer"
              />
              <div className="overflow-hidden">
                <h4 className="font-display font-bold text-primary truncate text-base md:text-lg">{current.authorName}</h4>
                <p className="text-sm text-secondary font-medium truncate">
                  {current.role || 'Client'}{current.company ? `, ${current.company}` : ''}
                </p>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Navigation Chevrons inside the frame for high design feel */}
        <div className="absolute right-8 bottom-8 flex gap-3 z-20">
          <button 
            id="testimonial-nav-prev"
            onClick={handlePrev}
            className="p-3 rounded-xl bg-accent text-primary hover:bg-secondary hover:text-white transition-all shadow-sm flex items-center justify-center cursor-pointer"
            aria-label="Previous testimonial"
          >
            <ChevronLeft size={20} />
          </button>
          <button 
            id="testimonial-nav-next"
            onClick={handleNext}
            className="p-3 rounded-xl bg-accent text-primary hover:bg-secondary hover:text-white transition-all shadow-sm flex items-center justify-center cursor-pointer"
            aria-label="Next testimonial"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      {/* Slider Bullet Pagination Indicators below the box */}
      {visibleTestimonials.length > 1 && (
        <div className="flex justify-center gap-2 mt-6">
          {visibleTestimonials.map((_, i) => (
            <button
              key={i}
              onClick={() => {
                setDirection(i > currentIndex ? 'right' : 'left');
                setCurrentIndex(i);
              }}
              className={`h-2.5 rounded-full transition-all duration-300 cursor-pointer ${
                i === currentIndex ? "w-8 bg-secondary" : "w-2.5 bg-gray-300 hover:bg-gray-400"
              }`}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
