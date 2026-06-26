import { ArrowUpRight, CheckCircle2 } from "lucide-react";

import { HighlightedText } from "@/components/HighlightedText";
import { OptimizedPicture } from "@/components/optimized-picture";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cardHover } from "@/lib/layout-classes";
import type { OptimizedImageSources } from "@/lib/images";
import { cn } from "@/lib/utils";

type ProjectCardProps = {
  title: string;
  category: string;
  description: string;
  highlights: string[];
  highlightsTitle: string;
  imageSources: OptimizedImageSources;
  imageAlt: string;
  href: string;
  visitLabel: string;
  previewHost?: string;
  imageFit?: "contain" | "cover";
  variant?: "compact" | "detailed";
};

export function ProjectCard({
  title,
  category,
  description,
  highlights,
  highlightsTitle,
  imageSources,
  imageAlt,
  href,
  visitLabel,
  previewHost = "perada.net",
  imageFit = "contain",
  variant = "detailed",
}: ProjectCardProps) {
  const isCover = imageFit === "cover";

  return (
    <Card
      className={cn(
        "group relative flex h-full flex-col overflow-hidden border-border/60 bg-card/80",
        cardHover
      )}
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/60 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

      <div className="relative overflow-hidden border-b border-border/50 bg-muted/30">
        <div className="flex items-center gap-1.5 border-b border-border/40 bg-card/60 px-3 py-2">
          <span className="size-2 rounded-full bg-red-400/80" aria-hidden />
          <span className="size-2 rounded-full bg-amber-400/80" aria-hidden />
          <span className="size-2 rounded-full bg-emerald-400/80" aria-hidden />
          <span className="ml-2 truncate text-[10px] text-muted-foreground">
            {previewHost}
          </span>
        </div>
        <div
          className={cn(
            "relative aspect-[16/9] bg-gradient-to-br from-muted/50 via-background to-primary/5 transition-colors duration-300 group-hover:from-primary/5 group-hover:to-primary/10",
            !isCover && "flex items-center justify-center p-5 sm:p-6"
          )}
        >
          {isCover ? (
            <OptimizedPicture
              sources={imageSources}
              alt={imageAlt}
              fit="cover"
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 400px"
              imgClassName="opacity-90 transition-transform duration-500 group-hover:scale-[1.03]"
            />
          ) : (
            <OptimizedPicture
              sources={imageSources}
              alt={imageAlt}
              fit="contain"
              sizes="(max-width: 640px) 60vw, 240px"
              imgClassName="max-h-16 w-auto opacity-90 transition-transform duration-500 group-hover:scale-105 sm:max-h-20 lg:max-h-24"
            />
          )}
        </div>
      </div>

      <CardHeader className="gap-2.5 sm:gap-3">
        <span className="w-fit rounded-full border border-primary/25 bg-primary/10 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-primary">
          {category}
        </span>
        <CardTitle className="text-base font-semibold leading-snug tracking-tight sm:text-lg lg:text-xl">
          {title}
        </CardTitle>
      </CardHeader>

      <CardContent className="flex flex-1 flex-col gap-4 pb-5 sm:gap-5">
        <HighlightedText
          as="p"
          text={description}
          className="text-sm leading-7 text-muted-foreground sm:text-[0.9375rem]"
        />

        {variant === "detailed" && highlights.length > 0 && (
          <div className="space-y-3 border-t border-border/50 pt-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              {highlightsTitle}
            </p>
            <ul className="space-y-2">
              {highlights.map((highlight) => (
                <li
                  key={highlight}
                  className="flex items-start gap-2.5 text-sm leading-relaxed text-muted-foreground"
                >
                  <CheckCircle2
                    className="mt-0.5 size-4 shrink-0 text-primary"
                    aria-hidden
                  />
                  <span>{highlight}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-auto inline-flex items-center gap-1.5 rounded-md text-sm font-medium text-primary transition-colors hover:text-primary/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
        >
          {visitLabel}
          <ArrowUpRight
            className="size-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
            aria-hidden
          />
        </a>
      </CardContent>
    </Card>
  );
}