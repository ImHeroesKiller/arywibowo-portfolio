import { HighlightedText } from "@/components/HighlightedText";
import { cn } from "@/lib/utils";

type ServicesPositioningProps = {
  title: string;
  description: string;
  className?: string;
};

export function ServicesPositioning({
  title,
  description,
  className,
}: ServicesPositioningProps) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/10 via-card/80 to-card/60 p-6 shadow-sm sm:p-8",
        className
      )}
    >
      <div className="pointer-events-none absolute -right-12 -top-12 size-40 rounded-full bg-primary/10 blur-3xl" />
      <div className="relative max-w-3xl">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-primary sm:text-sm">
          PERADA GROUP
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