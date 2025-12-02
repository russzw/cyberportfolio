"use client";

import { useState, useEffect, useMemo } from 'react';
import {
  DocumentReference,
  onSnapshot,
  DocumentData,
  FirestoreError,
  DocumentSnapshot,
  setDoc,
} from 'firebase/firestore';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';
import { useToast } from './use-toast';
import { setDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import { useMemoFirebase } from '@/firebase';

type WithId<T> = T & { id: string };

export interface UseDocumentResult<T> {
  data: WithId<T> | null;
  isLoading: boolean;
  error: FirestoreError | Error | null;
  isUpdating: boolean;
  updateDocument: (data: Partial<T>) => void;
}

export function useDocument<T = any>(
  docRef: DocumentReference<DocumentData> | null | undefined,
): UseDocumentResult<T> {
  const { toast } = useToast();
  const [data, setData] = useState<WithId<T> | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<FirestoreError | Error | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  
  const memoizedDocRef = useMemoFirebase(() => docRef, [docRef]);


  useEffect(() => {
    if (!memoizedDocRef) {
      setData(null);
      setIsLoading(false);
      setError(null);
      return;
    }

    setIsLoading(true);
    const unsubscribe = onSnapshot(
      memoizedDocRef,
      (snapshot: DocumentSnapshot<DocumentData>) => {
        if (snapshot.exists()) {
          setData({ ...(snapshot.data() as T), id: snapshot.id });
        } else {
          setData(null);
        }
        setError(null);
        setIsLoading(false);
      },
      (err: FirestoreError) => {
        const contextualError = new FirestorePermissionError({
          operation: 'get',
          path: memoizedDocRef.path,
        });
        setError(contextualError);
        setData(null);
        setIsLoading(false);
        errorEmitter.emit('permission-error', contextualError);
      }
    );

    return () => unsubscribe();
  }, [memoizedDocRef]);

  const updateDocument = (updateData: Partial<T>) => {
    if (!memoizedDocRef) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Document reference is not available.',
      });
      return;
    }
    setIsUpdating(true);
    setDocumentNonBlocking(memoizedDocRef, updateData, { merge: true });
    toast({
      title: 'Success!',
      description: 'Content is being updated.',
    });
    setIsUpdating(false);
  };


  return { data, isLoading, error, updateDocument, isUpdating };
}
