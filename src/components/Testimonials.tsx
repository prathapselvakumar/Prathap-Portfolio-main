'use client';

import * as React from "react";
import { motion } from "framer-motion";

const reviews = [
  {
    id: 1,
    name: "Dr. Aarthy",
    affiliation: "Faculty Advisor , SRM Institute",
    quote:
      "Prathap was one of the most promising students in my Advanced Algorithms class. His analytical thinking and problem-solving approach set him apart.",

  },
  {
    id: 2,
    name: "Mrs. Sridevi S",
    affiliation: " Professor , SRM Institute",
    quote:
      "As Prathap's Professor, I was impressed by his dedication and innovative thinking. His research on machine learning applications showed remarkable depth.",

  },
  {
    id: 3,
    name: "Faritha Banu",
    affiliation: "Depute HOD of Computer Science and Engineering, SRM Institute",
    quote:
      "Prathap's enthusiasm for learning and his ability to grasp complex concepts quickly made him stand out. His project on algorithm optimization was exceptional.",

  },
  {
    id: 4,
    name: "Mohan Raj",
    affiliation: "Senior Developer @ C-Square Info Solutions",
    quote:
      "Working with Prathap was a great experience. His problem-solving skills and attention to detail helped us deliver the project ahead of schedule.",

  },
  {
    id: 5,
    name: "Vijay Kanna",
    affiliation: " Developer @ C-Square Info Solutions",
    quote:
      "Prathap's technical expertise and collaborative approach made a significant impact on our team. He consistently delivered high-quality work.",

  },
  {
    id: 6,
    name: "Aneeze",
    affiliation: " Senior Developer @ C-Square Info Solutions",
    quote:
      "Exceptional developer with a keen eye for detail. Prathap's ability to understand complex requirements and translate them into efficient code is impressive.",

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
                  <path d="M33.172 5.469q2.555 0 4.547 1.547a7.4 7.4 0 0 1 2.695 4.007q.47 1.711.469 3.61 0 2.883-1.125 5.86a22.8 22.8 0 0 1-3.094 5.577 33 33 0 0 1-4.57 4.922A35 35 0 0 1 26.539 35l-3.398-3.398q5.296-4.243 7.218-6.563 1.946-2.32 2.016-4.617-2.86-.329-4.781-2.461-1.923-2.133-1.922-4.992 0-3.117 2.18-5.297 2.202-2.203 5.32-2.203m-20.625 0q2.555 0 4.547 1.547a7.4 7.4 0 0 1 2.695 4.007q.47 1.711.469 3.61 0 2.883-1.125 5.86a22.8 22.8 0 0 1-3.094 5.577 33 33 0 0 1-4.57 4.922A35 35 0 0 1 5.914 35l-3.398-3.398q5.296-4.243 7.218-6.563 1.946-2.32 2.016-4.617-2.86-.329-4.781-2.461-1.922-2.133-1.922-4.992 0-3.117 2.18-5.297 2.202-2.203 5.32-2.203" fill="currentColor" className="text-primary" />
                </svg>
                <p className="text-sm mt-3 text-muted-foreground">{review.quote}</p>
                <div className="mt-4">
                  <h2 className="text-lg text-foreground font-medium">{review.name}</h2>
                  <p className="text-sm text-muted-foreground">{review.affiliation}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}