export interface Publication {
    id: string;
    title: string;
    description: string;
    image: string;

    size: 'large' | 'small';
    url: string;
    authors: string[];
    date: string;
    publisher: string;
    team?: {
        title?: string;
        description?: string;
        members: {
            id: string;
            name: string;
            role: string;
            image: string;
            quote?: string;
        }[];
    };
}

export const publications: Publication[] = [
    {
        id: 'audio-clustering',
        title: 'Comparative Analysis Implementation of Queuing Songs in Players Using Audio Clustering Algorithm',
        description: 'Comparative study of k-means, DBSCAN, and adaptive algorithms for clustering audio data. Analyzes performance, accuracy, and efficiency to determine ideal grouping methods.',
        image: '/Thumbnails/Publication-Thumbnails/audio-clustering.png',
        size: 'large',
        url: 'https://doi.org/10.4018/979-8-3693-1301-5.ch004',
        authors: ['Dr.B. Aarthi', 'Prathap Selvakumar', 'S. Subiksha', 'S. Chhavi', 'Swetha Parathasarathy'],
        date: '2023',
        publisher: 'Advances in Artificial and Human Intelligence in the Modern Era',
        team: {
            title: "Author Team",
            description: "The researchers and engineers who contributed to this publication.",
            members: [
                {
                    id: "aarthi",
                    name: "Dr.B. Aarthi",
                    role: "Lead Researcher & Faculty Advisor",
                    quote: "This research addresses critical gaps in audio data clustering, providing a benchmark for intelligent multimedia systems.",
                    image: "/Team_and_Testimonial/dr-aarthi-b.jpg",
                },
                {
                    id: "prathap",
                    name: "Prathap Selvakumar",
                    role: "Robotics & ML Engineer",
                    quote: "Implementing and optimizing these algorithms for real-time audio analysis was a challenging yet rewarding experience.",
                    image: "/Team_and_Testimonial/prathapselvakumar.png",
                },
                {
                    id: "swetha",
                    name: "Swetha Parathasarathy",
                    role: "Associate Researcher",
                    quote: "The integration of adaptive clustering allows for more dynamic and user-centric music player experiences.",
                    image: "/Team_and_Testimonial/Swetha.jpg",
                },
                {
                    id: "subiksha",
                    name: "S. Subiksha",
                    role: "Associate Researcher",
                    quote: "Clustering spectral features allowed us to achieve unprecedented accuracy in categorical audio sorting.",
                    image: "/Team_and_Testimonial/subiksha.png",
                },
                {
                    id: "chhavi",
                    name: "S. Chhavi",
                    role: "Research Analyst",
                    quote: "Analyzing the asymptotic behavior across different clustering models provided deep insights into system scalability.",
                    image: "/Team_and_Testimonial/chhavi.jpg",
                },
            ]
        }
    }
];
