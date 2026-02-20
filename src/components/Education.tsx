import React from 'react';
import { Timeline } from '@/components/ui/timeline';

interface EducationItem {
  id: string;
  degree: string;
  institution: string;
  period: string;
  description: string[];
  achievements: string[];
  cgpa?: string;
  logo: string;
}

const education: EducationItem[] = [
  {
    id: "msc-robotics",
    degree: "MSc Robotics",
    institution: "University of Manchester, Manchester, United Kingdom",
    period: "2025 - Current",
    description: [
      "Advanced study in robotics systems, autonomous navigation, and intelligent control",
      "Research focus on AI-driven robotic applications and human-robot interaction",
      "Hands-on experience with cutting-edge robotics hardware and simulation environments",
      "Collaborative projects with industry partners and research institutions"
    ],
    achievements: ["Admitted to prestigious MSc program", "Research opportunities", "Industry collaborations"],
    logo: "/University_of_Manchester.svg"
  },
  {
    id: "btech-cse",
    degree: "B.Tech in Computer Science and Engineering",
    institution: "SRM Institute of Science and Technology, Chennai, India",
    period: "2020 - 2024",
    cgpa: "8.49",
    description: [
      "Comprehensive study of computer science fundamentals including algorithms, data structures, and software engineering",
      "Specialized coursework in artificial intelligence, machine learning, and robotics",
      "Hands-on experience with various programming languages and development frameworks",
      "Strong foundation that prepared for advanced robotics studies"
    ],
    achievements: ["CGPA: 8.49", "Dean's List Recognition", "Active participation in technical societies"],
    logo: "/SRM University.svg"
  },
];

export function Education() {
  const timelineData = education.map((edu) => ({
    title: edu.period.split(" ")[0], // Use start year as title
    content: (
      <div className="bg-card border border-border rounded-xl p-6 lg:p-8 animate-fade-in shadow-sm hover:shadow-md transition-shadow">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6 mb-6">
          <div>
            <h3 className="text-2xl font-bold text-foreground mb-2">{edu.degree}</h3>
            <p className="text-lg text-muted-foreground font-medium">{edu.institution}</p>
            <p className="text-sm text-primary font-mono mt-1">{edu.period}</p>
            {edu.cgpa && (
              <div className="inline-block mt-3 px-3 py-1 bg-primary/10 border border-primary/30 rounded-full">
                <p className="text-sm text-primary font-semibold font-mono tracking-wider">CGPA: {edu.cgpa}</p>
              </div>
            )}
          </div>
          {edu.logo && (
            <div className="w-24 h-auto shrink-0 bg-white/5 p-2 rounded-lg backdrop-blur-sm border border-border/50">
              <img
                src={edu.logo}
                alt={`${edu.institution} Logo`}
                className="w-full h-auto object-contain filter hover:grayscale-0 transition-all duration-300"
              />
            </div>
          )}
        </div>

        <div className="mb-8">
          <ul className="space-y-3">
            {edu.description.map((item, index) => (
              <li key={index} className="flex items-start">
                <span className="text-primary mr-3 mt-1 text-lg leading-none">•</span>
                <span className="text-muted-foreground leading-relaxed">{item}</span>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-bold tracking-widest uppercase mb-4 text-foreground/70">Key Achievements</h4>
          <div className="flex flex-wrap gap-2">
            {edu.achievements.map((achievement, index) => (
              <span
                key={index}
                className="px-4 py-1.5 text-xs font-medium rounded-full border border-border/50 
                         bg-secondary/50 backdrop-blur-sm text-foreground hover:bg-primary/10 hover:text-primary transition-colors"
              >
                {achievement}
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
        title="Education History"
        description="My academic journey highlighting degrees, institutions, and core focuses across my educational career."
      />
    </section>
  );
}