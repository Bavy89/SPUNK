import { connection } from 'next/server';
import { Suspense, type ReactNode } from 'react';
import { redirect } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';

import { DynamicBreadcrumb } from '@/components/dynamic-breadcrumb';
import { Separator } from '@/components/ui/separator';
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { createSupabaseClient } from '@/supabase-clients/server';
import { AppSidebar } from './app-sidebar';

async function AuthGuard({ children }: { children: ReactNode }) {
  await connection();
  const supabase = await createSupabaseClient();

  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) redirect('/login');

  const admin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { db: { schema: 'villekulla' } }
  );

  const { data: profile } = await admin
    .from('profiles')
    .select('is_approved, is_admin')
    .eq('id', user.id)
    .single();

  const approved = profile?.is_admin || profile?.is_approved;
  if (!approved) redirect('/venter-godkjenning');

  return <>{children}</>;
}

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="min-w-0 overflow-hidden">
        <header className="sticky top-0 z-30 flex h-14 shrink-0 items-center gap-2 border-b bg-background/90 px-4 backdrop-blur-md">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Suspense fallback={null}>
            <DynamicBreadcrumb />
          </Suspense>
        </header>
        <div className="flex min-h-[calc(100svh-3.5rem)] flex-1 flex-col bg-muted/15">
          <Suspense fallback={null}>
            <AuthGuard>{children}</AuthGuard>
          </Suspense>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
