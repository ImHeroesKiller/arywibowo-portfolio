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

const cardBaseClass =
  "group h-full border-border/60 bg-card/80 transition-all duration-300 ease-out hover:-translate-y-0.5 hover:border-primary/35 hover:bg-card hover:shadow-lg hover:shadow-primary/10";

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
    <Card className={cn(cardBaseClass, variant === "detailed" && "flex flex-col")}>
      <CardHeader className="gap-3 pb-0">
        <div className="mb-1 flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors duration-300 group-hover:bg-primary/20 group-hover:scale-105">
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
        <CardContent className="flex flex-1 flex-col gap-5 pt-4">
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
                  <span className="mt-2 size-1.5 shrink-0 rounded-full bg-primary" />
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