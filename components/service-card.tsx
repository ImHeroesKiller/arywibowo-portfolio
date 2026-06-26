import type { LucideIcon } from "lucide-react";

import { HighlightedText } from "@/components/HighlightedText";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

type ServiceCardProps = {
  icon: LucideIcon;
  title: string;
  usp: string;
  description?: string;
  features?: string[];
  variant?: "compact" | "detailed";
};

export function ServiceCard({
  icon: Icon,
  title,
  usp,
  description,
  features,
  variant = "compact",
}: ServiceCardProps) {
  return (
    <Card
      className={cn(
        "group relative h-full overflow-hidden border-border/60 bg-card/80 transition-all duration-300 ease-out",
        "hover:-translate-y-1 hover:border-primary/40 hover:bg-card hover:shadow-xl hover:shadow-primary/10",
        variant === "detailed" && "flex flex-col"
      )}
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/60 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      <div className="pointer-events-none absolute -right-8 -top-8 size-32 rounded-full bg-primary/5 blur-2xl transition-all duration-500 group-hover:bg-primary/10" />

      <CardHeader className="relative gap-3 pb-0">
        <div className="mb-1 flex size-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary/15 to-primary/5 text-primary ring-1 ring-primary/15 transition-all duration-300 group-hover:scale-105 group-hover:from-primary/25 group-hover:to-primary/10 group-hover:ring-primary/30">
          <Icon className="size-5" />
        </div>
        <CardTitle className="text-lg font-semibold leading-snug tracking-tight sm:text-xl">
          {title}
        </CardTitle>
        <CardDescription
          className={cn(
            "text-sm leading-relaxed sm:text-[0.9375rem]",
            variant === "detailed"
              ? "font-medium text-muted-foreground"
              : "text-muted-foreground"
          )}
        >
          <HighlightedText text={usp} />
        </CardDescription>
      </CardHeader>

      {variant === "detailed" && (description || features?.length) && (
        <CardContent className="relative flex flex-1 flex-col gap-5 pt-4">
          {description && (
            <HighlightedText
              as="p"
              text={description}
              className="text-sm leading-7 text-muted-foreground sm:text-[0.9375rem]"
            />
          )}
          {features && features.length > 0 && (
            <ul className="mt-auto space-y-2.5 border-t border-border/50 pt-4">
              {features.map((feature) => (
                <li
                  key={feature}
                  className="flex items-start gap-2.5 text-sm leading-relaxed text-muted-foreground"
                >
                  <span className="mt-2 size-1.5 shrink-0 rounded-full bg-primary shadow-[0_0_6px] shadow-primary/50" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      )}
    </Card>
  );
}