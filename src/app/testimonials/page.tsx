import * as React from "react";
import { TestimonialSlider } from "@/components/ui/testimonial-slider-1";

// 1. Define the review data
const reviews = [
  {
    id: 1,
    name: "Dr.B.Aarthi",
    affiliation: "Faculty Advisor, SRM Institute",
    quote: "Prathap was one of the most promising students in my Advanced Algorithms class. His analytical thinking and problem-solving approach set him apart.",
    imageSrc: "/Team_and_Testimonial/dr-aarthi-b.jpg",
    thumbnailSrc: "/Team_and_Testimonial/dr-aarthi-b.jpg",
  },
  {
    id: 2,
    name: "Dr. Sri Devi",
    affiliation: "Professor, SRM Institute",
    quote: "As Prathap's Professor, I was impressed by his dedication and innovative thinking. His research on machine learning applications showed remarkable depth.",
    imageSrc: "/Team_and_Testimonial/dr-sri-devi.png",
    thumbnailSrc: "/Team_and_Testimonial/dr-sri-devi.png",
  },
  {
    id: 3,
    name: "Dr. Faritha Banu",
    affiliation: "Depute HOD of CSE, SRM Institute",
    quote: "Prathap's enthusiasm for learning and his ability to grasp complex concepts quickly made him stand out. His project on algorithm optimization was exceptional.",
    imageSrc: "/Team_and_Testimonial/dr-faritha-banu.png",
    thumbnailSrc: "/Team_and_Testimonial/dr-faritha-banu.png",
  },
  {
    id: 4,
    name: "Mohan Raj",
    affiliation: "C-Square Info Solutions",
    quote: "Working with Prathap was a great experience. His problem-solving skills and attention to detail helped us deliver the project ahead of schedule.",
    imageSrc: "/Team_and_Testimonial/mohan-raj.jpeg",
    thumbnailSrc: "/Team_and_Testimonial/mohan-raj.jpeg",
  },
  {
    id: 5,
    name: "Vijay Kanna",
    affiliation: "C-Square Info Solutions",
    quote: "Prathap's technical expertise and collaborative approach made a significant impact on our team. He consistently delivered high-quality work.",
    imageSrc: "/Team_and_Testimonial/vijay-kanna.jpg",
    thumbnailSrc: "/Team_and_Testimonial/vijay-kanna.jpg",
  },
];

// 2. Render the component with the data
export default function TestimonialsPage() {
  return (
    <div className="min-h-screen w-full bg-background">
      <TestimonialSlider reviews={reviews} />
    </div>
  );
}
