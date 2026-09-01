import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, User, Users, Star, Calendar, MapPin } from 'lucide-react';

import { getChildProfile, getChildEvents } from '@/data/theater/children';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const TYPE_LABEL: Record<string, { label: string; class: string }> = {
  rehearsal:   { label: 'Øvelse',       class: 'bg-[#D7DEF8] text-[#1e3270]' },
  performance: { label: 'Forestilling', class: 'bg-[#DAEDE2] text-[#1e5c34]' },
  other:       { label: 'Annet',        class: 'bg-[#FDEABC] text-[#7a5a10]' },
};

function formatDato(iso: string) {
  return new Date(iso).toLocaleDateString('nb-NO', {
    weekday: 'long', day: 'numeric', month: 'long',
  });
}

function formatTid(starts: string, ends: string | null) {
  const s = new Date(starts).toLocaleTimeString('nb-NO', { hour: '2-digit', minute: '2-digit' });
  if (!ends) return s;
  const e = new Date(ends).toLocaleTimeString('nb-NO', { hour: '2-digit', minute: '2-digit' });
  return `${s}–${e}`;
}

export default async function BarnProfilPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  let child: Awaited<ReturnType<typeof getChildProfile>>;
  try {
    child = await getChildProfile(id);
  } catch {
    notFound();
  }
  if (!child) notFound();

  // Grupper produksjoner fra grupper og castings
  const prodMap = new Map<string, {
    prodId: string; prodNavn: string;
    grupper: { id: string; navn: string; ukedag: string | null }[];
    karakterer: { id: string; navn: string; kategori: string | null; slot: string }[];
  }>();

  for (const cg of child.child_groups ?? []) {
    const g = cg.group as { id: string; name: string; weekday: string | null; production_id: string; production: { id: string; name: string } } | null;
    if (!g) continue;
    const pid = g.production.id;
    if (!prodMap.has(pid)) prodMap.set(pid, { prodId: pid, prodNavn: g.production.name, grupper: [], karakterer: [] });
    prodMap.get(pid)!.grupper.push({ id: g.id, navn: g.name, ukedag: g.weekday });
  }

  for (const c of child.castings ?? []) {
    const ch = c.character as { id: string; name: string; category: string | null; production_id: string; production: { id: string; name: string } } | null;
    if (!ch) continue;
    const pid = ch.production.id;
    if (!prodMap.has(pid)) prodMap.set(pid, { prodId: pid, prodNavn: ch.production.name, grupper: [], karakterer: [] });
    prodMap.get(pid)!.karakterer.push({ id: ch.id, navn: ch.name, kategori: ch.category, slot: c.cast_slot });
  }

  const prodListe = Array.from(prodMap.values());

  // Hent hendelser per produksjon
  const hendelser = await Promise.all(
    prodListe.map(async (p) => ({
      prodId: p.prodId,
      events: await getChildEvents(id, p.prodId),
    }))
  );
  const hendelserMap = new Map(hendelser.map((h) => [h.prodId, h.events]));

  const nå = new Date();

  return (
    <div className="p-6 max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/admin/barn"><ArrowLeft className="size-4" /></Link>
        </Button>
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-full bg-primary/10 text-primary">
            <User className="size-5" />
          </div>
          <h1 className="text-2xl font-bold">{child.display_name}</h1>
        </div>
      </div>

      {prodListe.length === 0 && (
        <p className="text-muted-foreground">Ingen produksjoner registrert for dette barnet.</p>
      )}

      {prodListe.map((prod) => {
        const events = hendelserMap.get(prod.prodId) ?? [];
        const kommende = events.filter((e) => new Date(e.starts_at) >= nå);
        const tidligere = events.filter((e) => new Date(e.starts_at) < nå);

        return (
          <div key={prod.prodId} className="space-y-4">
            <h2 className="text-lg font-semibold border-b pb-2">{prod.prodNavn}</h2>

            {prod.grupper.length > 0 && (
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm flex items-center gap-2 text-[#030417]">
                    <Users className="size-4" /> Gruppe / Parti
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex flex-wrap gap-2">
                  {prod.grupper.map((g) => (
                    <Badge key={g.id} variant="blue">
                      {g.navn}{g.ukedag ? ` (${g.ukedag})` : ''}
                    </Badge>
                  ))}
                </CardContent>
              </Card>
            )}

            {prod.karakterer.length > 0 && (
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm flex items-center gap-2 text-[#030417]">
                    <Star className="size-4" /> Roller
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {prod.karakterer.map((k) => (
                    <div key={k.id + k.slot} className="flex items-center justify-between">
                      <div>
                        <span className="font-medium">{k.navn}</span>
                        {k.kategori && <span className="ml-2 text-xs text-muted-foreground">{k.kategori}</span>}
                      </div>
                      <Badge variant={k.slot === 'A' ? 'pink' : 'green'}>
                        Besetning {k.slot}
                      </Badge>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            {kommende.length > 0 && (
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm flex items-center gap-2 text-[#030417]">
                    <Calendar className="size-4" /> Kommende øvelser og forestillinger
                  </CardTitle>
                </CardHeader>
                <CardContent className="divide-y">
                  {kommende.map((e) => {
                    const t = TYPE_LABEL[e.type] ?? TYPE_LABEL.other;
                    return (
                      <div key={e.id} className="py-3 first:pt-0 last:pb-0">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <p className="font-medium capitalize">{formatDato(e.starts_at)}</p>
                            <p className="text-sm text-muted-foreground">{formatTid(e.starts_at, e.ends_at)}</p>
                            {e.title && <p className="text-sm mt-0.5">{e.title}</p>}
                            {e.raw_note && e.raw_note !== e.title && (
                              <p className="text-xs text-muted-foreground mt-0.5">{e.raw_note}</p>
                            )}
                            {e.location && (
                              <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                                <MapPin className="size-3" />{e.location}
                              </p>
                            )}
                          </div>
                          <span className={`text-xs px-2 py-0.5 rounded-full font-medium shrink-0 ${t.class}`}>
                            {t.label}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </CardContent>
              </Card>
            )}

            {tidligere.length > 0 && (
              <details className="group">
                <summary className="cursor-pointer text-sm text-muted-foreground hover:text-foreground list-none flex items-center gap-1">
                  <span className="group-open:hidden">▶</span>
                  <span className="hidden group-open:inline">▼</span>
                  Vis {tidligere.length} tidligere datoer
                </summary>
                <Card className="mt-2">
                  <CardContent className="divide-y pt-4">
                    {tidligere.map((e) => {
                      const t = TYPE_LABEL[e.type] ?? TYPE_LABEL.other;
                      return (
                        <div key={e.id} className="py-3 first:pt-0 last:pb-0 opacity-60">
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <p className="font-medium capitalize">{formatDato(e.starts_at)}</p>
                              <p className="text-sm text-muted-foreground">{formatTid(e.starts_at, e.ends_at)}</p>
                              {e.title && <p className="text-sm mt-0.5">{e.title}</p>}
                              {e.location && (
                                <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                                  <MapPin className="size-3" />{e.location}
                                </p>
                              )}
                            </div>
                            <span className={`text-xs px-2 py-0.5 rounded-full font-medium shrink-0 ${t.class}`}>
                              {t.label}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </CardContent>
                </Card>
              </details>
            )}

            {events.length === 0 && (
              <p className="text-sm text-muted-foreground">Ingen øvelser registrert ennå.</p>
            )}
          </div>
        );
      })}
    </div>
  );
}
