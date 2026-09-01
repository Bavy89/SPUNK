import { Suspense } from 'react';
import Link from 'next/link';

import { Brand } from '@/components/brand';
import {
  Sidebar,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import { getCachedLoggedInVerifiedSupabaseUser } from '@/rsc-data/supabase';
import { createSupabaseClient } from '@/supabase-clients/server';
import { AppSidebarContent } from './app-sidebar-client';

async function SidebarHeaderContent() {
  'use cache';

  return (
    <SidebarHeader>
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton size="lg" asChild tooltip="Villekulla hjem">
            <Link href="/">
              <Brand />
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarHeader>
  );
}

async function SidebarContentWrapper() {
  const { user } = await getCachedLoggedInVerifiedSupabaseUser();
  const supabase = await createSupabaseClient();
  const { data: profile } = await supabase
    .from('profiles')
    .select('is_admin')
    .eq('id', user.id)
    .single();

  return <AppSidebarContent user={user} isAdmin={profile?.is_admin ?? false} />;
}

export async function AppSidebar() {
  return (
    <Sidebar variant="inset" collapsible="icon">
      <SidebarHeaderContent />
      <Suspense fallback={null}>
        <SidebarContentWrapper />
      </Suspense>
    </Sidebar>
  );
}
