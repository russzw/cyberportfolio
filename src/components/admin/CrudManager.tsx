'use client';

import React, { useState } from 'react';
import { useFirestore, useMemoFirebase } from '@/firebase';
import { collection, doc, onSnapshot } from 'firebase/firestore';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Loader2, Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { addDocumentNonBlocking, deleteDocumentNonBlocking, updateDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import { Skeleton } from '../ui/skeleton';
import { ScrollArea } from '../ui/scroll-area';

interface CrudManagerProps<T extends { id: string }> {
  collectionName: string;
  Schema: z.ZodObject<any, any, any>;
  formFields: (form: any) => React.ReactNode;
  renderItem: (
    item: T,
    onEdit: (item: T) => void,
    onDelete: (id: string) => void,
    isReadonly: boolean
  ) => React.ReactNode;
  title: string;
  description: string;
  itemSkeleton: React.ReactNode;
  transformItemForDisplay?: (item: T) => T;
  transformItemForEdit?: (item: T) => T;
}

export function CrudManager<T extends { id: string }>({
  collectionName,
  Schema,
  formFields,
  renderItem,
  title,
  description,
  itemSkeleton,
  transformItemForDisplay,
  transformItemForEdit,
}: CrudManagerProps<T>) {
  const firestore = useFirestore();
  const { toast } = useToast();

  const [data, setData] = useState<T[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<T | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  React.useEffect(() => {
    if (!firestore) return;

    setIsLoading(true);
    const collectionRef = collection(firestore, collectionName);
    const unsubscribe = onSnapshot(
      collectionRef,
      (snapshot) => {
        let items = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as T));
        
        if (transformItemForDisplay) {
          items = items.map(item => transformItemForDisplay(item));
        }

        setData(items);
        setIsLoading(false);
      },
      (error) => {
        console.error(`Error fetching ${collectionName}:`, error);
        toast({
          variant: 'destructive',
          title: 'Error',
          description: `Could not fetch ${title}. Check permissions and configuration.`,
        });
        setIsLoading(false);
      }
    );

    return () => unsubscribe();
  }, [firestore, collectionName, title, toast, transformItemForDisplay]);

  const defaultValues = React.useMemo(() => {
    const parsed = Schema.safeParse({});
    if (parsed.success) {
      return parsed.data;
    }
    return {};
  }, [Schema]);

  const form = useForm({
    resolver: zodResolver(Schema),
    defaultValues: editingItem || defaultValues,
  });

  const handleEdit = (item: T) => {
    const itemForEdit = transformItemForEdit ? transformItemForEdit(item) : item;
    setEditingItem(itemForEdit);
    setIsDialogOpen(true);
  };

  React.useEffect(() => {
    if (isDialogOpen) {
      const itemForForm = editingItem || defaultValues;
      const transformedItem = transformItemForEdit ? transformItemForEdit(itemForForm as T) : itemForForm;
      form.reset(transformedItem);
    }
  }, [isDialogOpen, editingItem, form, defaultValues, transformItemForEdit]);

  const handleAddNew = () => {
    setEditingItem(null);
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this item?')) return;
    if (!firestore) return;
    deleteDocumentNonBlocking(doc(firestore, collectionName, id));
    toast({ title: 'Success', description: 'Item deleted successfully.' });
  };

  const onSubmit = async (values: z.infer<typeof Schema>) => {
    if (!firestore) return;
    setIsSubmitting(true);
    if (editingItem) {
      updateDocumentNonBlocking(doc(firestore, collectionName, editingItem.id), {
        ...values,
      });
      toast({ title: 'Success', description: 'Item updated successfully.' });
    } else {
      await addDocumentNonBlocking(collection(firestore, collectionName), {
        ...values,
      });
      toast({ title: 'Success', description: 'Item added successfully.' });
    }
    setIsDialogOpen(false);
    setEditingItem(null);
    setIsSubmitting(false);
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleAddNew} size="sm">
              <Plus className="mr-2 h-4 w-4" />
              Add New
            </Button>
          </DialogTrigger>
          <DialogContent>
             <DialogHeader>
              <DialogTitle>{editingItem ? `Edit ${title.slice(0,-1)}` : `Add New ${title.slice(0,-1)}`}</DialogTitle>
               <DialogDescription>
                {editingItem ? `Make changes to this ${title.slice(0, -1).toLowerCase()}.` : `Fill out the form to add a new ${title.slice(0, -1).toLowerCase()}.`}
              </DialogDescription>
            </DialogHeader>
            <FormProvider {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 grid flex-1">
                <ScrollArea className="pr-6 -mr-6 h-full">
                  <div className="grid gap-4">
                    {formFields(form)}
                  </div>
                </ScrollArea>
                <DialogFooter>
                    <Button type="submit" disabled={isSubmitting}>
                      {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      {editingItem ? 'Save Changes' : 'Create'}
                    </Button>
                </DialogFooter>
              </form>
            </FormProvider>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {isLoading ? (
            <>
              {itemSkeleton}
              {itemSkeleton}
              {itemSkeleton}
            </>
          ) : data.length > 0 ? (
            data.map((item) => {
              const isReadonly = item.id.startsWith('local-');
              return renderItem(item, handleEdit, handleDelete, isReadonly);
            })
          ) : (
            <p className="text-center text-muted-foreground py-8">No items found. Add content to see it here.</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
