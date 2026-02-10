import { projects } from "@/lib/projects";
import { notFound } from "next/navigation";
import ProjectLayout from "@/components/project-layout";

/* ─── Page ─── */
const ProjectPage = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  const project = projects.find((p) => p.id === id);

  if (!project) {
    notFound();
  }

  return <ProjectLayout project={project} />;
};

export default ProjectPage;
