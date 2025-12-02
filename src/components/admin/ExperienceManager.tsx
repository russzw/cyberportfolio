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
import type { ExperienceItem as Experience } from '@/lib/types';


const ExperienceSchema = z.object({
  role: z.string().min(1, 'Role is required.').default(''),
  company: z.string().min(1, 'Company is required.').default(''),
  duration: z.string().min(1, 'Duration is required.').default(''),
  description: z.string().min(1, 'Description is required.').default(''),
});


const FormFields = (form: any) => (
  <>
    <FormField control={form.control} name="role" render={({ field }) => (
      <FormItem><FormLabel>Role/Title</FormLabel><FormControl><Input {...field} value={field.value ?? ''} /></FormControl><FormMessage /></FormItem>
    )} />
    <FormField control={form.control} name="company" render={({ field }) => (
      <FormItem><FormLabel>Company</FormLabel><FormControl><Input {...field} value={field.value ?? ''} /></FormControl><FormMessage /></FormItem>
    )} />
    <FormField control={form.control} name="duration" render={({ field }) => (
      <FormItem><FormLabel>Duration</FormLabel><FormControl><Input {...field} placeholder="e.g., 2022 - Present" value={field.value ?? ''} /></FormControl><FormMessage /></FormItem>
    )} />
    <FormField control={form.control} name="description" render={({ field }) => (
      <FormItem><FormLabel>Description</FormLabel><FormControl><Textarea {...field} value={field.value ?? ''} /></FormControl><FormMessage /></FormItem>
    )} />
  </>
);

const ReadonlyTooltip = ({ children }: { children: React.ReactNode }) => (
  <TooltipProvider>
    <Tooltip>
      <TooltipTrigger asChild>{children}</TooltipTrigger>
      <TooltipContent>
        <p>This is fallback data. Add it to Firestore to edit.</p>
      </TooltipContent>
    </Tooltip>
  </TooltipProvider>
);


const RenderItem = (item: Experience, onEdit: (item: Experience) => void, onDelete: (id: string) => void, isReadonly: boolean) => (
  <div key={item.id} className={cn("flex items-start justify-between gap-4 rounded-lg border p-3", isReadonly && "bg-muted/30")}>
     <div>
        <h4 className="font-semibold">{item.role} <span className="text-sm text-muted-foreground font-normal">at {item.company}</span></h4>
        <p className="text-xs text-muted-foreground">{item.duration}</p>
        <p className="mt-1 text-sm text-muted-foreground">{item.description}</p>
    </div>
    <div className="flex gap-2 shrink-0">
        <ReadonlyTooltip>
            <div className={cn(isReadonly && "cursor-not-allowed")}>
                <Button variant="outline" size="icon" onClick={() => onEdit(item)} disabled={isReadonly} className={cn(isReadonly && "pointer-events-none")}><Pencil className="h-4 w-4" /></Button>
            </div>
        </ReadonlyTooltip>
        <ReadonlyTooltip>
            <div className={cn(isReadonly && "cursor-not-allowed")}>
                <Button variant="destructive" size="icon" onClick={() => onDelete(item.id)} disabled={isReadonly} className={cn(isReadonly && "pointer-events-none")}><Trash2 className="h-4 w-4" /></Button>
            </div>
        </ReadonlyTooltip>
    </div>
  </div>
);

export function ExperienceManager() {
  return (
    <CrudManager<Experience>
      collectionName="work_experience"
      Schema={ExperienceSchema}
      formFields={FormFields}
      renderItem={RenderItem}
      title="Work Experience"
      description="Manage your career timeline."
    />
  );
}
