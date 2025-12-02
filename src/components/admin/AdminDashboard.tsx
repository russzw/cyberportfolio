'use client';

import React from 'react';
import { doc } from 'firebase/firestore';
import { useAuth, useDoc, useFirestore } from '@/firebase';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import type { User } from 'firebase/auth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Code } from 'lucide-react';

interface AdminDashboardProps {
  user: User;
}

export function AdminDashboard({ user }: AdminDashboardProps) {
  const auth = useAuth();
  const firestore = useFirestore();

  // Check if the current user is an admin by checking for a doc in roles_admin
  const adminCheckRef = React.useMemo(() => {
    if (!user || !firestore) return null;
    return doc(firestore, 'roles_admin', user.uid);
  }, [firestore, user]);

  const { data: adminDoc, isLoading: isAdminLoading, error: adminError } = useDoc(adminCheckRef);

  const handleLogout = () => {
    if(auth) {
      auth.signOut();
    }
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
      <div className="flex min-h-screen items-center justify-center bg-background p-4">
        <Card className="w-full max-w-2xl text-center">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-destructive">Access Denied</CardTitle>
            <CardDescription>
              You are authenticated, but not yet authorized as an administrator.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
             <p className="text-muted-foreground">To grant yourself admin access, you need to add a document to your Firestore database.</p>
            
            <div className="text-left bg-secondary/50 p-4 rounded-lg border">
                <p className="text-sm font-semibold">Follow these steps in your Firebase Console:</p>
                <ol className="list-decimal list-inside mt-2 text-sm space-y-1 text-muted-foreground">
                    <li>Go to the <span className="font-semibold text-foreground">Firestore Database</span> section.</li>
                    <li>Start a collection named <code className="font-mono bg-primary/10 text-primary p-1 rounded-sm">roles_admin</code>.</li>
                    <li>Add a new document.</li>
                    <li>Set the Document ID to your User ID: <code className="font-mono bg-primary/10 text-primary p-1 rounded-sm break-all">{user.uid}</code></li>
                    <li>You can add any fields to the document (e.g., a field `isAdmin` with value `true`). The existence of the document is what grants access.</li>
                    <li>After creating the document, refresh this page.</li>
                </ol>
            </div>
            
            <Button onClick={handleLogout} variant="outline" className="mt-4">Logout</Button>
          </CardContent>
        </Card>
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
