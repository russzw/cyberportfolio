import { Hero } from "@/components/sections/Hero";
import { About } from "@/components/sections/About";
import { Skills } from "@/components/sections/Skills";
import { Experience } from "@/components/sections/Experience";
import { Projects } from "@/components/sections/Projects";
import { Testimonials } from "@/components/sections/Testimonials";
import { Contact } from "@/components/sections/Contact";
import { getPortfolioData } from "@/lib/firestore";
import type { PortfolioData } from "@/lib/types";

export default async function Home() {
  const portfolioData: PortfolioData | null = await getPortfolioData();

  if (!portfolioData) {
    return (
      <div className="flex h-screen items-center justify-center bg-background text-foreground">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Content not available</h1>
          <p className="text-muted-foreground">
            Please check your Firebase configuration and make sure data is populated.
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Hero data={portfolioData.hero} />
      <About data={portfolioData.about} />
      <Skills data={portfolioData.skills} />
      <Experience data={portfolioData.experience} />
      <Projects data={portfolioData.projects} />
      <Testimonials data={portfolioData.testimonials} />
      <Contact />
    </>
  );
}
