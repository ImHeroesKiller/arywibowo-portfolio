import type { Metadata } from "next";
import { Cloud, Database, Globe, Settings } from "lucide-react";

import { FadeIn, PageTransition } from "@/components/page-transition";
import { SectionHeader } from "@/components/section-header";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Web development, ERP integration, cloud infrastructure, and custom software solutions.",
};

const services = [
  {
    icon: Globe,
    title: "Web Development",
    description:
      "Modern, performant web applications built with Next.js, React, and TypeScript. From landing pages to complex SaaS platforms.",
    features: [
      "Responsive UI/UX",
      "SSR & SSG optimization",
      "API development",
      "Third-party integrations",
    ],
  },
  {
    icon: Database,
    title: "ERP Integration",
    description:
      "Seamless ERPNext and Odoo implementations — custom modules, workflows, and business process automation.",
    features: [
      "Custom module development",
      "Data migration",
      "Workflow automation",
      "Reporting & dashboards",
    ],
  },
  {
    icon: Cloud,
    title: "Cloud Infrastructure",
    description:
      "Reliable, scalable cloud deployments on AWS and GCP. CI/CD pipelines, containerization, and monitoring.",
    features: [
      "Docker & Kubernetes",
      "CI/CD pipelines",
      "Server management",
      "Performance optimization",
    ],
  },
  {
    icon: Settings,
    title: "Consulting & Support",
    description:
      "Technical advisory, code reviews, architecture planning, and ongoing maintenance for existing systems.",
    features: [
      "Architecture review",
      "Code audits",
      "Performance tuning",
      "Ongoing maintenance",
    ],
  },
];

export default function ServicesPage() {
  return (
    <PageTransition>
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
        <FadeIn>
          <SectionHeader
            eyebrow="Services"
            title="What I can help you with"
            description="Tailored solutions for startups, SMEs, and enterprises — from concept to deployment and beyond."
            align="center"
            className="mx-auto"
          />
        </FadeIn>

        <div className="mt-16 grid gap-6 sm:grid-cols-2">
          {services.map((service, index) => (
            <FadeIn key={service.title} delay={index * 0.1}>
              <Card className="h-full border-border/60 bg-card/80 transition-colors hover:border-primary/40">
                <CardHeader>
                  <div className="mb-2 flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <service.icon className="size-5" />
                  </div>
                  <CardTitle>{service.title}</CardTitle>
                  <CardDescription>{service.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
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