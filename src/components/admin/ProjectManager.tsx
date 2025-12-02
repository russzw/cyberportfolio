'use client';

import React from 'react';
import { z } from 'zod';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '../ui/form';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Button } from '../ui/button';
import { Pencil, Trash2, Plus, Loader2 } from 'lucide-react';
import { Badge } from '../ui/badge';
import Image from 'next/image';
import { useFirestore } from '@/firebase';
import { collection, doc } from 'firebase/firestore';
import { getCollectionData } from '@/lib/firestore';
import { CrudManager } from './CrudManager';
import type { Project } from '@/lib/types';


const ProjectSchema = z.object({
  name: z.string().min(1, 'Name is required.').default(''),
  description: z.string().min(1, 'Description is required.').default(''),
  tech: z.array(z.string()).default([]),
  imageUrl: z.string().url('Must be a valid URL.').default('https://picsum.photos/seed/placeholder/600/400'),
  imageHint: z.string().optional().default(''),
  liveUrl: z.string().url('Must be a valid URL.').default('https://example.com'),
  githubUrl: z.string().url('Must be a valid URL.').default('https://github.com'),
});


const FormFields = (form: any) => {
  return (
    <>
      <FormField
        control={form.control}
        name="name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Name</FormLabel>
            <FormControl>
              <Input {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="description"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Description</FormLabel>
            <FormControl>
              <Textarea {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="tech"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Tech Stack (comma-separated)</FormLabel>
            <FormControl>
              <Input
                value={Array.isArray(field.value) ? field.value.join(', ') : ''}
                onChange={e => field.onChange(e.target.value.split(',').map(s => s.trim()).filter(Boolean))}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="imageUrl"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Image URL</FormLabel>
            <FormControl>
              <Input {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="imageHint"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Image Hint (for AI)</FormLabel>
            <FormControl>
              <Input {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="liveUrl"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Live Demo URL</FormLabel>
            <FormControl>
              <Input {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="githubUrl"
        render={({ field }) => (
          <FormItem>
            <FormLabel>GitHub URL</FormLabel>
            <FormControl>
              <Input {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
};


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
  const firestore = useFirestore();
  const [data, setData] = React.useState<Project[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    if (firestore) {
      getCollectionData<Project>(firestore, "projects").then(projects => {
        setData(projects.map(p => ({...p, tech: Array.isArray(p.tech) ? p.tech : []})));
        setIsLoading(false);
      });
    }
  }, [firestore]);

  const onDataChange = (newData: Project[]) => {
    setData(newData);
  };

  return (
    <CrudManager<Project>
      collectionName="projects"
      Schema={ProjectSchema}
      formFields={FormFields}
      renderItem={RenderItem}
      title="Projects"
      description="Manage your portfolio projects."
      initialData={data}
      isLoading={isLoading}
      onDataChange={onDataChange}
    />
  );
}