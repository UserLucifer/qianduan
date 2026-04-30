'use client';

import React from 'react';
import { 
  Bot, 
  Cpu, 
  BrainCircuit, 
  Zap, 
  User, 
  Sparkles,
  CircuitBoard,
  Container,
  Database,
  Globe
} from 'lucide-react';
import { cn } from "@/lib/utils";

export interface AvatarOption {
  key: string;
  name: string;
  component: React.ElementType;
  color: string;
}

export const avatarOptions: AvatarOption[] = [
  { key: "default", name: "标准用户", component: User, color: "bg-slate-500" },
  { key: "ai_bot", name: "AI 助手", component: Bot, color: "bg-blue-500" },
  { key: "compute_core", name: "算力核心", component: Cpu, color: "bg-indigo-500" },
  { key: "neural_node", name: "神经节点", component: BrainCircuit, color: "bg-purple-500" },
  { key: "speed_zap", name: "极速推理", component: Zap, color: "bg-amber-500" },
  { key: "gen_ai", name: "生成式 AI", component: Sparkles, color: "bg-rose-500" },
  { key: "logic_gate", name: "逻辑门", component: CircuitBoard, color: "bg-emerald-500" },
  { key: "cluster", name: "集群", component: Container, color: "bg-cyan-500" },
  { key: "data_vault", name: "数据中心", component: Database, color: "bg-orange-500" },
  { key: "global_net", name: "全球网络", component: Globe, color: "bg-teal-500" },
];

interface UserAvatarProps {
  avatarKey?: string | null;
  userName?: string | null;
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
}

export const UserAvatar: React.FC<UserAvatarProps> = ({ 
  avatarKey, 
  userName, 
  className,
  size = "md" 
}) => {
  const option = avatarOptions.find(o => o.key === avatarKey);
  
  const sizeClasses = {
    sm: "h-6 w-6 text-[10px]",
    md: "h-9 w-9 text-xs",
    lg: "h-12 w-12 text-sm",
    xl: "h-16 w-16 text-lg"
  };

  const iconSizeClasses = {
    sm: "h-3.5 w-3.5",
    md: "h-5 w-5",
    lg: "h-6 w-6",
    xl: "h-8 w-8"
  };

  if (option) {
    const Icon = option.component;
    return (
      <div className={cn(
        "flex items-center justify-center rounded-xl text-white shadow-inner",
        option.color,
        sizeClasses[size],
        className
      )}>
        <Icon className={iconSizeClasses[size]} />
      </div>
    );
  }

  // Fallback to initials
  return (
    <div className={cn(
      "flex items-center justify-center rounded-xl bg-primary/20 text-primary font-bold shadow-sm border border-primary/10",
      sizeClasses[size],
      className
    )}>
      {(userName || "U").slice(0, 1).toUpperCase()}
    </div>
  );
};
