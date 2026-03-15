import { projects } from "@/lib/projects";
import { notFound } from "next/navigation";
import ProjectLayout from "@/components/ui/project-layout";

export const metadata = {
    title: "LEO Rover Exploded View | Prathap Selvakumar",
    description: "Explore the internal engineering of the LEO Rover with an interactive 3D exploded view on scroll.",
};

export default function LeoRoverPage() {
    const project = projects.find((p) => p.id === "autonomous-robot");

    if (!project) {
        notFound();
    }

    return <ProjectLayout project={project} />;
}
