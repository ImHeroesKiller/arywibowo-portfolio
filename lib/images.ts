export type OptimizedImageSources = {
  avif: string;
  webp: string;
  fallback: string;
  width: number;
  height: number;
};

export const profileImage: OptimizedImageSources = {
  avif: "/images/profile.avif",
  webp: "/images/profile.webp",
  fallback: "/images/profile.png",
  width: 586,
  height: 880,
};