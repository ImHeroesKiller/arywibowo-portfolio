import type { Metadata } from "next";

import { About } from "@/components/about";
import { PageTransition } from "@/components/page-transition";

export const metadata: Metadata = {
  title: "About",
  description:
    "Profil profesional Ary Wibowo — konsultan di bidang SDM, manajemen proyek, dan transformasi digital.",
};

export default function AboutPage() {
  return (
    <PageTransition>
      <About showExperience className="border-t-0 bg-transparent" />
    </PageTransition>
  );
}