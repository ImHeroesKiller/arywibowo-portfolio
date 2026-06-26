import { cn } from "@/lib/utils";
import type { OptimizedImageSources } from "@/lib/images";

type OptimizedPictureProps = {
  sources: OptimizedImageSources;
  alt: string;
  priority?: boolean;
  sizes?: string;
  fit?: "contain" | "cover";
  className?: string;
  imgClassName?: string;
  fill?: boolean;
};

export function OptimizedPicture({
  sources,
  alt,
  priority = false,
  sizes,
  fit = "cover",
  className,
  imgClassName,
  fill = false,
}: OptimizedPictureProps) {
  const objectClass =
    fit === "cover" ? "object-cover" : "object-contain";

  return (
    <picture className={cn(fill && "absolute inset-0 block", className)}>
      <source srcSet={sources.avif} type="image/avif" sizes={sizes} />
      <source srcSet={sources.webp} type="image/webp" sizes={sizes} />
      <img
        src={sources.fallback}
        alt={alt}
        width={sources.width}
        height={sources.height}
        sizes={sizes}
        loading={priority ? "eager" : "lazy"}
        decoding={priority ? "sync" : "async"}
        fetchPriority={priority ? "high" : "auto"}
        className={cn(
          fill ? "size-full" : "h-auto max-w-full",
          objectClass,
          imgClassName
        )}
      />
    </picture>
  );
}