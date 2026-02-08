import React from 'react';
import { projects } from '@/lib/data';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ExternalLink, Github, FileText, Globe } from 'lucide-react';
import { AnimatedThemeToggler } from '@/components/ui/animated-theme-toggler';
import { MediaGallery } from '@/components/MediaGallery';

interface ProjectPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { id } = await params;
  const project = projects.find((p) => p.id === id);

  if (!project) {
    notFound();
  }

  const getLinkIcon = (type: string) => {
    switch (type) {
      case 'repository':
        return <Github className="w-4 h-4" />;
      case 'report':
        return <FileText className="w-4 h-4" />;
      case 'demo':
        return <Globe className="w-4 h-4" />;
      default:
        return <ExternalLink className="w-4 h-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground p-8 md:p-16">
      {/* Theme Toggle */}
      <div className="fixed top-6 right-6 z-50">
        <AnimatedThemeToggler className="w-11 h-11 bg-card border border-border rounded-full hover:bg-accent transition-colors shadow-lg" />
      </div>

      <div className="max-w-4xl mx-auto">
        <Link href="/" className="inline-block mb-8">
          <Button variant="ghost" className="gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back to Portfolio
          </Button>
        </Link>

        <div className="space-y-8">
          {/* Media Gallery */}
          <MediaGallery media={project.media} title={project.title} />

          <div className="space-y-6">
            {/* Header Section */}
            <div className="flex flex-col gap-4">
              <div className="flex flex-wrap gap-2">
                {project.categories.map((category) => (
                  <span
                    key={category}
                    className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium"
                  >
                    {category}
                  </span>
                ))}
              </div>

              <h1 className="text-4xl md:text-5xl font-bold">{project.title}</h1>
              
              <p className="text-xl text-muted-foreground leading-relaxed">
                {project.description}
              </p>

              {/* Project Links */}
              {project.links && project.links.length > 0 && (
                <div className="flex flex-wrap gap-4 pt-2">
                  {project.links.map((link, index) => (
                    <a
                      key={index}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex"
                    >
                      <Button variant="outline" className="gap-2">
                        {getLinkIcon(link.type)}
                        {link.label}
                      </Button>
                    </a>
                  ))}
                </div>
              )}
            </div>

            {/* Detailed Content */}
            <div className="grid md:grid-cols-2 gap-8 pt-8 border-t border-border">
              {project.goals && project.goals.length > 0 && (
                <div className="space-y-4">
                  <h3 className="text-2xl font-semibold">Project Goals</h3>
                  <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                    {project.goals.map((goal, index) => (
                      <li key={index}>{goal}</li>
                    ))}
                  </ul>
                </div>
              )}

              {project.contribution && (
                <div className="space-y-4">
                  <h3 className="text-2xl font-semibold">My Contribution</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {project.contribution}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
