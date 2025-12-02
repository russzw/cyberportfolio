'use client';

import React from 'react';
import { z } from 'zod';
import { format } from "date-fns";
import { CrudManager } from './CrudManager';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '../ui/form';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Button } from '../ui/button';
import { Calendar as CalendarIcon, Pencil, Trash2 } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';
import { cn } from '@/lib/utils';
import type { ExperienceItem as Experience } from '@/lib/types';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Calendar } from '../ui/calendar';
import { Skeleton } from '../ui/skeleton';

const ExperienceSchema = z.object({
  role: z.string().min(1, 'Role is required.').default(''),
  company: z.string().min(1, 'Company is required.').default(''),
  startDate: z.date({ required_error: "A start date is required." }),
  endDate: z.date().optional(),
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
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <FormField
        control={form.control}
        name="startDate"
        render={({ field }) => (
          <FormItem className="flex flex-col">
            <FormLabel>Start Date</FormLabel>
            <Popover>
              <PopoverTrigger asChild>
                <FormControl>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full pl-3 text-left font-normal",
                      !field.value && "text-muted-foreground"
                    )}
                  >
                    {field.value ? (
                      format(new Date(field.value), "PPP")
                    ) : (
                      <span>Pick a date</span>
                    )}
                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                  </Button>
                </FormControl>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={field.value ? new Date(field.value) : undefined}
                  onSelect={field.onChange}
                  disabled={(date) =>
                    date > new Date() || date < new Date("1900-01-01")
                  }
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="endDate"
        render={({ field }) => (
          <FormItem className="flex flex-col">
            <FormLabel>End Date (optional)</FormLabel>
            <Popover>
              <PopoverTrigger asChild>
                <FormControl>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full pl-3 text-left font-normal",
                      !field.value && "text-muted-foreground"
                    )}
                  >
                    {field.value ? (
                      format(new Date(field.value), "PPP")
                    ) : (
                      <span>Pick a date</span>
                    )}
                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                  </Button>
                </FormControl>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={field.value ? new Date(field.value) : undefined}
                  onSelect={field.onChange}
                  disabled={(date) =>
                    date > new Date() || date < new Date("1900-01-01")
                  }
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
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

const formatDateRange = (start: any, end: any) => {
    const startDate = start?.toDate ? start.toDate() : new Date(start);
    const endDate = end?.toDate ? end.toDate() : (end ? new Date(end) : null);
    
    const startFormatted = format(startDate, "MMM yyyy");
    if (endDate) {
        const endFormatted = format(endDate, "MMM yyyy");
        return `${startFormatted} - ${endFormatted}`;
    }
    return `${startFormatted} - Present`;
}


const RenderItem = (item: Experience, onEdit: (item: Experience) => void, onDelete: (id: string) => void, isReadonly: boolean) => (
  <div key={item.id} className={cn("flex items-start justify-between gap-4 rounded-lg border p-3", isReadonly && "bg-muted/30")}>
     <div>
        <h4 className="font-semibold">{item.role} <span className="text-sm text-muted-foreground font-normal">at {item.company}</span></h4>
        <p className="text-xs text-muted-foreground">{formatDateRange(item.startDate, item.endDate)}</p>
        <p className="mt-1 text-sm text-muted-foreground">{item.description}</p>
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
            <Skeleton className="h-5 w-3/4" />
            <Skeleton className="h-3 w-1/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
        </div>
        <div className="flex gap-2 shrink-0">
            <Skeleton className="h-10 w-10" />
            <Skeleton className="h-10 w-10" />
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
      itemSkeleton={<ItemSkeleton />}
    />
  );
}