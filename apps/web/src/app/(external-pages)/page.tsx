import { ArrowRight, CalendarDays } from 'lucide-react';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const upcomingEvents = [
  { title: 'Helseprøve — Akt 1', time: 'Man 16. sep · 17:00', who: 'Røverunger' },
  { title: 'Sceneprøve — Frøken Gulch', time: 'Ons 18. sep · 18:30', who: 'Frøken Gulch + Toto' },
  { title: 'Generalprøve', time: 'Lør 21. sep · 10:00', who: 'Hele ensemblet' },
];

export default function HomePage() {
  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center px-4 py-16">
      <div className="w-full max-w-md space-y-8">

        {/* Logo og tittel */}
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="space-y-1">
            <h1 className="text-5xl font-black tracking-tight">Villekulla</h1>
            <p className="text-sm text-muted-foreground">Øvingsplan og rolleoversikt</p>
          </div>
        </div>

        {/* Kommende øvelser */}
        <Card className="overflow-hidden border-border/70 shadow-xl shadow-primary/5">
          <CardHeader className="border-b bg-secondary pb-4">
            <div className="flex items-center justify-between gap-4">
              <CardTitle className="text-sm text-secondary-foreground">Kommende øvelser</CardTitle>
              <Badge className="rounded-full bg-primary text-primary-foreground text-xs">
                Trollmannen fra Oz
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="divide-y p-0">
            {upcomingEvents.map((event) => (
              <div key={event.title} className="flex items-start gap-3 px-4 py-3">
                <div className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                  <CalendarDays className="size-4 text-primary" aria-hidden="true" />
                </div>
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">{event.title}</p>
                  <p className="text-xs text-muted-foreground">{event.time}</p>
                  <p className="text-xs text-primary font-medium">{event.who}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Logg inn / Registrer */}
        <div className="flex flex-col gap-2">
          <Button asChild size="lg" className="w-full rounded-full font-bold">
            <Link href="/login">
              Logg inn
              <ArrowRight aria-hidden="true" />
            </Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="w-full rounded-full">
            <Link href="/sign-up">Registrer deg</Link>
          </Button>
        </div>

      </div>
    </div>
  );
}
