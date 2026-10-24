import type { MetadataRoute } from "next";

import { siteConfig } from "@/lib/constants";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${siteConfig.name} | Business & Technology Strategist`,
    short_name: siteConfig.name,
    description:
      "Portofolio strategi bisnis, AI, fintech, enterprise systems, serta produk digital dalam berbagai tahap pengembangan.",
    start_url: "/",
    scope: "/",
    id: "/",
    display: "standalone",
    orientation: "portrait",
    theme_color: "#172d75",
    background_color: "#f8fbff",
    categories: ["business", "productivity"],
    lang: "id",
    dir: "ltr",
    icons: [
      {
        src: "/icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icon-512-maskable.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
    screenshots: [
      {
        src: "/images/profile.webp",
        sizes: "586x880",
        type: "image/webp",
      },
      {
        src: "/icon-512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
    shortcuts: [
      {
        name: "Services",
        short_name: "Services",
        url: "/services",
        icons: [{ src: "/icon-192.png", sizes: "192x192", type: "image/png" }],
      },
      {
        name: "Contact",
        short_name: "Contact",
        url: "/contact",
        icons: [{ src: "/icon-192.png", sizes: "192x192", type: "image/png" }],
      },
    ],
  };
}