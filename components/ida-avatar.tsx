import { cn } from "@/lib/utils";

type IdaAvatarProps = {
  alt?: string;
  className?: string;
};

export function IdaAvatar({
  alt = "IDA Assistant",
  className,
}: IdaAvatarProps) {
  return (
    <img
      src="/images/ida-avatar.png"
      alt={alt}
      width={32}
      height={32}
      className={cn("size-8 rounded-full object-contain", className)}
    />
  );
}