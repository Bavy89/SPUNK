import Image from 'next/image';
import { cn } from '@/lib/utils';

interface BrandProps {
  className?: string;
}

export function Brand({ className }: BrandProps) {
  return (
    <span className={cn('flex items-center', className)}>
      <Image
        src="/images/logo.png"
        alt="Villekulla"
        width={120}
        height={40}
        className="h-8 w-auto shrink-0"
        priority
      />
    </span>
  );
}
