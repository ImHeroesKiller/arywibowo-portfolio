export const siteConfig = {
  name: "Ary Wibowo",
  title: "Ary Wibowo — Portfolio",
  description:
    "Full-stack developer & digital solutions specialist. Building modern web applications with Next.js, TypeScript, and cloud infrastructure.",
  url: "https://arywibowo.vercel.app",
  email: "hello@arywibowo.dev",
  github: "https://github.com/arywibowo",
  linkedin: "https://linkedin.com/in/arywibowo",
} as const;

export const navLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/services", label: "Services" },
  { href: "/projects", label: "Projects" },
  { href: "/contact", label: "Contact" },
] as const;