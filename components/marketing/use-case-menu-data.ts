import {
  Bot,
  Boxes,
  Code2,
  DatabaseZap,
  FileText,
  ImageIcon,
  Mic,
  MonitorCog,
  SlidersHorizontal,
  type LucideIcon,
} from "lucide-react";

export type UseCaseItem = {
  key: string;
  href: string;
  icon: LucideIcon;
};

export const useCaseItems: UseCaseItem[] = [
  { key: "textGeneration", href: "/use-cases/ai-text-generation", icon: FileText },
  { key: "imageVideo", href: "/use-cases/ai-image-video-generation", icon: ImageIcon },
  { key: "agents", href: "/use-cases/ai-agents", icon: Bot },
  { key: "fineTuning", href: "/use-cases/ai-fine-tuning", icon: SlidersHorizontal },
  { key: "batchData", href: "/use-cases/batch-data-processing", icon: DatabaseZap },
  { key: "audio", href: "/use-cases/audio-to-text-transcription", icon: Mic },
  { key: "virtualComputing", href: "/use-cases/virtual-computing", icon: MonitorCog },
  { key: "gpuProgramming", href: "/use-cases/gpu-programming", icon: Code2 },
  { key: "rendering", href: "/use-cases/3d-rendering", icon: Boxes },
];
