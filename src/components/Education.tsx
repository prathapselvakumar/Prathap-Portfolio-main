import React from 'react';
import { Timeline } from '@/components/ui/timeline';
import { useLanguage } from '@/contexts/LanguageContext';
import { translations } from '@/lib/translations';

export function Education() {
  const { language } = useLanguage();
  const t = translations[language].education;

  const timelineData = t.items.map((edu: any) => ({
    title: edu.period.split(" ")[0].replace(/年$/, ""), // Extract start year, remove '年' if present for title
    content: (
      <div className="bg-card border border-border rounded-xl p-6 lg:p-8 animate-fade-in shadow-sm hover:shadow-md transition-shadow">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6 mb-6">
          <div>
            <h3 className="text-2xl font-bold text-foreground mb-2">{edu.degree}</h3>
            <p className="text-lg text-foreground font-medium">{edu.institution}</p>
            <p className="text-sm text-primary font-mono mt-1">{edu.period}</p>
            {edu.cgpa && (
              <div className="inline-block mt-3 px-3 py-1 bg-primary/10 border border-primary/30 rounded-full">
                <p className="text-sm text-primary font-semibold font-mono tracking-wider">{translations[language].education.cgpa}: {edu.cgpa}</p>
              </div>
            )}
          </div>
          <div className="w-24 h-auto shrink-0 bg-white/5 p-2 rounded-lg backdrop-blur-sm border border-border/50">
            <img
              src={edu.id === "msc-robotics" ? "/Organization Logs/University_of_Manchester.svg" : "/Organization Logs/SRM University.svg"}
              alt={`${edu.institution} Logo`}
              className="w-full h-auto object-contain filter hover:grayscale-0 transition-all duration-300"
            />
          </div>
        </div>

        <div className="mb-8">
          <ul className="space-y-3">
            {edu.description.map((item: string, index: number) => (
              <li key={index} className="flex items-start">
                <span className="text-primary mr-3 mt-1 text-lg leading-none">•</span>
                <span className="text-foreground leading-relaxed" dangerouslySetInnerHTML={{ __html: item.replace(/<strong>(.*?)<\/strong>/g, '<strong class="font-bold text-foreground">$1</strong>') }} />
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-bold tracking-widest uppercase mb-4 text-foreground/70">{translations[language].education.keyAchievements}</h4>
          <div className="flex flex-wrap gap-2">
            {edu.achievements.map((achievement: string, index: number) => (
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
        title={t.title}
      />
    </section>
  );
}