'use client';

import React from 'react';
import type { User } from 'firebase/auth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { useAuth } from '@/firebase';
import { Button } from '../ui/button';

interface AdminDashboardProps {
  user: User;
  children: React.ReactNode;
}

export function AdminDashboard({ user, children }: AdminDashboardProps) {
  const auth = useAuth();
  
  const handleLogout = () => {
    if(auth) {
      auth.signOut();
    }
  };
  
  return (
    <div className="flex flex-col h-screen">
      <header className="flex h-14 items-center justify-between border-b bg-background px-4 lg:px-6">
        <div className="flex items-center gap-4">
          <h1 className="text-lg font-semibold">Admin Panel</h1>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-muted-foreground hidden md:inline-block">
            {user.email}
          </span>
          <Button onClick={handleLogout} variant="outline" size="sm">
            Logout
          </Button>
        </div>
      </header>
      <main className="flex-1 overflow-auto p-4 md:p-6 lg:p-8">
        {children}
      </main>
    </div>
  );
}

const AccessDeniedCard = ({ user, handleLogout }: { user: User; handleLogout: () => void; }) => (
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

export { AccessDeniedCard };