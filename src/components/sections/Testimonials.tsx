"use client"

import React from 'react';
import { Section } from "@/components/shared/Section";
import { AnimatedTitle } from "@/components/shared/AnimatedTitle";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import type { Testimonial } from "@/lib/types";

function TestimonialCard({ testimonial }: { testimonial: Testimonial }) {
  return (
    <Card className="h-full flex flex-col bg-card/80 border-border/50 neon-border">
      <CardHeader>
        <div className="flex items-center gap-4">
          <div>
            <p className="font-bold">{testimonial.author}</p>
            <p className="text-sm text-muted-foreground">{testimonial.role}</p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex-grow">
        <blockquote className="italic text-foreground/80">
          “{testimonial.text}”
        </blockquote>
      </CardContent>
    </Card>
  );
}

export function Testimonials({ data }: { data: Testimonial[] }) {
  return (
    <Section id="testimonials">
      <AnimatedTitle text="Testimonials" />
      <Carousel
        opts={{
          align: "start",
          loop: true,
        }}
        className="w-full max-w-4xl mx-auto"
      >
        <CarouselContent>
          {data.map((testimonial, index) => (
            <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/2 p-4">
               <TestimonialCard testimonial={testimonial} />
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </Section>
  );
}
