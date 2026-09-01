import { connection } from 'next/server';
import { getAllProductions } from '@/data/theater/productions';
import { ProduksjonerClient } from './ProduksjonerClient';

export default async function ProduksjonerPage() {
  await connection();
  const productions = await getAllProductions();
  return (
    <div className="mx-auto flex w-full max-w-4xl flex-1 flex-col gap-6 p-4 sm:p-6 lg:p-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Produksjoner</h1>
        <p className="text-muted-foreground">Administrer forestillinger og produksjoner.</p>
      </div>
      <ProduksjonerClient productions={productions} />
    </div>
  );
}
