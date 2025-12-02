"use client";

import { useState, useEffect } from 'react';
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

type WithId<T> = T & { id: string };

export interface UseDocumentResult<T> {
  data: WithId<T> | null;
  isLoading: boolean;
  error: FirestoreError | Error | null;
  isUpdating: boolean;
  updateDocument: (data: Partial<T>) => Promise<void>;
}

export function useDocument<T = any>(
  docRef: DocumentReference<DocumentData> | null | undefined,
): UseDocumentResult<T> {
  const { toast } = useToast();
  const [data, setData] = useState<WithId<T> | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<FirestoreError | Error | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    if (!docRef) {
      setData(null);
      setIsLoading(false);
      setError(null);
      return;
    }

    setIsLoading(true);
    const unsubscribe = onSnapshot(
      docRef,
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
          path: docRef.path,
        });
        setError(contextualError);
        setData(null);
        setIsLoading(false);
        errorEmitter.emit('permission-error', contextualError);
      }
    );

    return () => unsubscribe();
  }, [docRef]);

  const updateDocument = async (updateData: Partial<T>) => {
    if (!docRef) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Document reference is not available.',
      });
      return;
    }
    setIsUpdating(true);
    try {
      await setDoc(docRef, updateData, { merge: true });
      toast({
        title: 'Success!',
        description: 'Content has been updated successfully.',
      });
    } catch (err: any) {
      const contextualError = new FirestorePermissionError({
        operation: 'update',
        path: docRef.path,
        requestResourceData: updateData,
      });
      setError(contextualError);
      errorEmitter.emit('permission-error', contextualError);
       toast({
        variant: 'destructive',
        title: 'Update Failed',
        description: 'You do not have permission to perform this action.',
      });
    } finally {
      setIsUpdating(false);
    }
  };


  return { data, isLoading, error, updateDocument, isUpdating };
}
