"use client";

import React from "react";
import ProjectLayout from "@/components/ui/project-layout";
import { projects } from "@/lib/projects";

export default function Coursework1Page() {
    const project = projects.find((p) => p.id === "ros2-coursework1");

    if (!project) {
        return <div className="p-20 text-center">Project not found</div>;
    }

    return (
        <ProjectLayout 
            project={project} 
        />
    );
}
