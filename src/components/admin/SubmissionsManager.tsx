'use client';

import React, { useState, useEffect } from 'react';
import { useFirestore, useMemoFirebase } from '@/firebase';
import { collection, query, orderBy, getDocs, doc, deleteDoc } from 'firebase/firestore';
import { formatDistanceToNow } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Trash2, Loader2, Inbox } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '../ui/skeleton';

interface Submission {
  id: string;
  name: string;
  email: string;
  message: string;
  createdAt: {
    seconds: number;
    nanoseconds: number;
  } | null;
}

const SubmissionSkeleton = () => (
    <div className="flex flex-col space-y-3">
        <div className="space-y-2">
            <Skeleton className="h-8 w-full" />
        </div>
    </div>
);

export function SubmissionsManager() {
  const firestore = useFirestore();
  const { toast } = useToast();
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const submissionsQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return query(collection(firestore, 'contact_form_submissions'), orderBy('createdAt', 'desc'));
  }, [firestore]);

  useEffect(() => {
    async function fetchSubmissions() {
      if (!submissionsQuery) return;
      try {
        const querySnapshot = await getDocs(submissionsQuery);
        const fetchedSubmissions = querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id })) as Submission[];
        setSubmissions(fetchedSubmissions);
      } catch (error) {
        console.error("Error fetching submissions:", error);
        toast({
          variant: 'destructive',
          title: 'Error fetching submissions',
          description: 'Could not retrieve messages. Please check permissions.',
        });
      } finally {
        setIsLoading(false);
      }
    }
    fetchSubmissions();
  }, [submissionsQuery, toast]);

  const handleDelete = async (id: string) => {
    if (!firestore || !window.confirm('Are you sure you want to delete this message?')) return;
    try {
      await deleteDoc(doc(firestore, 'contact_form_submissions', id));
      setSubmissions(submissions.filter(sub => sub.id !== id));
      toast({ title: 'Success', description: 'Message deleted.' });
    } catch (error) {
      console.error("Error deleting submission:", error);
      toast({
        variant: 'destructive',
        title: 'Error deleting message',
        description: 'Could not delete the message. Please try again.',
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Contact Form Submissions</CardTitle>
        <CardDescription>Messages sent from your portfolio contact form.</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-4">
            <SubmissionSkeleton />
            <SubmissionSkeleton />
            <SubmissionSkeleton />
          </div>
        ) : submissions.length > 0 ? (
          <Accordion type="single" collapsible className="w-full">
            {submissions.map(sub => (
              <AccordionItem key={sub.id} value={sub.id}>
                <AccordionTrigger>
                  <div className="flex justify-between items-center w-full pr-4">
                    <div className='text-left'>
                      <span className="font-semibold">{sub.name}</span>
                      <span className="text-sm text-muted-foreground ml-2 truncate">({sub.email})</span>
                    </div>
                    <span className="text-xs text-muted-foreground shrink-0 ml-4">
                      {sub.createdAt ? formatDistanceToNow(new Date(sub.createdAt.seconds * 1000), { addSuffix: true }) : 'Just now'}
                    </span>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="p-4 bg-muted/30 rounded-md">
                    <p className="whitespace-pre-wrap text-muted-foreground">{sub.message}</p>
                    <div className="text-right mt-4">
                      <Button variant="destructive" size="sm" onClick={() => handleDelete(sub.id)}>
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </Button>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        ) : (
          <div className="text-center py-12 text-muted-foreground flex flex-col items-center gap-4">
            <Inbox className="h-12 w-12" />
            <h3 className="text-lg font-semibold">No submissions yet</h3>
            <p>Your inbox is empty. New messages will appear here.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
