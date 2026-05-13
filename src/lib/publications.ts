export interface Publication {
    id: string;
    title: string;
    description: string;
    description_ja?: string;
    image: string;

    size: 'large' | 'small';
    url: string;
    authors: string[];
    date: string;
    publisher: string;
    team?: {
        title?: string;
        title_ja?: string;
        description?: string;
        description_ja?: string;
        members: {
            id: string;
            name: string;
            name_ja?: string;
            role: string;
            role_ja?: string;
            image: string;
            quote?: string;
            quote_ja?: string;
        }[];
    };
}

export const publications: Publication[] = [
    {
        id: 'audio-clustering',
        title: 'Comparative Analysis Implementation of Queuing Songs in Players Using Audio Clustering Algorithm',
        description: 'Comparative study of k-means, DBSCAN, and adaptive algorithms for clustering audio data. Analyzes performance, accuracy, and efficiency to determine ideal grouping methods.',
        description_ja: 'オーディオデータのクラスタリングにおけるk-means、DBSCAN、および適応型アルゴリズムの比較研究。理想的なグループ化手法を特定するために、パフォーマンス、精度、および効率を分析します。',
        image: '/Thumbnails/Publication-Thumbnails/audio-clustering.png',
        size: 'large',
        url: 'https://doi.org/10.4018/979-8-3693-1301-5.ch004',
        authors: ['Dr.B. Aarthi', 'Prathap Selvakumar', 'S. Subiksha', 'S. Chhavi', 'Swetha Parathasarathy'],
        date: '2023',
        publisher: 'Advances in Artificial and Human Intelligence in the Modern Era',
        team: {
            title: "Author Team",
            title_ja: "著者チーム",
            description: "The researchers and engineers who contributed to this publication.",
            description_ja: "この論文に貢献した研究者とエンジニア。",
            members: [
                {
                    id: "aarthi",
                    name: "Dr.B. Aarthi",
                    role: "Lead Researcher & Faculty Advisor",
                    role_ja: "主任研究員・指導教員",
                    quote: "This research addresses critical gaps in audio data clustering, providing a benchmark for intelligent multimedia systems.",
                    quote_ja: "本研究はオーディオデータクラスタリングにおける重要なギャップに対処し、インテリジェントなマルチメディアシステムのベンチマークを提供します。",
                    image: "/Team_and_Testimonial/dr-aarthi-b.jpg",
                },
                {
                    id: "prathap",
                    name: "Prathap Selvakumar",
                    role: "Robotics & ML Engineer",
                    role_ja: "ロボット工学・機械学習エンジニア",
                    quote: "Implementing and optimizing these algorithms for real-time audio analysis was a challenging yet rewarding experience.",
                    quote_ja: "リアルタイムオーディオ分析のためにこれらのアルゴリズムを実装し最適化することは、困難でしたがやりがいのある経験でした。",
                    image: "/Team_and_Testimonial/prathapselvakumar.png",
                },
                {
                    id: "swetha",
                    name: "Swetha Parathasarathy",
                    role: "Associate Researcher",
                    role_ja: "副研究員",
                    quote: "The integration of adaptive clustering allows for more dynamic and user-centric music player experiences.",
                    quote_ja: "適応型クラスタリングの統合により、よりダイナミックでユーザー中心のミュージックプレイヤー体験が可能になります。",
                    image: "/Team_and_Testimonial/Swetha.jpg",
                },
                {
                    id: "subiksha",
                    name: "S. Subiksha",
                    role: "Associate Researcher",
                    role_ja: "副研究員",
                    quote: "Clustering spectral features allowed us to achieve unprecedented accuracy in categorical audio sorting.",
                    quote_ja: "スペクトル特徴のクラスタリングにより、カテゴリー別のオーディオソートにおいて前例のない精度を達成することができました。",
                    image: "/Team_and_Testimonial/subiksha.png",
                },
                {
                    id: "chhavi",
                    name: "S. Chhavi",
                    role: "Research Analyst",
                    role_ja: "研究アナリスト",
                    quote: "Analyzing the asymptotic behavior across different clustering models provided deep insights into system scalability.",
                    quote_ja: "異なるクラスタリングモデルにわたる漸近的挙動を分析することで、システムの拡張性に関する深い洞察が得られました。",
                    image: "/Team_and_Testimonial/chhavi.jpg",
                },
            ]
        }
    }
];
