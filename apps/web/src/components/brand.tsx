import Image from 'next/image';
import { cn } from '@/lib/utils';

interface BrandProps {
  className?: string;
  showTagline?: boolean;
}

export function Brand({ className, showTagline = false }: BrandProps) {
  return (
    <span className={cn('flex min-w-0 items-center gap-2.5', className)}>
      <Image
        src="/images/logo.png"
        alt="Villekulla"
        width={120}
        height={40}
        className="h-8 w-auto shrink-0"
        priority
      />
      {showTagline ? (
        <span className="truncate text-xs text-muted-foreground">
          Barne- og ungdomsteater
        </span>
      ) : null}
    </span>
  );
}
