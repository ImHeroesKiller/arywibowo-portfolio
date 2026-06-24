import type { MetadataRoute } from "next";

import { siteConfig } from "@/lib/constants";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${siteConfig.name} | Profesional Consultant`,
    short_name: siteConfig.name,
    description:
      "Mendampingi bisnis tumbuh melalui konsultasi strategis — renewable energy, business development, IT & digital transformation, HR & operations, sales & project management, hingga financial solutions.",
    start_url: "/",
    scope: "/",
    display: "standalone",
    orientation: "portrait",
    theme_color: "#111111",
    background_color: "#111111",
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
        src: "/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}