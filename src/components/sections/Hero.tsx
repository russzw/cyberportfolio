"use client";

import React, { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { Button } from "@/components/ui/button";
import { ArrowDown } from "lucide-react";
import { cn } from "@/lib/utils";
import type { HeroData } from "@/lib/types";

const CyberGridBackground = () => (
  <div className="absolute inset-0 z-0 overflow-hidden bg-background">
    <div
      className={cn(
        "absolute inset-[-100%] h-[300%] w-[300%]",
        "bg-[linear-gradient(to_right,hsl(var(--border))_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--border))_1px,transparent_1px)]",
        "bg-[size:2rem_2rem]",
        "animate-[grid-glow_20s_linear_infinite]"
      )}
    />
    <div className="absolute inset-0 z-10 bg-[radial-gradient(circle_at_center,transparent_0,hsl(var(--background))_70%)]" />
  </div>
);

const AnimatedText = ({ text, className, delay = 0 }: { text: string; className?: string, delay?: number }) => {
  return (
    <div className={cn("overflow-hidden", className)}>
      <div className="animate-text-reveal" style={{ animationDelay: `${delay}s` }}>
        {text}
      </div>
    </div>
  );
};

export function Hero({ data }: { data: HeroData }) {
  const heroRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".animate-text-reveal",
        { yPercent: 100 },
        { yPercent: 0, duration: 1, ease: "power3.out", stagger: 0.2 }
      );
      gsap.fromTo(
        ".cta-button",
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.8, ease: "power3.out", delay: 1 }
      );
    }, heroRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={heroRef} id="home" className="relative flex h-[calc(100vh-4rem)] min-h-[500px] w-full items-center justify-center">
      <CyberGridBackground />
      <div className="relative z-20 text-center">
        <AnimatedText
          text={data.name}
          className="text-5xl font-bold tracking-tighter md:text-7xl lg:text-8xl text-glow"
        />
        <AnimatedText
          text={data.subtitle}
          className="mt-4 text-lg text-muted-foreground md:text-xl"
          delay={0.2}
        />
        <div className="cta-button mt-8">
          <Button asChild size="lg" className="group">
            <a href="#projects">
              View My Work
              <ArrowDown className="ml-2 h-4 w-4 transition-transform group-hover:translate-y-1" />
            </a>
          </Button>
        </div>
      </div>
    </section>
  );
}
