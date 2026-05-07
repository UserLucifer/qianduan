"use client";

/**
 * Avatar helpers that rebuild DiceBear URLs from persisted keys.
 * Supported prefixes:
 * - shapes_  -> Shapes style
 * - bigears_ -> Big Ears style
 * - bottts_  -> Bottts style
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

// Preset styles with 20 generated seeds per style.
export const AVATAR_STYLES = [
  { id: "shapes", name: "Minimal geometry", prefix: "shapes_" },
  { id: "bigears", name: "Playful avatars", prefix: "bigears_" },
  { id: "bottts", name: "Robot style", prefix: "bottts_" },
];

export const getAvatarsByStyle = (styleId: string) => {
  const style = AVATAR_STYLES.find(s => s.id === styleId);
  if (!style) return [];
  
  return Array.from({ length: 20 }, (_, i) => ({
    key: `${style.prefix}${i + 1}`,
    url: getAvatarUrl(`${style.prefix}${i + 1}`)!
  }));
};
