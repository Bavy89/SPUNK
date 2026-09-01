'use client';

import { useTransition } from 'react';
import { Check, ShieldCheck, X } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { approveUserAction, revokeUserAction } from './actions';

type Profile = {
  id: string;
  full_name: string | null;
  is_approved: boolean;
  is_admin: boolean;
  created_at: string;
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('nb-NO', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

function UserRow({ profile }: { profile: Profile }) {
  const [isPending, startTransition] = useTransition();

  function approve() {
    startTransition(async () => {
      await approveUserAction(profile.id);
    });
  }

  function revoke() {
    startTransition(async () => {
      await revokeUserAction(profile.id);
    });
  }

  const status = profile.is_admin
    ? { label: 'Admin', variant: 'blue' as const, className: '' }
    : profile.is_approved
    ? { label: 'Godkjent', variant: 'green' as const, className: '' }
    : { label: 'Venter', variant: 'yellow' as const, className: '' };

  return (
    <TableRow className={!profile.is_approved && !profile.is_admin ? 'bg-amber-50/50 dark:bg-amber-950/20' : undefined}>
      <TableCell className="font-medium">
        {profile.full_name ?? <span className="text-muted-foreground italic">Ukjent</span>}
      </TableCell>
      <TableCell>
        <Badge variant={status.variant}>
          {profile.is_admin && <ShieldCheck className="mr-1 size-3" aria-hidden="true" />}
          {status.label}
        </Badge>
      </TableCell>
      <TableCell className="text-sm text-muted-foreground">
        {formatDate(profile.created_at)}
      </TableCell>
      <TableCell className="text-right">
        {profile.is_admin ? null : profile.is_approved ? (
          <Button
            size="sm"
            variant="outline"
            onClick={revoke}
            disabled={isPending}
            className="gap-1.5 text-destructive hover:text-destructive"
          >
            <X className="size-3.5" aria-hidden="true" />
            Fjern tilgang
          </Button>
        ) : (
          <Button
            size="sm"
            onClick={approve}
            disabled={isPending}
            className="gap-1.5"
          >
            <Check className="size-3.5" aria-hidden="true" />
            {isPending ? 'Godkjenner...' : 'Godkjenn'}
          </Button>
        )}
      </TableCell>
    </TableRow>
  );
}

export function BrukereClient({ profiles }: { profiles: Profile[] }) {
  const pending = profiles.filter((p) => !p.is_approved && !p.is_admin);
  const rest = profiles.filter((p) => p.is_approved || p.is_admin);

  return (
    <div className="space-y-6">
      {pending.length > 0 && (
        <div>
          <p className="mb-2 text-sm font-semibold text-amber-700 dark:text-amber-400">
            {pending.length} venter på godkjenning
          </p>
          <div className="rounded-lg border border-amber-200 bg-card dark:border-amber-800">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Navn</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Registrert</TableHead>
                  <TableHead />
                </TableRow>
              </TableHeader>
              <TableBody>
                {pending.map((p) => (
                  <UserRow key={p.id} profile={p} />
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      )}

      <div>
        {pending.length > 0 && (
          <p className="mb-2 text-sm font-semibold text-muted-foreground">Alle brukere</p>
        )}
        <div className="rounded-lg border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Navn</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Registrert</TableHead>
                <TableHead />
              </TableRow>
            </TableHeader>
            <TableBody>
              {profiles.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} className="py-8 text-center text-muted-foreground">
                    Ingen brukere ennå.
                  </TableCell>
                </TableRow>
              )}
              {rest.map((p) => (
                <UserRow key={p.id} profile={p} />
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
