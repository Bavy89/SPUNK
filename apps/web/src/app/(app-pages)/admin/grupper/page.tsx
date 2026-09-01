import { connection } from 'next/server';
import { getAllGroups } from '@/data/theater/groups';
import { getAllProductions } from '@/data/theater/productions';
import { GrupperClient } from './GrupperClient';

export default async function GrupperPage() {
  await connection();
  const [groups, productions] = await Promise.all([
    getAllGroups(),
    getAllProductions(),
  ]);
  return (
    <div className="mx-auto flex w-full max-w-4xl flex-1 flex-col gap-6 p-4 sm:p-6 lg:p-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Grupper</h1>
        <p className="text-muted-foreground">Administrer øvingsgrupper per produksjon.</p>
      </div>
      <GrupperClient groups={groups} productions={productions} />
    </div>
  );
}
