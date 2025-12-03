'use client';

import React from 'react';
import { z } from 'zod';
import { format } from "date-fns";
import { CrudManager } from './CrudManager';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '../ui/form';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Button } from '../ui/button';
import { Calendar as CalendarIcon, Pencil, Trash2, ListPlus } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';
import { cn } from '@/lib/utils';
import type { ExperienceItem as Experience } from '@/lib/types';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Calendar } from '../ui/calendar';
import { Skeleton } from '../ui/skeleton';
import { Timestamp } from 'firebase/firestore';

const ExperienceSchema = z.object({
  role: z.string().min(1, 'Role is required.').default(''),
  company: z.string().min(1, 'Company is required.').default(''),
  startDate: z.date({ required_error: "A start date is required." }),
  endDate: z.date().optional(),
  description: z.string().min(1, 'Description is required.').default(''),
});


const FormFields = (form: any) => {
  const descriptionRef = React.useRef<HTMLTextAreaElement>(null);

  const handleAddBullet = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const textarea = descriptionRef.current;
    if (textarea) {
      const { selectionStart, selectionEnd, value } = textarea;
      const bullet = '• ';
      const newText =
        value.substring(0, selectionStart) +
        (value.substring(selectionStart - 1, selectionStart) === '\n' || value.length === 0 ? '' : '\n') +
        bullet +
        value.substring(selectionEnd);
      
      form.setValue('description', newText, { shouldValidate: true });

      // Move cursor after the inserted bullet point
      setTimeout(() => {
        textarea.focus();
        const newCursorPosition = selectionStart + bullet.length + (value.substring(selectionStart - 1, selectionStart) === '\n' || value.length === 0 ? 0 : 1);
        textarea.setSelectionRange(newCursorPosition, newCursorPosition);
      }, 0);
    }
  };

  return (
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
                      format(field.value, "PPP")
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
                  selected={field.value}
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
                      format(field.value, "PPP")
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
                  selected={field.value}
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
      <FormItem>
        <div className="flex items-center justify-between">
          <FormLabel>Description</FormLabel>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-7 w-7" onClick={handleAddBullet}>
                    <ListPlus className="h-4 w-4" />
                    <span className="sr-only">Add Bullet Point</span>
                  </Button>
              </TooltipTrigger>
              <TooltipContent>Add Bullet Point</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <FormControl>
          <Textarea 
             {...field}
             ref={(e) => {
                field.ref(e);
                // @ts-ignore
                descriptionRef.current = e;
             }}
             value={field.value ?? ''} 
             rows={5} />
        </FormControl>
        <FormMessage />
      </FormItem>
    )} />
  </>
);
}

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

const formatDateRange = (startDate?: Date, endDate?: Date) => {
    if (!startDate) {
        return "Date not set";
    }

    const startFormatted = format(startDate, "MMM yyyy");

    if (endDate) {
        return `${startFormatted} - ${format(endDate, "MMM yyyy")}`;
    }
    return `${startFormatted} - Present`;
}


const RenderItem = (item: Experience, onEdit: (item: Experience) => void, onDelete: (id: string) => void, isReadonly: boolean) => (
  <div key={item.id} className={cn("flex items-start justify-between gap-4 rounded-lg border p-3", isReadonly && "bg-muted/30")}>
     <div>
        <h4 className="font-semibold">{item.role} <span className="text-sm text-muted-foreground font-normal">at {item.company}</span></h4>
        <p className="text-xs text-muted-foreground">{formatDateRange(item.startDate, item.endDate)}</p>
        <p className="mt-1 text-sm text-muted-foreground whitespace-pre-wrap">{item.description}</p>
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

const convertTimestampsInItem = (item: any) => {
  const newItem = { ...item };
  if (newItem.startDate && newItem.startDate instanceof Timestamp) {
    newItem.startDate = newItem.startDate.toDate();
  }
  if (newItem.endDate && newItem.endDate instanceof Timestamp) {
    newItem.endDate = newItem.endDate.toDate();
  }
  return newItem;
};

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
      transformItemForDisplay={convertTimestampsInItem}
      transformItemForEdit={convertTimestampsInItem}
    />
  );
}
