"use client";

import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

interface UserAvatarProps {
  src?: string | null;
  name?: string;
  className?: string;
}

/**
 * 截取用户名展示逻辑：
 * 1. 如果是中文，取第一个汉字
 * 2. 如果是英文/数字，取前两个字符并大写
 */
const getFallbackText = (name: string = "") => {
  if (!name) return "U";
  const trimName = name.trim();
  // 判断首字符是否为中文
  if (/[\u4e00-\u9fa5]/.test(trimName[0])) {
    return trimName[0];
  }
  return trimName.slice(0, 2).toUpperCase();
};

export function UserAvatar({ src, name, className }: UserAvatarProps) {
  return (
    <Avatar className={cn("bg-muted", className)}>
      {src && <AvatarImage src={src} alt={name || "User Avatar"} className="object-cover" />}
      <AvatarFallback className="bg-primary/10 text-primary font-bold">
        {getFallbackText(name)}
      </AvatarFallback>
    </Avatar>
  );
}
