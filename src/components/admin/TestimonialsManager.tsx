'use client';

import React from 'react';
import { z } from 'zod';
import { CrudManager } from './CrudManager';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '../ui/form';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Button } from '../ui/button';
import { Pencil, Trash2 } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';
import { cn } from '@/lib/utils';
import type { Testimonial } from '@/lib/types';
import { Skeleton } from '../ui/skeleton';


const TestimonialSchema = z.object({
  author: z.string().min(1, 'Author is required.').default(''),
  role: z.string().min(1, 'Role is required.').default(''),
  text: z.string().min(1, 'Testimonial text is required.').default(''),
});


const FormFields = (form: any) => (
  <>
    <FormField control={form.control} name="author" render={({ field }) => (
      <FormItem><FormLabel>Author</FormLabel><FormControl><Input {...field} value={field.value ?? ''} /></FormControl><FormMessage /></FormItem>
    )} />
    <FormField control={form.control} name="role" render={({ field }) => (
      <FormItem><FormLabel>Author's Role</FormLabel><FormControl><Input {...field} value={field.value ?? ''} /></FormControl><FormMessage /></FormItem>
    )} />
    <FormField control={form.control} name="text" render={({ field }) => (
      <FormItem><FormLabel>Testimonial</FormLabel><FormControl><Textarea {...field} value={field.value ?? ''} /></FormControl><FormMessage /></FormItem>
    )} />
  </>
);

const RenderItem = (item: Testimonial, onEdit: (item: Testimonial) => void, onDelete: (id: string) => void, isReadonly: boolean) => (
  <div key={item.id} className={cn("flex items-start justify-between gap-4 rounded-lg border p-3", isReadonly && "bg-muted/50")}>
    <div>
        <h4 className="font-semibold">{item.author} <span className="text-sm text-muted-foreground font-normal">- {item.role}</span></h4>
        <blockquote className="mt-1 text-sm text-muted-foreground italic">"{item.text}"</blockquote>
    </div>
    <div className="flex gap-2 shrink-0">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className={cn(isReadonly && "cursor-not-allowed")}>
                <Button variant="outline" size="icon" onClick={() => onEdit(item)} disabled={isReadonly} className={cn(isReadonly && "pointer-events-none")}><Pencil className="h-4 w-4" /></Button>
              </div>
            </TooltipTrigger>
            <TooltipContent>
              {isReadonly ? <p>This is fallback data. Add it to Firestore to edit.</p> : <p>Edit Item</p>}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className={cn(isReadonly && "cursor-not-allowed")}>
                <Button variant="destructive" size="icon" onClick={() => onDelete(item.id)} disabled={isReadonly} className={cn(isReadonly && "pointer-events-none")}><Trash2 className="h-4 w-4" /></Button>
              </div>
            </TooltipTrigger>
            <TooltipContent>
              {isReadonly ? <p>This is fallback data. Add it to Firestore to edit.</p> : <p>Delete Item</p>}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
    </div>
  </div>
);

const ItemSkeleton = () => (
    <div className="flex items-start justify-between gap-4 rounded-lg border p-3">
        <div className="space-y-2 flex-grow">
            <Skeleton className="h-5 w-1/2" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
        </div>
        <div className="flex gap-2 shrink-0">
            <Skeleton className="h-10 w-10" />
            <Skeleton className="h-10 w-10" />
        </div>
    </div>
);

export function TestimonialsManager() {
  return (
    <CrudManager<Testimonial>
      collectionName="testimonials"
      Schema={TestimonialSchema}
      formFields={FormFields}
      renderItem={RenderItem}
      title="Testimonials"
      description="Manage client and colleague testimonials."
      itemSkeleton={<ItemSkeleton />}
    />
  );
}
