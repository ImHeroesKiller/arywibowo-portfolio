import type { Metadata } from "next";
import Link from "next/link";
import { Code2, ExternalLink } from "lucide-react";

import { FadeIn, PageTransition } from "@/components/page-transition";
import { SectionHeader } from "@/components/section-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Projects",
  description: "Selected projects and case studies by Ary Wibowo.",
};

const projects = [
  {
    title: "PeradaGroup.web",
    description:
      "Corporate website with modern design, CMS integration, and optimized performance for a multi-division enterprise group.",
    tags: ["Next.js", "TypeScript", "Tailwind"],
    liveUrl: "#",
    githubUrl: "#",
  },
  {
    title: "ERP Portal System",
    description:
      "Custom ERP portal with role-based access, real-time dashboards, and automated reporting for manufacturing operations.",
    tags: ["ERPNext", "Python", "PostgreSQL"],
    liveUrl: "#",
    githubUrl: "#",
  },
  {
    title: "Lead Management Platform",
    description:
      "Full-stack CRM for lead tracking, pipeline management, and automated outreach with React frontend and Node.js API.",
    tags: ["React", "Node.js", "MongoDB"],
    liveUrl: "#",
    githubUrl: "#",
  },
  {
    title: "GL Web Application",
    description:
      "General ledger web application with double-entry bookkeeping, financial reports, and multi-company support.",
    tags: ["Next.js", "TypeScript", "Prisma"],
    liveUrl: "#",
    githubUrl: "#",
  },
];

export default function ProjectsPage() {
  return (
    <PageTransition>
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
        <FadeIn>
          <SectionHeader
            eyebrow="Portfolio"
            title="Selected projects"
            description="A collection of work spanning web apps, ERP systems, and business automation tools."
            align="center"
            className="mx-auto"
          />
        </FadeIn>

        <div className="mt-16 grid gap-6 sm:grid-cols-2">
          {projects.map((project, index) => (
            <FadeIn key={project.title} delay={index * 0.1}>
              <Card className="flex h-full flex-col border-border/60 bg-card/80 transition-colors hover:border-primary/40">
                <CardHeader>
                  <CardTitle>{project.title}</CardTitle>
                  <CardDescription>{project.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {project.tags.map((tag) => (
                      <Badge key={tag} variant="secondary">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
                <CardFooter className="mt-auto gap-2">
                  <Button
                    render={
                      <a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      />
                    }
                    variant="outline"
                    size="sm"
                  >
                    <ExternalLink />
                    Live Demo
                  </Button>
                  <Button
                    render={
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      />
                    }
                    variant="ghost"
                    size="sm"
                  >
                    <Code2 />
                    Source
                  </Button>
                </CardFooter>
              </Card>
            </FadeIn>
          ))}
        </div>

        <FadeIn delay={0.4}>
          <p className="mt-12 text-center text-muted-foreground">
            More projects available on{" "}
            <Link href="/contact" className="text-primary hover:underline">
              request
            </Link>
            .
          </p>
        </FadeIn>
      </div>
    </PageTransition>
  );
}