"use client";

import Link from "next/link";

import { FadeIn } from "@/components/page-transition";
import { SectionHeader } from "@/components/section-header";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { services } from "@/lib/constants";
import { cn } from "@/lib/utils";

interface ServicesProps {
  showAll?: boolean;
  className?: string;
}

export function Services({ showAll = false, className }: ServicesProps) {
  const items = showAll ? services : services;

  return (
    <section className={cn("mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:px-8", className)}>
      <FadeIn>
        <SectionHeader
          eyebrow="Services"
          title="Solusi konsultasi terintegrasi"
          description={
            showAll
              ? "Layanan konsultasi profesional yang dirancang untuk mendukung pertumbuhan bisnis Anda di berbagai sektor."
              : "Renewable Energy, Business Development, IT & Digital, HR Consulting, Sales & Project Management, dan Financial Solutions — solusi terintegrasi dari strategi hingga eksekusi."
          }
          align="center"
          className="mx-auto mb-12"
        />
      </FadeIn>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((service, index) => (
          <FadeIn key={service.id} delay={index * 0.08}>
            <Card className="group h-full border-border/60 bg-card/80 transition-all duration-300 hover:border-primary/40 hover:bg-card hover:shadow-lg hover:shadow-primary/5">
              <CardHeader>
                <div className="mb-3 flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary/20">
                  <service.icon className="size-5" />
                </div>
                <CardTitle className="text-lg">{service.title}</CardTitle>
                <CardDescription className="text-sm leading-relaxed">
                  {service.usp}
                </CardDescription>
              </CardHeader>
            </Card>
          </FadeIn>
        ))}
      </div>

      {!showAll && (
        <FadeIn delay={0.5}>
          <p className="mt-10 text-center text-sm text-muted-foreground">
            Lihat detail lengkap di halaman{" "}
            <Link href="/services" className="font-medium text-primary hover:underline">
              Services
            </Link>
            .
          </p>
        </FadeIn>
      )}
    </section>
  );
}