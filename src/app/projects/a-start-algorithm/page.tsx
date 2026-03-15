import type { Metadata } from "next";
import { projects } from "@/lib/projects";
import ProjectLayout from "@/components/ui/project-layout";

export const metadata: Metadata = {
    title: "A-Star Algorithm | Portfolio",
    description: "Interactive A* path planning project with obstacle placement and route replay.",
};

const AStarProjectPage = () => {
    const project = projects.find((p) => p.id === 'a-start-algorithm');

    if (!project) {
        return null;
    }

    return <ProjectLayout project={project} />;
};

export default AStarProjectPage;
