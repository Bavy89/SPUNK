import { connection } from 'next/server';
import { getAllCharacters } from '@/data/theater/characters';
import { getAllProductions } from '@/data/theater/productions';
import { KaraktererClient } from './KaraktererClient';

export default async function KaraktererPage() {
  await connection();
  const [characters, productions] = await Promise.all([
    getAllCharacters(),
    getAllProductions(),
  ]);
  return (
    <div className="mx-auto flex w-full max-w-4xl flex-1 flex-col gap-6 p-4 sm:p-6 lg:p-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Karakterer</h1>
        <p className="text-muted-foreground">Administrer karakterer per produksjon.</p>
      </div>
      <KaraktererClient characters={characters} productions={productions} />
    </div>
  );
}
