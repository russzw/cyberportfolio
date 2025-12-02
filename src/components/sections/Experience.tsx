"use client"

import React, { useRef } from 'react';
import { Section } from "@/components/shared/Section";
import { AnimatedTitle } from "@/components/shared/AnimatedTitle";
import { cn } from "@/lib/utils";
import { useOnScreen } from "@/hooks/use-on-screen";
import type { ExperienceItem as Experience } from "@/lib/types";
import { Briefcase } from "lucide-react";

interface TimelineItemProps {
  item: Experience;
  isLast: boolean;
}

const TimelineItem: React.FC<TimelineItemProps> = ({ item, isLast }) => {
  const ref = useRef<HTMLDivElement>(null);
  const isVisible = useOnScreen(ref, { threshold: 0.5 });
  
  return (
    <div ref={ref} className={cn(
      "relative pl-10 md:pl-12 transition-all duration-500 ease-in-out",
      isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4',
      !isLast && "pb-12"
    )}>
      <div className="absolute left-0 top-1 h-full w-px bg-border">
        <div className={cn(
          "absolute left-1/2 top-0 h-4 w-4 -translate-x-1/2 rounded-full bg-background border-2 border-primary transition-all duration-500",
          isVisible ? 'scale-100' : 'scale-0'
        )} />
      </div>
      <div className="flex flex-col">
        <p className="text-sm font-semibold text-primary">{item.duration}</p>
        <h3 className="mt-1 text-lg font-bold text-foreground">{item.role}</h3>
        <p className="text-md text-muted-foreground">{item.company}</p>
        <p className="mt-2 text-base text-muted-foreground">{item.description}</p>
      </div>
    </div>
  );
};


export function Experience({ data }: { data: Experience[] }) {
  return (
    <Section id="experience">
      <AnimatedTitle text="Work Experience" />
      <div className="max-w-3xl mx-auto">
        <div className="relative">
          {data.map((item, index) => (
            <TimelineItem key={item.id} item={item} isLast={index === data.length - 1} />
          ))}
        </div>
      </div>
    </Section>
  );
}
