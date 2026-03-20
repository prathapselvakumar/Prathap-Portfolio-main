import type { Metadata } from "next";
import { projects } from "@/lib/projects";
import ProjectLayout from "@/components/ui/project-layout";

export const metadata: Metadata = {
    title: "HybridNet: Adaptive Fusion | Portfolio",
    description: "A hybrid deep learning architecture combining CNNs and Bidirectional LSTMs with an adaptive gating mechanism for CIFAR-10 classification.",
};

const HybridNetProjectPage = () => {
    const project = projects.find((p) => p.id === 'hybridnet-cifar10');

    if (!project) {
        return null;
    }

    return <ProjectLayout project={project} />;
};

export default HybridNetProjectPage;
