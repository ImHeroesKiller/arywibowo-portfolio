"use client";

import { motion } from "framer-motion";

import { HighlightedText } from "@/components/HighlightedText";
import { cn } from "@/lib/utils";

interface SectionHeaderProps {
  eyebrow?: string;
  title: string;
  description?: string;
  className?: string;
  align?: "left" | "center";
}

export function SectionHeader({
  eyebrow,
  title,
  description,
  className,
  align = "left",
}: SectionHeaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className={cn(
        "max-w-3xl",
        align === "center" && "mx-auto text-center",
        className
      )}
    >
      {eyebrow && (
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.14em] text-primary sm:mb-4 sm:text-sm">
          {eyebrow}
        </p>
      )}
      <h2 className="text-balance text-2xl font-bold leading-[1.2] tracking-tight text-foreground sm:text-3xl lg:text-4xl">
        <HighlightedText text={title} />
      </h2>
      {description && (
        <HighlightedText
          as="p"
          text={description}
          className="mt-4 text-base leading-7 text-muted-foreground sm:mt-5 sm:text-lg sm:leading-8"
        />
      )}
    </motion.div>
  );
}