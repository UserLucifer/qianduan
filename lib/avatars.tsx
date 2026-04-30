"use client";

/**
 * 头像工具函数：根据 Key 还原 DiceBear Shapes 风格 URL
 */
export const getAvatarUrl = (key?: string | null) => {
  if (!key) return null;
  // 支持 shapes_1 到 shapes_20
  if (key.startsWith("shapes_")) {
    const seed = key.split("_")[1];
    return `https://api.dicebear.com/9.x/shapes/svg?seed=${seed}`;
  }
  return null;
};

// 预定义 20 个头像供选择器使用
export const SYSTEM_AVATARS = Array.from({ length: 20 }, (_, i) => ({
  key: `shapes_${i + 1}`,
  url: `https://api.dicebear.com/9.x/shapes/svg?seed=${i + 1}`
}));
