'use client';

import React from 'react';
import { z } from 'zod';
import { CrudManager } from './CrudManager';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '../ui/form';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Pencil, Trash2 } from 'lucide-react';
import { TechIcon, iconMap } from '../icons/TechIcons';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';
import { cn } from '@/lib/utils';
import type { Skill } from '@/lib/types';
import { Skeleton } from '../ui/skeleton';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

const iconNames = Object.keys(iconMap).sort();

const SkillSchema = z.object({
  name: z.string().min(1, 'Name is required.').default(''),
  icon: z.string().min(1, 'Icon name is required.').default(''),
});

const FormFields = (form: any) => (
  <>
    <FormField control={form.control} name="name" render={({ field }) => (
      <FormItem><FormLabel>Skill Name</FormLabel><FormControl><Input {...field} placeholder="e.g., React" value={field.value ?? ''} /></FormControl><FormMessage /></FormItem>
    )} />
    <FormField
      control={form.control}
      name="icon"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Icon</FormLabel>
          <Select onValueChange={field.onChange} defaultValue={field.value}>
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Select an icon" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {iconNames.map((iconName) => (
                <SelectItem key={iconName} value={iconName}>
                  <div className="flex items-center gap-2">
                    <TechIcon name={iconName} className="w-4 h-4" />
                    <span>{iconName.charAt(0).toUpperCase() + iconName.slice(1)}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  </>
);

const RenderItem = (item: Skill, onEdit: (item: Skill) => void, onDelete: (id: string) => void, isReadonly: boolean) => (
  <div key={item.id} className={cn("flex items-center justify-between gap-4 rounded-lg border p-3", isReadonly && "bg-muted/30")}>
    <div className="flex items-center gap-4">
      <TechIcon name={item.icon} className="w-6 h-6 text-primary" />
      <h4 className="font-semibold">{item.name}</h4>
    </div>
    <div className="flex gap-2">
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
    <div className="flex items-center justify-between gap-4 rounded-lg border p-3">
        <div className="flex items-center gap-4">
            <Skeleton className="h-6 w-6 rounded-full" />
            <Skeleton className="h-5 w-24" />
        </div>
        <div className="flex gap-2">
            <Skeleton className="h-10 w-10" />
            <Skeleton className="h-10 w-10" />
        </div>
    </div>
);

export function SkillsManager() {
  return (
    <CrudManager<Skill>
      collectionName="skills"
      Schema={SkillSchema}
      formFields={FormFields}
      renderItem={RenderItem}
      title="Tech Stacks"
      description="Manage your tech stack and skills."
      itemSkeleton={<ItemSkeleton />}
    />
  );
}
