'use client';

import React from 'react';
import { z } from 'zod';
import { CrudManager } from './CrudManager';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '../ui/form';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Button } from '../ui/button';
import { Pencil, Trash2 } from 'lucide-react';

const ExperienceSchema = z.object({
  role: z.string().min(1, 'Role is required.'),
  company: z.string().min(1, 'Company is required.'),
  duration: z.string().min(1, 'Duration is required.'),
  description: z.string().min(1, 'Description is required.'),
});

type Experience = z.infer<typeof ExperienceSchema> & { id: string };

const FormFields = (form: any) => (
  <>
    <FormField control={form.control} name="role" render={({ field }) => (
      <FormItem><FormLabel>Role/Title</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
    )} />
    <FormField control={form.control} name="company" render={({ field }) => (
      <FormItem><FormLabel>Company</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
    )} />
    <FormField control={form.control} name="duration" render={({ field }) => (
      <FormItem><FormLabel>Duration</FormLabel><FormControl><Input {...field} placeholder="e.g., 2022 - Present" /></FormControl><FormMessage /></FormItem>
    )} />
    <FormField control={form.control} name="description" render={({ field }) => (
      <FormItem><FormLabel>Description</FormLabel><FormControl><Textarea {...field} /></FormControl><FormMessage /></FormItem>
    )} />
  </>
);

const RenderItem = (item: Experience, onEdit: (item: Experience) => void, onDelete: (id: string) => void) => (
  <div key={item.id} className="flex items-start justify-between gap-4 rounded-lg border p-3">
     <div>
        <h4 className="font-semibold">{item.role} <span className="text-sm text-muted-foreground font-normal">at {item.company}</span></h4>
        <p className="text-xs text-muted-foreground">{item.duration}</p>
        <p className="mt-1 text-sm text-muted-foreground">{item.description}</p>
    </div>
    <div className="flex gap-2">
      <Button variant="outline" size="icon" onClick={() => onEdit(item)}><Pencil className="h-4 w-4" /></Button>
      <Button variant="destructive" size="icon" onClick={() => onDelete(item.id)}><Trash2 className="h-4 w-4" /></Button>
    </div>
  </div>
);

export function ExperienceManager() {
  return (
    <CrudManager
      collectionName="work_experience"
      Schema={ExperienceSchema}
      formFields={FormFields}
      renderItem={RenderItem}
      title="Work Experience"
      description="Manage your career timeline."
    />
  );
}
