'use client';

import React from 'react';
import { z } from 'zod';
import { CrudManager } from './CrudManager';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '../ui/form';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Button } from '../ui/button';
import { Pencil, Trash2 } from 'lucide-react';
import { Badge } from '../ui/badge';
import Image from 'next/image';

const ProjectSchema = z.object({
  name: z.string().min(1, 'Name is required.'),
  description: z.string().min(1, 'Description is required.'),
  tech: z.string().min(1, 'Enter comma-separated techs').transform(val => val.split(',').map(s => s.trim())),
  imageUrl: z.string().url('Must be a valid URL.'),
  imageHint: z.string().optional(),
  liveUrl: z.string().url('Must be a valid URL.'),
  githubUrl: z.string().url('Must be a valid URL.'),
});

type Project = z.infer<typeof ProjectSchema> & { id: string };

const FormFields = (form: any) => (
  <>
    <FormField control={form.control} name="name" render={({ field }) => (
      <FormItem><FormLabel>Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
    )} />
    <FormField control={form.control} name="description" render={({ field }) => (
      <FormItem><FormLabel>Description</FormLabel><FormControl><Textarea {...field} /></FormControl><FormMessage /></FormItem>
    )} />
    <FormField control={form.control} name="tech" render={({ field }) => (
      <FormItem><FormLabel>Tech Stack (comma-separated)</FormLabel><FormControl><Input {...field} value={Array.isArray(field.value) ? field.value.join(', ') : ''} /></FormControl><FormMessage /></FormItem>
    )} />
    <FormField control={form.control} name="imageUrl" render={({ field }) => (
      <FormItem><FormLabel>Image URL</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
    )} />
     <FormField control={form.control} name="imageHint" render={({ field }) => (
      <FormItem><FormLabel>Image Hint (for AI)</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
    )} />
    <FormField control={form.control} name="liveUrl" render={({ field }) => (
      <FormItem><FormLabel>Live Demo URL</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
    )} />
    <FormField control={form.control} name="githubUrl" render={({ field }) => (
      <FormItem><FormLabel>GitHub URL</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
    )} />
  </>
);

const RenderItem = (item: Project, onEdit: (item: Project) => void, onDelete: (id: string) => void) => (
  <div key={item.id} className="flex items-center justify-between gap-4 rounded-lg border p-3">
    <div className="flex items-center gap-4">
       <Image src={item.imageUrl} alt={item.name} width={64} height={64} className="rounded-md object-cover aspect-video h-16 w-16" />
        <div>
            <h4 className="font-semibold">{item.name}</h4>
            <div className="flex flex-wrap gap-1 mt-1">
                {Array.isArray(item.tech) && item.tech.map(t => <Badge key={t} variant="secondary">{t}</Badge>)}
            </div>
        </div>
    </div>
    <div className="flex gap-2">
      <Button variant="outline" size="icon" onClick={() => onEdit(item)}><Pencil className="h-4 w-4" /></Button>
      <Button variant="destructive" size="icon" onClick={() => onDelete(item.id)}><Trash2 className="h-4 w-4" /></Button>
    </div>
  </div>
);

export function ProjectManager() {
  return (
    <CrudManager
      collectionName="projects"
      Schema={ProjectSchema}
      formFields={FormFields}
      renderItem={RenderItem}
      title="Projects"
      description="Manage your portfolio projects."
    />
  );
}
