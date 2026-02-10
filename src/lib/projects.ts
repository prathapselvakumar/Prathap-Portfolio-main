export interface Project {
    id: string;
    title: string;
    description: string;
    image: string;
    categories: string[];
    size: 'large' | 'small';
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

export const projects: Project[] = [
    {
        id: 'autonomous-robot',
        title: 'Autonomous Robot',
        description: 'Self-navigating robot using SLAM and path planning algorithms with real-time obstacle detection',
        image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&q=80',
        categories: ['Robotics'],
        size: 'large',
        features: [
            { icon: 'Cpu', title: "SLAM Navigation", desc: "Simultaneous Localization and Mapping for autonomous movement." },
            { icon: 'Zap', title: "Real-time Processing", desc: "On-board processing of sensor data for immediate reaction." },
            { icon: 'Database', title: "Path Logging", desc: "Stores navigation paths and obstacle data for analysis." }
        ],
        videos: [
            { id: "1", title: "Computer Vision", description: "The output of the object detection using YOLOv8.", thumbnail: "/IMG_4876.JPG", duration: "4:32", url: "/Object_Detection.MOV" },
            { id: "2", title: "Lidars", description: "Initial testing of the lidars.", thumbnail: "/IMG_4876.JPG", duration: "2:10", url: "/LIDAR.MOV" },
            { id: "3", title: "Arm Movement Testing", description: "Testing the movement of the arm.", thumbnail: "/IMG_4876.JPG", duration: "3:48", url: "/ARM.MOV" },
            { id: "4", title: "Strucal Construction", description: "The construction of the robot.", thumbnail: "/IMG_4876.JPG", duration: "5:20", url: "/Leo Construction Progress.MOV" },
            { id: "5", title: "Trail Run", description: "First run of the robot in a trail environment.", thumbnail: "/IMG_4876.JPG", duration: "7:15", url: "/Trail Run-1.MOV" },

        ],
        files: [
            { id: "1", name: "Housing Assembly", format: ".f3d", description: "Complete Fusion 360 assembly with all internal components and mounting points.", fileSize: "24.3 MB", icon: "fusion", previewImage: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=400&h=300&fit=crop", downloadUrl: "#" },
            { id: "2", name: "Gear Train", format: ".step", description: "STEP file of the precision gear train for cross-platform CAD compatibility.", fileSize: "8.7 MB", icon: "cad", previewImage: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=400&h=300&fit=crop", downloadUrl: "#" },
            { id: "3", name: "PCB Enclosure", format: ".f3d", description: "Custom enclosure designed in Fusion 360 for the controller PCB with ventilation.", fileSize: "12.1 MB", icon: "fusion", previewImage: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&h=300&fit=crop", downloadUrl: "#" },
            { id: "4", name: "Bracket Mount", format: ".stl", description: "3D-printable mounting bracket optimized for PLA/PETG with support-free geometry.", fileSize: "3.2 MB", icon: "cad", previewImage: "https://images.unsplash.com/photo-1631515243349-e0cb75fb8d3a?w=400&h=300&fit=crop", downloadUrl: "#" },
        ],
        repos: [
            { id: "1", name: "motor-controller-firmware", description: "Embedded firmware for brushless DC motor controller with FOC algorithm implementation.", language: "C++", languageColor: "hsl(210 70% 55%)", stars: 42, url: "https://github.com", topics: ["embedded", "motor-control", "stm32"] },
            { id: "2", name: "sensor-data-pipeline", description: "Real-time sensor data acquisition and processing pipeline with visualization dashboard.", language: "Python", languageColor: "hsl(50 70% 50%)", stars: 28, url: "https://github.com", topics: ["data-pipeline", "sensors", "visualization"] },
            { id: "3", name: "cad-automation-scripts", description: "Fusion 360 API scripts for automated CAD operations, parametric design, and batch exports.", language: "Python", languageColor: "hsl(50 70% 50%)", stars: 15, url: "https://github.com", topics: ["fusion360", "automation", "cad"] },
        ]
    },
    {
        id: 'audio-search',
        title: 'Audio Search Engine',
        description: 'Voice-powered search with NLP and speech recognition',
        image: 'https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/a5838af0-769b-474e-a5fc-caa1e19c86e5/generated_images/modern-audio-search-engine-interface-wit-0e47d749-20251103021714.jpg',
        categories: ['AI/ML', 'Web Development'],
        size: 'small',
        videos: [],
        files: [],
        repos: []
    },
    {
        id: 'agro-analytics',
        title: 'Agro Analytics Platform',
        description: 'AI-driven crop monitoring and predictive analytics system',
        image: 'https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/a5838af0-769b-474e-a5fc-caa1e19c86e5/generated_images/ai-powered-agricultural-analytics-dashbo-925fa72a-20251103021715.jpg',
        categories: ['AI/ML', 'Data Science'],
        size: 'small',
        videos: [],
        files: [],
        repos: []
    }
];
