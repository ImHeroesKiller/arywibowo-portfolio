import type { Metadata } from "next";

import { FadeIn, PageTransition } from "@/components/page-transition";
import { SectionHeader } from "@/components/section-header";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

export const metadata: Metadata = {
  title: "About",
  description: "Learn more about Ary Wibowo — background, skills, and experience.",
};

const skills = [
  "Next.js",
  "TypeScript",
  "React",
  "Node.js",
  "PostgreSQL",
  "Docker",
  "AWS / GCP",
  "ERPNext / Odoo",
  "Python",
  "Tailwind CSS",
];

const experience = [
  {
    period: "2023 — Present",
    role: "Full-Stack Developer",
    company: "Freelance & Contract",
    description:
      "Building custom web applications, ERP integrations, and cloud infrastructure for clients across industries.",
  },
  {
    period: "2021 — 2023",
    role: "Software Engineer",
    company: "Enterprise Solutions",
    description:
      "Developed and maintained ERP systems, automated business workflows, and led technical implementations.",
  },
];

export default function AboutPage() {
  return (
    <PageTransition>
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
        <FadeIn>
          <SectionHeader
            eyebrow="About Me"
            title="Developer, problem-solver, builder"
            description="I combine technical depth with business understanding to deliver software that actually works in the real world."
          />
        </FadeIn>

        <div className="mt-16 grid gap-12 lg:grid-cols-2">
          <FadeIn delay={0.1}>
            <div className="space-y-4 text-muted-foreground">
              <p>
                Hi, I&apos;m <strong className="text-foreground">Ary Wibowo</strong>.
                I&apos;m a full-stack developer based in Indonesia with a passion
                for building robust, scalable digital products.
              </p>
              <p>
                My work spans modern web development with Next.js and TypeScript,
                enterprise resource planning with ERPNext and Odoo, and cloud
                infrastructure on AWS and GCP.
              </p>
              <p>
                I believe great software is built at the intersection of clean
                code, thoughtful UX, and deep understanding of business needs.
              </p>
            </div>
          </FadeIn>

          <FadeIn delay={0.2}>
            <div>
              <h3 className="text-lg font-semibold">Skills & Technologies</h3>
              <div className="mt-4 flex flex-wrap gap-2">
                {skills.map((skill) => (
                  <Badge key={skill} variant="secondary">
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>
          </FadeIn>
        </div>

        <Separator className="my-16" />

        <FadeIn>
          <SectionHeader eyebrow="Experience" title="Professional journey" />
        </FadeIn>

        <div className="mt-10 space-y-8">
          {experience.map((item, index) => (
            <FadeIn key={item.role} delay={index * 0.1}>
              <div className="rounded-xl border border-border/60 bg-card/50 p-6">
                <p className="text-sm font-medium text-primary">{item.period}</p>
                <h3 className="mt-1 text-lg font-semibold">{item.role}</h3>
                <p className="text-sm text-muted-foreground">{item.company}</p>
                <p className="mt-3 text-muted-foreground">{item.description}</p>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </PageTransition>
  );
}