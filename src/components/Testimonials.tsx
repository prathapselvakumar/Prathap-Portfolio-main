'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export type TestimonialData = {
  quote: string;
  name: string;
  designation: string;
  src: string;
  objectPosition?: string;
};

const defaultTestimonials: TestimonialData[] = [
  {
    quote: "Prathap was one of the most promising students in my Advanced Algorithms class. His analytical thinking and problem-solving approach set him apart.",
    name: "Dr.B.Aarthi",
    designation: "Faculty Advisor, SRM Institute",
    src: "/Team_and_Testimonial/dr-aarthi-b.jpg",
  },
  {
    quote: "As Prathap's Professor, I was impressed by his dedication and innovative thinking. His research on machine learning applications showed remarkable depth.",
    name: "Dr. Sri Devi",
    designation: "Professor, SRM Institute",
    src: "/Team_and_Testimonial/dr-sri-devi.png",
  },
  {
    quote: "Prathap's enthusiasm for learning and his ability to grasp complex concepts quickly made him stand out. His project on algorithm optimization was exceptional.",
    name: "Dr. Faritha Banu",
    designation: "Depute HOD of CSE, SRM Institute",
    src: "/Team_and_Testimonial/dr-faritha-banu.png",
  },
  {
    quote: "Working with Prathap was a great experience. His problem-solving skills and attention to detail helped us deliver the project ahead of schedule.",
    name: "Mohan Raj",
    designation: "Senior Developer @ C-Square Info Solutions",
    src: "/Team_and_Testimonial/mohan-raj.jpeg",
  },
  {
    quote: "Prathap's technical expertise and collaborative approach made a significant impact on our team. He consistently delivered high-quality work.",
    name: "Vijay Kanna",
    designation: "Developer @ C-Square Info Solutions",
    src: "/Team_and_Testimonial/vijay-kanna.jpg",
  },
];

export function Testimonials() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <section className="min-h-screen py-24 md:py-32 bg-background relative overflow-hidden flex flex-col items-center justify-center">
      <div className="container max-w-7xl mx-auto px-4 relative z-10 flex flex-col items-center">
        <motion.div
          className="text-center mb-16 md:mb-24"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-5xl md:text-7xl font-bold text-foreground mb-6 tracking-tight">
            Valued Feedback
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Insights and recommendations from professors and mentors who have guided my journey.
          </p>
        </motion.div>

        {/* Accordion Logic */}
        <div className="flex flex-col md:flex-row items-center justify-center gap-2 md:gap-1.5 w-full h-auto md:h-[550px]">
          {defaultTestimonials.map((testimonial, index) => {
            const isHovered = hoveredIndex === index;
            const isAnyHovered = hoveredIndex !== null;
            const isExpanded = isHovered;

            return (
              <motion.div
                key={index}
                className={`relative transition-all duration-[800ms] ease-[cubic-bezier(0.25,0.46,0.45,0.94)] w-full md:h-full cursor-pointer group ${
                  isExpanded 
                    ? "md:w-[550px] z-30 h-[450px]" 
                    : isAnyHovered 
                      ? "md:w-16 opacity-40 h-[100px] md:h-full" 
                      : "md:w-24 h-[120px] md:h-full"
                }`}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
                layout
              >
                <div
                  className={`relative w-full h-full rounded-[32px] backdrop-blur-2xl border transition-all duration-[800ms] ease-[cubic-bezier(0.25,0.46,0.45,0.94)] overflow-hidden flex flex-col md:flex-row items-center ${
                    isExpanded
                      ? "bg-card shadow-[0_32px_64px_rgba(0,0,0,0.15)] border-border/50 scale-[1.02]"
                      : "bg-card/40 shadow-[0_8px_32px_rgba(0,0,0,0.05)] border-border/20 hover:border-border/40"
                  }`}
                >
                  {/* Photo Section */}
                  <div className={`relative h-full transition-all duration-700 shrink-0 ${
                    isExpanded ? "w-full md:w-1/3" : "w-full"
                  }`}>
                    <img
                      src={testimonial.src}
                      alt={testimonial.name}
                      className={`w-full h-full object-cover transition-all duration-[800ms] ${
                        isExpanded ? "scale-100 opacity-90" : "scale-110 blur-[1px] opacity-30 group-hover:opacity-60"
                      }`}
                    />
                    {!isExpanded && (
                       <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                          <p className="hidden md:block text-foreground/20 font-bold text-2xl lg:text-3xl transform -rotate-90 whitespace-nowrap uppercase tracking-[0.3em]">
                             {testimonial.name}
                          </p>
                       </div>
                    )}
                  </div>

                  {/* Content Section (Only visible when expanded) */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div 
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        transition={{ delay: 0.2, duration: 0.5 }}
                        className="flex-1 p-8 md:p-10 flex flex-col justify-between h-full text-left bg-gradient-to-br from-white/5 to-transparent"
                      >
                        <div className="space-y-6">
                           <svg width="40" height="36" viewBox="0 0 44 40" fill="none" className="text-foreground/20">
                              <path d="M33.172 5.469q2.555 0 4.547 1.547a7.4 7.4 0 0 1 2.695 4.007q.47 1.711.469 3.61 0 2.883-1.125 5.86a22.8 22.8 0 0 1-3.094 5.577 33 33 0 0 1-4.57 4.922A35 35 0 0 1 26.539 35l-3.398-3.398q5.296-4.243 7.218-6.563 1.946-2.32 2.016-4.617-2.86-.329-4.781-2.461-1.923-2.133-1.922-4.992 0-3.117 2.18-5.297 2.202-2.203 5.32-2.203m-20.625 0q2.555 0 4.547 1.547a7.4 7.4 0 0 1 2.695 4.007q.47 1.711.469 3.61 0 2.883-1.125 5.86a22.8 22.8 0 0 1-3.094 5.577 33 33 0 0 1-4.57 4.922A35 35 0 0 1 5.914 35l-3.398-3.398q5.296-4.243 7.218-6.563 1.946-2.32 2.016-4.617-2.86-.329-4.781-2.461-1.922-2.133-1.922-4.992 0-3.117 2.18-5.297 2.202-2.203 5.32-2.203" fill="currentColor" />
                           </svg>
                           <p className="text-xl md:text-2xl leading-relaxed text-foreground/90 font-light italic">
                             "{testimonial.quote}"
                           </p>
                        </div>

                        <div className="pt-8 border-t border-border/50">
                           <h4 className="text-xl font-semibold text-foreground">{testimonial.name}</h4>
                           <p className="text-sm text-muted-foreground uppercase tracking-widest mt-1">
                             {testimonial.designation}
                           </p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Mobile Swipe Hint */}
        <div className="mt-12 md:hidden text-white/30 text-xs uppercase tracking-[0.2em]">
           Tap for details
        </div>
      </div>
    </section>
  );
}