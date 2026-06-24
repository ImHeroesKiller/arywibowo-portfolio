import Image from "next/image";
import Link from "next/link";

import { siteConfig } from "@/lib/constants";
import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  imageClassName?: string;
  showName?: boolean;
  linkToHome?: boolean;
}

export function Logo({
  className,
  imageClassName,
  showName = false,
  linkToHome = true,
}: LogoProps) {
  const content = (
    <span
      className={cn(
        "inline-flex items-center gap-2.5 transition-opacity hover:opacity-90",
        className
      )}
    >
      <Image
        src={siteConfig.logo}
        alt={`${siteConfig.name} logo`}
        width={160}
        height={48}
        priority
        unoptimized
        className={cn(
          "h-8 w-auto bg-transparent object-contain sm:h-9",
          imageClassName
        )}
      />
      {showName && (
        <span className="text-base font-semibold tracking-tight text-foreground sm:text-lg">
          {siteConfig.name}
        </span>
      )}
    </span>
  );

  if (linkToHome) {
    return (
      <Link href="/" className="shrink-0">
        {content}
      </Link>
    );
  }

  return content;
}