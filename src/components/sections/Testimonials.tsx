"use client"

import React, { useState } from 'react';
import { Section } from "@/components/shared/Section";
import { AnimatedTitle } from "@/components/shared/AnimatedTitle";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Loader2, Wand2 } from 'lucide-react';
import { refineTestimonialTone } from '@/ai/flows/testimonial-tone-refinement';
import type { Testimonial } from "@/lib/types";

function RefineToneDialog({ testimonial }: { testimonial: Testimonial }) {
  const [originalText] = useState(testimonial.text);
  const [refinedText, setRefinedText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleRefine = async () => {
    setIsLoading(true);
    setError('');
    setRefinedText('');
    try {
      const result = await refineTestimonialTone({ testimonial: originalText });
      setRefinedText(result.refinedTestimonial);
    } catch (e) {
      setError('Failed to refine testimonial. Please try again.');
      console.error(e);
    }
    setIsLoading(false);
  };

  return (
    <DialogContent className="sm:max-w-[625px]">
      <DialogHeader>
        <DialogTitle>Refine Testimonial Tone</DialogTitle>
        <DialogDescription>
          Use AI to make this testimonial sound more authentic and compelling.
        </DialogDescription>
      </DialogHeader>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
        <div className="space-y-2">
          <Label htmlFor="original">Original</Label>
          <Textarea id="original" value={originalText} readOnly className="h-48 resize-none" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="refined">Refined</Label>
          {isLoading ? (
            <div className="h-48 flex items-center justify-center rounded-md border border-dashed">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <Textarea id="refined" value={refinedText} readOnly placeholder="AI-refined version will appear here..." className="h-48 resize-none" />
          )}
        </div>
      </div>
       {error && <p className="text-sm text-destructive">{error}</p>}
      <div className="flex justify-end">
        <Button onClick={handleRefine} disabled={isLoading}>
          {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Wand2 className="mr-2 h-4 w-4" />}
          Generate
        </Button>
      </div>
    </DialogContent>
  );
}

function TestimonialCard({ testimonial }: { testimonial: Testimonial }) {
  return (
    <Card className="h-full flex flex-col bg-background/50 border-border/50 neon-border">
      <CardHeader>
        <div className="flex items-center gap-4">
          <div>
            <p className="font-bold">{testimonial.author}</p>
            <p className="text-sm text-muted-foreground">{testimonial.role}</p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex-grow">
        <blockquote className="italic text-foreground">
          “{testimonial.text}”
        </blockquote>
      </CardContent>
      <CardFooter>
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="ghost" size="sm">
              <Wand2 className="mr-2 h-4 w-4" />
              Refine with AI
            </Button>
          </DialogTrigger>
          <RefineToneDialog testimonial={testimonial} />
        </Dialog>
      </CardFooter>
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
