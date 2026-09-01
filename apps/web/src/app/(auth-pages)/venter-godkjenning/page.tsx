import { Clock } from 'lucide-react';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';

export const instant = false;

import { Brand } from '@/components/brand';
import { Button } from '@/components/ui/button';
import { signOutAction } from '@/data/auth/sign-out';
import { createSupabaseClient } from '@/supabase-clients/server';

export default async function VenterGodkjenningPage() {
  const supabase = await createSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (user) {
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

    if (profile?.is_admin || profile?.is_approved) {
      redirect('/dashboard');
    }
  }
  return (
    <div className="flex min-h-svh flex-col items-center justify-center px-4 text-center">
      <div className="mb-8">
        <Link href="/" aria-label="Villekulla hjem">
          <Brand />
        </Link>
      </div>
      <div className="flex size-16 items-center justify-center rounded-full bg-primary/10 text-primary mb-6">
        <Clock className="size-8" aria-hidden="true" />
      </div>
      <h1 className="text-2xl font-bold tracking-tight mb-2">Venter på godkjenning</h1>
      <p className="max-w-sm text-muted-foreground mb-8">
        Kontoen din er registrert. En administrator må godkjenne tilgangen din før du kan logge inn. Du vil bli kontaktet på e-post.
      </p>
      <div className="flex flex-col gap-2 w-full max-w-xs">
        <form action={signOutAction}>
          <Button type="submit" className="w-full">
            Logg ut og prøv igjen
          </Button>
        </form>
        <Button variant="outline" asChild>
          <Link href="/login">Tilbake til innlogging</Link>
        </Button>
      </div>
    </div>
  );
}
