"use client";

import React, { useEffect } from "react";
import DroneSimulator from "../DroneSimulator";

export default function DroneSimulationFullscreen() {
    // Lock viewport and prevent scroll
    useEffect(() => {
        document.body.style.overflow = "hidden";
        document.body.style.margin = "0";
        document.body.style.padding = "0";
        return () => {
            document.body.style.overflow = "";
            document.body.style.margin = "";
            document.body.style.padding = "";
        };
    }, []);

    return (
        <div
            style={{
                position: "fixed",
                inset: 0,
                width: "100vw",
                height: "100vh",
                overflow: "hidden",
                display: "flex",
                flexDirection: "column",
            }}
        >
            <DroneSimulator fullscreen />
        </div>
    );
}
