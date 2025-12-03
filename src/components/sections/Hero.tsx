
"use client";

import React, { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { SplitText } from "gsap/SplitText";
import { Button } from "@/components/ui/button";
import { ArrowDown } from "lucide-react";
import { cn } from "@/lib/utils";
import type { HeroData } from "@/lib/types";

gsap.registerPlugin(SplitText);

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
    let ctx = gsap.context(() => {
        if (!nameRef.current || !subtitleRef.current) return;
        
        // Wrap words in divs for proper line breaking
        nameRef.current.innerHTML = data.name.split(' ').map(word => `<div>${word}</div>`).join(' ');
        subtitleRef.current.innerHTML = data.subtitle.split(' ').map(word => `<div>${word}</div>`).join(' ');

        const nameWords = gsap.utils.toArray<HTMLDivElement>(nameRef.current.children);
        const subtitleWords = gsap.utils.toArray<HTMLDivElement>(subtitleRef.current.children);

        const tl = gsap.timeline();
        
        nameWords.forEach(word => {
            const chars = new SplitText(word, { type: "chars" }).chars;
            tl.from(chars, {
                opacity: 0,
                y: 20,
                stagger: 0.05,
                ease: "power3.out",
            }, "-=0.2"); // Overlap animations slightly
        });
        
        subtitleWords.forEach(word => {
             const chars = new SplitText(word, { type: "chars" }).chars;
             tl.from(chars, {
                opacity: 0,
                y: 15,
                stagger: 0.02,
                ease: "power3.out",
            }, "-=0.2");
        });

        tl.fromTo(
          buttonRef.current,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, ease: "power3.out", duration: 0.8 },
          "-=0.4"
        );
    }, heroRef);
    
    return () => ctx.revert();
  }, [data]);

  return (
    <section ref={heroRef} id="home" className="relative flex h-[70vh] min-h-[450px] w-full items-center justify-center">
      <CyberGridBackground />
      <div className="relative z-20 text-center">
        <h1
          ref={nameRef}
          className="text-5xl font-bold tracking-tighter md:text-7xl lg:text-8xl text-glow flex flex-wrap justify-center gap-x-4"
        >
          {/* Content will be injected by GSAP */}
        </h1>
        <p
          ref={subtitleRef}
          className="mt-4 text-lg text-muted-foreground md:text-xl flex flex-wrap justify-center gap-x-2"
        >
          {/* Content will be injected by GSAP */}
        </p>
        <div ref={buttonRef} className="cta-button mt-8">
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
