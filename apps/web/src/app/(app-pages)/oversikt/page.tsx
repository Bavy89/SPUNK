import { connection } from 'next/server';
import { getAllEvents } from '@/data/theater/events';
import { getAllProductions } from '@/data/theater/productions';
import { OversiktClient } from './OversiktClient';

export default async function OversiktPage({
  searchParams,
}: {
  searchParams: Promise<{ produksjon?: string }>;
}) {
  await connection();
  const params = await searchParams;

  const [events, productions] = await Promise.all([
    getAllEvents(params.produksjon),
    getAllProductions(),
  ]);

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-6 p-4 sm:p-6 lg:p-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Oversikt</h1>
        <p className="text-muted-foreground">Alle øvelser og forestillinger.</p>
      </div>
      <OversiktClient
        events={events}
        productions={productions}
        selectedProductionId={params.produksjon}
      />
    </div>
  );
}
