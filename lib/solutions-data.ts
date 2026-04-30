import { 
  BrainCircuit, 
  Cpu, 
  Zap, 
  Layers, 
  ShieldCheck, 
  Infinity, 
  Database, 
  LineChart,
  Cloud,
  Microchip,
  Network,
  User,
  Rocket,
  GraduationCap,
  Calendar,
  Gamepad2,
  LucideIcon
} from 'lucide-react';

export interface Feature {
  title: string;
  description: string;
  icon: LucideIcon;
}

export interface SolutionPageData {
  id: string;
  heroTitle: string;
  heroSubtitle: string;
  heroSvgPattern: 'grid' | 'dots' | 'waves';
  features: Feature[];
  visualType: 'code' | 'line-art' | 'realistic';
  visualContent: string;
  recommendedGpus: {
    model: string;
    specs: string;
  }[];
}

export const solutionsData: Record<string, SolutionPageData> = {
  // Use Cases
  'llm-training': {
    id: 'llm-training',
    heroTitle: '大规模语言模型 (LLM) 训练集群',
    heroSubtitle: '基于 NVIDIA Hopper 架构 H100 裸金属节点，通过 InfiniBand NDR 400G 互联，为千亿级参数模型提供极致算力支撑。',
    heroSvgPattern: 'grid',
    features: [
      {
        title: 'RDMA 无损网络',
        description: '搭载 InfiniBand NDR 互联架构，实现全线速 GPU 内存直接访问，节点间通信延迟低至 1μs。',
        icon: Network
      },
      {
        title: '高性能算力基座',
        description: '单节点配备 8x H100 80GB SXM5，NVLink 总带宽高达 900GB/s，充分释放张量计算潜力。',
        icon: Cpu
      },
      {
        title: '并行存储加速',
        description: '自研并行文件系统，支持最高 200GB/s 持续吞吐，确保大规模并行训练中的 I/O 效率。',
        icon: Database
      }
    ],
    visualType: 'code',
    visualContent: `// DeepSpeed-ZeRO3 训练优化配置
{
  "fp16": { "enabled": true },
  "zero_optimization": {
    "stage": 3,
    "offload_optimizer": { "device": "cpu", "pin_memory": true },
    "overlap_comm": true,
    "contiguous_gradients": true,
    "reduce_bucket_size": "auto"
  },
  "gradient_accumulation_steps": "auto"
}`,
    recommendedGpus: [
      { model: 'NVIDIA H100 80GB', specs: '8x H100 SXM5 Cluster' },
      { model: 'NVIDIA A100 80GB', specs: '8x A100 SXM4 Cluster' }
    ]
  },
  'ai-inference': {
    id: 'ai-inference',
    heroTitle: '企业级 AI 高并发弹性推理引擎',
    heroSubtitle: '毫秒级响应，支持多模型热切换与 Serverless 自动扩缩容，为生产环境提供高可用的推理算力保障。',
    heroSvgPattern: 'dots',
    features: [
      {
        title: 'Serverless 弹性调度',
        description: '根据实时流量自动调整实例规模，支持毫秒级冷启动，实现资源利用率最大化。',
        icon: Cloud
      },
      {
        title: '低延迟推理加速',
        description: '内置 TensorRT 与 vLLM 深度优化内核，相比通用框架响应速度提升 2.5 倍。',
        icon: Zap
      },
      {
        title: '全球化多活部署',
        description: '跨区域算力池冗余备份，确保在高并发请求下业务依然保持极高的 SLA 稳定性。',
        icon: Network
      }
    ],
    visualType: 'code',
    visualContent: `// 使用 vLLM 进行高吞吐量推理
from vllm import LLM, SamplingParams

prompts = ["Explain quantum computing in 100 words."]
sampling_params = SamplingParams(temperature=0.8, top_p=0.95)

llm = LLM(model="llama-3-70b-instruct", tensor_parallel_size=4)
outputs = llm.generate(prompts, sampling_params)`,
    recommendedGpus: [
      { model: 'NVIDIA L40S 48GB', specs: '专门优化 FP8 推理吞吐' },
      { model: 'NVIDIA A10 24GB', specs: '兼顾性价比与部署密度的首选' }
    ]
  },
  'high-concurrency-inference': {
    id: 'high-concurrency-inference',
    heroTitle: '高并发推理 (Inference) 优化方案',
    heroSubtitle: '专为生产环境设计的弹性推理引擎，支持千万级日活请求。',
    heroSvgPattern: 'dots',
    features: [
      { title: 'Serverless 架构', description: '按需动态扩容，无请求时零成本。', icon: Cloud },
      { title: '推理加速内核', description: '集成 TensorRT 优化，响应时间缩短 50%。', icon: Zap },
      { title: '全球加速网', description: '多地域部署，降低终端用户访问延迟。', icon: Network }
    ],
    visualType: 'code',
    visualContent: `// vLLM Inference Request\ncurl http://localhost:8000/v1/completions \\\n  -H "Content-Type: application/json" \\\n  -d '{"model": "llama3", "prompt": "..."}'`,
    recommendedGpus: [{ model: 'NVIDIA L40S', specs: 'Optimized for FP8 Inference' }]
  },
  'aigc-generation': {
    id: 'aigc-generation',
    heroTitle: 'AIGC 图像与视频生成加速',
    heroSubtitle: '为 Stable Diffusion、Sora 等生成式模型提供极致的显存带宽。',
    heroSvgPattern: 'waves',
    features: [
      { title: '大显存支持', description: '80GB 显存轻松应对 4K/8K 视频生成。', icon: Layers },
      { title: '算力共享机制', description: '支持多任务并行生成，提高设备利用率。', icon: Infinity },
      { title: '自动化工作流', description: '集成 ComfyUI 等工具流，一键开启生产。', icon: Zap }
    ],
    visualType: 'code',
    visualContent: `# Diffusers Pipeline\npipe = StableDiffusionPipeline.from_pretrained(\n  "runwayml/stable-diffusion-v1-5",\n  torch_dtype=torch.float16\n)`,
    recommendedGpus: [{ model: 'NVIDIA A100 80GB', specs: '80GB HBM2e Memory' }]
  },
  'graphic-rendering': {
    id: 'graphic-rendering',
    heroTitle: '云端高密图形与影视渲染农场',
    heroSubtitle: '为好莱坞级影视后期、建筑表现与数字孪生提供无限容量的 GPU 渲染集群，支持主流渲染引擎一键部署。',
    heroSvgPattern: 'waves',
    features: [
      {
        title: '分布式并行渲染',
        description: '支持 Redshift, Octane, Arnold 等引擎的分布式计算，单帧渲染速度提升数倍。',
        icon: Layers
      },
      {
        title: '高密算力节点',
        description: '单节点配备 4-8 张大显存 GPU，轻松应对海量纹理与复杂光影计算。',
        icon: Microchip
      },
      {
        title: '数据资产物理隔离',
        description: '金融级安全隔离环境，确保您的创意资产在传输与存储中万无一失。',
        icon: ShieldCheck
      }
    ],
    visualType: 'line-art',
    visualContent: 'rendering-topology',
    recommendedGpus: [
      { model: 'NVIDIA RTX 6000 Ada', specs: '48GB 显存, 专为图形任务设计' },
      { model: 'NVIDIA RTX 4090 24GB', specs: '极致光追性能, 性价比渲染首选' }
    ]
  },
  'scientific-computing': {
    id: 'scientific-computing',
    heroTitle: '高密集型仿真与科学计算',
    heroSubtitle: '为气象模拟、基因测序、金融风控提供双精度算力。',
    heroSvgPattern: 'grid',
    features: [
      { title: '双精度浮点', description: 'FP64 性能优化，确保计算结果精准。', icon: Microchip },
      { title: '大规模并行', description: '支持 MPI/CUDA 多机多卡并行计算。', icon: Network },
      { title: '数据安全性', description: '物理隔离节点，确保科研数据安全。', icon: ShieldCheck }
    ],
    visualType: 'line-art',
    visualContent: 'hpc-cluster',
    recommendedGpus: [{ model: 'NVIDIA A100 SXM', specs: '9.7 TFLOPS FP64' }]
  },
  'ai-agents': {
    id: 'ai-agents',
    heroTitle: '智能体 (AI Agents) 开发算力平台',
    heroSubtitle: '为复杂 Agent 迭代提供稳定的推理与微调算力，支持多 Agent 协作仿真。',
    heroSvgPattern: 'dots',
    features: [
      { title: '快速原型迭代', description: '秒级部署微调任务，加速智能体逻辑更新。', icon: Zap },
      { title: '弹性资源池', description: '根据训练负载自动调度 GPU 资源。', icon: Layers },
      { title: 'API 集成优化', description: '提供低延迟接口，支持 Agent 实时交互。', icon: Network }
    ],
    visualType: 'code',
    visualContent: `// LangChain Agent Executor\nconst agent = createOpenAIFunctionsAgent({\n  llm,\n  tools,\n  prompt\n});`,
    recommendedGpus: [{ model: 'NVIDIA A100 80GB', specs: 'SXM4 High Bandwidth' }]
  },

  // Industries
  'autonomous-driving': {
    id: 'autonomous-driving',
    heroTitle: '自动驾驶感知训练与仿真平台',
    heroSubtitle: '打通从海量数据回传、多模态标注到闭环仿真的全生命周期，为 L3+ 级自动驾驶研发提供算力基座。',
    heroSvgPattern: 'grid',
    features: [
      {
        title: '多传感器融合训练',
        description: '针对 LiDAR, Camera, Radar 等异构数据流优化的存储方案，支持高效读取。',
        icon: Infinity
      },
      {
        title: '高保真物理仿真',
        description: '高性能 GPU 集群支撑高保真物理仿真引擎，模拟数百万种极端边缘场景。',
        icon: BrainCircuit
      },
      {
        title: '大规模标注加速',
        description: '集成 AI 辅助标注模型，利用大算力显著提升原始感知数据的清洗与分类效率。',
        icon: LineChart
      }
    ],
    visualType: 'realistic',
    visualContent: '/images/solutions/auto-driving.webp',
    recommendedGpus: [
      { model: 'NVIDIA H100 NVL', specs: 'NVLink 双卡, 专为并行计算优化' },
      { model: 'NVIDIA A100 80GB SXM', specs: '标准智算中心配置, 兼具稳定性与吞吐率' }
    ]
  },
  'aigc-startups': {
    id: 'aigc-startups',
    heroTitle: 'AIGC 初创企业成长计划',
    heroSubtitle: '提供初创企业专属折扣与技术指导，助您快速上线 AI 产品。',
    heroSvgPattern: 'dots',
    features: [
      { title: '灵活计费', description: '支持小时计费，无预付门槛。', icon: Zap },
      { title: '技术专家支持', description: '架构师 1 对 1 指导算力选型。', icon: User },
      { title: '生态对接', description: '对接主流 AI 开发框架与社区。', icon: Rocket }
    ],
    visualType: 'realistic',
    visualContent: '/images/solutions/startups.webp',
    recommendedGpus: [{ model: 'NVIDIA A10 24GB', specs: 'Balanced Cost & Performance' }]
  },
  'research': {
    id: 'research',
    heroTitle: '科研与高校学术支持',
    heroSubtitle: '助力学术前沿探索，提供教育优惠与长期稳定的算力环境。',
    heroSvgPattern: 'grid',
    features: [
      { title: '学术折扣', description: '面向认证高校提供 20% 以上优惠。', icon: GraduationCap },
      { title: '长期预留', description: '支持月度/年度算力预留，确保实验连续性。', icon: Calendar },
      { title: '多框架预装', description: '内置 PyTorch, TensorFlow 等科研镜像。', icon: Layers }
    ],
    visualType: 'realistic',
    visualContent: '/images/solutions/research.webp',
    recommendedGpus: [{ model: 'NVIDIA V100 32GB', specs: 'Classic Stability for Research' }]
  },
  'gaming': {
    id: 'gaming',
    heroTitle: '游戏与数字娱乐云端渲染',
    heroSubtitle: '低延迟云游戏方案，支持高画质实进渲染。',
    heroSvgPattern: 'waves',
    features: [
      { title: '超低延迟', description: '专为实时渲染优化的编解码链路。', icon: Zap },
      { title: '高密实例', description: '单机支持多路云游戏流。', icon: Layers },
      { title: '跨平台兼容', description: '支持 PC, Mobile, Web 等多种终端。', icon: Gamepad2 }
    ],
    visualType: 'realistic',
    visualContent: '/images/solutions/gaming.webp',
    recommendedGpus: [{ model: 'NVIDIA RTX 4090', specs: 'Unmatched Rasterization Performance' }]
  }
};
