export interface Project {
    id: string;
    title: string;
    description: string;
    image: string;
    categories: string[];
    size: 'large' | 'small';
    demoUrl?: string; // URL for "Run Demo" button
    repoUrl?: string; // URL for "GitHub" button
    videos?: {
        id: string;
        title: string;
        description: string;
        thumbnail: string;
        duration: string;
        url: string;
    }[];
    files?: {
        id: string;
        name: string;
        format: string;
        description: string;
        fileSize: string;
        icon: 'fusion' | 'cad';
        previewImage: string;
        downloadUrl: string;
        modelUrl?: string;
    }[];
    repos?: {
        id: string;
        name: string;
        description: string;
        language: string;
        languageColor: string;
        stars: number;
        url: string;
        topics: string[];
    }[];
    features?: {
        icon: any;
        title: string;
        desc: string;
    }[];
}

export const projects: Project[] =
    // modified for thumbnail 
    [
        {
            id: 'autonomous-robot',
            title: 'Autonomous Robot',
            description: 'Self-navigating robot using SLAM and path planning algorithms with real-time obstacle detection',
            image: 'https://upload.wikimedia.org/wikipedia/commons/4/4e/Leo-Rover.jpg',
            categories: ['Robotics'],
            size: 'large',
            repoUrl: 'https://github.com/prathapselvakumar/Leo-Rover.git',
            features: [
                { icon: 'Cpu', title: "SLAM Navigation", desc: "Simultaneous Localization and Mapping for autonomous movement." },
                { icon: 'Zap', title: "Real-time Processing", desc: "On-board processing of sensor data for immediate reaction." },
                { icon: 'Database', title: "Path Logging", desc: "Stores navigation paths and obstacle data for analysis." }
            ],
            videos: [
                {
                    id: "1",
                    title: "Computer Vision",
                    description: "The output of the object detection using YOLOv8.",
                    thumbnail: "/IMG_4876.JPG",
                    duration: "4:32",
                    url: "https://www.youtube.com/embed/qvzDwsoLuuM?si=Yi3NlumaOGGyOG8A"
                },
                {
                    id: "2",
                    title: "Lidars",
                    description: "Initial testing of the lidars.",
                    thumbnail: "/IMG_4876.JPG",
                    duration: "2:10",
                    url: "https://www.youtube.com/embed/VSYWAxqKxZ8?si=jUMfohMpg7cIfBh"
                },
                {
                    id: "3",
                    title: "Arm Movement Testing",
                    description: "Testing the movement of the arm.",
                    thumbnail: "/IMG_4876.JPG",
                    duration: "3:48",
                    url: "https://www.youtube.com/embed/XS9NESWWpK8?si=EJpZDgY3A2b5d7aR"
                },
                {
                    id: "4",
                    title: "Structural Construction",
                    description: "The construction of the robot.",
                    thumbnail: "/IMG_4876.JPG",
                    duration: "5:20",
                    url: "https://www.youtube.com/embed/JKL012XYZ"
                },
                {
                    id: "5",
                    title: "Trail Run",
                    description: "First run of the robot in a trail environment.",
                    thumbnail: "/IMG_4876.JPG",
                    duration: "7:15",
                    url: "https://www.youtube.com/embed/FMmaug6hqB4?si=TfzrjiVYwOa-qobM"
                }
            ],

            files: [
                { id: "1", name: "Arm mounting plate v7", format: ".step", description: "Mounting plate for the robotic arm assembly.", fileSize: "30 KB", icon: "cad", previewImage: "/Cad Files/arm-plate-thumb.svg", downloadUrl: "/Cad Files/Arm mounting plate v7.step", modelUrl: "/Cad Files/Arm mounting plate v7.glb" },
                { id: "2", name: "L camera mount v6", format: ".step", description: "L-shaped bracket for camera mounting.", fileSize: "44 KB", icon: "cad", previewImage: "/Cad Files/camera-mount-thumb.svg", downloadUrl: "/Cad Files/L camera mount v6.step", modelUrl: "/Cad Files/L camera mount v6.glb" },
                { id: "3", name: "LIDAR A2 mount v4_", format: ".step", description: "Mounting unit for LIDAR A2 sensor.", fileSize: "80 KB", icon: "cad", previewImage: "/Cad Files/lidar-mount-thumb.svg", downloadUrl: "/Cad Files/LIDAR A2 mount v4_.step", modelUrl: "/Cad Files/LIDAR A2 mount v4_.glb" },
                { id: "4", name: "NUC mounting plate v4", format: ".step", description: "Mounting plate for the NUC computer.", fileSize: "40 KB", icon: "cad", previewImage: "/Cad Files/nuc-plate-thumb.svg", downloadUrl: "/Cad Files/NUC mounting plate v4.step", modelUrl: "/Cad Files/NUC mounting plate v4.glb" },
            ],
            repos: [
                { id: "1", name: "Leo-Rover", description: "The complete source code for the Autonomous Robot project.", language: "C++", languageColor: "hsl(210 70% 55%)", stars: 0, url: "https://github.com/prathapselvakumar/Leo-Rover.git", topics: ["robotics", "autonomous", "leo-rover"] }
            ]
        },
        {
            id: 'audio-search',
            title: 'Audio Search Engine',
            description: 'Voice-powered search with NLP and speech recognition',
            image: 'https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/a5838af0-769b-474e-a5fc-caa1e19c86e5/generated_images/modern-audio-search-engine-interface-wit-0e47d749-20251103021714.jpg',
            categories: ['AI/ML'],
            size: 'small',
            repoUrl: 'https://github.com/prathapselvakumar/Audio-Search-Engine',
            videos: [],
            files: [],
            repos: []
        },
        {
            id: 'agro-analytics',
            title: 'Agro Analytics Platform',
            description: 'AI-driven crop monitoring and predictive analytics system',
            image: 'https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/a5838af0-769b-474e-a5fc-caa1e19c86e5/generated_images/ai-powered-agricultural-analytics-dashbo-925fa72a-20251103021715.jpg',
            categories: ['AI/ML'],
            size: 'small',
            repoUrl: 'https://github.com/prathapselvakumar/Agro-Analytics',
            videos: [],
            files: [],
            repos: []
        }
    ];

