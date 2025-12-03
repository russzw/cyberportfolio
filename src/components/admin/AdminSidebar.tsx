'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Package2,
  Flame,
  MessageSquareQuote,
  Briefcase,
  Sparkles,
  LayoutDashboard,
  Package,
  Send,
} from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useFirestore } from '@/firebase';
import { collection, onSnapshot, query, where } from 'firebase/firestore';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

const navLinks = [
  { href: '/admin', label: 'Main Content', icon: LayoutDashboard },
  { href: '/admin/projects', label: 'Projects', icon: Package },
  { href: '/admin/skills', label: 'Skills', icon: Sparkles },
  { href: '/admin/experience', label: 'Experience', icon: Briefcase },
  { href: '/admin/testimonials', label: 'Testimonials', icon: MessageSquareQuote },
  { href: '/admin/messages', label: 'Messages', icon: Send },
];

interface AdminSidebarProps {
  onLinkClick?: () => void;
}

export default function AdminSidebar({ onLinkClick }: AdminSidebarProps) {
  const pathname = usePathname();
  const firestore = useFirestore();
  const [messageCount, setMessageCount] = useState(0);

  useEffect(() => {
    if (!firestore) return;

    const unreadQuery = query(collection(firestore, 'contact_form_submissions'), where('isRead', '!=', true));
    const unsubscribe = onSnapshot(unreadQuery, (snapshot) => {
      setMessageCount(snapshot.size);
    });

    return () => unsubscribe();
  }, [firestore]);

  return (
    <div className="flex h-full max-h-screen flex-col gap-2 border-r bg-muted/40">
      <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
        <Link href="/admin" className="flex items-center gap-2 font-semibold" onClick={onLinkClick}>
          <Flame className="h-6 w-6 text-primary" />
          <span className="">dev🔥russ Admin</span>
        </Link>
      </div>
      <div className="flex-1">
        <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
          {navLinks.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              onClick={onLinkClick}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary',
                pathname === href && 'bg-muted text-primary'
              )}
            >
              <Icon className="h-4 w-4" />
              {label}
              {label === 'Messages' && messageCount > 0 && (
                <Badge className="ml-auto flex h-6 w-6 shrink-0 items-center justify-center rounded-full">
                  {messageCount}
                </Badge>
              )}
            </Link>
          ))}
        </nav>
      </div>
    </div>
  );
}
