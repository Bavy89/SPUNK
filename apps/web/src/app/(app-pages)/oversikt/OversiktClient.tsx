'use client';

import { MapPin, Clock } from 'lucide-react';
import { useRouter, usePathname } from 'next/navigation';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const EVENT_TYPE_LABELS: Record<string, string> = {
  rehearsal: 'Øvelse',
  performance: 'Forestilling',
  other: 'Annet',
};

const EVENT_TYPE_COLORS: Record<string, string> = {
  rehearsal: 'bg-[#D7DEF8] text-[#1e3270]',
  performance: 'bg-[#FDD0DE] text-[#7a2040]',
  other: 'bg-[#FDEABC] text-[#7a5a10]',
};

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString('nb-NO', {
    hour: '2-digit',
    minute: '2-digit',
  });
}

function getWeekKey(iso: string) {
  const d = new Date(iso);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  const monday = new Date(d.setDate(diff));
  return monday.toISOString().slice(0, 10);
}

function getWeekLabel(weekKey: string) {
  const monday = new Date(weekKey);
  const friday = new Date(weekKey);
  friday.setDate(monday.getDate() + 4);
  const m = monday.toLocaleDateString('nb-NO', { day: 'numeric', month: 'short' });
  const f = friday.toLocaleDateString('nb-NO', { day: 'numeric', month: 'short' });
  return `Uke ${getWeekNumber(monday)} · ${m}–${f}`;
}

function getWeekNumber(d: Date) {
  const date = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  date.setUTCDate(date.getUTCDate() + 4 - (date.getUTCDay() || 7));
  const yearStart = new Date(Date.UTC(date.getUTCFullYear(), 0, 1));
  return Math.ceil((((date as unknown as number) - (yearStart as unknown as number)) / 86400000 + 1) / 7);
}

type EventGroup = { group: { id: string; name: string } | null };
type EventCharacter = { character: { id: string; name: string } | null };
type Production = { id: string; name: string; slug: string } | null;

type Event = {
  id: string;
  title: string | null;
  type: string;
  starts_at: string;
  ends_at: string | null;
  location: string | null;
  comment: string | null;
  production: Production;
  event_groups: EventGroup[];
  event_characters: EventCharacter[];
};

type ProductionItem = { id: string; name: string; slug: string };

export function OversiktClient({
  events,
  productions,
  selectedProductionId,
}: {
  events: Event[];
  productions: ProductionItem[];
  selectedProductionId?: string;
}) {
  const router = useRouter();
  const pathname = usePathname();

  function handleProductionChange(value: string) {
    const params = new URLSearchParams();
    if (value !== 'alle') params.set('produksjon', value);
    router.push(`${pathname}${params.size ? '?' + params.toString() : ''}`);
  }

  // Group by week
  const byWeek = new Map<string, Event[]>();
  for (const event of events) {
    const key = getWeekKey(event.starts_at);
    if (!byWeek.has(key)) byWeek.set(key, []);
    byWeek.get(key)!.push(event);
  }
  const weeks = Array.from(byWeek.entries()).sort(([a], [b]) => a.localeCompare(b));

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Select
          value={selectedProductionId ?? 'alle'}
          onValueChange={handleProductionChange}
        >
          <SelectTrigger className="w-52">
            <SelectValue placeholder="Alle produksjoner" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="alle">Alle produksjoner</SelectItem>
            {productions.map((p) => (
              <SelectItem key={p.id} value={p.id}>
                {p.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <span className="text-sm text-muted-foreground">
          {events.length} hendelse{events.length !== 1 ? 'r' : ''}
        </span>
      </div>

      {weeks.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            Ingen hendelser funnet.
          </CardContent>
        </Card>
      )}

      {weeks.map(([weekKey, weekEvents]) => (
        <div key={weekKey}>
          <h2 className="mb-3 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            {getWeekLabel(weekKey)}
          </h2>
          <div className="space-y-3">
            {weekEvents.map((event) => {
              const groups = event.event_groups
                .map((eg) => eg.group)
                .filter(Boolean) as { id: string; name: string }[];
              const characters = event.event_characters
                .map((ec) => ec.character)
                .filter(Boolean) as { id: string; name: string }[];

              return (
                <Card key={event.id} className="overflow-hidden">
                  <CardContent className="flex gap-4 p-4">
                    <div className="flex w-16 shrink-0 flex-col items-center justify-start pt-0.5 text-center">
                      <span className="text-2xl font-bold leading-none text-primary">
                        {new Date(event.starts_at).getDate()}
                      </span>
                      <span className="text-xs text-muted-foreground capitalize">
                        {new Date(event.starts_at).toLocaleDateString('nb-NO', { weekday: 'short' })}
                      </span>
                    </div>
                    <div className="min-w-0 flex-1 space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="font-semibold">
                          {event.title ?? EVENT_TYPE_LABELS[event.type] ?? event.type}
                        </p>
                        <span
                          className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${EVENT_TYPE_COLORS[event.type] ?? EVENT_TYPE_COLORS.other}`}
                        >
                          {EVENT_TYPE_LABELS[event.type] ?? event.type}
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Clock className="size-3" aria-hidden="true" />
                          {formatTime(event.starts_at)}
                          {event.ends_at && ` – ${formatTime(event.ends_at)}`}
                        </span>
                        {event.location && (
                          <span className="flex items-center gap-1">
                            <MapPin className="size-3" aria-hidden="true" />
                            {event.location}
                          </span>
                        )}
                        {event.production && (
                          <span className="text-xs">{event.production.name}</span>
                        )}
                      </div>
                      {(groups.length > 0 || characters.length > 0) && (
                        <div className="flex flex-wrap gap-1 pt-1">
                          {groups.map((g) => (
                            <Badge key={g.id} variant="blue" className="text-xs">
                              {g.name}
                            </Badge>
                          ))}
                          {characters.map((c) => (
                            <Badge key={c.id} variant="green" className="text-xs">
                              {c.name}
                            </Badge>
                          ))}
                        </div>
                      )}
                      {event.comment && (
                        <p className="text-xs text-muted-foreground">{event.comment}</p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
