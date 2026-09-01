'use client';

import { Database } from '@/lib/database.types';
import { createBrowserClient } from '@supabase/ssr';

export function createClient(): ReturnType<typeof createBrowserClient<Database>> {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
    { db: { schema: 'villekulla' } }
  );
}
