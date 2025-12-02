'use client';

import React from 'react';
import { useUser } from '@/firebase';
import { LoginForm } from '@/components/admin/LoginForm';
import { AdminDashboard } from '@/components/admin/AdminDashboard';
import { Loader2 } from 'lucide-react';

export default function AdminPage() {
  const { user, isUserLoading, userError } = useUser();

  if (isUserLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (userError) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="text-destructive">Error loading user: {userError.message}</p>
      </div>
    );
  }

  if (!user) {
    return <LoginForm />;
  }

  return <AdminDashboard user={user} />;
}
