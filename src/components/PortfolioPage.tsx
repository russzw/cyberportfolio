'use client';

import React, { useState, useEffect } from 'react';
import { Hero } from "@/components/sections/Hero";
import { About } from "@/components/sections/About";
import { Skills } from "@/components/sections/Skills";
import { Experience } from "@/components/sections/Experience";
import { Projects } from "@/components/sections/Projects";
import { Testimonials } from "@/components/sections/Testimonials";
import { Contact } from "@/components/sections/Contact";
import { getPortfolioData } from "@/lib/firestore";
import type { PortfolioData } from "@/lib/types";
import { useFirestore } from '@/firebase';
import { Skeleton } from './ui/skeleton';

export function PortfolioPage() {
  const firestore = useFirestore();
  const [portfolioData, setPortfolioData] = useState<PortfolioData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      if (firestore) {
        setIsLoading(true);
        const data = await getPortfolioData(firestore);
        setPortfolioData(data);
        setIsLoading(false);
      }
    }
    fetchData();
  }, [firestore]);

  if (isLoading) {
    return (
      <div className="space-y-12 my-12">
        <div className="container">
            <Skeleton className="h-96 w-full" />
        </div>
        <div className="container">
            <Skeleton className="h-48 w-full" />
        </div>
        <div className="container grid grid-cols-4 gap-4">
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
        </div>
      </div>
    )
  }

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
