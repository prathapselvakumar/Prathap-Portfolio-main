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
}

export const publications: Publication[] = [
    {
        id: 'audio-clustering',
        title: 'Comparative Analysis Implementation of Queuing Songs in Players Using Audio Clustering Algorithm',
        description: 'Comparative study of k-means, DBSCAN, and adaptive algorithms for clustering audio data. Analyzes performance, accuracy, and efficiency to determine ideal grouping methods.',
        image: '/audio-clustering.png',
        size: 'large',
        url: 'https://doi.org/10.4018/979-8-3693-1301-5.ch004',
        authors: ['B. Aarthi', 'Prathap Selvakumar', 'S. Subiksha', 'S. Chhavi', 'Swetha Parathasarathy'],
        date: '2023',
        publisher: 'Advances in Artificial and Human Intelligence in the Modern Era'
    }
];
