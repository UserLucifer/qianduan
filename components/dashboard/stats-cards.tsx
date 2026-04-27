"use client";

import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, TrendingDown, DollarSign, ShoppingCart, Users, RotateCcw } from 'lucide-react';
import { cn } from '@/lib/utils';

const stats = [
  {
    title: "总收入",
    value: "￥42,560.00",
    change: "+12.5%",
    trend: "up",
    icon: DollarSign,
    color: "text-emerald-500",
  },
  {
    title: "订单总量",
    value: "1,284",
    change: "+18.2%",
    trend: "up",
    icon: ShoppingCart,
    color: "text-blue-500",
  },
  {
    title: "活跃访客",
    value: "24,562",
    change: "-4.5%",
    trend: "down",
    icon: Users,
    color: "text-purple-500",
  },
  {
    title: "退款率",
    value: "1.2%",
    change: "-0.8%",
    trend: "up", // lower is better usually, but here up means better performance
    icon: RotateCcw,
    color: "text-rose-500",
  },
];

export function StatsCards() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <Card 
          key={stat.title} 
          className="border-white/10 bg-[#18181b] transition-all duration-200 hover:border-primary/50 hover:bg-[#1c1c1f]"
        >
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className={cn("rounded-lg bg-white/5 p-2", stat.color)}>
                <stat.icon className="h-5 w-5" />
              </div>
              <div className={cn(
                "flex items-center gap-1 text-xs font-medium",
                stat.trend === "up" ? "text-emerald-500" : "text-rose-500"
              )}>
                {stat.trend === "up" ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                {stat.change}
              </div>
            </div>
            <div className="mt-4">
              <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
              <h3 className="text-2xl font-bold tracking-tight text-white mt-1">{stat.value}</h3>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
