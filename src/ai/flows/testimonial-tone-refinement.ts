'use server';

/**
 * @fileOverview Refines the tone of a testimonial using GenAI to sound more authentic and compelling.
 *
 * - refineTestimonialTone - A function that refines the testimonial tone.
 * - RefineTestimonialToneInput - The input type for the refineTestimonialTone function.
 * - RefineTestimonialToneOutput - The return type for the refineTestimonialTone function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const RefineTestimonialToneInputSchema = z.object({
  testimonial: z
    .string()
    .describe('The original testimonial text to be refined.'),
});
export type RefineTestimonialToneInput = z.infer<typeof RefineTestimonialToneInputSchema>;

const RefineTestimonialToneOutputSchema = z.object({
  refinedTestimonial: z
    .string()
    .describe('The refined testimonial text with an improved tone.'),
});
export type RefineTestimonialToneOutput = z.infer<typeof RefineTestimonialToneOutputSchema>;

export async function refineTestimonialTone(
  input: RefineTestimonialToneInput
): Promise<RefineTestimonialToneOutput> {
  return refineTestimonialToneFlow(input);
}

const refineTestimonialTonePrompt = ai.definePrompt({
  name: 'refineTestimonialTonePrompt',
  input: {schema: RefineTestimonialToneInputSchema},
  output: {schema: RefineTestimonialToneOutputSchema},
  prompt: `You are an expert marketing copywriter specializing in refining testimonial content.

  Given the original testimonial, rewrite it to sound more authentic and compelling while preserving the original meaning.

  Original Testimonial: {{{testimonial}}}

  Refined Testimonial:`,
});

const refineTestimonialToneFlow = ai.defineFlow(
  {
    name: 'refineTestimonialToneFlow',
    inputSchema: RefineTestimonialToneInputSchema,
    outputSchema: RefineTestimonialToneOutputSchema,
  },
  async input => {
    const {output} = await refineTestimonialTonePrompt(input);
    return output!;
  }
);
