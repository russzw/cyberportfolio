'use client';

import React from 'react';
import { z } from 'zod';
import { CrudManager } from './CrudManager';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '../ui/form';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Button } from '../ui/button';
import { Pencil, Trash2 } from 'lucide-react';

const TestimonialSchema = z.object({
  author: z.string().min(1, 'Author is required.').default(''),
  role: z.string().min(1, 'Role is required.').default(''),
  text: z.string().min(1, 'Testimonial text is required.').default(''),
});

type Testimonial = z.infer<typeof TestimonialSchema> & { id: string };

const FormFields = (form: any) => (
  <>
    <FormField control={form.control} name="author" render={({ field }) => (
      <FormItem><FormLabel>Author</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
    )} />
    <FormField control={form.control} name="role" render={({ field }) => (
      <FormItem><FormLabel>Author's Role</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
    )} />
    <FormField control={form.control} name="text" render={({ field }) => (
      <FormItem><FormLabel>Testimonial</FormLabel><FormControl><Textarea {...field} /></FormControl><FormMessage /></FormItem>
    )} />
  </>
);

const RenderItem = (item: Testimonial, onEdit: (item: Testimonial) => void, onDelete: (id: string) => void) => (
  <div key={item.id} className="flex items-start justify-between gap-4 rounded-lg border p-3">
    <div>
        <h4 className="font-semibold">{item.author} <span className="text-sm text-muted-foreground font-normal">- {item.role}</span></h4>
        <blockquote className="mt-1 text-sm text-muted-foreground italic">"{item.text}"</blockquote>
    </div>
    <div className="flex gap-2">
      <Button variant="outline" size="icon" onClick={() => onEdit(item)}><Pencil className="h-4 w-4" /></Button>
      <Button variant="destructive" size="icon" onClick={() => onDelete(item.id)}><Trash2 className="h-4 w-4" /></Button>
    </div>
  </div>
);

export function TestimonialsManager() {
  return (
    <CrudManager
      collectionName="testimonials"
      Schema={TestimonialSchema}
      formFields={FormFields}
      renderItem={RenderItem}
      title="Testimonials"
      description="Manage client and colleague testimonials."
    />
  );
}
