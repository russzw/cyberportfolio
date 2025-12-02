'use client';

import React from 'react';
import { z } from 'zod';
import { CrudManager } from './CrudManager';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '../ui/form';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Pencil, Trash2 } from 'lucide-react';
import { TechIcon } from '../icons/TechIcons';

const SkillSchema = z.object({
  name: z.string().min(1, 'Name is required.').default(''),
  icon: z.string().min(1, 'Icon name is required (e.g., "react", "typescript").').default(''),
});

type Skill = z.infer<typeof SkillSchema> & { id: string };

const FormFields = (form: any) => (
  <>
    <FormField control={form.control} name="name" render={({ field }) => (
      <FormItem><FormLabel>Skill Name</FormLabel><FormControl><Input {...field} placeholder="e.g., React" /></FormControl><FormMessage /></FormItem>
    )} />
    <FormField control={form.control} name="icon" render={({ field }) => (
      <FormItem><FormLabel>Icon ID</FormLabel><FormControl><Input {...field} placeholder="e.g., react" /></FormControl><FormMessage /></FormItem>
    )} />
  </>
);

const RenderItem = (item: Skill, onEdit: (item: Skill) => void, onDelete: (id: string) => void) => (
  <div key={item.id} className="flex items-center justify-between gap-4 rounded-lg border p-3">
    <div className="flex items-center gap-4">
      <TechIcon name={item.icon} className="w-6 h-6 text-primary" />
      <h4 className="font-semibold">{item.name}</h4>
    </div>
    <div className="flex gap-2">
      <Button variant="outline" size="icon" onClick={() => onEdit(item)}><Pencil className="h-4 w-4" /></Button>
      <Button variant="destructive" size="icon" onClick={() => onDelete(item.id)}><Trash2 className="h-4 w-4" /></Button>
    </div>
  </div>
);

export function SkillsManager() {
  return (
    <CrudManager
      collectionName="skills"
      Schema={SkillSchema}
      formFields={FormFields}
      renderItem={RenderItem}
      title="Skills"
      description="Manage your tech stack and skills."
    />
  );
}
