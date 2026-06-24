import Link from "next/link";
import { ArrowRight, Code2, Layers, Rocket } from "lucide-react";

import { FadeIn, PageTransition } from "@/components/page-transition";
import { SectionHeader } from "@/components/section-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const highlights = [
  {
    icon: Code2,
    title: "Full-Stack Development",
    description:
      "End-to-end web applications with Next.js, TypeScript, and modern APIs.",
  },
  {
    icon: Layers,
    title: "System Architecture",
    description:
      "Scalable infrastructure, ERP integrations, and cloud-native solutions.",
  },
  {
    icon: Rocket,
    title: "Rapid Delivery",
    description:
      "From prototype to production — fast iterations without sacrificing quality.",
  },
];

export default function HomePage() {
  return (
    <PageTransition>
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(59,130,246,0.15)_0%,_transparent_60%)]" />

        <div className="relative mx-auto max-w-6xl px-4 py-24 sm:px-6 sm:py-32 lg:px-8">
          <FadeIn>
            <Badge variant="secondary" className="mb-6">
              Available for new projects
            </Badge>
          </FadeIn>

          <FadeIn delay={0.1}>
            <h1 className="max-w-3xl text-4xl font-bold tracking-tight sm:text-6xl">
              Building digital products that{" "}
              <span className="text-primary">scale</span> and{" "}
              <span className="text-primary">deliver</span>.
            </h1>
          </FadeIn>

          <FadeIn delay={0.2}>
            <p className="mt-6 max-w-2xl text-lg text-muted-foreground">
              I&apos;m Ary Wibowo — a full-stack developer specializing in
              modern web apps, ERP systems, and cloud infrastructure. Let&apos;s
              turn your ideas into production-ready software.
            </p>
          </FadeIn>

          <FadeIn delay={0.3}>
            <div className="mt-10 flex flex-wrap gap-4">
              <Button render={<Link href="/projects" />} size="lg">
                View Projects
                <ArrowRight />
              </Button>
              <Button
                render={<Link href="/contact" />}
                variant="outline"
                size="lg"
              >
                Contact Me
              </Button>
            </div>
          </FadeIn>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:px-8">
        <FadeIn>
          <SectionHeader
            eyebrow="What I Do"
            title="Crafting solutions across the stack"
            description="From frontend polish to backend reliability — I bring a holistic approach to every project."
            align="center"
            className="mb-12"
          />
        </FadeIn>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {highlights.map((item, index) => (
            <FadeIn key={item.title} delay={index * 0.1}>
              <Card className="h-full border-border/60 bg-card/80 transition-colors hover:border-primary/40">
                <CardHeader>
                  <div className="mb-2 flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <item.icon className="size-5" />
                  </div>
                  <CardTitle>{item.title}</CardTitle>
                  <CardDescription>{item.description}</CardDescription>
                </CardHeader>
              </Card>
            </FadeIn>
          ))}
        </div>
      </section>

      <section className="border-t border-border/60 bg-card/30">
        <div className="mx-auto max-w-6xl px-4 py-20 text-center sm:px-6 lg:px-8">
          <FadeIn>
            <h2 className="text-2xl font-bold sm:text-3xl">
              Ready to start your next project?
            </h2>
            <p className="mx-auto mt-4 max-w-lg text-muted-foreground">
              Let&apos;s discuss how I can help you build something great.
            </p>
            <Button
              render={<Link href="/contact" />}
              size="lg"
              className="mt-8"
            >
              Let&apos;s Talk
              <ArrowRight />
            </Button>
          </FadeIn>
        </div>
      </section>
    </PageTransition>
  );
}