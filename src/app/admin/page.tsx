'use client';

import React from 'react';
import { doc } from 'firebase/firestore';
import { useFirestore } from '@/firebase';
import { MainContentForm } from '@/components/admin/MainContentForm';
import { useDocument } from '@/hooks/use-document';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

export default function AdminPage() {
  const firestore = useFirestore();

  const userConfigRef = React.useMemo(() => {
    if (!firestore) return null;
    return doc(firestore, 'user_config', 'main');
  }, [firestore]);

  const { data: userConfig, isLoading: isConfigLoading, updateDocument, isUpdating } = useDocument(userConfigRef);

  if (isConfigLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-8 w-1/3" />
          <Skeleton className="h-4 w-2/3" />
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Skeleton className="h-4 w-1/4" />
            <Skeleton className="h-10 w-full" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-1/4" />
            <Skeleton className="h-10 w-full" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-1/4" />
            <Skeleton className="h-24 w-full" />
          </div>
          <Skeleton className="h-10 w-32" />
        </CardContent>
      </Card>
    );
  }

  return (
    <MainContentForm
      data={userConfig || { heroText: '', heroSubtitle: '', aboutSection: '' }}
      onSave={updateDocument}
      isSaving={isUpdating}
    />
  );
}
