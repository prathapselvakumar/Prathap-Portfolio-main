/**
 * Defines the structure for a portfolio project.
 * Ensure all required fields are populated when adding a new project.
 * 
 * @interface Project
 */
export interface Project {
    id: string;
    title: string;
    title_ja?: string;
    description: string;
    description_ja?: string;
    image: string;
    categories: string[];
    size: 'large' | 'small';
    demoUrl?: string; // URL for "Run Demo" button
    repoUrl?: string; // URL for "GitHub" button
    videos?: {
        id: string;
        title: string;
        title_ja?: string;
        description: string;
        description_ja?: string;
        duration: string;
        url: string;
        filter?: string;
    }[];
    files?: {
        id: string;
        name: string;
        name_ja?: string;
        format: string;
        description: string;
        description_ja?: string;
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
        description_ja?: string;
        language: string;
        languageColor: string;
        stars: number;
        forks: number;
        url: string;
        topics: string[];
    }[];
    features?: {
        icon: any;
        title: string;
        title_ja?: string;
        desc: string;
        desc_ja?: string;
    }[];
    terminalOutput?: { type: "cmd" | "info" | "success" | "result" | "divider"; text: string; text_ja?: string }[];
    terminalVideo?: string; // New field to replace terminal with a video
    codeSnippets?: { id: string; title: string; title_ja?: string; description: string; description_ja?: string; language: string; code: string }[];
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
            quote?: string; // Kept quote for historical context/use elsewhere
            quote_ja?: string;
        }[];
    };
}


/**
 * Array of all portfolio projects.
 * These are mapped over in the PortfolioContent component to create the project grid.
 */
