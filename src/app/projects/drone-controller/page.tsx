"use client";

import React from "react";
import ProjectLayout from "@/components/ui/project-layout";
import { projects } from "@/lib/projects";
import DroneSimulator from "./DroneSimulator";

export default function DroneControllerPage() {
    const project = projects.find((p) => p.id === "drone-controller");

    if (!project) {
        return <div className="p-20 text-center">Project not found</div>;
    }

    return (
        <ProjectLayout 
            project={project} 
            customDemo={<DroneSimulator />} 
        />
    );
}
