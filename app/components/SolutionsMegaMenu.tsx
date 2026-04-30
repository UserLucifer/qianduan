'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  BrainCircuit,
  Cpu,
  Layers,
  Zap,
  Video,
  FlaskConical,
  Rocket,
  GraduationCap,
  CarFront,
  Gamepad2
} from 'lucide-react';

const useCaseCategories = [
  {
    title: "AI 训练",
    items: [
      {
        name: "大模型训练",
        description: "提供裸金属 GPU 集群",
        icon: BrainCircuit,
        href: "/solutions/llm-training"
      },
      {
        name: "智能体开发",
        description: "支持复杂智能体迭代",
        icon: Cpu,
        href: "/solutions/ai-agents"
      }
    ]
  },
  {
    title: "AI 推理",
    items: [
      {
        name: "高并发推理",
        description: "低延迟的弹性 API 部署",
        icon: Zap,
        href: "/solutions/high-concurrency-inference"
      },
      {
        name: "AIGC 生成",
        description: "专为图像/视频生成优化",
        icon: Video,
        href: "/solutions/aigc-generation"
      }
    ]
  },
  {
    title: "专用计算",
    items: [
      {
        name: "图形渲染",
        description: "云端弹性渲染农场",
        icon: Layers,
        href: "/solutions/graphic-rendering"
      },
      {
        name: "科学计算",
        description: "高密集型仿真计算",
        icon: FlaskConical,
        href: "/solutions/scientific-computing"
      }
    ]
  }
];

const industryItems = [
  { name: "AIGC 初创企业", icon: Rocket, href: "/solutions/aigc-startups" },
  { name: "科研与高校", icon: GraduationCap, href: "/solutions/research" },
  { name: "自动驾驶", icon: CarFront, href: "/solutions/autonomous-driving" },
  { name: "游戏与数字娱乐", icon: Gamepad2, href: "/solutions/gaming" }
];


export default function SolutionsMegaMenu() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      transition={{ duration: 0.2 }}
      className="absolute top-full left-0 mt-2 w-[1000px] overflow-hidden rounded-xl border border-border bg-background shadow-lg flex flex-row items-stretch"
    >
      {/* Solutions by Use Case (2/3) */}
      <div className="w-2/3 p-8">
        <div className="mb-6">
          <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            按场景解决方案
          </h3>
        </div>
        <div className="grid grid-cols-3 gap-6">
          {useCaseCategories.map((category) => (
            <div key={category.title} className="space-y-4">
              <h4 className="text-xs font-medium text-muted-foreground/80 border-b border-border/50 pb-2">
                {category.title}
              </h4>
              <div className="space-y-3">
                {category.items.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    prefetch={false}
                    className="group block rounded-lg p-2 transition-colors hover:bg-accent/50"
                  >
                    <div className="flex items-start gap-3">
                      <div className="mt-1 rounded-md bg-muted p-1.5 text-foreground transition-colors group-hover:bg-background shrink-0">
                        <item.icon className="h-4 w-4" />
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-foreground leading-tight">
                          {item.name}
                        </div>
                        <div className="mt-1 text-xs text-muted-foreground leading-snug">
                          {item.description}
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Solutions by Industry (1/3) */}
      <div className="w-1/3 p-8 bg-muted/30 flex flex-col">
        <div className="mb-6">
          <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            按行业
          </h3>
        </div>
        <div className="flex flex-col gap-2">
          {industryItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              prefetch={false}
              className="group flex items-center gap-3 rounded-lg p-3 transition-colors hover:bg-accent/50"
            >
              <item.icon className="h-4 w-4 text-muted-foreground transition-colors group-hover:text-foreground shrink-0" />
              <span className="text-sm font-medium text-foreground">
                {item.name}
              </span>
            </Link>
          ))}
        </div>

        <div className="mt-auto pt-8">
          <div className="rounded-xl border border-border/50 bg-background/50 p-4">
            <p className="text-xs leading-relaxed text-muted-foreground">
              探索专为您行业定制的算力加速方案，助力业务快速增长。
            </p>
            <Link
              href="/contact"
              prefetch={false}
              className="mt-3 inline-flex items-center text-xs font-semibold text-primary hover:underline"
            >
              获取定制方案 →
            </Link>
          </div>
        </div>
      </div>
    </motion.div>

  );
}
