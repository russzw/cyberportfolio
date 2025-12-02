'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const mainContentSchema = z.object({
  heroText: z.string().min(1, 'Hero text is required.'),
  heroSubtitle: z.string().min(1, 'Hero subtitle is required.'),
  aboutSection: z.string().min(1, 'About section is required.'),
});

type MainContentFormValues = z.infer<typeof mainContentSchema>;

interface MainContentFormProps {
  data: Partial<MainContentFormValues>;
  onSave: (data: MainContentFormValues) => Promise<void>;
  isSaving: boolean;
}

export function MainContentForm({ data, onSave, isSaving }: MainContentFormProps) {
  const form = useForm<MainContentFormValues>({
    resolver: zodResolver(mainContentSchema),
    defaultValues: {
      heroText: data.heroText || '',
      heroSubtitle: data.heroSubtitle || '',
      aboutSection: data.aboutSection || '',
    },
  });
  
  React.useEffect(() => {
    form.reset(data);
  }, [data, form]);

  const handleSubmit = async (values: MainContentFormValues) => {
    await onSave(values);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Main Content</CardTitle>
        <CardDescription>Edit the content for the Hero and About sections.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="heroText"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Hero Title (Your Name)</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="heroSubtitle"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Hero Subtitle</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="aboutSection"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>About Section</FormLabel>
                  <FormControl>
                    <Textarea {...field} rows={6} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isSaving}>
              {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save Changes
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
