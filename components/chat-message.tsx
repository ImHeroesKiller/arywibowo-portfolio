"use client";

import type { ReactNode } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import { cn } from "@/lib/utils";

type ChatMessageProps = {
  content: string;
  role: "user" | "assistant";
};

const assistantMarkdownClass =
  "prose prose-sm prose-invert max-w-none break-words [&>*:first-child]:mt-0 [&>*:last-child]:mb-0";

const markdownComponents = {
  p: ({ children }: { children?: ReactNode }) => (
    <p className="mb-2 leading-relaxed last:mb-0">{children}</p>
  ),
  strong: ({ children }: { children?: ReactNode }) => (
    <strong className="font-semibold text-foreground">{children}</strong>
  ),
  em: ({ children }: { children?: ReactNode }) => (
    <em className="italic text-foreground/90">{children}</em>
  ),
  ul: ({ children }: { children?: ReactNode }) => (
    <ul className="mb-2 list-disc space-y-1 pl-4 last:mb-0">{children}</ul>
  ),
  ol: ({ children }: { children?: ReactNode }) => (
    <ol className="mb-2 list-decimal space-y-1 pl-4 last:mb-0">{children}</ol>
  ),
  li: ({ children }: { children?: ReactNode }) => (
    <li className="leading-relaxed">{children}</li>
  ),
  h1: ({ children }: { children?: ReactNode }) => (
    <h1 className="mb-2 text-base font-semibold text-foreground">{children}</h1>
  ),
  h2: ({ children }: { children?: ReactNode }) => (
    <h2 className="mb-2 text-sm font-semibold text-foreground">{children}</h2>
  ),
  h3: ({ children }: { children?: ReactNode }) => (
    <h3 className="mb-1.5 text-sm font-medium text-foreground">{children}</h3>
  ),
  code: ({ children }: { children?: ReactNode }) => (
    <code className="rounded bg-background/80 px-1 py-0.5 font-mono text-[0.8em] text-primary">
      {children}
    </code>
  ),
  pre: ({ children }: { children?: ReactNode }) => (
    <pre className="mb-2 overflow-x-auto rounded-lg border border-border/60 bg-background/80 p-2.5 text-xs last:mb-0">
      {children}
    </pre>
  ),
  a: ({ href, children }: { href?: string; children?: ReactNode }) => (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="font-medium text-primary underline-offset-2 hover:underline"
    >
      {children}
    </a>
  ),
  blockquote: ({ children }: { children?: ReactNode }) => (
    <blockquote className="mb-2 border-l-2 border-primary/50 pl-3 text-muted-foreground last:mb-0">
      {children}
    </blockquote>
  ),
};

export function ChatMessage({ content, role }: ChatMessageProps) {
  const isUser = role === "user";

  return (
    <div
      className={cn(
        "max-w-[88%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed",
        isUser
          ? "rounded-br-md bg-primary text-primary-foreground"
          : "rounded-bl-md border border-border/60 bg-muted/50 text-foreground"
      )}
    >
      {isUser ? (
        <p className="whitespace-pre-wrap">{content}</p>
      ) : (
        <div className={assistantMarkdownClass}>
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={markdownComponents}
          >
            {content}
          </ReactMarkdown>
        </div>
      )}
    </div>
  );
}