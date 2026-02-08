export interface ProjectLink {
  label: string;
  url: string;
  type: 'repository' | 'report' | 'demo' | 'other';
}

export interface ProjectMedia {
  type: 'image' | 'video';
  url: string;
  alt?: string;
  thumbnail?: string; // For videos
}

export interface Project {
  id: string;
  title: string;
  description: string;
  // Deprecated: use media array instead
  image: string; 
  media: ProjectMedia[];
  categories: string[];
  size: 'large' | 'small';
  goals?: string[];
  contribution?: string;
  links?: ProjectLink[];
}

export const projects: Project[] = [
  {
    id: 'autonomous-robot',
    title: 'Autonomous Robot',
    description: 'Self-navigating robot using SLAM and path planning algorithms with real-time obstacle detection',
    image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&q=80',
    media: [
      {
        type: 'image',
        url: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&q=80',
        alt: 'Autonomous Robot Front View'
      },
      {
        type: 'image',
        url: 'https://images.unsplash.com/photo-1534723452862-4c874018d66d?w=800&q=80',
        alt: 'Robot Navigation System'
      },
      {
        type: 'video',
        url: 'https://www.w3schools.com/html/mov_bbb.mp4', // Placeholder video
        thumbnail: 'https://images.unsplash.com/photo-1531746790731-6c087fecd65a?w=800&q=80'
      }
    ],
    categories: ['Robotics', 'AI/ML'],
    size: 'large',
    goals: [
      'Develop a robust SLAM algorithm for unknown environments',
      'Implement real-time obstacle avoidance with < 100ms latency',
      'Achieve autonomous navigation accuracy within 5cm'
    ],
    contribution: 'I led the development of the SLAM module using ROS and C++. I also designed the sensor fusion algorithm combining LiDAR and IMU data for improved localization accuracy.',
    links: [
      {
        label: 'GitHub Repository',
        url: 'https://github.com',
        type: 'repository'
      },
      {
        label: 'Technical Report',
        url: 'https://example.com/report.pdf',
        type: 'report'
      }
    ]
  },
  {
    id: 'audio-search',
    title: 'Audio Search Engine',
    description: 'Voice-powered search with NLP and speech recognition',
    image: 'https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/a5838af0-769b-474e-a5fc-caa1e19c86e5/generated_images/modern-audio-search-engine-interface-wit-0e47d749-20251103021714.jpg',
    media: [
      {
        type: 'image',
        url: 'https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/a5838af0-769b-474e-a5fc-caa1e19c86e5/generated_images/modern-audio-search-engine-interface-wit-0e47d749-20251103021714.jpg',
        alt: 'Audio Search Interface'
      }
    ],
    categories: ['AI/ML', 'Web Development'],
    size: 'small',
    goals: [
      'Create a seamless voice search experience',
      'Improve speech-to-text accuracy for technical terms',
      'Reduce search latency to under 500ms'
    ],
    contribution: 'Designed and implemented the NLP pipeline using Python and TensorFlow. Integrated the speech recognition API with the React frontend.',
    links: [
      {
        label: 'Live Demo',
        url: 'https://example.com/demo',
        type: 'demo'
      }
    ]
  },
  {
    id: 'agro-analytics',
    title: 'Agro Analytics Platform',
    description: 'AI-driven crop monitoring and predictive analytics system',
    image: 'https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/a5838af0-769b-474e-a5fc-caa1e19c86e5/generated_images/ai-powered-agricultural-analytics-dashbo-925fa72a-20251103021715.jpg',
    media: [
      {
        type: 'image',
        url: 'https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/a5838af0-769b-474e-a5fc-caa1e19c86e5/generated_images/ai-powered-agricultural-analytics-dashbo-925fa72a-20251103021715.jpg',
        alt: 'Analytics Dashboard'
      }
    ],
    categories: ['AI/ML', 'Data Science'],
    size: 'small',
    goals: [
      'Analyze satellite imagery for crop health monitoring',
      'Predict yield estimates based on weather patterns',
      'Provide actionable insights to farmers'
    ],
    contribution: 'Developed the computer vision models for crop disease detection. Built the data visualization dashboard using D3.js.',
    links: [
      {
        label: 'Project Repository',
        url: 'https://github.com',
        type: 'repository'
      }
    ]
  }
];
