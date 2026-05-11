import {
  BrainCircuit,
  CarFront,
  Cpu,
  FlaskConical,
  Gamepad2,
  GraduationCap,
  Layers,
  Rocket,
  Video,
  Zap,
  type LucideIcon,
} from "lucide-react";

export type SolutionMenuItem = {
  key: string;
  icon: LucideIcon;
  href: string;
};

export type SolutionScenarioCategory = {
  key: string;
  items: SolutionMenuItem[];
};

export const solutionScenarioCategories: SolutionScenarioCategory[] = [
  {
    key: "training",
    items: [
      { key: "llmTraining", icon: BrainCircuit, href: "/solutions/llm-training" },
      { key: "agents", icon: Cpu, href: "/solutions/ai-agents" },
    ],
  },
  {
    key: "inference",
    items: [
      { key: "highConcurrency", icon: Zap, href: "/solutions/high-concurrency-inference" },
      { key: "aigc", icon: Video, href: "/solutions/aigc-generation" },
    ],
  },
  {
    key: "compute",
    items: [
      { key: "graphics", icon: Layers, href: "/solutions/graphic-rendering" },
      { key: "scientific", icon: FlaskConical, href: "/solutions/scientific-computing" },
    ],
  },
];

export const solutionIndustryItems: SolutionMenuItem[] = [
  { key: "startups", icon: Rocket, href: "/solutions/aigc-startups" },
  { key: "research", icon: GraduationCap, href: "/solutions/research" },
  { key: "auto", icon: CarFront, href: "/solutions/autonomous-driving" },
  { key: "gaming", icon: Gamepad2, href: "/solutions/gaming" },
];
