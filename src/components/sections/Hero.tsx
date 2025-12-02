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

export function Hero({ data }: { data: HeroData }) {
  const heroRef = useRef<HTMLDivElement>(null);
  const nameRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const buttonRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (heroRef.current) {
      const tl = gsap.timeline({
        defaults: { duration: 0.8, ease: "power3.out" },
      });
      tl.fromTo(
        nameRef.current,
        { opacity: 0, y: 50 },
        { opacity: 1, y: 0 }
      )
        .fromTo(
          subtitleRef.current,
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0 },
          "-=0.6"
        )
        .fromTo(
          buttonRef.current,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0 },
          "-=0.6"
        );
    }
  }, [data]); // Rerun animation when data changes

  return (
    <section ref={heroRef} id="home" className="relative flex h-[80vh] min-h-[450px] w-full items-center justify-center">
      <CyberGridBackground />
      <div className="relative z-20 text-center">
        <h1
          ref={nameRef}
          className="text-5xl font-bold tracking-tighter md:text-7xl lg:text-8xl text-glow opacity-0"
        >
          {data.name}
        </h1>
        <p
          ref={subtitleRef}
          className="mt-4 text-lg text-muted-foreground md:text-xl opacity-0"
        >
          {data.subtitle}
        </p>
        <div ref={buttonRef} className="cta-button mt-8 opacity-0">
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
