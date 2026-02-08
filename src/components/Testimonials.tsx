'use client';

import * as React from "react";
import { motion } from "framer-motion";

const reviews = [
  {
    id: 1,
    name: "Dr. Barthy",
    affiliation: "Professor, SRM Institute",
    quote:
      "Prathap was one of the most promising students in my Advanced Algorithms class. His analytical thinking and problem-solving approach set him apart.",
    imageSrc:
      "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&h=100&fit=crop&q=80",
  },
  {
    id: 2,
    name: "Mrs. Sridevi S",
    affiliation: "Thesis Advisor, SRM Institute",
    quote:
      "As Prathap's thesis advisor, I was impressed by his dedication and innovative thinking. His research on machine learning applications showed remarkable depth.",
    imageSrc:
      "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&h=100&fit=crop&q=80",
  },
  {
    id: 3,
    name: "Faritha Banu",
    affiliation: "Professor, SRM Institute",
    quote:
      "Prathap's enthusiasm for learning and his ability to grasp complex concepts quickly made him stand out. His project on algorithm optimization was exceptional.",
    imageSrc:
      "https://images.unsplash.com/photo-1594744803329-e58b31de8bf5?w=100&h=100&fit=crop&q=80",
  },
  {
    id: 4,
    name: "Mohan Raj",
    affiliation: "Team Lead @ C-Square",
    quote:
      "Working with Prathap was a great experience. His problem-solving skills and attention to detail helped us deliver the project ahead of schedule.",
    imageSrc:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&q=80",
  },
  {
    id: 5,
    name: "Vijay Kanna",
    affiliation: "Senior Developer @ C-Square",
    quote:
      "Prathap's technical expertise and collaborative approach made a significant impact on our team. He consistently delivered high-quality work.",
    imageSrc:
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop&q=80",
  },
  {
    id: 6,
    name: "Aneeze",
    affiliation: "Developer @ C-Square",
    quote:
      "Exceptional developer with a keen eye for detail. Prathap's ability to understand complex requirements and translate them into efficient code is impressive.",
    imageSrc:
      "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=100&h=100&fit=crop&q=80",
  },
];

export function Testimonials() {
  return (
    <section className="min-h-screen py-20 bg-background flex items-center">
      <div className="w-full max-w-7xl mx-auto px-8 md:px-16">
        <div className="text-center">
          <motion.h1
            className="text-3xl md:text-4xl font-bold text-foreground"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            What People Say
          </motion.h1>
          <motion.p
            className="text-sm md:text-base text-muted-foreground mt-4"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
          >
            Testimonials from professors, mentors, and colleagues I've worked with
          </motion.p>
          <div className="flex flex-wrap justify-center gap-5 mt-16 text-left">
            {reviews.map((review, index) => (
              <motion.div
                key={review.id}
                className="w-80 flex flex-col items-start border border-border p-5 rounded-lg bg-card"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <svg width="44" height="40" viewBox="0 0 44 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M33.172 5.469q2.555 0 4.547 1.547a7.4 7.4 0 0 1 2.695 4.007q.47 1.711.469 3.61 0 2.883-1.125 5.86a22.8 22.8 0 0 1-3.094 5.577 33 33 0 0 1-4.57 4.922A35 35 0 0 1 26.539 35l-3.398-3.398q5.296-4.243 7.218-6.563 1.946-2.32 2.016-4.617-2.86-.329-4.781-2.461-1.923-2.133-1.922-4.992 0-3.117 2.18-5.297 2.202-2.203 5.32-2.203m-20.625 0q2.555 0 4.547 1.547a7.4 7.4 0 0 1 2.695 4.007q.47 1.711.469 3.61 0 2.883-1.125 5.86a22.8 22.8 0 0 1-3.094 5.577 33 33 0 0 1-4.57 4.922A35 35 0 0 1 5.914 35l-3.398-3.398q5.296-4.243 7.218-6.563 1.946-2.32 2.016-4.617-2.86-.329-4.781-2.461-1.922-2.133-1.922-4.992 0-3.117 2.18-5.297 2.202-2.203 5.32-2.203" fill="currentColor" className="text-primary"/>
                </svg>
                <p className="text-sm mt-3 text-muted-foreground">{review.quote}</p>
                <div className="flex items-center gap-3 mt-4">
                  <img className="h-12 w-12 rounded-full" src={review.imageSrc} alt={review.name} />
                  <div>
                    <h2 className="text-lg text-foreground font-medium">{review.name}</h2>
                    <p className="text-sm text-muted-foreground">{review.affiliation}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}