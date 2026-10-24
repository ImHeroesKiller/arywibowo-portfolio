"use client";

import { useEffect, useState } from "react";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslations } from "next-intl";

import Logo from "@/components/Logo";
import { LanguageSwitcher } from "@/components/language-switcher";
import { Button } from "@/components/ui/button";
import { Link, usePathname } from "@/i18n/navigation";
import { navPaths } from "@/lib/navigation";
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

export default function Navbar() {
  const pathname = usePathname();
  const t = useTranslations("nav");
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

  useEffect(() => {
    if (!mobileOpen) return;
    const onEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMobileOpen(false);
        document.getElementById("mobile-nav-toggle")?.focus();
      }
    };
    window.addEventListener("keydown", onEscape);
    return () => window.removeEventListener("keydown", onEscape);
  }, [mobileOpen]);

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/70 bg-white/90 shadow-[0_2px_18px_rgba(28,58,118,0.035)] backdrop-blur-xl">
      <a href="#main-content" className="sr-only absolute left-3 top-2 z-[100] rounded-md bg-primary px-4 py-2 font-medium text-primary-foreground focus:not-sr-only">
        {t("skipToMain")}
      </a>
      <nav aria-label={t("primaryNavigation")} className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-3 px-4 sm:h-[72px] sm:px-6 lg:px-8">
        <Logo />

        <ul className="hidden items-center gap-1 lg:flex">
          {navPaths.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                aria-current={pathname === link.href ? "page" : undefined}
                className={cn(
                  "relative rounded-lg px-3 py-2 text-[13px] font-medium transition-colors",
                  pathname === link.href
                    ? "text-primary after:absolute after:bottom-0 after:left-3 after:right-3 after:h-[2px] after:rounded-full after:bg-primary"
                    : "text-slate-600 hover:bg-blue-50 hover:text-primary"
                )}
              >
                {t(link.key)}
              </Link>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2">
          <LanguageSwitcher />

          <div className="hidden sm:block">
            <Button render={<Link href="/contact" />} size="sm">
              {t("getInTouch")} <ArrowUpRight className="ml-1 size-4" />
            </Button>
          </div>

          <Button
            id="mobile-nav-toggle"
            aria-controls="mobile-navigation"
            variant="ghost"
            size="icon"
            className="shrink-0 lg:hidden"
            onClick={() => setMobileOpen((prev) => !prev)}
            aria-label={mobileOpen ? t("closeMenu") : t("openMenu")}
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
            id="mobile-navigation"
            role="region"
            aria-label={t("mobileNavigation")}
            variants={menuVariants}
            initial="closed"
            animate="open"
            exit="exit"
            className="overflow-hidden border-t border-border/60 bg-background/95 backdrop-blur-md lg:hidden"
          >
            <ul className="flex flex-col gap-1 px-4 py-4">
              {navPaths.map((link) => (
                <motion.li key={link.href} variants={itemVariants}>
                  <Link
                    href={link.href}
                    aria-current={pathname === link.href ? "page" : undefined}
                    onClick={() => setMobileOpen(false)}
                    className={cn(
                      "block rounded-xl px-4 py-3 text-sm font-medium transition-colors",
                      pathname === link.href
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    )}
                  >
                    {t(link.key)}
                  </Link>
                </motion.li>
              ))}
              <motion.li variants={itemVariants} className="pt-2">
                <Button
                  render={<Link href="/contact" />}
                  className="w-full"
                  onClick={() => setMobileOpen(false)}
                >
                  {t("getInTouch")}
                </Button>
              </motion.li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}