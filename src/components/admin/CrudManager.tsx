'use client';

import React, { useState } from 'react';
import { useCollection } from '@/firebase';
import { useFirestore } from '@/firebase';
import { collection, addDoc, updateDoc, deleteDoc, doc, serverTimestamp } from 'firebase/firestore';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Loader2, Plus, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface CrudManagerProps<T extends { id: string }> {
  collectionName: string;
  Schema: z.ZodObject<any, any, any>;
  formFields: (form: any) => React.ReactNode;
  renderItem: (item: T, onEdit: (item: T) => void, onDelete: (id: string) => void) => React.ReactNode;
  title: string;
  description: string;
}

export function CrudManager<T extends { id: string }>({
  collectionName,
  Schema,
  formFields,
  renderItem,
  title,
  description,
}: CrudManagerProps<T>) {
  const firestore = useFirestore();
  const { toast } = useToast();
  const collectionRef = React.useMemo(() => collection(firestore, collectionName), [firestore, collectionName]);

  const { data: items, isLoading, error } = useCollection<T>(collectionRef);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<T | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm({
    resolver: zodResolver(Schema),
    defaultValues: editingItem || {},
  });

  React.useEffect(() => {
    if (editingItem) {
      form.reset(editingItem);
    } else {
      form.reset(Schema.default({})._def.defaultValue);
    }
  }, [editingItem, form, Schema]);

  const handleEdit = (item: T) => {
    setEditingItem(item);
    setIsDialogOpen(true);
  };

  const handleAddNew = () => {
    setEditingItem(null);
    form.reset(Schema.default({})._def.defaultValue);
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this item?')) return;
    try {
      await deleteDoc(doc(firestore, collectionName, id));
      toast({ title: 'Success', description: 'Item deleted successfully.' });
    } catch (e) {
      console.error(e);
      toast({ variant: 'destructive', title: 'Error', description: 'Could not delete item.' });
    }
  };

  const onSubmit = async (values: z.infer<typeof Schema>) => {
    setIsSubmitting(true);
    try {
      if (editingItem) {
        await updateDoc(doc(firestore, collectionName, editingItem.id), {
          ...values,
          updatedAt: serverTimestamp(),
        });
        toast({ title: 'Success', description: 'Item updated successfully.' });
      } else {
        await addDoc(collection(firestore, collectionName), {
          ...values,
          createdAt: serverTimestamp(),
        });
        toast({ title: 'Success', description: 'Item added successfully.' });
      }
      setIsDialogOpen(false);
      setEditingItem(null);
    } catch (e) {
      console.error(e);
      toast({ variant: 'destructive', title: 'Error', description: 'Could not save item.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
            <CardTitle>{title}</CardTitle>
            <CardDescription>{description}</CardDescription>
        </div>
        <Button onClick={handleAddNew} size="sm">
          <Plus className="mr-2 h-4 w-4" />
          Add New
        </Button>
      </CardHeader>
      <CardContent>
        {isLoading && <div className="flex justify-center"><Loader2 className="animate-spin" /></div>}
        {error && <p className="text-destructive">Error: {error.message}</p>}
        <div className="space-y-4">
          {items && items.map((item) => renderItem(item, handleEdit, handleDelete))}
          {items && items.length === 0 && <p className="text-center text-muted-foreground">No items found.</p>}
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingItem ? `Edit ${title}` : `Add New ${title}`}</DialogTitle>
            </DialogHeader>
            <FormProvider {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                {formFields(form)}
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {editingItem ? 'Save Changes' : 'Create'}
                </Button>
              </form>
            </FormProvider>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}
