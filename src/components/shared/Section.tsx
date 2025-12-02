"use client";

import React, { useRef } from 'react';
import { cn } from '@/lib/utils';
import { useOnScreen } from '@/hooks/use-on-screen';

interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  id: string;
  children: React.ReactNode;
  className?: string;
}

export const Section = React.forwardRef<HTMLElement, SectionProps>(
  ({ id, children, className, ...props }, ref) => {
    const internalRef = useRef<HTMLElement>(null);
    const isVisible = useOnScreen(internalRef, { threshold: 0.1, rootMargin: '-100px' });

    // Use the forwarded ref if it exists, otherwise use the internal ref
    const sectionRef = (ref || internalRef) as React.RefObject<HTMLElement>;

    return (
      <section
        id={id}
        ref={sectionRef}
        className={cn(
          "w-full container py-16 md:py-24 transition-all duration-700 ease-out",
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8',
          className
        )}
        {...props}
      >
        {children}
      </section>
    );
  }
);

Section.displayName = 'Section';
