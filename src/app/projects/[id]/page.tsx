'use client';

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { projects } from '@/lib/projects';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function ProjectPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const id = params.id;

  const project = projects.find((p) => p.id === id);

  if (!project) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground">
        <h1 className="text-4xl font-bold mb-4">Project Not Found</h1>
        <Button onClick={() => router.push('/#projects')}>Back to Projects</Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground p-8 md:p-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl mx-auto"
      >
        <Link href="/#projects" className="inline-block mb-8">
          <Button variant="ghost" className="gap-2 pl-0 hover:pl-2 transition-all">
            <ArrowLeft className="w-4 h-4" />
            Back to Projects
          </Button>
        </Link>

        <div className="rounded-2xl overflow-hidden border border-border bg-card mb-8">
          <div className="relative h-[400px] md:h-[500px] w-full">
            <img
              src={project.image}
              alt={project.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
            <div className="absolute bottom-0 left-0 p-8">
              <div className="flex flex-wrap gap-2 mb-4">
                {project.categories.map((cat) => (
                  <span
                    key={cat}
                    className="px-3 py-1 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full text-xs text-white"
                  >
                    {cat}
                  </span>
                ))}
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">{project.title}</h1>
            </div>
          </div>
        </div>

        <div className="prose prose-invert max-w-none">
          <h2 className="text-2xl font-bold mb-4 text-foreground">Overview</h2>
          <p className="text-lg text-muted-foreground leading-relaxed mb-8">
            {project.description}
          </p>

          <div className="bg-card border border-border rounded-xl p-6 mb-8">
            <h3 className="text-xl font-semibold mb-4 text-foreground">Technical Details</h3>
            <p className="text-muted-foreground">
              Detailed technical specifications and implementation details for {project.title} will be added here.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
