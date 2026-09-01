'use client';

import { Menu } from 'lucide-react';
import Link from 'next/link';

import { Brand } from '@/components/brand';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';

const navigation = [
  { href: '/', label: 'Hjem' },
  { href: '/login', label: 'Logg inn' },
];

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/90 backdrop-blur-lg supports-[backdrop-filter]:bg-background/75">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-4 sm:px-6 lg:px-8">
        <Link href="/" aria-label="Villekulla hjem" className="shrink-0">
          <Brand />
        </Link>

        <div className="ml-auto flex items-center gap-1.5">
          <Button asChild variant="ghost" size="sm" className="hidden sm:flex">
            <Link href="/login">Logg inn</Link>
          </Button>
          <Button asChild size="sm" variant="outline" className="hidden sm:flex">
            <Link href="mailto:">Kontakt</Link>
          </Button>

          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="sm:hidden">
                <Menu aria-hidden="true" />
                <span className="sr-only">Åpne meny</span>
              </Button>
            </SheetTrigger>
            <SheetContent className="flex w-[min(22rem,85vw)] flex-col">
              <SheetHeader className="text-left">
                <SheetTitle>
                  <Brand />
                </SheetTitle>
                <SheetDescription>
                  Øvingsplan og rolleoversikt for Villekulla.
                </SheetDescription>
              </SheetHeader>
              <nav className="mt-6 grid gap-1">
                {navigation.map((item) => (
                  <SheetClose asChild key={item.href}>
                    <Button variant="ghost" asChild className="justify-start">
                      <Link href={item.href}>{item.label}</Link>
                    </Button>
                  </SheetClose>
                ))}
              </nav>
              <div className="mt-auto grid gap-2 pt-8">
                <SheetClose asChild>
                  <Button variant="outline" asChild>
                    <Link href="/login">Logg inn</Link>
                  </Button>
                </SheetClose>
                <SheetClose asChild>
                  <Button variant="outline" asChild>
                    <Link href="mailto:">Kontakt</Link>
                  </Button>
                </SheetClose>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
