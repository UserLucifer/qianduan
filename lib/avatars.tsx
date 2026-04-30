"use client";

/**
 * 头像工具函数：根据 Key 智能还原不同风格的 DiceBear URL
 * 支持前缀：
 * - shapes_  -> Shapes 风格
 * - bigears_ -> Big Ears 风格
 * - bottts_  -> Bottts 风格
 */
export const getAvatarUrl = (key?: string | null) => {
  if (!key) return null;
  
  if (key.startsWith("shapes_")) {
    const seed = key.split("_")[1];
    return `https://api.dicebear.com/9.x/shapes/svg?seed=${seed}`;
  }
  
  if (key.startsWith("bigears_")) {
    const seed = key.split("_")[1];
    return `https://api.dicebear.com/9.x/big-ears/svg?seed=${seed}`;
  }
  
  if (key.startsWith("bottts_")) {
    const seed = key.split("_")[1];
    return `https://api.dicebear.com/9.x/bottts/svg?seed=${seed}`;
  }
  
  return null;
};

// 预定义各风格的 20 个种子
export const AVATAR_STYLES = [
  { id: "shapes", name: "极简几何", prefix: "shapes_" },
  { id: "bigears", name: "萌系动物", prefix: "bigears_" },
  { id: "bottts", name: "科技机器人", prefix: "bottts_" },
];

export const getAvatarsByStyle = (styleId: string) => {
  const style = AVATAR_STYLES.find(s => s.id === styleId);
  if (!style) return [];
  
  return Array.from({ length: 20 }, (_, i) => ({
    key: `${style.prefix}${i + 1}`,
    url: getAvatarUrl(`${style.prefix}${i + 1}`)!
  }));
};
