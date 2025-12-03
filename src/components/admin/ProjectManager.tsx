'use client';

import React from 'react';
import { z } from 'zod';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '../ui/form';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Button } from '../ui/button';
import { Pencil, Trash2 } from 'lucide-react';
import { Badge } from '../ui/badge';
import Image from 'next/image';
import { CrudManager } from './CrudManager';
import type { Project } from '@/lib/types';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';
import { cn } from '@/lib/utils';
import { Skeleton } from '../ui/skeleton';

const ProjectSchema = z.object({
  name: z.string().min(1, 'Name is required.').default(''),
  description: z.string().min(1, 'Description is required.').default(''),
  tech: z.union([z.array(z.string()), z.string()]).transform(val => {
    if (typeof val === 'string') {
      return val.split(',').map(s => s.trim()).filter(Boolean);
    }
    return val;
  }).default([]),
  imageUrl: z.string().url('Must be a valid URL.').default('https://picsum.photos/seed/placeholder/600/400'),
  imageHint: z.string().optional().default(''),
  liveUrl: z.string().url('Must be a valid URL.').default('https://example.com'),
  githubUrl: z.string().url('Must be a valid URL.').default('https://github.com'),
});

const FormFields = (form: any) => {
  return (
    <>
      <FormField control={form.control} name="name" render={({ field }) => (
        <FormItem><FormLabel>Name</FormLabel><FormControl><Input {...field} value={field.value ?? ''}/></FormControl><FormMessage /></FormItem>
      )} />
      <FormField control={form.control} name="description" render={({ field }) => (
        <FormItem><FormLabel>Description</FormLabel><FormControl><Textarea {...field} value={field.value ?? ''} /></FormControl><FormMessage /></FormItem>
      )} />
      <FormField control={form.control} name="tech" render={({ field }) => (
        <FormItem>
          <FormLabel>Tech Stack (comma-separated)</FormLabel>
          <FormControl>
            <Input
              value={Array.isArray(field.value) ? field.value.join(', ') : ''}
              onChange={e => field.onChange(e.target.value.split(',').map(s => s.trim()))}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )} />
      <FormField control={form.control} name="imageUrl" render={({ field }) => (
        <FormItem><FormLabel>Image URL</FormLabel><FormControl><Input {...field} value={field.value ?? ''} /></FormControl><FormMessage /></FormItem>
      )} />
      <FormField control={form.control} name="imageHint" render={({ field }) => (
        <FormItem><FormLabel>Image Hint (for AI)</FormLabel><FormControl><Input {...field} value={field.value ?? ''} /></FormControl><FormMessage /></FormItem>
      )} />
      <FormField control={form.control} name="liveUrl" render={({ field }) => (
        <FormItem><FormLabel>Live Demo URL</FormLabel><FormControl><Input {...field} value={field.value ?? ''} /></FormControl><FormMessage /></FormItem>
      )} />
      <FormField control={form.control} name="githubUrl" render={({ field }) => (
        <FormItem><FormLabel>GitHub URL</FormLabel><FormControl><Input {...field} value={field.value ?? ''} /></FormControl><FormMessage /></FormItem>
      )} />
    </>
  );
};

const RenderItem = (item: Project, onEdit: (item: Project) => void, onDelete: (id: string) => void, isReadonly: boolean) => {
    const techArray = Array.isArray(item.tech) ? item.tech : (typeof item.tech === 'string' ? item.tech.split(',').map(t => t.trim()) : []);
    
    return (
      <div key={item.id} className={cn("flex items-center justify-between gap-4 rounded-lg border p-3", isReadonly && "bg-muted/30")}>
        <div className="flex items-center gap-4">
           <Image src={item.imageUrl} alt={item.name} width={64} height={64} className="rounded-md object-cover aspect-video h-16 w-16" />
            <div>
                <h4 className="font-semibold">{item.name}</h4>
                <div className="flex flex-wrap gap-1 mt-1">
                    {techArray.map(t => <Badge key={t} variant="secondary">{t}</Badge>)}
                </div>
            </div>
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
};

const ItemSkeleton = () => (
    <div className="flex items-center justify-between gap-4 rounded-lg border p-3">
        <div className="flex items-center gap-4">
            <Skeleton className="h-16 w-16 rounded-md" />
            <div className="space-y-2">
                <Skeleton className="h-5 w-40" />
                <div className="flex gap-2">
                    <Skeleton className="h-5 w-16" />
                    <Skeleton className="h-5 w-20" />
                </div>
            </div>
        </div>
        <div className="flex gap-2 shrink-0">
            <Skeleton className="h-10 w-10" />
            <Skeleton className="h-10 w-10" />
        </div>
    </div>
);


export function ProjectManager() {
  return (
    <CrudManager<Project>
      collectionName="projects"
      Schema={ProjectSchema}
      formFields={FormFields}
      renderItem={RenderItem}
      title="Projects"
      description="Manage your portfolio projects."
      itemSkeleton={<ItemSkeleton />}
    />
  );
}
