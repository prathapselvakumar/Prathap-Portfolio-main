import React from 'react';
import { Timeline } from '@/components/ui/timeline';

interface ExperienceItem {
  id: string;
  title: string;
  company: string;
  period: string;
  description: string[];
  technologies: string[];
  logo?: string;
}

const experiences: ExperienceItem[] = [
  {
    id: "csq-swe",
    title: "Software Engineer",
    company: "C-Square Info Solutions (Subsidiary of Reliance Retail)",
    period: "AUG-2024 to MAY-2025",
    description: [
      "Working with React.js and Node.js to develop full-stack web applications",
      "Collaborating with cross-functional teams to deliver high-quality software solutions",
      "Implementing responsive designs and ensuring optimal performance across devices"
    ],
    technologies: ["React.js", "JavaScript", "HTML/CSS", "Git"],
    logo: "/C-Square Info solution.png"
  },
  {
    id: "qentelli-intern",
    title: "AI/ML Project Intern",
    company: "Qentelli Solutions",
    period: "FEB-2024 to APR-2024",
    description: [
      "Participated in AI/ML projects focused on predictive analytics",
      "Assisted in developing machine learning models for business applications",
      "Gained hands-on experience with machine learning frameworks and tools"
    ],
    technologies: ["Python", "Machine Learning", "Predictive Analytics", "Data Science"],
    logo: "/Qentelli.png"
  },
  {
    id: "nus-academic-intern",
    title: "Big Data Analytics using Deep Learning - Academic Internship",
    company: "National University of Singapore",
    period: "DEC-2023 to JAN-2024",
    description: [
      "Applied deep learning techniques to analyze large datasets",
      "Worked on research projects involving pattern recognition in data",
      "Collaborated with academic researchers on cutting-edge deep learning approaches"
    ],
    technologies: ["Python", "TensorFlow", "Deep Learning", "Big Data Analytics"],
    logo: "/National University of Singapore.svg"
  },
  {
    id: "csq-intern",
    title: "Python Developer Intern",
    company: "C-Square Info Solutions (Subsidiary of Reliance Retail)",
    period: "SEP-2023 to NOV-2023",
    description: [
      "Developed Python scripts for automation and data processing",
      "Worked on internal tools to improve team productivity",
      "Gained experience with database operations and API integration"
    ],
    technologies: ["Python", "SQL", "Data Processing", "MongoDB"],
    logo: "/C-Square Info solution.png"
  },
];

export function Experience() {
  const timelineData = experiences.map((exp) => ({
    title: exp.period.split(" ")[0].split("-")[1] || exp.period.split(" ")[0], // Extract just the year/month start
    content: (
      <div className="bg-card border border-border rounded-xl p-6 lg:p-8 animate-fade-in shadow-sm hover:shadow-md transition-shadow">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6 mb-6">
          <div>
            <h3 className="text-2xl font-bold text-foreground mb-2">{exp.title}</h3>
            <p className="text-lg text-muted-foreground font-medium">{exp.company}</p>
            <p className="text-sm text-primary font-mono mt-1">{exp.period}</p>
          </div>
          {exp.logo && (
            <div className="w-24 h-auto shrink-0 bg-white/5 p-2 rounded-lg backdrop-blur-sm border border-border/50">
              <img
                src={exp.logo}
                alt={`${exp.company} Logo`}
                className="w-full h-auto object-contain filter hover:grayscale-0 transition-all duration-300"
              />
            </div>
          )}
        </div>

        <div className="mb-8">
          <h4 className="text-sm font-bold tracking-widest uppercase mb-4 text-foreground/70">Key Responsibilities</h4>
          <ul className="space-y-3">
            {exp.description.map((item, index) => (
              <li key={index} className="flex items-start">
                <span className="text-primary mr-3 mt-1 text-lg leading-none">•</span>
                <span className="text-muted-foreground leading-relaxed">{item}</span>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-bold tracking-widest uppercase mb-4 text-foreground/70">Technologies</h4>
          <div className="flex flex-wrap gap-2">
            {exp.technologies.map((tech, index) => (
              <span
                key={index}
                className="px-4 py-1.5 text-xs font-medium rounded-full border border-border/50 
                         bg-secondary/50 backdrop-blur-sm text-foreground hover:bg-primary/10 hover:text-primary transition-colors"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
      </div>
    ),
  }));

  return (
    <section>
      <Timeline
        data={timelineData}
        title="Experience"
        description="A timeline of my professional journey, internships, and key responsibilities."
      />
    </section>
  );
}