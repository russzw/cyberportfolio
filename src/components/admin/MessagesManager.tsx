'use client';

import React, { useState, useEffect } from 'react';
import { useFirestore, useMemoFirebase } from '@/firebase';
import { collection, query, orderBy, getDocs, doc, deleteDoc, updateDoc, where, onSnapshot } from 'firebase/firestore';
import { formatDistanceToNow } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Trash2, Inbox } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '../ui/skeleton';
import { cn } from '@/lib/utils';
import { updateDocumentNonBlocking } from '@/firebase/non-blocking-updates';

interface Submission {
  id: string;
  name: string;
  email: string;
  message: string;
  isRead?: boolean;
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

export function MessagesManager() {
  const firestore = useFirestore();
  const { toast } = useToast();
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const submissionsQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return query(collection(firestore, 'contact_form_submissions'), orderBy('createdAt', 'desc'));
  }, [firestore]);

  useEffect(() => {
    if (!submissionsQuery) return;
    
    setIsLoading(true);
    const unsubscribe = onSnapshot(submissionsQuery, (querySnapshot) => {
        const fetchedSubmissions = querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id })) as Submission[];
        setSubmissions(fetchedSubmissions);
        setIsLoading(false);
    }, (error) => {
        console.error("Error fetching submissions:", error);
        toast({
          variant: 'destructive',
          title: 'Error fetching messages',
          description: 'Could not retrieve messages. Please check permissions.',
        });
        setIsLoading(false);
    });

    return () => unsubscribe();
  }, [submissionsQuery, toast]);

  const handleToggleRead = (submission: Submission) => {
    if (submission.isRead || !firestore) return;
    const docRef = doc(firestore, 'contact_form_submissions', submission.id);
    updateDocumentNonBlocking(docRef, { isRead: true });
  };

  const handleDelete = async (id: string) => {
    if (!firestore || !window.confirm('Are you sure you want to delete this message?')) return;
    try {
      await deleteDoc(doc(firestore, 'contact_form_submissions', id));
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
        <CardTitle>Contact Form Messages</CardTitle>
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
          <Accordion type="single" collapsible className="w-full" onValueChange={(id) => {
              const submission = submissions.find(s => s.id === id);
              if (submission) {
                handleToggleRead(submission);
              }
          }}>
            {submissions.map(sub => (
              <AccordionItem key={sub.id} value={sub.id}>
                <AccordionTrigger>
                  <div className="flex justify-between items-center w-full pr-4">
                    <div className='flex items-center text-left'>
                      <div className={cn("h-2.5 w-2.5 rounded-full mr-3 shrink-0", !sub.isRead ? "bg-primary" : "bg-transparent")} />
                      <span className={cn("font-semibold", !sub.isRead && "text-foreground")}>{sub.name}</span>
                      <span className="text-sm text-muted-foreground ml-2 truncate hidden sm:inline">({sub.email})</span>
                    </div>
                    <span className="text-xs text-muted-foreground shrink-0 ml-4">
                      {sub.createdAt ? formatDistanceToNow(new Date(sub.createdAt.seconds * 1000), { addSuffix: true }) : 'Just now'}
                    </span>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="p-4 bg-muted/50 rounded-md ml-5">
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
            <h3 className="text-lg font-semibold">No messages yet</h3>
            <p>Your inbox is empty. New messages will appear here.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
