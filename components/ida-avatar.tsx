import { cn } from "@/lib/utils";

const sizeStyles = {
  sm: { className: "size-8", dimension: 32 },
  md: { className: "size-10", dimension: 40 },
  lg: { className: "size-12", dimension: 48 },
} as const;

type IdaAvatarProps = {
  alt?: string;
  className?: string;
  size?: keyof typeof sizeStyles;
};

export function IdaAvatar({
  alt = "IDA Assistant",
  className,
  size = "sm",
}: IdaAvatarProps) {
  const { className: sizeClass, dimension } = sizeStyles[size];

  return (
    <img
      src="/images/ida-avatar.png"
      alt={alt}
      width={dimension}
      height={dimension}
      className={cn(sizeClass, "rounded-full object-contain", className)}
    />
  );
}