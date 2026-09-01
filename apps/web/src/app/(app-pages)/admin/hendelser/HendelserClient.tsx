'use client';

import { useState, useTransition } from 'react';
import { Plus, Pencil, Trash2, Clock, MapPin } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { createEventAction, updateEventAction, deleteEventAction } from './actions';

const EVENT_TYPES = [
  { value: 'rehearsal', label: 'Øvelse' },
  { value: 'performance', label: 'Forestilling' },
  { value: 'other', label: 'Annet' },
];

const EVENT_TYPE_LABELS: Record<string, string> = {
  rehearsal: 'Øvelse',
  performance: 'Forestilling',
  other: 'Annet',
};

function formatDateTime(iso: string) {
  return new Date(iso).toLocaleString('nb-NO', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function toLocalInputValue(iso: string) {
  return iso.slice(0, 16);
}

type EventGroup = { group: { id: string; name: string } | null };
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
  event_characters: { character: { id: string; name: string } | null }[];
};

type ProductionItem = { id: string; name: string; slug: string };
type GroupItem = { id: string; name: string; production_id: string; production: { id: string; name: string } | null };

export function HendelserClient({
  events,
  productions,
}: {
  events: Event[];
  productions: ProductionItem[];
  groups?: GroupItem[];
}) {
  const [isPending, startTransition] = useTransition();
  const [showAdd, setShowAdd] = useState(false);
  const [editItem, setEditItem] = useState<Event | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  function handleCreate(formData: FormData) {
    startTransition(async () => {
      await createEventAction(formData);
      setShowAdd(false);
    });
  }

  function handleUpdate(formData: FormData) {
    if (!editItem) return;
    startTransition(async () => {
      await updateEventAction(editItem.id, formData);
      setEditItem(null);
    });
  }

  function handleDelete() {
    if (!deleteId) return;
    startTransition(async () => {
      await deleteEventAction(deleteId);
      setDeleteId(null);
    });
  }

  return (
    <>
      <div className="flex justify-end">
        <Button onClick={() => setShowAdd(true)} className="gap-2">
          <Plus className="size-4" aria-hidden="true" />
          Ny hendelse
        </Button>
      </div>

      <div className="rounded-lg border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Tittel / Type</TableHead>
              <TableHead>Tid</TableHead>
              <TableHead>Sted</TableHead>
              <TableHead>Produksjon</TableHead>
              <TableHead className="w-24" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {events.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="py-8 text-center text-muted-foreground">
                  Ingen hendelser ennå.
                </TableCell>
              </TableRow>
            )}
            {events.map((event) => (
              <TableRow key={event.id}>
                <TableCell>
                  <div className="space-y-0.5">
                    <p className="font-medium">
                      {event.title ?? EVENT_TYPE_LABELS[event.type] ?? event.type}
                    </p>
                    <Badge variant="yellow" className="text-xs">
                      {EVENT_TYPE_LABELS[event.type] ?? event.type}
                    </Badge>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Clock className="size-3" aria-hidden="true" />
                    {formatDateTime(event.starts_at)}
                  </div>
                </TableCell>
                <TableCell>
                  {event.location ? (
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <MapPin className="size-3" aria-hidden="true" />
                      {event.location}
                    </div>
                  ) : (
                    <span className="text-muted-foreground">—</span>
                  )}
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {event.production?.name ?? '—'}
                </TableCell>
                <TableCell>
                  <div className="flex gap-1">
                    <Button size="icon" variant="ghost" onClick={() => setEditItem(event)} aria-label="Rediger">
                      <Pencil className="size-4" aria-hidden="true" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => setDeleteId(event.id)}
                      aria-label="Slett"
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="size-4" aria-hidden="true" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={showAdd} onOpenChange={setShowAdd}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Ny hendelse</DialogTitle>
          </DialogHeader>
          <form action={handleCreate} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="add-prod">Produksjon</Label>
              <select
                id="add-prod"
                name="production_id"
                required
                className="w-full rounded-md border bg-background px-3 py-2 text-sm"
              >
                <option value="">Velg produksjon</option>
                {productions.map((p) => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="add-type">Type</Label>
              <select
                id="add-type"
                name="type"
                className="w-full rounded-md border bg-background px-3 py-2 text-sm"
              >
                {EVENT_TYPES.map((t) => (
                  <option key={t.value} value={t.value}>{t.label}</option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="add-title">Tittel (valgfri)</Label>
              <Input id="add-title" name="title" placeholder="Helseprøve — Akt 1" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="add-start">Start</Label>
                <Input id="add-start" name="starts_at" type="datetime-local" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="add-end">Slutt (valgfri)</Label>
                <Input id="add-end" name="ends_at" type="datetime-local" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="add-loc">Sted (valgfri)</Label>
              <Input id="add-loc" name="location" placeholder="Kulturhuset sal 2" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="add-comment">Kommentar (valgfri)</Label>
              <Input id="add-comment" name="comment" placeholder="Ta med kostymer" />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setShowAdd(false)}>Avbryt</Button>
              <Button type="submit" disabled={isPending}>{isPending ? 'Lagrer...' : 'Lagre'}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={!!editItem} onOpenChange={(open) => !open && setEditItem(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Rediger hendelse</DialogTitle>
          </DialogHeader>
          {editItem && (
            <form action={handleUpdate} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="edit-type">Type</Label>
                <select
                  id="edit-type"
                  name="type"
                  defaultValue={editItem.type}
                  className="w-full rounded-md border bg-background px-3 py-2 text-sm"
                >
                  {EVENT_TYPES.map((t) => (
                    <option key={t.value} value={t.value}>{t.label}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-title">Tittel (valgfri)</Label>
                <Input id="edit-title" name="title" defaultValue={editItem.title ?? ''} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="edit-start">Start</Label>
                  <Input
                    id="edit-start"
                    name="starts_at"
                    type="datetime-local"
                    required
                    defaultValue={toLocalInputValue(editItem.starts_at)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-end">Slutt (valgfri)</Label>
                  <Input
                    id="edit-end"
                    name="ends_at"
                    type="datetime-local"
                    defaultValue={editItem.ends_at ? toLocalInputValue(editItem.ends_at) : ''}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-loc">Sted (valgfri)</Label>
                <Input id="edit-loc" name="location" defaultValue={editItem.location ?? ''} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-comment">Kommentar (valgfri)</Label>
                <Input id="edit-comment" name="comment" defaultValue={editItem.comment ?? ''} />
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setEditItem(null)}>Avbryt</Button>
                <Button type="submit" disabled={isPending}>{isPending ? 'Lagrer...' : 'Lagre'}</Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Slett hendelse?</AlertDialogTitle>
            <AlertDialogDescription>Dette kan ikke angres.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Avbryt</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isPending}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Slett
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
