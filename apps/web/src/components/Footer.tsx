import Link from 'next/link';

import { Brand } from '@/components/brand';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

const footerLinks = [
  { href: '/login', label: 'Logg inn' },
  { href: '/sign-up', label: 'Registrer deg' },
];

export default function Footer() {
  return (
    <footer className="border-t bg-muted/20">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid gap-8 md:grid-cols-[1fr_auto] md:items-start">
          <div className="max-w-md space-y-3">
            <Link href="/" aria-label="Villekulla hjem" className="inline-flex">
              <Brand />
            </Link>
            <p className="text-sm leading-6 text-muted-foreground">
              Øvingsplan og rolleoversikt for foreldre og produksjonsledere i Villekulla barne- og ungdomsteater.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-1 md:justify-end">
            {footerLinks.map((item) => (
              <Button key={item.href} variant="ghost" size="sm" asChild>
                <Link href={item.href}>{item.label}</Link>
              </Button>
            ))}
          </div>
        </div>
        <Separator className="my-8" />
        <div className="flex flex-col gap-2 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 Villekulla barne- og ungdomsteater.</p>
          <p>Laget med kjærlighet for scenekunst.</p>
        </div>
      </div>
    </footer>
  );
}
