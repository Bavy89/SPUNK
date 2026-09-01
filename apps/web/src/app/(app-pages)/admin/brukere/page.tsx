import { connection } from 'next/server';
import { createSupabaseClient } from '@/supabase-clients/server';
import { BrukereClient } from './BrukereClient';

export default async function BrukerePage() {
  await connection();
  const supabase = await createSupabaseClient();

  const { data: profiles, error } = await supabase
    .from('profiles')
    .select('id, full_name, is_approved, is_admin, created_at')
    .order('created_at', { ascending: false });

  if (error) throw new Error(error.message);

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-1 flex-col gap-6 p-4 sm:p-6 lg:p-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Brukere</h1>
        <p className="text-muted-foreground">Godkjenn eller avvis tilgang til appen.</p>
      </div>
      <BrukereClient profiles={profiles ?? []} />
    </div>
  );
}
