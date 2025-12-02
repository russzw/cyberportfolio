'use client';

import React from 'react';
import { doc } from 'firebase/firestore';
import { useUser, useAuth, useFirestore, useMemoFirebase } from '@/firebase';
import { useDoc } from '@/firebase/firestore/use-doc';
import { Loader2 } from 'lucide-react';
import { LoginForm } from '@/components/admin/LoginForm';
import { AdminDashboard, AccessDeniedCard } from '@/components/admin/AdminDashboard';
import AdminSidebar from '@/components/admin/AdminSidebar';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Menu } from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, isUserLoading } = useUser();
  const auth = useAuth();
  const firestore = useFirestore();
  const [isSheetOpen, setIsSheetOpen] = React.useState(false);

  const adminCheckRef = useMemoFirebase(() => {
    if (!user || !firestore) return null;
    return doc(firestore, 'roles_admin', user.uid);
  }, [firestore, user]);

  const { data: adminDoc, isLoading: isAdminLoading, error: adminError } = useDoc(adminCheckRef);

  if (isUserLoading || (user && isAdminLoading)) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="ml-4 text-muted-foreground">Loading...</p>
      </div>
    );
  }

  if (!user) {
    return <LoginForm />;
  }

  if (adminError) {
    return (
      <div className="flex h-screen items-center justify-center flex-col gap-4">
        <h1 className="text-2xl font-bold text-destructive">Permission Error</h1>
        <p className="text-muted-foreground max-w-md text-center">
          There was an issue verifying your admin status. Check your security rules to ensure you can read your own document in `roles_admin`.
        </p>
      </div>
    );
  }

  if (!adminDoc) {
    return <AccessDeniedCard user={user} handleLogout={() => auth?.signOut()} />;
  }

  return (
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      <div className="hidden md:block">
        <AdminSidebar />
      </div>
       <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent side="left" className="p-0 w-[280px]">
          <AdminSidebar onLinkClick={() => setIsSheetOpen(false)} />
        </SheetContent>
      </Sheet>
      <AdminDashboard user={user} onMenuClick={() => setIsSheetOpen(true)}>
        {children}
      </AdminDashboard>
    </div>
  );
}
