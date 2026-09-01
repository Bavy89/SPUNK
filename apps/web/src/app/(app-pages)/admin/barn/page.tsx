import { connection } from 'next/server';
import { getAllChildren } from '@/data/theater/children';
import { BarnClient } from './BarnClient';

export default async function BarnPage() {
  await connection();
  const children = await getAllChildren();
  return (
    <div className="mx-auto flex w-full max-w-4xl flex-1 flex-col gap-6 p-4 sm:p-6 lg:p-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Barn</h1>
        <p className="text-muted-foreground">Administrer barn og deltakere.</p>
      </div>
      <BarnClient children={children} />
    </div>
  );
}
