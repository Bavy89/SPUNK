import { connection } from 'next/server';
import { getAllEvents } from '@/data/theater/events';
import { getAllProductions } from '@/data/theater/productions';
import { getAllGroups } from '@/data/theater/groups';
import { HendelserClient } from './HendelserClient';

export default async function HendelserPage() {
  await connection();
  const [events, productions, groups] = await Promise.all([
    getAllEvents(),
    getAllProductions(),
    getAllGroups(),
  ]);
  return (
    <div className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-6 p-4 sm:p-6 lg:p-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Hendelser</h1>
        <p className="text-muted-foreground">Administrer øvelser, forestillinger og møter.</p>
      </div>
      <HendelserClient events={events} productions={productions} groups={groups} />
    </div>
  );
}
