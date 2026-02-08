export interface Project {
    id: string;
    title: string;
    description: string;
    image: string;
    categories: string[];
    size: 'large' | 'small';
}

export const projects: Project[] = [
    {
        id: 'autonomous-robot',
        title: 'Autonomous Robot',
        description: 'Self-navigating robot using SLAM and path planning algorithms with real-time obstacle detection',
        image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&q=80',
        categories: ['Robotics'],
        size: 'large'
    },
    {
        id: 'audio-search',
        title: 'Audio Search Engine',
        description: 'Voice-powered search with NLP and speech recognition',
        image: 'https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/a5838af0-769b-474e-a5fc-caa1e19c86e5/generated_images/modern-audio-search-engine-interface-wit-0e47d749-20251103021714.jpg',
        categories: ['AI/ML', 'Web Development'],
        size: 'small'
    },
    {
        id: 'agro-analytics',
        title: 'Agro Analytics Platform',
        description: 'AI-driven crop monitoring and predictive analytics system',
        image: 'https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/a5838af0-769b-474e-a5fc-caa1e19c86e5/generated_images/ai-powered-agricultural-analytics-dashbo-925fa72a-20251103021715.jpg',
        categories: ['AI/ML', 'Data Science'],
        size: 'small'
    }
];
