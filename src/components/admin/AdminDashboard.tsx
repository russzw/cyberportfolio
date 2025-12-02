'use client';

import React from 'react';
import { doc } from 'firebase/firestore';
import { useAuth, useDoc, useFirestore } from '@/firebase';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import type { User } from 'firebase/auth';

interface AdminDashboardProps {
  user: User;
}

export function AdminDashboard({ user }: AdminDashboardProps) {
  const auth = useAuth();
  const firestore = useFirestore();

  // Check if the current user is an admin by checking for a doc in roles_admin
  const adminCheckRef = React.useMemo(() => {
    if (!user) return null;
    return doc(firestore, 'roles_admin', user.uid);
  }, [firestore, user]);

  const { data: adminDoc, isLoading: isAdminLoading, error: adminError } = useDoc(adminCheckRef);

  const handleLogout = () => {
    auth.signOut();
  };
  
  if (isAdminLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
        <p className="ml-4">Verifying admin status...</p>
      </div>
    );
  }

  if (adminError) {
     return (
      <div className="flex h-screen items-center justify-center flex-col gap-4">
        <h1 className="text-2xl font-bold text-destructive">Permission Error</h1>
        <p className="text-muted-foreground max-w-md text-center">There was an issue verifying your admin status. This might be a network issue or a problem with security rules.</p>
         <Button onClick={handleLogout}>Logout</Button>
      </div>
    );
  }

  if (!adminDoc) {
    return (
      <div className="flex h-screen items-center justify-center flex-col gap-4">
        <h1 className="text-2xl font-bold text-destructive">Access Denied</h1>
        <p className="text-muted-foreground">You are not authorized to view this page.</p>
        <Button onClick={handleLogout}>Logout</Button>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
            <p className="text-muted-foreground">Welcome, {user.email}</p>
        </div>
        <Button onClick={handleLogout} variant="outline">Logout</Button>
      </div>

      <div className="p-8 border rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Content Management</h2>
        <p className="text-muted-foreground">
          Content editing features will be available here soon.
        </p>
      </div>
    </div>
  );
}
