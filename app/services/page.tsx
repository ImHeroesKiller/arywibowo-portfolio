import type { Metadata } from "next";

import { FadeIn, PageTransition } from "@/components/page-transition";
import { SectionHeader } from "@/components/section-header";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { services } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Layanan konsultasi profesional: Renewable Energy, Business Development, IT & Digital, HR Consulting, Sales & Project Management, Financial Solutions.",
};

export default function ServicesPage() {
  return (
    <PageTransition>
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
        <FadeIn>
          <SectionHeader
            eyebrow="Services"
            title="Layanan konsultasi lengkap"
            description="Solusi terintegrasi untuk mendukung transformasi bisnis Anda — dari strategi hingga eksekusi."
            align="center"
            className="mx-auto"
          />
        </FadeIn>

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service, index) => (
            <FadeIn key={service.id} delay={index * 0.08}>
              <Card className="group flex h-full flex-col border-border/60 bg-card/80 transition-all duration-300 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5">
                <CardHeader>
                  <div className="mb-3 flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary/20">
                    <service.icon className="size-5" />
                  </div>
                  <CardTitle>{service.title}</CardTitle>
                  <CardDescription className="font-medium text-primary/90">
                    {service.usp}
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-1 flex-col">
                  <p className="mb-4 text-sm leading-relaxed text-muted-foreground">
                    {service.description}
                  </p>
                  <ul className="mt-auto space-y-2">
                    {service.features.map((feature) => (
                      <li
                        key={feature}
                        className="flex items-center gap-2 text-sm text-muted-foreground"
                      >
                        <span className="size-1.5 shrink-0 rounded-full bg-primary" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </FadeIn>
          ))}
        </div>
      </div>
    </PageTransition>
  );
}