export const projects: Project[] =
    // modified for thumbnail 
    [
        {
            id: 'autonomous-robot',
            title: 'Autonomous Robot',
            title_ja: '自律走行ロボット',
            description: 'Self-navigating robot using SLAM and path planning algorithms with real-time obstacle detection',
            description_ja: 'SLAMと経路計画アルゴリズム、リアルタイム障害物検知を用いた自律走行ロボット',
            image: '/Thumbnails/Project Thumbnails/maxresdefault.jpg',
            categories: ['Robotics'],
            size: 'large',
            repoUrl: 'https://github.com/sarathkumar-sk/Team_6_AERO62520_RSD_Project',
            features: [
                { icon: 'Cpu', title: "SLAM Navigation", title_ja: "SLAMナビゲーション", desc: "Simultaneous Localization and Mapping for autonomous movement.", desc_ja: "自律走行のための自己位置推定と環境地図作成を同時に実行。" },
                { icon: 'Zap', title: "Real-time Processing", title_ja: "リアルタイム処理", desc: "On-board processing of sensor data for immediate reaction.", desc_ja: "即座な反応を可能にするセンサーデータのオンボード処理。" },
                { icon: 'Database', title: "Path Logging", title_ja: "パスロギング", desc: "Stores navigation paths and obstacle data for analysis.", desc_ja: "分析のために走行経路と障害物データを保存。" }
            ],
            videos: [
                {
                    id: "1",
                    title: "Perception System (Rover's PoV)",
                    title_ja: "認識システム (ローバー視点)",
                    description: "Object detection and LIDAR perception capabilities from the Rover's point of view.",
                    description_ja: "ローバーの視点からの物体検出とLiDAR認識機能。",
                    duration: "Live",
                    url: "https://www.youtube.com/embed/Jkbf77HW8Nw?si=0PGOqbZgni4xtVDR",
                    filter: "Perception"
                },
                {
                    id: "3",
                    title: "Arm Movement Testing",
                    title_ja: "アーム動作テスト",
                    description: "Testing the movement of the arm.",
                    description_ja: "ロボットアームの動作テスト。",
                    duration: "3:48",
                    url: "https://www.youtube.com/embed/XS9NESWWpK8?si=EJpZDgY3A2b5d7aR",
                    filter: "Manipulation"
                },
                {
                    id: "4",
                    title: "Structural Construction",
                    title_ja: "構造の組み立て",
                    description: "The construction of the robot.",
                    description_ja: "ロボットの構造組み立てプロセス。",
                    duration: "5:20",
                    url: "https://www.youtube.com/embed/vs7O9ohwxwc?si=1lukm8WUqp22UDjS",
                    filter: "System Level"
                },
                {
                    id: "5",
                    title: "Trail Run",
                    title_ja: "走行テスト",
                    description: "First run of the robot in a trail environment.",
                    description_ja: "テスト環境でのロボットの初走行。",
                    duration: "7:15",
                    url: "https://www.youtube.com/embed/FMmaug6hqB4?si=TfzrjiVYwOa-qobM",
                    filter: "System Level"
                },
                {
                    id: "6",
                    title: "Navigation Simulation",
                    title_ja: "ナビゲーションシミュレーション",
                    description: "Autonomous Mobile Robot navigation simulation in a controlled environment.",
                    description_ja: "管理された環境での自律走行ロボットのナビゲーションシミュレーション。",
                    duration: "1:45",
                    url: "https://www.youtube.com/embed/x4h67LoeZBI?si=8KE50BYbr0_2nMhd",
                    filter: "Navigation"
                },
                {
                    id: "7",
                    title: "Autonomous Navigation",
                    title_ja: "自律走行",
                    description: "Autonomous Mobile Robot navigation simulation - Alternative scenario.",
                    description_ja: "自律走行ロボットのナビゲーションシミュレーション - 別シナリオ。",
                    duration: "2:15",
                    url: "https://www.youtube.com/embed/JKKeyHDO91U?si=27LqnjHdYJ1Jo4Sp",
                    filter: "Navigation"
                },
                {
                    id: "8",
                    title: "Navigation toward to block",
                    title_ja: "ブロックへのナビゲーション",
                    description: "Autonomous Mobile Robot navigation toward a specific block.",
                    description_ja: "特定のブロックに向けた自律走行ロボットのナビゲーション。",
                    duration: "1:20",
                    url: "https://www.youtube.com/embed/XdL26rWp_r4?si=e_KfrP3zyFPaZeQ3",
                    filter: "Navigation"
                },
                {
                    id: "9",
                    title: "Return to intial position after mission (Simulation Demo) ",
                    title_ja: "ミッション後の初期位置への帰還 (シミュレーションデモ)",
                    description: "Simulation of the robot's navigation path.",
                    description_ja: "ロボットの走行経路のシミュレーション。",
                    duration: "Live",
                    url: "https://www.youtube.com/embed/4J8ch9rUiek?si=cN7iUfXhKyTlOndf",
                    filter: "Navigation"
                },
                {
                    id: "10",
                    title: "Arm Manipulation (Simulation)",
                    title_ja: "アーム操作 (シミュレーション)",
                    description: "Simulation of the robot's arm manipulation.",
                    description_ja: "ロボットアームの操作シミュレーション。",
                    duration: "Live",
                    url: "https://www.youtube.com/embed/PHqzU4Cxsj4?si=AA06VIJK6sAWlKeE",
                    filter: "Manipulation"
                },
                {
                    id: "11",
                    title: "Emergency brake (Simulation)",
                    title_ja: "緊急ブレーキ (シミュレーション)",
                    description: "Demonstration of the robot's safety features and protocols.",
                    description_ja: "ロボットの安全機能とプロトコルの実演。",
                    duration: "Live",
                    url: "https://www.youtube.com/embed/n0pm3tVpszg?si=VqiDjv09iCeroLaZ",
                    filter: "Safety"
                }

            ],

            files: [
                { id: "5", name: "Autonomous Mobile Robot", name_ja: "自律走行モバイルロボット", format: ".step", description: "Complete assembly of the Autonomous Mobile Robot.", description_ja: "自律走行モバイルロボットの完全な組み立て図。", fileSize: "2.4 MB", icon: "cad", previewImage: "/Autonomous-Mobile-Robot/Cad Files/robot-assembly-thumb.svg", downloadUrl: "#", modelUrl: "#" },
                { id: "1", name: "Arm mounting plate v7", name_ja: "アーム取付プレート v7", format: ".step", description: "Mounting plate for the robotic arm assembly.", description_ja: "ロボットアームアセンブリ用の取付プレート。", fileSize: "30 KB", icon: "cad", previewImage: "/Autonomous-Mobile-Robot/Products/Robotic ARM.png", downloadUrl: "/Autonomous-Mobile-Robot/Cad Files/Arm mounting plate v7.step", modelUrl: "/Autonomous-Mobile-Robot/Cad Files/Arm mounting plate v7.glb" },
                { id: "2", name: "L camera mount v6", name_ja: "L型カメラマウント v6", format: ".step", description: "L-shaped bracket for camera mounting.", description_ja: "カメラ取り付け用のL型ブラケット。", fileSize: "44 KB", icon: "cad", previewImage: "/Autonomous-Mobile-Robot/Products/Camera.png", downloadUrl: "/Autonomous-Mobile-Robot/Cad Files/L camera mount v6.step", modelUrl: "/Autonomous-Mobile-Robot/Cad Files/L camera mount v6.glb" },
                { id: "3", name: "LIDAR A2 mount v4_", name_ja: "LIDAR A2 マウント v4_", format: ".step", description: "Mounting unit for LIDAR A2 sensor.", description_ja: "LIDAR A2センサー用の取り付けユニット。", fileSize: "80 KB", icon: "cad", previewImage: "/Autonomous-Mobile-Robot/Products/Lidars.png", downloadUrl: "/Autonomous-Mobile-Robot/Cad Files/LIDAR A2 mount v4_.step", modelUrl: "/Autonomous-Mobile-Robot/Cad Files/LIDAR A2 mount v4_.glb" },
                { id: "4", name: "NUC mounting plate v4", name_ja: "NUC取付プレート v4", format: ".step", description: "Mounting plate for the NUC computer.", description_ja: "NUCコンピュータ用の取付プレート。", fileSize: "40 KB", icon: "cad", previewImage: "/Autonomous-Mobile-Robot/Cad Files/nuc-plate-thumb.svg", downloadUrl: "/Autonomous-Mobile-Robot/Cad Files/NUC mounting plate v4.step", modelUrl: "/Autonomous-Mobile-Robot/Cad Files/NUC mounting plate v4.glb" },
            ],
            repos: [
                { id: "1", name: "Leo-Rover", description: "The complete source code for the Autonomous Robot project, featuring ROS2 integration, SLAM navigation, and hardware control systems.", description_ja: "ROS2統合、SLAMナビゲーション、ハードウェア制御システムを特徴とする、自律走行ロボットプロジェクトの完全なソースコード。", language: "C++", languageColor: "hsl(210 70% 55%)", stars: 0, forks: 0, url: "https://github.com/prathapselvakumar/Leo-Rover.git", topics: ["robotics", "autonomous", "leo-rover", "ros2", "cpp"] },
                { id: "2", name: "Object-Detection-for-Leo-Rover", description: "Computer vision and object detection models deployed on the Leo Rover using YOLOv8 and custom datasets.", description_ja: "YOLOv8とカスタムデータセットを使用してLeo Roverに展開された、コンピュータビジョンと物体検出モデル。", language: "Python", languageColor: "hsl(50 70% 50%)", stars: 0, forks: 0, url: "https://github.com/prathapselvakumar/Object-Detection-for-Leo-Rover.git", topics: ["yolov8", "ros2", "computer-vision", "python", "ai"] }
            ],
            terminalOutput: [
                { type: "cmd", text: "ros2 launch leo_rover_object_detection yolo_v8.launch.py", text_ja: "ros2 launch leo_rover_object_detection yolo_v8.launch.py" },
                { type: "info", text: "[INFO] [launch]: All log files can be found below /root/.ros/log/...", text_ja: "[情報] [起動]: すべてのログファイルは /root/.ros/log/... にあります" },
                { type: "info", text: "[INFO] [launch]: Defaulting to ROS_DOMAIN_ID=0", text_ja: "[情報] [起動]: デフォルトの ROS_DOMAIN_ID=0 を使用します" },
                { type: "success", text: "[yolov8_node]: Node started successfully. Loading weights 'yolov8n.pt'", text_ja: "[yolov8_node]: ノードが正常に開始されました。重み 'yolov8n.pt' を読み込み中" },
                { type: "info", text: "[camera_node]: Subscribing to /camera/image_raw", text_ja: "[camera_node]: /camera/image_raw をサブスクライブ中" },
                { type: "divider", text: "─".repeat(56), text_ja: "─".repeat(56) },
                { type: "success", text: "[yolov8_node]: Inference Engine initialized on Edge TPU", text_ja: "[yolov8_node]: 推論エンジンが Edge TPU 上で初期化されました" },
                { type: "result", text: "Detected: 'Person' at [120, 45, 230, 450] - Confidence: 0.92", text_ja: "検出: '人' [120, 45, 230, 450] - 信頼度: 0.92" },
                { type: "result", text: "Detected: 'Stop Sign' at [400, 100, 480, 180] - Confidence: 0.88", text_ja: "検出: '一時停止標識' [400, 100, 480, 180] - 信頼度: 0.88" },
                { type: "info", text: "[nav2_costmap]: Updating local costmap with obstacles...", text_ja: "[nav2_costmap]: 障害物でローカルコストマップを更新中..." },
                { type: "success", text: "[nav2_planner]: Recalculating path to avoid 'Stop Sign'", text_ja: "[nav2_planner]: '一時停止標識' を回避するために経路を再計算中" },
                { type: "divider", text: "─".repeat(56), text_ja: "─".repeat(56) },
                { type: "info", text: "📌 This is sample terminal output showing live object detection.", text_ja: "📌 これはリアルタイム物体検出を示すサンプルターミナル出力です。" },
                { type: "info", text: "For full ROS2 nodes & launch files, visit GitHub ↓", text_ja: "完全な ROS2 ノードと起動ファイルについては、GitHub をご覧ください ↓" },
                { type: "result", text: "→ github.com/prathapselvakumar/Object-Detection-for-Leo-Rover", text_ja: "→ github.com/prathapselvakumar/Object-Detection-for-Leo-Rover" },
            ],
            codeSnippets: [
                {
                    id: "1",
                    title: "yolov8_node.py",
                    title_ja: "yolov8_node.py",
                    description: "ROS2 node for subscribing to camera stream and running object detection",
                    description_ja: "カメラストリームをサブスクライブし、物体検出を実行するための ROS2 ノード",
                    language: "Python",
                    code: `import rclpy
from rclpy.node import Node
from sensor_msgs.msg import Image
from cv_bridge importCvBridge
import cv2
from ultralytics import YOLO
from vision_msgs.msg import Detection2DArray

class YoloV8Node(Node):
    def __init__(self):
        super().__init__('yolov8_node')
        self.bridge = CvBridge()
        self.model = YOLO('yolov8n.pt') # Load YOLOv8 Nano
        
        # Subscribe to camera
        self.subscription = self.create_subscription(
            Image, '/camera/image_raw', self.image_callback, 10)
        
        # Publisher for detections
        self.detection_pub = self.create_publisher(
            Detection2DArray, '/detections', 10)
        
        self.get_logger().info("YOLOv8 Node Initialized.")

    def image_callback(self, msg):
        try:
            cv_image = self.bridge.imgmsg_to_cv2(msg, "bgr8")
            results = self.model(cv_image)
            
            for r in results:
                for box in r.boxes:
                    conf = box.conf[0]
                    if conf > 0.5:
                        self.get_logger().info(f"Detected class {box.cls} - Conf {conf:.2f}")
                        
        except Exception as e:
            self.get_logger().error(f"Failed to process image: {e}")

def main(args=None):
    rclpy.init(args=args)
    node = YoloV8Node()
    rclpy.spin(node)
    node.destroy_node()
    rclpy.shutdown()

if __name__ == '__main__':
    main()`
                }
            ],
            team: {
                title: "Team",
                title_ja: "チーム",
                description: "The dedicated team of engineers and innovators behind the Autonomous Robot project.",
                description_ja: "自律走行ロボットプロジェクトを支える、エンジニアと革新者の専属チーム。",
                members: [
                    {
                        id: "prathap",
                        quote: "Responsible for developing and managing the Computer Vision and Navigation systems",
                        quote_ja: "コンピュータビジョンとナビゲーションシステムの開発および管理を担当",
                        name: "Prathap Selvakumar",
                        role: "Computer Vision and Navigation",
                        role_ja: "コンピュータビジョン・ナビゲーション",
                        image: "/Team_and_Testimonial/prathapselvakumar.png",
                    },
                    {
                        id: "joao",
                        quote: "Oversaw component design, additive manufacturing (3D printing), and hand–eye calibration for accurate robotic perception and manipulation.",
                        quote_ja: "正確なロボットの認識と操作のためのコンポーネント設計、付加製造（3Dプリント）、およびハンドアイキャリブレーションを監督。",
                        name: "Joao Lopes",
                        role: "Designing , 3D printing the components and Hand-Eye Calibration",
                        role_ja: "設計・3Dプリント・ハンドアイキャリブレーション",
                        image: "/Team_and_Testimonial/JoaoLopes.jpeg",
                    },
                    {
                        id: "sarath",
                        quote: "Developed and optimized SLAM and navigation for autonomous robot movement",
                        quote_ja: "自律走行ロボットの動きのためのSLAMとナビゲーションの開発および最適化",
                        name: "Sarath Kumar",
                        role: "Navigation and SLAM",
                        role_ja: "ナビゲーション・SLAM",
                        image: "/Team_and_Testimonial/Sarathkumar.jpeg",
                    },
                    {
                        id: "ruyang",
                        quote: "Specializing in Navigation and spatial awareness for real-time robotic navigation.",
                        quote_ja: "リアルタイムロボットナビゲーションのためのナビゲーションと空間認識を専門とする。",
                        name: "Ruiyang",
                        role: "Navigation and spatial awareness",
                        role_ja: "ナビゲーション・空間認識",
                        image: "/Team_and_Testimonial/ruyang.jpg",
                    },
                    {
                        id: "jiaxin",
                        quote: "Concentrated on SLAM, spatial mapping, and real-time robotic localization",
                        quote_ja: "SLAM、空間マッピング、およびリアルタイムロボット自己位置推定に注力",
                        name: "Jiaxin Tang",
                        role: "SLAM and spatial awareness",
                        role_ja: "SLAM・空間認識",
                        image: "/Team_and_Testimonial/Jiaxin Tang.jpeg",
                    },
                ]
            }
        },
        {
            id: 'audio-search',
            title: 'Audio Search Engine',
            title_ja: '音声検索エンジン',
            description: 'Voice-powered search with NLP and speech recognition',
            description_ja: 'NLP（自然言語処理）と音声認識を用いた音声検索システム',
            image: 'https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/a5838af0-769b-474e-a5fc-caa1e19c86e5/generated_images/modern-audio-search-engine-interface-wit-0e47d749-20251103021714.jpg',
            categories: ['AI/ML'],
            size: 'small',
            repoUrl: 'https://github.com/prathapselvakumar/Audio-Search-Engine',
            features: [
                { icon: 'Mic', title: "Speech Recognition", title_ja: "音声認識", desc: "State-of-the-art NLP models for high-precision voice-to-text conversion in noisy environments.", desc_ja: "騒がしい環境でも高精度な音声テキスト変換を可能にする、最先端のNLPモデル。" },
                { icon: 'Zap', title: "Semantic Search", title_ja: "セマンティック検索", desc: "Goes beyond keywords to understand the context and intent behind every voice query.", desc_ja: "キーワードを超えて、すべての音声クエリの背後にある文脈と意図を理解します。" },
                { icon: 'Database', title: "Scalable Indexing", title_ja: "スケーラブルなインデックス作成", desc: "Fast and memory-efficient indexing architecture for searching through millions of audio files.", desc_ja: "何百万もの音声ファイルを検索するための、高速でメモリ効率の高いインデックス作成アーキテクチャ。" },
                { icon: 'Search', title: "Audio Fingerprinting", title_ja: "オーディオフィンガープリンティング", desc: "Identify audio clips through unique acoustic signatures with minimal data requirements.", desc_ja: "最小限のデータ要件で、独自の音響シグネチャを通じてオーディオクリップを識別します。" },
            ],
            codeSnippets: [
                {
                    id: "1",
                    title: "audio_processor.py",
                    title_ja: "audio_processor.py",
                    description: "Main logic for audio feature extraction and indexing.",
                    description_ja: "音声特徴抽出とインデックス作成のメインロジック。",
                    language: "Python",
                    code: `import numpy as np\nimport librosa\n\ndef extract_features(audio_path):\n    y, sr = librosa.load(audio_path)\n    mfcc = librosa.feature.mfcc(y=y, sr=sr, n_mfcc=13)\n    return np.mean(mfcc.T, axis=0)`
                }
            ],
            terminalOutput: [
                { type: "cmd", text: "python3 search.py --query 'classical music'", text_ja: "python3 search.py --query 'classical music'" },
                { type: "info", text: "[INFO] Processing audio query...", text_ja: "[情報] 音声クエリを処理中..." },
                { type: "success", text: "[SUCCESS] Match found: 'Beethoven_Symphony5.mp3' (Score: 0.98)", text_ja: "[成功] 一致が見つかりました: 'Beethoven_Symphony5.mp3' (スコア: 0.98)" }
            ],
            videos: [],
            files: [],
            repos: []
        },
        {
            id: 'a-start-algorithm',
            title: 'A-Star Algorithm',
            title_ja: 'A*（A-star）アルゴリズム',
            description: 'Interactive A* path planner for grid navigation with obstacle placement and route replay',
            description_ja: '障害物設置とルート再生機能を備えた、格子状ナビゲーション用インタラクティブA*経路プランナー',
            image: '/Thumbnails/Project Thumbnails/a-star-path-planning.svg',
            categories: ['Algorithms'],
            size: 'small',
            repoUrl: 'https://github.com/prathapselvakumar/AMR-Coursework-2',
            features: [
                { icon: 'Cpu', title: "A* Path Planning", title_ja: "A*経路計画", desc: "Computes shortest paths on a dynamic grid using heuristic-based search.", desc_ja: "ヒューリスティックベースの探索を使用して、動的な格子上の最短経路を計算します。" },
                { icon: 'Activity', title: "Interactive Controls", title_ja: "インタラクティブコントロール", desc: "Set start/end points, paint obstacles, and launch live route calculations.", desc_ja: "開始点/終了点の設定、障害物の描画、リアルタイムのルート計算の開始が可能です。" },
                { icon: 'Activity', title: "Path Validation", title_ja: "経路検証", desc: "Validates and visualizes each computed step with clear state feedback and messages.", desc_ja: "計算された各ステップを検証し、明確な状態フィードバックとメッセージで視覚化します。" },
                { icon: 'Layers', title: "Grid Resizing", title_ja: "格子サイズ変更", desc: "Adjust grid dimensions at runtime to test algorithm behavior on different planning resolutions.", desc_ja: "実行時に格子の寸法を調整し、異なる計画解像度でアルゴリズムの動作をテストできます。" },
                { icon: 'Wifi', title: "Path Cost Diagnostics", title_ja: "経路コスト診断", desc: "Tracks algorithm iteration costs and highlights when heuristic costs lead to faster route convergence.", desc_ja: "アルゴリズムの反復コストを追跡し、ヒューリスティックコストがより速いルート収束につながる場合を強調します。" },
            ],
            codeSnippets: [
                {
                    id: "1",
                    title: "PathPlannerApp.tsx",
                    title_ja: "PathPlannerApp.tsx",
                    description: "Interactive React implementation of A* grid path planning.",
                    description_ja: "A*格子経路計画のインタラクティブなReact実装。",
                    language: "TypeScript",
                    code: `type Cell = [number, number];

function heuristic(a: Cell, b: Cell): number {
    const dx = a[0] - b[0];
    const dy = a[1] - b[1];
    return Math.sqrt(dx * dx + dy * dy);
}

function doAStar(
    start: Cell,
    end: Cell
) {
    // Explore open set using g-cost + heuristic
    const openSet: Cell[] = [start];
    ...
}`
                }
            ],
            terminalOutput: [],
            videos: [],
            files: [],
            repos: []
        },
        {
            id: 'agro-analytics',
            title: 'Agro Analytics ',
            description: 'AI-driven crop monitoring and predictive analytics system',
            image: 'https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/a5838af0-769b-474e-a5fc-caa1e19c86e5/generated_images/ai-powered-agricultural-analytics-dashbo-925fa72a-20251103021715.jpg',
            categories: ['AI/ML'],
            size: 'small',
            repoUrl: 'https://github.com/prathapselvakumar/Agro-Analytics',
            features: [
                { icon: 'Cpu', title: "Satellite Monitoring", title_ja: "衛星モニタリング", desc: "Real-time crop health assessment using high-resolution hyperspectral satellite imagery.", desc_ja: "高解像度のハイパースペクトル衛星画像を使用した、リアルタイムの作物の健康状態評価。" },
                { icon: 'Zap', title: "Predictive Yield", title_ja: "収穫量予測", desc: "AI models that forecast agricultural output based on soil, weather, and historical data.", desc_ja: "土壌、天候、履歴データに基づいて農業出力を予測するAIモデル。" },
                { icon: 'Box', title: "Resource optimization", title_ja: "リソース最適化", desc: "Precision irrigation and fertilizer application maps to maximize efficiency and reduce waste.", desc_ja: "効率を最大化し無駄を減らすための、精密な灌漑および肥料散布マップ。" },
                { icon: 'Globe', title: "Climate Analysis", title_ja: "気候分析", desc: "Historical weather pattern analysis to predict long-term environmental impacts on harvests.", desc_ja: "収穫に対する長期的な環境影響を予測するための、過去の気象パターンの分析。" },
                { icon: 'Database', title: "Soil Health Index", title_ja: "土壌健康指標", desc: "Comprehensive tracking of nutrient levels and moisture across varied topography.", desc_ja: "様々な地形における栄養レベルと水分の包括的な追跡。" },
            ],
            codeSnippets: [
                {
                    id: "1",
                    title: "yield_model.py",
                    title_ja: "yield_model.py",
                    description: "Predictive model implementation using regression analysis.",
                    description_ja: "回帰分析を用いた予測モデルの実装。",
                    language: "Python",
                    code: `import pandas as pd\nfrom sklearn.ensemble import RandomForestRegressor\n\ndef train_model(data_path):\n    df = pd.read_csv(data_path)\n    X = df.drop('yield', axis=1)\n    y = df['yield']\n    model = RandomForestRegressor().fit(X, y)\n    return model`
                }
            ],
            terminalOutput: [
                { type: "cmd", text: "agro-analytics scan --region 'south-sector'", text_ja: "agro-analytics scan --region 'south-sector'" },
                { type: "info", text: "[INFO] Analyzing hyperspectral imagery...", text_ja: "[情報] ハイパースペクトル画像を分析中..." },
                { type: "result", text: "Predicted Yield: 4.2 tons/hectare (+12% vs last year)", text_ja: "予測収穫量: 4.2 トン/ヘクタール (前年比 +12%)" }
            ],
            videos: [],
            files: [],
            repos: [],
            team: {
                title: "Team",
                title_ja: "チーム",
                description: "The team behind the Agro Analytics platform, bridging AI and agriculture.",
                description_ja: "AIと農業を橋渡しする、Agro Analyticsプラットフォームを支えるチーム。",
                members: [
                    {
                        id: "prathap",
                        quote: "Architecting the data pipeline and machine learning models for predictive agricultural insights.",
                        quote_ja: "予測的な農業の洞察のためのデータパイプラインと機械学習モデルの構築を担当。",
                        name: "Prathap Selvakumar",
                        role: "Robotics & ML Engineer",
                        role_ja: "ロボット工学・機械学習エンジニア",
                        image: "/Team_and_Testimonial/prathapselvakumar.png",
                    },
                    {
                        id: "mrthunjai",
                        quote: "Optimizing hyperspectral imagery processing and satellite data integration.",
                        quote_ja: "ハイパースペクトル画像処理と衛星データ統合の最適化を担当。",
                        name: "Mrthunjai Dhanasekhar",
                        role: "Computer Vision Specialist",
                        role_ja: "コンピュータビジョンスペシャリスト",
                        image: "/Team_and_Testimonial/mrthunjai-dhanasekhar.jpeg",
                    },
                    {
                        id: "adithya",
                        quote: "Ensuring robust system scalability and cloud infrastructure for real-time farm monitoring.",
                        quote_ja: "リアルタイムの農場監視のための、堅牢なシステムスケーラビリティとクラウドインフラストラクチャを確保。",
                        name: "Adithya",
                        role: "Full Stack Developer",
                        role_ja: "フルスタックデベロッパー",
                        image: "/Team_and_Testimonial/adithya.jpeg",
                    },
                ]
            }
        },
        {
            id: 'snake-detection',
            title: 'Snake Detection',
            title_ja: 'ヘビ検出システム',
            description: 'Real-time snake detection and classification system using YOLOv8',
            description_ja: 'YOLOv8を用いたリアルタイムのヘビ検出および分類システム',
            image: '/Thumbnails/Project Thumbnails/image.png',
            categories: ['AI/ML', 'Computer Vision'],
            size: 'small',
            repoUrl: 'https://github.com/prathapselvakumar/Snake-detection',
            features: [
                { icon: 'Cpu', title: "YOLOv8 Detection", title_ja: "YOLOv8検出", desc: "Real-time snake detection using a custom-trained YOLOv8 model for high accuracy.", desc_ja: "高精度なカスタムトレーニング済みYOLOv8モデルを使用した、リアルタイムのヘビ検出。" },
                { icon: 'Zap', title: "Species Classification", title_ja: "種分類", desc: "Instantly classifies detected snakes as venomous or non-venomous.", desc_ja: "検出されたヘビが有毒か無毒かを即座に分類します。" },
                { icon: 'Activity', title: "Real-time Processing", title_ja: "リアルタイム処理", desc: "Low-latency inference optimized for edge devices and mobile deployment.", desc_ja: "エッジデバイスやモバイル展開向けに最適化された低遅延推論。" },
                { icon: 'Bell', title: "Automated Alerts", title_ja: "自動アラート", desc: "Instant notifications sent to local authorities when high-risk species are spotted.", desc_ja: "高リスク種が発見された際、地方自治体へ即座に通知を送信します。" },
                { icon: 'MapPin', title: "Geospatial Logging", title_ja: "地理空間ロギング", desc: "Logs detection events with precise GPS coordinates for wildlife population tracking.", desc_ja: "野生動物の個体数追跡のために、正確なGPS座標とともに検出イベントを記録します。" },
                { icon: 'Shield', title: "Safety Protocols", title_ja: "安全プロトコル", desc: "Integrated safety guidelines and emergency contacts for snake-prone areas.", desc_ja: "ヘビの出没しやすい地域向けの、統合された安全ガイドラインと緊急連絡先。" },
            ],
            codeSnippets: [
                {
                    id: "1",
                    title: "detector.py",
                    title_ja: "detector.py",
                    description: "Inference script for custom YOLOv8 model.",
                    description_ja: "カスタムYOLOv8モデル用の推論スクリプト。",
                    language: "Python",
                    code: `from ultralytics import YOLO\nimport cv2\n\ndef run_inference(image_path):\n    model = YOLO('best.pt')\n    results = model(image_path)\n    for result in results:\n        result.show()`
                }
            ],
            terminalOutput: [
                { type: "cmd", text: "python detect.py --source 'camera_0'", text_ja: "python detect.py --source 'camera_0'" },
                { type: "success", text: "[DETECTION] Cobra detected (Confidence: 0.94) - WARNING: VENOMOUS", text_ja: "[検出] コブラを検出 (信頼度: 0.94) - 警告: 有毒" },
                { type: "info", text: "[INFO] Logging event to wildlife database.", text_ja: "[情報] 野生動物データベースにイベントを記録中。" }
            ],
            videos: [],
            files: [],
            repos: []
        },
        {
            id: 'drone-controller',
            title: 'Drone Feedback Controller',
            description: 'Adaptive Q-learning reinforcement learning agent with a nested PID actuation layer for UAV position stabilisation and waypoint navigation.',
            description_ja: 'UAVの位置安定化とウェイポイントナビゲーションのための、入れ子状のPID作動層を備えた適応型Q学習強化学習エージェント。',
            image: '/Thumbnails/Project Thumbnails/drone-controller.png',
            categories: ['Robotics', 'AI/ML', 'Control Systems'],
            size: 'small',
            repoUrl: 'https://github.com/prathapselvakumar/Drone-Feadback-Controller.git',
            features: [
                { icon: 'Cpu', title: "Q-Learning Adaptation", title_ja: "Q学習適応", desc: "Online tabular RL agent that selects optimal PID gains based on real-time flight states.", desc_ja: "リアルタイムの飛行状態に基づいて最適なPIDゲインを選択する、オンライン表形式強化学習エージェント。" },
                { icon: 'Zap', title: "Nested PID Control", title_ja: "入れ子状PID制御", desc: "High-frequency PID actuation layer (1000Hz) for precise velocity and attitude tracking.", desc_ja: "精密な速度および姿勢追跡のための高周波PID作動層 (1000Hz)。" },
                { icon: 'Activity', title: "Wind Disturbance Handling", title_ja: "風乱れ対応", desc: "Adaptive integral clamping and gain scheduling specifically tuned for robust performance in windy environments.", desc_ja: "強風環境での堅牢なパフォーマンスのために特別に調整された、適応型積分クランプとゲインスケジューリング。" },
                { icon: 'Database', title: "Experience Replay", title_ja: "経験再生", desc: "Stabilizes learning using a 400-sample circular buffer for off-policy TD(0) updates.", desc_ja: "オフポリシーTD(0)更新用の400サンプル循環バッファを使用して学習を安定化させます。" },
            ],
            codeSnippets: [
                {
                    id: "1",
                    title: "controller.py",
                    title_ja: "controller.py",
                    description: "Main logic for the Q-learning feedback controller.",
                    description_ja: "Q学習フィードバックコントローラのメインロジック。",
                    language: "Python",
                    code: `def controller(state, target_pos, dt, wind_enabled=False):
    # State: (dist, yaw_err, wind) -> 96 discrete states
    # Actions: Selected from 16 pre-tuned PID action profiles
    
    # Q-learning TD(0) Update
    reward = (prev_cost - current_cost) - 0.015 * effort
    Q[s][a] += alpha * (reward + gamma + max(Q[s_next]) - Q[s][a])
    
    # PID Law
    vx = kp * ex + ki * integral_x + kd * derivative_x
    return (vx, vy, vz, yaw_rate)`
                }
            ],
            terminalOutput: [],
            videos: [
                {
                    id: "1",
                    title: "Drone Week-1 trail",
                    title_ja: "ドローン 1週目テスト",
                    description: "Initial drone feedback control session and flight testing.",
                    description_ja: "初期のドローンフィードバック制御セッションと飛行テスト。",
                    duration: "3:15",
                    url: "https://www.youtube.com/embed/APb6memCiac?si=ITwi2TK544AzIHiY&start=7"
                }
            ],
            files: [],
            repos: []
        },
        {
            id: 'computer-vision-experiments',
            title: 'Computer Vision Experiments: CIFAR-10 Classification',
            description: 'A comparative study of Traditional Computer Vision (HOG+SVM) vs Deep Learning (CNN) for image classification on the CIFAR-10 dataset.',
            description_ja: 'CIFAR-10データセットを用いた画像分類における、伝統的なコンピュータビジョン（HOG+SVM）とディープラーニング（CNN）の比較研究。',
            image: '/Thumbnails/Project Thumbnails/cv-experiments.png',
            categories: ['AI/ML', 'Computer Vision'],
            size: 'large',
            repoUrl: 'https://github.com/prathapselvakumar/Computer-Vision-Experment.git',
            features: [
                { icon: 'Zap', title: "Traditional Computer Vision", title_ja: "伝統的なコンピュータビジョン", desc: "Implementation using HOG for feature extraction and Linear SVM for classification.", desc_ja: "特徴抽出にHOG、分類に線形SVMを使用した実装。" },
                { icon: 'Cpu', title: "Deep Learning Approach", title_ja: "ディープラーニング手法", desc: "Custom 3-layer CNN architecture with TensorFlow/Keras achieving ~71.3% accuracy.", desc_ja: "TensorFlow/Kerasを使用したカスタム3層CNNアーキテクチャ。約71.3%の精度を達成。" },
                { icon: 'BarChart3', title: "Performance Analysis", title_ja: "性能分析", desc: "Detailed comparison across Accuracy, Precision, Recall, and F1-Score.", desc_ja: "精度、適合率、再現率、F1スコアにわたる詳細な比較。" },
                { icon: 'Code2', title: "Reproducible Notebook", title_ja: "再現可能なノートブック", desc: "End-to-end implementation from data preprocessing to visualization in Jupyter.", desc_ja: "データの整理からJupyterでの視覚化までのエンドツーエンドの実装。" },
            ],
            codeSnippets: [
                {
                    id: "1",
                    title: "cnn_model.py",
                    title_ja: "cnn_model.py",
                    description: "3-layer CNN architecture built with Keras.",
                    description_ja: "Kerasで構築された3層CNNアーキテクチャ。",
                    language: "Python",
                    code: `from tensorflow.keras import layers, models

def create_cnn_model():
    model = models.Sequential([
        layers.Conv2D(32, (3, 3), activation='relu', input_shape=(32, 32, 3)),
        layers.BatchNormalization(),
        layers.MaxPooling2D((2, 2)),
        layers.Dropout(0.25),
        
        layers.Conv2D(64, (3, 3), activation='relu'),
        layers.BatchNormalization(),
        layers.MaxPooling2D((2, 2)),
        layers.Dropout(0.25),
        
        layers.Flatten(),
        layers.Dense(128, activation='relu'),
        layers.Dropout(0.5),
        layers.Dense(10, activation='softmax')
    ])
    return model`
                }
            ],
            terminalOutput: [
                { type: "cmd", text: "python train.py --model cnn" },
                { type: "info", text: "Epoch 1/10 - loss: 1.842 - accuracy: 0.354" },
                { type: "info", text: "Epoch 5/10 - loss: 1.125 - accuracy: 0.612" },
                { type: "info", text: "Epoch 10/10 - loss: 0.842 - accuracy: 0.713", text_ja: "エポック 10/10 - 損失: 0.842 - 精度: 0.713" },
                { type: "success", text: "[SUCCESS] Model trained. Accuracy: 71.32%", text_ja: "[成功] モデルのトレーニング完了。精度: 71.32%" },
                { type: "divider", text: "─".repeat(56), text_ja: "─".repeat(56) },
                { type: "result", text: "CNN Accuracy: 71.32% vs SVM Accuracy: 53.05%", text_ja: "CNN精度: 71.32% vs SVM精度: 53.05%" }
            ],
            videos: [],
            files: [],
            repos: []
        },
        {
            id: 'hybridnet-cifar10',
            title: 'HybridNet: Adaptive CNN-LSTM Fusion',
            description: 'A hybrid deep learning architecture combining CNNs and Bidirectional LSTMs with an adaptive gating mechanism for state-of-the-art CIFAR-10 classification.',
            description_ja: 'CNNと双方向LSTMを組み合わせ、最新のCIFAR-10分類のための適応型ゲーティングメカニズムを備えたハイブリッドディープラーニングアーキテクチャ。',
            image: '/Thumbnails/Project Thumbnails/hybridnet.png',
            categories: ['AI/ML', 'Computer Vision', 'Deep Learning'],
            size: 'small',
            repoUrl: 'https://github.com/prathapselvakumar/HybridNet_CIFAR10_TF.git',
            features: [
                { icon: 'Cpu', title: "Hybrid Architecture", title_ja: "ハイブリッドアーキテクチャ", desc: "Dual-stream CNN and Bi-LSTM network capturing both local spatial features and global dependencies.", desc_ja: "ローカルな空間的特徴とグローバルな依存関係の両方を捉える、デュアルストリームCNNとBi-LSTMネットワーク。" },
                { icon: 'Zap', title: "Adaptive Fusion", title_ja: "適応型フュージョン", desc: "Learned gating mechanism that dynamically weights CNN and LSTM feature maps based on input context.", desc_ja: "入力コンテキストに基づいてCNNとLSTMの特徴マップを動的に重み付けする、学習済みゲーティングメカニズム。" },
                { icon: 'Activity', title: "Optimized Training", title_ja: "最適化されたトレーニング", desc: "Advanced data augmentation and callback strategies (EarlyStopping, Checkpointing) for robust convergence.", desc_ja: "堅牢な収束のための、高度なデータ拡張とコールバック戦略（EarlyStopping、Checkpointing）。" },
                { icon: 'BarChart3', title: "Performance Tracking", title_ja: "性能追跡", desc: "Real-time accuracy/loss visualization and comprehensive confusion matrix analysis reaching 72%+.", desc_ja: "72%以上に達する、リアルタイムの精度/損失の可視化と包括的な混同行列分析。" },
            ],
            codeSnippets: [
                {
                    id: "1",
                    title: "hybrid_fusion.py",
                    title_ja: "hybrid_fusion.py",
                    description: "Adaptive gating mechanism for fusing CNN and LSTM features.",
                    description_ja: "CNNとLSTM特徴を融合するための適応型ゲーティングメカニズム。",
                    language: "Python",
                    code: `import tensorflow as tf
from tensorflow.keras import layers

class AdaptiveFusion(layers.Layer):
    def __init__(self):
        super(AdaptiveFusion, self).__init__()
        self.gate = layers.Dense(1, activation='sigmoid')

    def call(self, cnn_features, lstm_features):
        # Flatten CNN features for gating
        combined = tf.concat([cnn_features, lstm_features], axis=-1)
        gate_weight = self.gate(combined)
        
        # Weighted fusion: gate * CNN + (1-gate) * LSTM
        fused = gate_weight * cnn_features + (1 - gate_weight) * lstm_features
        return fused, gate_weight`
                }
            ],
            terminalOutput: [
                { type: "cmd", text: "python train_hybrid.py --epochs 20" },
                { type: "info", text: "[INFO] Building HybridNet with Adaptive Gating..." },
                { type: "info", text: "Epoch 1/20 - acc: 0.42 - val_acc: 0.48" },
                { type: "info", text: "Epoch 8/20 - acc: 0.70 - val_acc: 0.72" },
                { type: "success", text: "[SUCCESS] Best model saved with val_accuracy: 0.724", text_ja: "[成功] 最良モデルが保存されました。検証精度: 0.724" },
                { type: "divider", text: "─".repeat(56), text_ja: "─".repeat(56) },
                { type: "result", text: "Mean Fusion Weights: CNN=0.62, LSTM=0.38", text_ja: "平均フュージョン重み: CNN=0.62, LSTM=0.38" }
            ],
            videos: [],
            files: [],
            repos: []
        },
        {
            id: 'ros2-coursework1',
            title: 'ROS 2 - Basic Programming & Practice',
            description: 'Autonomous drone flight control system using ROS 2, featuring PID controllers and waypoint navigation.',
            description_ja: 'PIDコントローラとウェイポイントナビゲーションを特徴とする、ROS 2を使用した自律型ドローン飛行制御システム。',
            image: '/Thumbnails/Project Thumbnails/ros2_programming_thumbnail.png',
            categories: ['Robotics', 'ROS2'],
            size: 'small',
            repoUrl: 'https://github.com/prathapselvakumar/ROS-2/tree/main/coursework1',
            features: [
                { icon: 'Cpu', title: "PID Control", title_ja: "PID制御", desc: "Implementation of PID controllers for stable drone flight.", desc_ja: "安定したドローン飛行のためのPIDコントローラの実装。" },
                { icon: 'Zap', title: "Waypoint Navigation", title_ja: "ウェイポイントナビゲーション", desc: "Automated flight paths through predefined coordinate markers.", desc_ja: "事前に定義された座標マーカーを通過する自動飛行経路。" },
                { icon: 'Activity', title: "ROS 2 Integration", title_ja: "ROS 2 統合", desc: "Built using ROS 2 for modular robotics software.", desc_ja: "モジュール式のロボットソフトウェアのためにROS 2を使用して構築。" },
            ],
            terminalVideo: "/ROS-2/Software for Robotics Coursework-2.webm",
            demoUrl: "/projects/coursework1/demo",
            videos: [],
            files: [],
            repos: [
                { id: "1", name: "ROS-2", description: "Repository for Software for Robotics Coursework.", language: "C++", languageColor: "hsl(210 70% 55%)", stars: 0, forks: 0, url: "https://github.com/prathapselvakumar/ROS-2.git", topics: ["ros2", "robotics", "drone"] }
            ]
        }
    ];

