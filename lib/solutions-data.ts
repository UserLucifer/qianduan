import {
  BrainCircuit,
  Calendar,
  Cloud,
  Cpu,
  Database,
  Gamepad2,
  GraduationCap,
  Infinity,
  Layers,
  LineChart,
  Microchip,
  Network,
  Rocket,
  ShieldCheck,
  User,
  Zap,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

export interface SolutionFeatureMeta {
  icon: LucideIcon;
}

export interface SolutionPageData {
  id: string;
  heroSvgPattern: "grid" | "dots" | "waves";
  features: SolutionFeatureMeta[];
  visualType: "code" | "line-art" | "realistic";
  visualContent: string;
  recommendedGpuModels: string[];
}

export const solutionsData: Record<string, SolutionPageData> = {
  "llm-training": {
    id: "llm-training",
    heroSvgPattern: "grid",
    features: [{ icon: Network }, { icon: Cpu }, { icon: Database }],
    visualType: "code",
    visualContent: "deepspeed-zero3",
    recommendedGpuModels: ["NVIDIA H100 80GB", "NVIDIA A100 80GB"],
  },
  "ai-inference": {
    id: "ai-inference",
    heroSvgPattern: "dots",
    features: [{ icon: Cloud }, { icon: Zap }, { icon: Network }],
    visualType: "code",
    visualContent: "vllm-inference",
    recommendedGpuModels: ["NVIDIA L40S 48GB", "NVIDIA A10 24GB"],
  },
  "high-concurrency-inference": {
    id: "high-concurrency-inference",
    heroSvgPattern: "dots",
    features: [{ icon: Cloud }, { icon: Zap }, { icon: Network }],
    visualType: "code",
    visualContent: "vllm-request",
    recommendedGpuModels: ["NVIDIA L40S"],
  },
  "aigc-generation": {
    id: "aigc-generation",
    heroSvgPattern: "waves",
    features: [{ icon: Layers }, { icon: Infinity }, { icon: Zap }],
    visualType: "code",
    visualContent: "diffusers-pipeline",
    recommendedGpuModels: ["NVIDIA A100 80GB"],
  },
  "graphic-rendering": {
    id: "graphic-rendering",
    heroSvgPattern: "waves",
    features: [{ icon: Layers }, { icon: Microchip }, { icon: ShieldCheck }],
    visualType: "line-art",
    visualContent: "rendering-topology",
    recommendedGpuModels: ["NVIDIA RTX 6000 Ada", "NVIDIA RTX 4090 24GB"],
  },
  "scientific-computing": {
    id: "scientific-computing",
    heroSvgPattern: "grid",
    features: [{ icon: Microchip }, { icon: Network }, { icon: ShieldCheck }],
    visualType: "line-art",
    visualContent: "hpc-cluster",
    recommendedGpuModels: ["NVIDIA A100 SXM"],
  },
  "ai-agents": {
    id: "ai-agents",
    heroSvgPattern: "dots",
    features: [{ icon: Zap }, { icon: Layers }, { icon: Network }],
    visualType: "code",
    visualContent: "agent-executor",
    recommendedGpuModels: ["NVIDIA A100 80GB"],
  },
  "autonomous-driving": {
    id: "autonomous-driving",
    heroSvgPattern: "grid",
    features: [{ icon: Infinity }, { icon: BrainCircuit }, { icon: LineChart }],
    visualType: "realistic",
    visualContent: "/images/solutions/auto-driving.webp",
    recommendedGpuModels: ["NVIDIA H100 NVL", "NVIDIA A100 80GB SXM"],
  },
  "aigc-startups": {
    id: "aigc-startups",
    heroSvgPattern: "dots",
    features: [{ icon: Zap }, { icon: User }, { icon: Rocket }],
    visualType: "realistic",
    visualContent: "/images/solutions/startups.webp",
    recommendedGpuModels: ["NVIDIA A10 24GB"],
  },
  research: {
    id: "research",
    heroSvgPattern: "grid",
    features: [{ icon: GraduationCap }, { icon: Calendar }, { icon: Layers }],
    visualType: "realistic",
    visualContent: "/images/solutions/research.webp",
    recommendedGpuModels: ["NVIDIA V100 32GB"],
  },
  gaming: {
    id: "gaming",
    heroSvgPattern: "waves",
    features: [{ icon: Zap }, { icon: Layers }, { icon: Gamepad2 }],
    visualType: "realistic",
    visualContent: "/images/solutions/gaming.webp",
    recommendedGpuModels: ["NVIDIA RTX 4090"],
  },
};
