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
        forks: number;
        url: string;
        topics: string[];
    }[];
    features?: {
        icon: any;
        title: string;
        desc: string;
    }[];
    terminalOutput?: { type: "cmd" | "info" | "success" | "result" | "divider"; text: string }[];
    codeSnippets?: { id: string; title: string; description: string; language: string; code: string }[];
    team?: {
        title?: string;
        description?: string;
        members: {
            quote: string;
            name: string;
            designation: string;
            src: string;
        }[];
    };
}

export const projects: Project[] =
    // modified for thumbnail 
    [
        {
            id: 'autonomous-robot',
            title: 'Autonomous Robot',
            description: 'Self-navigating robot using SLAM and path planning algorithms with real-time obstacle detection',
            image: '/Thumbnails/Project Thumbnails/maxresdefault.jpg',
            categories: ['Robotics'],
            size: 'large',
            repoUrl: 'https://github.com/sarathkumar-sk/Team_6_AERO62520_RSD_Project',
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
                  
                    duration: "4:32",
                    url: "https://www.youtube.com/embed/qvzDwsoLuuM?si=Yi3NlumaOGGyOG8A"
                },
                {
                    id: "2",
                    title: "Lidars",
                    description: "Initial testing of the lidars.",
                   
                    duration: "2:10",
                    url: "https://www.youtube.com/embed/VSYWAxqKxZ8?si=jUMfohMpg7cIfBh"
                },
                {
                    id: "3",
                    title: "Arm Movement Testing",
                    description: "Testing the movement of the arm.",
                   
                    duration: "3:48",
                    url: "https://www.youtube.com/embed/XS9NESWWpK8?si=EJpZDgY3A2b5d7aR"
                },
                {
                    id: "4",
                    title: "Structural Construction",
                    description: "The construction of the robot.",
                  
                    duration: "5:20",
                    url: "https://www.youtube.com/embed/vs7O9ohwxwc?si=1lukm8WUqp22UDjS"
                },
                {
                    id: "5",
                    title: "Trail Run",
                    description: "First run of the robot in a trail environment.",
                   
                    duration: "7:15",
                    url: "https://www.youtube.com/embed/FMmaug6hqB4?si=TfzrjiVYwOa-qobM"
                }
            ],

            files: [
                { id: "5", name: "Autonomous Mobile Robot", format: ".step", description: "Complete assembly of the Autonomous Mobile Robot.", fileSize: "2.4 MB", icon: "cad", previewImage: "/Autonomous-Mobile-Robot/Cad Files/robot-assembly-thumb.svg", downloadUrl: "#", modelUrl: "#" },
                { id: "1", name: "Arm mounting plate v7", format: ".step", description: "Mounting plate for the robotic arm assembly.", fileSize: "30 KB", icon: "cad", previewImage: "/Autonomous-Mobile-Robot/Products/Robotic ARM.png", downloadUrl: "/Autonomous-Mobile-Robot/Cad Files/Arm mounting plate v7.step", modelUrl: "/Autonomous-Mobile-Robot/Cad Files/Arm mounting plate v7.glb" },
                { id: "2", name: "L camera mount v6", format: ".step", description: "L-shaped bracket for camera mounting.", fileSize: "44 KB", icon: "cad", previewImage: "/Autonomous-Mobile-Robot/Products/Camera.png", downloadUrl: "/Autonomous-Mobile-Robot/Cad Files/L camera mount v6.step", modelUrl: "/Autonomous-Mobile-Robot/Cad Files/L camera mount v6.glb" },
                { id: "3", name: "LIDAR A2 mount v4_", format: ".step", description: "Mounting unit for LIDAR A2 sensor.", fileSize: "80 KB", icon: "cad", previewImage: "/Autonomous-Mobile-Robot/Products/Lidars.png", downloadUrl: "/Autonomous-Mobile-Robot/Cad Files/LIDAR A2 mount v4_.step", modelUrl: "/Autonomous-Mobile-Robot/Cad Files/LIDAR A2 mount v4_.glb" },
                { id: "4", name: "NUC mounting plate v4", format: ".step", description: "Mounting plate for the NUC computer.", fileSize: "40 KB", icon: "cad", previewImage: "/Autonomous-Mobile-Robot/Cad Files/nuc-plate-thumb.svg", downloadUrl: "/Autonomous-Mobile-Robot/Cad Files/NUC mounting plate v4.step", modelUrl: "/Autonomous-Mobile-Robot/Cad Files/NUC mounting plate v4.glb" },
            ],
            repos: [
                { id: "1", name: "Leo-Rover", description: "The complete source code for the Autonomous Robot project, featuring ROS2 integration, SLAM navigation, and hardware control systems.", language: "C++", languageColor: "hsl(210 70% 55%)", stars: 0, forks: 0, url: "https://github.com/prathapselvakumar/Leo-Rover.git", topics: ["robotics", "autonomous", "leo-rover", "ros2", "cpp"] },
                { id: "2", name: "Object-Detection-for-Leo-Rover", description: "Computer vision and object detection models deployed on the Leo Rover using YOLOv8 and custom datasets.", language: "Python", languageColor: "hsl(50 70% 50%)", stars: 0, forks: 0, url: "https://github.com/prathapselvakumar/Object-Detection-for-Leo-Rover.git", topics: ["yolov8", "ros2", "computer-vision", "python", "ai"] }
            ],
            terminalOutput: [
                { type: "cmd", text: "ros2 launch leo_rover_object_detection yolo_v8.launch.py" },
                { type: "info", text: "[INFO] [launch]: All log files can be found below /root/.ros/log/..." },
                { type: "info", text: "[INFO] [launch]: Defaulting to ROS_DOMAIN_ID=0" },
                { type: "success", text: "[yolov8_node]: Node started successfully. Loading weights 'yolov8n.pt'" },
                { type: "info", text: "[camera_node]: Subscribing to /camera/image_raw" },
                { type: "divider", text: "─".repeat(56) },
                { type: "success", text: "[yolov8_node]: Inference Engine initialized on Edge TPU" },
                { type: "result", text: "Detected: 'Person' at [120, 45, 230, 450] - Confidence: 0.92" },
                { type: "result", text: "Detected: 'Stop Sign' at [400, 100, 480, 180] - Confidence: 0.88" },
                { type: "info", text: "[nav2_costmap]: Updating local costmap with obstacles..." },
                { type: "success", text: "[nav2_planner]: Recalculating path to avoid 'Stop Sign'" },
                { type: "divider", text: "─".repeat(56) },
                { type: "info", text: "📌 This is sample terminal output showing live object detection." },
                { type: "info", text: "For full ROS2 nodes & launch files, visit GitHub ↓" },
                { type: "result", text: "→ github.com/prathapselvakumar/Object-Detection-for-Leo-Rover" },
            ],
            codeSnippets: [
                {
                    id: "1",
                    title: "yolov8_node.py",
                    description: "ROS2 node for subscribing to camera stream and running object detection",
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
                description: "The dedicated team of engineers and innovators behind the Autonomous Robot project.",
                members: [
                     
                    {
                        quote: "Responsible for developing and managing the Computer Vision and Navigation systems",
                        name: "Prathap Selvakumar",
                        designation: "Computer Vision and Navigation",
                        src: "/Team_and_Testimonial/prathapselvakumar.png",
                    },
                    {
                        quote: "Oversaw component design, additive manufacturing (3D printing), and hand–eye calibration for accurate robotic perception and manipulation.",
                        name: "Joao Lopes",
                        designation: "Designing , 3D printing the components and Hand-Eye Calibration",
                        src: "/Team_and_Testimonial/JoaoLopes.jpeg",
                    },
                     {
                        quote: "Developed and optimized SLAM and navigation for autonomous robot movement",
                        name: "Sarath Kumar",
                        designation: "Navigation and SLAM",
                        src: "/Team_and_Testimonial/Sarathkumar.jpeg",
                    },
                    {
                        quote: "Specializing in Navigation and spatial awareness for real-time robotic navigation.",
                        name: "Ruiyang",
                        designation: "Navigation and spatial awareness",
                        src: "/Team_and_Testimonial/ruyang.jpg",
                    },
                    {
                        quote: "Concentrated on SLAM, spatial mapping, and real-time robotic localization",
                        name: "Jiaxin Tang",
                        designation: "SLAM and spatial awareness",
                        src: "/Team_and_Testimonial/Jiaxin Tang.jpeg",
                    },

                ]
            }
        },
        {
            id: 'audio-search',
            title: 'Audio Search Engine',
            description: 'Voice-powered search with NLP and speech recognition',
            image: 'https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/a5838af0-769b-474e-a5fc-caa1e19c86e5/generated_images/modern-audio-search-engine-interface-wit-0e47d749-20251103021714.jpg',
            categories: ['AI/ML'],
            size: 'small',
            repoUrl: 'https://github.com/prathapselvakumar/Audio-Search-Engine',
            features: [
                { icon: 'Mic', title: "Speech Recognition", desc: "State-of-the-art NLP models for high-precision voice-to-text conversion in noisy environments." },
                { icon: 'Zap', title: "Semantic Search", desc: "Goes beyond keywords to understand the context and intent behind every voice query." },
                { icon: 'Database', title: "Scalable Indexing", desc: "Fast and memory-efficient indexing architecture for searching through millions of audio files." },
                { icon: 'Search', title: "Audio Fingerprinting", desc: "Identify audio clips through unique acoustic signatures with minimal data requirements." },
            
            ],
            codeSnippets: [
                {
                    id: "1",
                    title: "audio_processor.py",
                    description: "Main logic for audio feature extraction and indexing.",
                    language: "Python",
                    code: `import numpy as np\nimport librosa\n\ndef extract_features(audio_path):\n    y, sr = librosa.load(audio_path)\n    mfcc = librosa.feature.mfcc(y=y, sr=sr, n_mfcc=13)\n    return np.mean(mfcc.T, axis=0)`
                }
            ],
            terminalOutput: [
                { type: "cmd", text: "python3 search.py --query 'classical music'" },
                { type: "info", text: "[INFO] Processing audio query..." },
                { type: "success", text: "[SUCCESS] Match found: 'Beethoven_Symphony5.mp3' (Score: 0.98)" }
            ],
            videos: [],
            files: [],
            repos: []
        },
        {
            id: 'a-start-algorithm',
            title: 'A-Star Algorithm',
            description: 'Interactive A* path planner for grid navigation with obstacle placement and route replay',
            image: '/Thumbnails/Project Thumbnails/a-star-path-planning.svg',
            categories: ['Algorithms'],
            size: 'small',
            repoUrl: 'https://github.com/prathapselvakumar/AMR-Coursework-2',
            features: [
                { icon: 'Cpu', title: "A* Path Planning", desc: "Computes shortest paths on a dynamic grid using heuristic-based search." },
                { icon: 'Activity', title: "Interactive Controls", desc: "Set start/end points, paint obstacles, and launch live route calculations." },
            { icon: 'Activity', title: "Path Validation", desc: "Validates and visualizes each computed step with clear state feedback and messages." },
            { icon: 'Layers', title: "Grid Resizing", desc: "Adjust grid dimensions at runtime to test algorithm behavior on different planning resolutions." },
            { icon: 'Wifi', title: "Path Cost Diagnostics", desc: "Tracks algorithm iteration costs and highlights when heuristic costs lead to faster route convergence." },
            ],
            codeSnippets: [
                {
                    id: "1",
                    title: "PathPlannerApp.tsx",
                    description: "Interactive React implementation of A* grid path planning.",
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
                { icon: 'Cpu', title: "Satellite Monitoring", desc: "Real-time crop health assessment using high-resolution hyperspectral satellite imagery." },
                { icon: 'Zap', title: "Predictive Yield", desc: "AI models that forecast agricultural output based on soil, weather, and historical data." },
                { icon: 'Box', title: "Resource optimization", desc: "Precision irrigation and fertilizer application maps to maximize efficiency and reduce waste." },
                { icon: 'Globe', title: "Climate Analysis", desc: "Historical weather pattern analysis to predict long-term environmental impacts on harvests." },
                { icon: 'Database', title: "Soil Health Index", desc: "Comprehensive tracking of nutrient levels and moisture across varied topography." },
            ],
            codeSnippets: [
                {
                    id: "1",
                    title: "yield_model.py",
                    description: "Predictive model implementation using regression analysis.",
                    language: "Python",
                    code: `import pandas as pd\nfrom sklearn.ensemble import RandomForestRegressor\n\ndef train_model(data_path):\n    df = pd.read_csv(data_path)\n    X = df.drop('yield', axis=1)\n    y = df['yield']\n    model = RandomForestRegressor().fit(X, y)\n    return model`
                }
            ],
            terminalOutput: [
                { type: "cmd", text: "agro-analytics scan --region 'south-sector'" },
                { type: "info", text: "[INFO] Analyzing hyperspectral imagery..." },
                { type: "result", text: "Predicted Yield: 4.2 tons/hectare (+12% vs last year)" }
            ],
            videos: [],
            files: [],
            repos: [],
            team: {
                title: "Team",
                description: "The team behind the Agro Analytics platform, bridging AI and agriculture.",
                members: [
                    {
                        quote: "Architecting the data pipeline and machine learning models for predictive agricultural insights.",
                        name: "Prathap Selvakumar",
                        designation: "Robotics & ML Engineer",
                        src: "/Team_and_Testimonial/prathapselvakumar.png",
                    },
                    {
                        quote: "Optimizing hyperspectral imagery processing and satellite data integration.",
                        name: "Mrthunjai Dhanasekhar",
                        designation: "Computer Vision Specialist",
                        src: "/Team_and_Testimonial/mrthunjai-dhanasekhar.jpeg",
                    },
                    {
                        quote: "Ensuring robust system scalability and cloud infrastructure for real-time farm monitoring.",
                        name: "Adithya",
                        designation: "Full Stack Developer",
                        src: "/Team_and_Testimonial/adithya.jpeg",
                    },
                ]
            }
        },
        {
            id: 'snake-detection',
            title: 'Snake Detection',
            description: 'Real-time snake detection and classification system using YOLOv8',
            image: '/Thumbnails/Project Thumbnails/image.png',
            categories: ['AI/ML', 'Computer Vision'],
            size: 'small',
            repoUrl: 'https://github.com/prathapselvakumar/Snake-detection',
            features: [
                { icon: 'Cpu', title: "YOLOv8 Detection", desc: "Real-time snake detection using a custom-trained YOLOv8 model for high accuracy." },
                { icon: 'Zap', title: "Species Classification", desc: "Instantly classifies detected snakes as venomous or non-venomous." },
                { icon: 'Activity', title: "Real-time Processing", desc: "Low-latency inference optimized for edge devices and mobile deployment." },
                { icon: 'Bell', title: "Automated Alerts", desc: "Instant notifications sent to local authorities when high-risk species are spotted." },
                { icon: 'MapPin', title: "Geospatial Logging", desc: "Logs detection events with precise GPS coordinates for wildlife population tracking." },
                { icon: 'Shield', title: "Safety Protocols", desc: "Integrated safety guidelines and emergency contacts for snake-prone areas." },
            ],
            codeSnippets: [
                {
                    id: "1",
                    title: "detector.py",
                    description: "Inference script for custom YOLOv8 model.",
                    language: "Python",
                    code: `from ultralytics import YOLO\nimport cv2\n\ndef run_inference(image_path):\n    model = YOLO('best.pt')\n    results = model(image_path)\n    for result in results:\n        result.show()`
                }
            ],
            terminalOutput: [
                { type: "cmd", text: "python detect.py --source 'camera_0'" },
                { type: "success", text: "[DETECTION] Cobra detected (Confidence: 0.94) - WARNING: VENOMOUS" },
                { type: "info", text: "[INFO] Logging event to wildlife database." }
            ],
            videos: [],
            files: [],
            repos: []
        },
        {
            id: 'drone-controller',
            title: 'Drone Feedback Controller',
            description: 'Adaptive Q-learning reinforcement learning agent with a nested PID actuation layer for UAV position stabilisation and waypoint navigation.',
            image: '/Thumbnails/Project Thumbnails/drone-controller.png',
            categories: ['Robotics', 'AI/ML', 'Control Systems'],
            size: 'small',
            repoUrl: 'https://github.com/prathapselvakumar/Drone-Feadback-Controller.git',
            features: [
                { icon: 'Cpu', title: "Q-Learning Adaptation", desc: "Online tabular RL agent that selects optimal PID gains based on real-time flight states." },
                { icon: 'Zap', title: "Nested PID Control", desc: "High-frequency PID actuation layer (1000Hz) for precise velocity and attitude tracking." },
                { icon: 'Activity', title: "Wind Disturbance Handling", desc: "Adaptive integral clamping and gain scheduling specifically tuned for robust performance in windy environments." },
                { icon: 'Database', title: "Experience Replay", desc: "Stabilizes learning using a 400-sample circular buffer for off-policy TD(0) updates." },
            ],
            codeSnippets: [
                {
                    id: "1",
                    title: "controller.py",
                    description: "Main logic for the Q-learning feedback controller.",
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
            videos: [],
            files: [],
            repos: []
        },
        {
            id: 'computer-vision-experiments',
            title: 'Computer Vision Experiments: CIFAR-10 Classification',
            description: 'A comparative study of Traditional Computer Vision (HOG+SVM) vs Deep Learning (CNN) for image classification on the CIFAR-10 dataset.',
            image: '/Thumbnails/Project Thumbnails/cv-experiments.png',
            categories: ['AI/ML', 'Computer Vision'],
            size: 'large',
            repoUrl: 'https://github.com/prathapselvakumar/Computer-Vision-Experment.git',
            features: [
                { icon: 'Zap', title: "Traditional Computer Vision", desc: "Implementation using HOG for feature extraction and Linear SVM for classification." },
                { icon: 'Cpu', title: "Deep Learning Approach", desc: "Custom 3-layer CNN architecture with TensorFlow/Keras achieving ~71.3% accuracy." },
                { icon: 'BarChart3', title: "Performance Analysis", desc: "Detailed comparison across Accuracy, Precision, Recall, and F1-Score." },
                { icon: 'Code2', title: "Reproducible Notebook", desc: "End-to-end implementation from data preprocessing to visualization in Jupyter." },
            ],
            codeSnippets: [
                {
                    id: "1",
                    title: "cnn_model.py",
                    description: "3-layer CNN architecture built with Keras.",
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
                { type: "info", text: "Epoch 10/10 - loss: 0.842 - accuracy: 0.713" },
                { type: "success", text: "[SUCCESS] Model trained. Accuracy: 71.32%" },
                { type: "divider", text: "─".repeat(56) },
                { type: "result", text: "CNN Accuracy: 71.32% vs SVM Accuracy: 53.05%" }
            ],
            videos: [],
            files: [],
            repos: []
        },
        {
            id: 'hybridnet-cifar10',
            title: 'HybridNet: Adaptive CNN-LSTM Fusion',
            description: 'A hybrid deep learning architecture combining CNNs and Bidirectional LSTMs with an adaptive gating mechanism for state-of-the-art CIFAR-10 classification.',
            image: '/Thumbnails/Project Thumbnails/hybridnet.png',
            categories: ['AI/ML', 'Computer Vision', 'Deep Learning'],
            size: 'small',
            repoUrl: 'https://github.com/prathapselvakumar/HybridNet_CIFAR10_TF.git',
            features: [
                { icon: 'Cpu', title: "Hybrid Architecture", desc: "Dual-stream CNN and Bi-LSTM network capturing both local spatial features and global dependencies." },
                { icon: 'Zap', title: "Adaptive Fusion", desc: "Learned gating mechanism that dynamically weights CNN and LSTM feature maps based on input context." },
                { icon: 'Activity', title: "Optimized Training", desc: "Advanced data augmentation and callback strategies (EarlyStopping, Checkpointing) for robust convergence." },
                { icon: 'BarChart3', title: "Performance Tracking", desc: "Real-time accuracy/loss visualization and comprehensive confusion matrix analysis reaching 72%+." },
            ],
            codeSnippets: [
                {
                    id: "1",
                    title: "hybrid_fusion.py",
                    description: "Adaptive gating mechanism for fusing CNN and LSTM features.",
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
                { type: "success", text: "[SUCCESS] Best model saved with val_accuracy: 0.724" },
                { type: "divider", text: "─".repeat(56) },
                { type: "result", text: "Mean Fusion Weights: CNN=0.62, LSTM=0.38" }
            ],
            videos: [],
            files: [],
            repos: []
        },
        {
            id: 'ros2-coursework1',
            title: 'ROS 2 Coursework 1: Beta Pilot',
            description: 'Autonomous drone flight control system using ROS 2, featuring PID controllers and waypoint navigation.',
            image: '/Thumbnails/Project Thumbnails/drone-controller.png',
            categories: ['Robotics', 'Control Systems'],
            size: 'small',
            repoUrl: 'https://github.com/prathapselvakumar/ROS-2/tree/main/coursework1',
            features: [
                { icon: 'Cpu', title: "PID Control", desc: "Implementation of PID controllers for stable drone flight." },
                { icon: 'Zap', title: "Waypoint Navigation", desc: "Automated flight paths through predefined coordinate markers." },
                { icon: 'Activity', title: "ROS 2 Integration", desc: "Built using ROS 2 for modular robotics software." },
            ],
            terminalOutput: [
                { type: "cmd", text: "ros2 launch beta_pilot_launch_pkg manual_flight.launch.py" },
                { type: "info", text: "[INFO] [launch]: Monitoring telemetry data..." },
                { type: "success", text: "[SUCCESS] Drone takeoff achieved. Holding altitude at 1.5m." }
            ],
            videos: [],
            files: [],
            repos: [
                { id: "1", name: "ROS-2", description: "Repository for Software for Robotics Coursework.", language: "C++", languageColor: "hsl(210 70% 55%)", stars: 0, forks: 0, url: "https://github.com/prathapselvakumar/ROS-2.git", topics: ["ros2", "robotics", "drone"] }
            ]
        }
    ];

