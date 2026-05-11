import {
  Activity,
  Cloud,
  Cpu,
  Database,
  Target,
  Zap,
  type LucideIcon,
} from "lucide-react";

export type ProductSubItem = {
  key: string;
  href: string;
  items?: string[];
};

export type ProductCategory = {
  id: string;
  messageKey: string;
  icon: LucideIcon;
  subItems: ProductSubItem[];
  featured: {
    image: string;
  };
};

export const productCategories: ProductCategory[] = [
  {
    id: "foundation",
    messageKey: "foundation",
    icon: Cpu,
    subItems: [
      { key: "gpuComputing", href: "/gpu-computing", items: ["NVIDIA Blackwell", "NVIDIA Hopper", "NVIDIA Ada Lovelace"] },
      { key: "cpuComputing", href: "/cpu-computing" },
      { key: "bareMetal", href: "/bare-metal-servers" },
      { key: "networking", href: "/networking-services" },
    ],
    featured: {
      image: "/images/navagation/1.jpg",
    },
  },
  {
    id: "data-storage",
    messageKey: "dataStorage",
    icon: Database,
    subItems: [
      { key: "objectStorage", href: "/ai-object-storage" },
      { key: "vastStorage", href: "/dedicated-vast-storage" },
      { key: "distributedFile", href: "/ai-object-storage#distributed-file-storage" },
      { key: "localStorage", href: "/ai-object-storage#local-storage" },
    ],
    featured: {
      image: "/images/navagation/2.jpg",
    },
  },
  {
    id: "infrastructure-control",
    messageKey: "infrastructureControl",
    icon: Cloud,
    subItems: [
      { key: "managedKubernetes", href: "/managed-kubernetes" },
    ],
    featured: {
      image: "/images/navagation/3.jpg",
    },
  },
  {
    id: "runtime-acceleration",
    messageKey: "runtimeAcceleration",
    icon: Zap,
    subItems: [
      { key: "sunk", href: "/sunk" },
      { key: "sunkAnywhere", href: "/sunk-anywhere" },
      { key: "serverlessRl", href: "https://wandb.ai/site/serverless-rl/?utm_source=coreweave.com&utm_medium=site" },
    ],
    featured: {
      image: "/images/navagation/4.jpg",
    },
  },
  {
    id: "model-agent-development",
    messageKey: "modelAgent",
    icon: Target,
    subItems: [
      { key: "training", href: "https://wandb.ai/site/models/?utm_source=coreweave.com&utm_medium=site" },
      { key: "fineTuning", href: "https://wandb.ai/site/wb-training/?utm_source=coreweave.com&utm_medium=site" },
      { key: "inference", href: "https://wandb.ai/site/inference/?utm_source=coreweave.com&utm_medium=site#" },
      { key: "monitoring", href: "https://wandb.ai/site/weave/?utm_source=coreweave.com&utm_medium=site" },
    ],
    featured: {
      image: "/images/navagation/5.avif",
    },
  },
  {
    id: "mission-control",
    messageKey: "missionControl",
    icon: Activity,
    subItems: [
      { key: "missionControl", href: "/mission-control" },
      { key: "fleetLifecycle", href: "/mission-control#fleet-lifecycle-controller" },
      { key: "nodeLifecycle", href: "/mission-control#node-lifecycle-controller" },
      { key: "observability", href: "/observability" },
    ],
    featured: {
      image: "/images/navagation/6.jpg",
    },
  },
];
