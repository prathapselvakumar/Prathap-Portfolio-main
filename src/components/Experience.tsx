import React from 'react';
import { Timeline } from '@/components/ui/timeline';

interface ExperienceItem {
  id: string;
  title: string;
  company: string;
  period: string;
  description: (string | React.ReactNode)[];
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
      <>Built and <strong>optimised ERP web applications</strong> for a pharmaceutical business using <strong>React.js and Node.js</strong>, digitalising operations across <strong>8 departments</strong> and cutting <strong>processing time by 35%</strong>.</>,
      <>Re-engineered <strong>more than 50 static APIs</strong> into <strong>dynamic, modular endpoints</strong>, eliminating <strong>1,000+ redundant code lines per report page</strong> and improving <strong>scalability by 40%</strong>.</>,
      <>Refined <strong>front-end architecture</strong> with <strong>reusable React hooks</strong> and <strong>Context APIs</strong>, increasing <strong>interface responsiveness and maintainability by 25%</strong>.</>,
      <>Strengthened <strong>database queries</strong> and implemented <strong>secure RESTful API authentication</strong>, resulting in a <strong>30% gain in data retrieval speed</strong>.</>,
    ],
    technologies: ["React.js", "JavaScript", "HTML/CSS", "Git"],
    logo: "/Organization Logs/C-Square Info solution.png"
  },
  {
    id: "qentelli-intern",
    title: "AI/ML Project Intern",
    company: "Qentelli Solutions",
    period: "FEB-2024 to APR-2024",
    description: [
      <>Participated in <strong>AI/ML projects</strong> focused on <strong>predictive analytics</strong>.</>,
      <>Assisted in developing <strong>machine learning models</strong> for <strong>business applications</strong>.</>,
      <>Gained hands-on experience with <strong>machine learning frameworks and tools</strong>.</>
    ],
    technologies: ["Python", "Machine Learning", "Predictive Analytics", "Data Science"],
    logo: "/Organization Logs/Qentelli.png"
  },
  {
    id: "nus-academic-intern",
    title: "Big Data Analytics using Deep Learning - Academic Internship",
    company: "National University of Singapore",
    period: "DEC-2023 to JAN-2024",
    description: [
      <>
    <strong>Directed a team of 4 interns</strong> to deliver a <strong>deep learning project</strong>, 
    securing a <strong>final project score of 44/50</strong> (<strong>Grade A, 74%</strong>).
  </>,

  <>
    Trained and <strong>fine-tuned neural networks</strong> on <strong>large-scale datasets</strong>, 
    enhancing <strong>model precision by 15%</strong>.
  </>,

  <>
    Implemented <strong>data visualisation dashboards</strong> using <strong>Python libraries</strong> 
    (<strong>Matplotlib</strong>, <strong>Seaborn</strong>), reducing <strong>analysis time by 25%</strong>.
  </>
    ],
    technologies: ["Python", "TensorFlow", "Deep Learning", "Big Data Analytics"],
    logo: "/Organization Logs/National University of Singapore.svg"
  },
  {
    id: "csq-intern",
    title: "Python Developer Intern",
    company: "C-Square Info Solutions (Subsidiary of Reliance Retail)",
    period: "SEP-2023 to NOV-2023",
    description: [
      <>Developed <strong>Python scripts</strong> for <strong>automation and data processing</strong>.</>,
      <>Worked on <strong>internal tools</strong> to improve <strong>team productivity</strong>.</>,
      <>Gained experience with <strong>database operations and API integration</strong>.</>
    ],
    technologies: ["Python", "SQL", "Data Processing", "MongoDB"],
    logo: "/Organization Logs/C-Square Info solution.png"
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