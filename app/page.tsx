import { About } from "@/components/about";
import { Hero } from "@/components/hero";
import { PageTransition } from "@/components/page-transition";
import { Services } from "@/components/services";

export default function HomePage() {
  return (
    <PageTransition>
      <Hero />
      <Services />
      <About />
    </PageTransition>
  );
}