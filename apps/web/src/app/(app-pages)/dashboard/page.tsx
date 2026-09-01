import { connection } from 'next/server';
import Link from 'next/link';
import {
  CalendarDays,
  ChevronRight,
  Clapperboard,
  MapPin,
  Users,
} from 'lucide-react';

import { getUpcomingEvents } from '@/data/theater/events';
import { getCachedLoggedInVerifiedSupabaseUser } from '@/rsc-data/supabase';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const EVENT_TYPE_LABELS: Record<string, string> = {
  rehearsal: 'Øvelse',
  performance: 'Forestilling',
  workshop: 'Workshop',
  meeting: 'Møte',
  other: 'Annet',
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('nb-NO', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });
}

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString('nb-NO', {
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default async function DashboardPage() {
  await connection();

  const [{ user }, upcomingEvents] = await Promise.all([
    getCachedLoggedInVerifiedSupabaseUser(),
    getUpcomingEvents(3).catch(() => []),
  ]);

  const firstName = (
    user?.user_metadata?.full_name ||
    user?.user_metadata?.name ||
    user?.email?.split('@')[0] ||
    ''
  ).split(' ')[0];

  const nextEvent = upcomingEvents[0] ?? null;

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-1 flex-col gap-6 p-4 sm:p-6 lg:p-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          Hei {firstName} 👋
        </h1>
        <p className="text-muted-foreground">Her er en oversikt over hva som skjer.</p>
      </div>

      {nextEvent ? (
        <Card className="border-primary/30 bg-primary/5">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-base font-medium text-muted-foreground">
              <CalendarDays className="size-4" aria-hidden="true" />
              Neste øvelse
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-1">
            <p className="text-xl font-semibold">
              {nextEvent.title ?? EVENT_TYPE_LABELS[nextEvent.type] ?? nextEvent.type}
            </p>
            <p className="text-sm text-muted-foreground">
              {formatDate(nextEvent.starts_at)} · {formatTime(nextEvent.starts_at)}
            </p>
            {nextEvent.location && (
              <p className="flex items-center gap-1 text-sm text-muted-foreground">
                <MapPin className="size-3" aria-hidden="true" />
                {nextEvent.location}
              </p>
            )}
            {Array.isArray(nextEvent.event_groups) && nextEvent.event_groups.length > 0 && (
              <div className="flex flex-wrap gap-1 pt-1">
                {nextEvent.event_groups.map((eg: { group: { id: string; name: string } | null }) =>
                  eg.group ? (
                    <Badge key={eg.group.id} variant="blue">
                      {eg.group.name}
                    </Badge>
                  ) : null
                )}
              </div>
            )}
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="py-8 text-center text-muted-foreground">
            Ingen kommende hendelser.
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Link href="/oversikt" className="group">
          <Card className="h-full transition-colors hover:border-primary/40 hover:bg-primary/5">
            <CardContent className="flex items-center justify-between p-5">
              <div className="flex items-center gap-3">
                <CalendarDays className="size-5 text-primary" aria-hidden="true" />
                <span className="font-medium">Fellesoversikt</span>
              </div>
              <ChevronRight className="size-4 text-muted-foreground transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
            </CardContent>
          </Card>
        </Link>

        <Link href="/admin/produksjoner" className="group">
          <Card className="h-full transition-colors hover:border-primary/40 hover:bg-primary/5">
            <CardContent className="flex items-center justify-between p-5">
              <div className="flex items-center gap-3">
                <Clapperboard className="size-5 text-primary" aria-hidden="true" />
                <span className="font-medium">Produksjoner</span>
              </div>
              <ChevronRight className="size-4 text-muted-foreground transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
            </CardContent>
          </Card>
        </Link>

        <Link href="/admin/barn" className="group">
          <Card className="h-full transition-colors hover:border-primary/40 hover:bg-primary/5">
            <CardContent className="flex items-center justify-between p-5">
              <div className="flex items-center gap-3">
                <Users className="size-5 text-primary" aria-hidden="true" />
                <span className="font-medium">Barn</span>
              </div>
              <ChevronRight className="size-4 text-muted-foreground transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
            </CardContent>
          </Card>
        </Link>
      </div>

      {upcomingEvents.length > 1 && (
        <div>
          <h2 className="mb-3 text-sm font-semibold text-muted-foreground uppercase tracking-wider">
            Kommende hendelser
          </h2>
          <div className="space-y-2">
            {upcomingEvents.slice(1).map((event) => (
              <Card key={event.id}>
                <CardContent className="flex items-center justify-between p-4">
                  <div>
                    <p className="font-medium">
                      {event.title ?? EVENT_TYPE_LABELS[event.type] ?? event.type}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {formatDate(event.starts_at)} · {formatTime(event.starts_at)}
                      {event.location && ` · ${event.location}`}
                    </p>
                  </div>
                  <Badge variant="yellow">{EVENT_TYPE_LABELS[event.type] ?? event.type}</Badge>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="mt-3">
            <Button variant="outline" asChild className="w-full">
              <Link href="/oversikt">Se alle hendelser</Link>
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
