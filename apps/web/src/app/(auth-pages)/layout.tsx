import Link from 'next/link';
import type { ReactNode } from 'react';

import { Brand } from '@/components/brand';

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-svh flex-col">
      <header className="flex h-16 items-center px-4 sm:px-6 lg:px-8">
        <Link href="/" aria-label="Villekulla hjem">
          <Brand />
        </Link>
      </header>
      <main className="flex flex-1 items-center justify-center px-4 py-10 sm:px-6">
        <div className="w-full max-w-md">{children}</div>
      </main>
      <footer className="px-6 py-5 text-center text-xs text-muted-foreground">
        © 2026 Villekulla barne- og ungdomsteater.
      </footer>
    </div>
  );
}
