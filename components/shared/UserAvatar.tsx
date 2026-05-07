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
 * Fallback display logic:
 * 1. For CJK names, use the first character.
 * 2. For alphanumeric names, use the first two uppercase characters.
 */
const getFallbackText = (name: string = "") => {
  if (!name) return "U";
  const trimName = name.trim();
  // Check whether the first character is CJK.
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
