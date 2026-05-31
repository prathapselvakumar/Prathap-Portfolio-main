import React from 'react';
import { Timeline } from '@/components/ui/timeline';
import { useLanguage } from '@/contexts/LanguageContext';
import { translations } from '@/lib/translations';

export function Experience() {
  const { language } = useLanguage();
  const t = translations[language].experience;

  const timelineData = t.items.map((exp: any) => ({
    title: exp.period.split(" ")[0].split("-")[1] || exp.period.split(" ")[0].replace(/年$/, ""), // Extract just the year/month start
    content: (
      <div className="bg-card border border-border rounded-xl p-6 lg:p-8 animate-fade-in shadow-sm hover:shadow-md transition-shadow">
        <div className="flex flex-col sm:flex-row sm:items-start gap-6 mb-6">
          <div className="w-24 h-auto shrink-0 bg-white/5 p-2 rounded-lg backdrop-blur-sm border border-border/50">
            <img
              src={exp.id === "csq-swe" || exp.id === "csq-intern" ? "/Organization Logs/C-Square Info solution.png" : (exp.id === "qentelli-intern" ? "/Organization Logs/Qentelli.png" : "/Organization Logs/National University of Singapore.svg")}
              alt={`${exp.company} Logo`}
              className="w-full h-auto object-contain filter hover:grayscale-0 transition-all duration-300"
            />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-foreground mb-2">{exp.title}</h3>
            <p className="text-lg text-foreground font-medium">{exp.company}</p>
            <p className="text-sm text-primary font-mono mt-1">{exp.period}</p>
          </div>
        </div>

        <div className="mb-8">
          <h4 className="text-sm font-bold tracking-widest uppercase mb-4 text-foreground/70">{t.keyResponsibilities}</h4>
          <ul className="space-y-3">
            {exp.description.map((item: string, index: number) => (
              <li key={index} className="flex items-start">
                <span className="text-primary mr-3 mt-1 text-lg leading-none">•</span>
                <span className="text-foreground leading-relaxed" dangerouslySetInnerHTML={{ __html: item.replace(/<strong>(.*?)<\/strong>/g, '<strong class="font-bold text-foreground">$1</strong>') }} />
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-bold tracking-widest uppercase mb-4 text-foreground/70">{t.technologies}</h4>
          <div className="flex flex-wrap gap-2">
            {exp.technologies.map((tech: string, index: number) => (
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
        title={t.title}
      />
    </section>
  );
}