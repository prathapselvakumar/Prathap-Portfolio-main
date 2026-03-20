import type { Metadata } from "next";
import { projects } from "@/lib/projects";
import ProjectLayout from "@/components/ui/project-layout";

export const metadata: Metadata = {
    title: "Computer Vision Experiments | Portfolio",
    description: "A comparative study of Traditional Computer Vision (HOG+SVM) vs Deep Learning (CNN) for image classification on the CIFAR-10 dataset.",
};

const CVExperimentsProjectPage = () => {
    const project = projects.find((p) => p.id === 'computer-vision-experiments');

    if (!project) {
        return null;
    }

    return <ProjectLayout project={project} />;
};

export default CVExperimentsProjectPage;
