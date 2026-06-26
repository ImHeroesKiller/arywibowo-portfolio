import { HighlightedText } from "@/components/HighlightedText";
import { cn } from "@/lib/utils";

type ServicesPositioningProps = {
  eyebrow: string;
  title: string;
  description: string;
  className?: string;
};

export function ServicesPositioning({
  eyebrow,
  title,
  description,
  className,
}: ServicesPositioningProps) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl border border-border/60 bg-card/40 p-6 sm:p-8",
        className
      )}
    >
      <div className="pointer-events-none absolute -right-12 -top-12 size-40 rounded-full bg-primary/5 blur-3xl" />
      <div className="relative mx-auto max-w-3xl text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-primary sm:text-sm">
          {eyebrow}
        </p>
        <h3 className="mt-3 text-xl font-semibold leading-snug text-foreground sm:text-2xl">
          {title}
        </h3>
        <HighlightedText
          as="p"
          text={description}
          className="mt-4 text-sm leading-7 text-muted-foreground sm:text-base sm:leading-8"
        />
      </div>
    </div>
  );
}