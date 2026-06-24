"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import { Button } from "@/components/ui/button";
import { navLinks } from "@/lib/constants";
import { cn } from "@/lib/utils";

const menuVariants = {
  closed: { opacity: 0, height: 0 },
  open: {
    opacity: 1,
    height: "auto",
    transition: {
      duration: 0.35,
      ease: [0.25, 0.1, 0.25, 1] as const,
      staggerChildren: 0.05,
      delayChildren: 0.05,
    },
  },
  exit: {
    opacity: 0,
    height: 0,
    transition: { duration: 0.25, ease: [0.25, 0.1, 0.25, 1] as const },
  },
};

const itemVariants = {
  closed: { opacity: 0, x: -12 },
  open: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.3, ease: [0.25, 0.1, 0.25, 1] as const },
  },
};

export function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur-md">
      <nav className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:h-16 sm:px-6 lg:px-8">
        <ul className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className={cn(
                  "rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  pathname === link.href
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="ml-auto flex items-center gap-2">
          <div className="hidden md:block">
            <Button render={<Link href="/contact" />} size="sm">
              Get in Touch
            </Button>
          </div>

          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileOpen((prev) => !prev)}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
          >
            <motion.span
              key={mobileOpen ? "close" : "open"}
              initial={{ opacity: 0, rotate: -90 }}
              animate={{ opacity: 1, rotate: 0 }}
              transition={{ duration: 0.2 }}
              className="flex items-center justify-center"
            >
              {mobileOpen ? <X /> : <Menu />}
            </motion.span>
          </Button>
        </div>
      </nav>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            variants={menuVariants}
            initial="closed"
            animate="open"
            exit="exit"
            className="overflow-hidden border-t border-border/60 bg-background/95 backdrop-blur-md md:hidden"
          >
            <ul className="flex flex-col gap-1 px-4 py-4">
              {navLinks.map((link) => (
                <motion.li key={link.href} variants={itemVariants}>
                  <Link
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className={cn(
                      "block rounded-lg px-3 py-3 text-sm font-medium transition-colors",
                      pathname === link.href
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    )}
                  >
                    {link.label}
                  </Link>
                </motion.li>
              ))}
              <motion.li variants={itemVariants} className="pt-2">
                <Button
                  render={<Link href="/contact" />}
                  className="w-full"
                  onClick={() => setMobileOpen(false)}
                >
                  Get in Touch
                </Button>
              </motion.li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
