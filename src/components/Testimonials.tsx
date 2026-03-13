'use client';

import * as React from "react";
import { motion } from "framer-motion";
import { AnimatedTestimonials } from "@/components/ui/animated-testimonials";

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

interface TestimonialsProps {
  title?: string;
  description?: string;
  data?: TestimonialData[];
  variant?: 'grid' | 'animated';
}

export function Testimonials({
  title = "What People Say",
  description = "Testimonials from professors, mentors, and colleagues I've worked with",
  data = defaultTestimonials,
  variant = 'grid'
}: TestimonialsProps) {
  return (
    <section className="min-h-[100dvh] py-16 md:py-20 bg-background flex flex-col items-center">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-8 md:px-16">
        <div className="text-center mb-12">
          <motion.h1
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-foreground"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            {title}
          </motion.h1>
          <motion.p
            className="text-sm md:text-base text-muted-foreground mt-4"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
          >
            {description}
          </motion.p>
        </div>
        
        {variant === 'animated' ? (
          <AnimatedTestimonials testimonials={data} autoplay={false} />
        ) : (
          <div className="flex flex-wrap justify-center gap-5 mt-4 text-left">
            {data.map((testimonial, index) => (
              <motion.div
                key={index}
                className="w-80 flex flex-col items-start border border-border p-5 rounded-lg bg-card"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <svg width="44" height="40" viewBox="0 0 44 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M33.172 5.469q2.555 0 4.547 1.547a7.4 7.4 0 0 1 2.695 4.007q.47 1.711.469 3.61 0 2.883-1.125 5.86a22.8 22.8 0 0 1-3.094 5.577 33 33 0 0 1-4.57 4.922A35 35 0 0 1 26.539 35l-3.398-3.398q5.296-4.243 7.218-6.563 1.946-2.32 2.016-4.617-2.86-.329-4.781-2.461-1.923-2.133-1.922-4.992 0-3.117 2.18-5.297 2.202-2.203 5.32-2.203m-20.625 0q2.555 0 4.547 1.547a7.4 7.4 0 0 1 2.695 4.007q.47 1.711.469 3.61 0 2.883-1.125 5.86a22.8 22.8 0 0 1-3.094 5.577 33 33 0 0 1-4.57 4.922A35 35 0 0 1 5.914 35l-3.398-3.398q5.296-4.243 7.218-6.563 1.946-2.32 2.016-4.617-2.86-.329-4.781-2.461-1.922-2.133-1.922-4.992 0-3.117 2.18-5.297 2.202-2.203 5.32-2.203" fill="currentColor" className="text-primary" />
                </svg>
                <p className="text-sm mt-3 text-muted-foreground leading-relaxed italic">"{testimonial.quote}"</p>
                
                <div className="flex items-center gap-4 mt-auto pt-6 w-full border-t border-border/50">
                  <div className="relative h-12 w-12 rounded-full overflow-hidden border border-border shrink-0">
                    <img 
                      src={testimonial.src} 
                      alt={testimonial.name} 
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="flex flex-col min-w-0">
                    <h2 className="text-sm text-foreground font-semibold truncate">{testimonial.name}</h2>
                    <p className="text-[11px] text-muted-foreground mt-0.5 truncate uppercase tracking-wider">{testimonial.designation}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}