'use client';

import { useState, useTransition } from 'react';
import { Plus, Pencil, Trash2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
import { createGroupAction, updateGroupAction, deleteGroupAction } from './actions';

type Group = {
  id: string;
  name: string;
  weekday: string | null;
  production_id: string;
  production: { id: string; name: string } | null;
};

type Production = { id: string; name: string; slug: string };

export function GrupperClient({
  groups,
  productions,
}: {
  groups: Group[];
  productions: Production[];
}) {
  const [isPending, startTransition] = useTransition();
  const [showAdd, setShowAdd] = useState(false);
  const [editItem, setEditItem] = useState<Group | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  function handleCreate(formData: FormData) {
    startTransition(async () => {
      await createGroupAction(formData);
      setShowAdd(false);
    });
  }

  function handleUpdate(formData: FormData) {
    if (!editItem) return;
    startTransition(async () => {
      await updateGroupAction(editItem.id, formData);
      setEditItem(null);
    });
  }

  function handleDelete() {
    if (!deleteId) return;
    startTransition(async () => {
      await deleteGroupAction(deleteId);
      setDeleteId(null);
    });
  }

  return (
    <>
      <div className="flex justify-end">
        <Button onClick={() => setShowAdd(true)} className="gap-2">
          <Plus className="size-4" aria-hidden="true" />
          Ny gruppe
        </Button>
      </div>

      <div className="rounded-lg border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Navn</TableHead>
              <TableHead>Ukedag</TableHead>
              <TableHead>Produksjon</TableHead>
              <TableHead className="w-24" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {groups.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} className="py-8 text-center text-muted-foreground">
                  Ingen grupper ennå.
                </TableCell>
              </TableRow>
            )}
            {groups.map((g) => (
              <TableRow key={g.id}>
                <TableCell className="font-medium">{g.name}</TableCell>
                <TableCell className="text-muted-foreground">{g.weekday ?? '—'}</TableCell>
                <TableCell className="text-muted-foreground">{g.production?.name ?? '—'}</TableCell>
                <TableCell>
                  <div className="flex gap-1">
                    <Button size="icon" variant="ghost" onClick={() => setEditItem(g)} aria-label="Rediger">
                      <Pencil className="size-4" aria-hidden="true" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => setDeleteId(g.id)}
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
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Ny gruppe</DialogTitle>
          </DialogHeader>
          <form action={handleCreate} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="add-name">Navn</Label>
              <Input id="add-name" name="name" required placeholder="Røverunger" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="add-weekday">Ukedag (valgfri)</Label>
              <Input id="add-weekday" name="weekday" placeholder="Mandag" />
            </div>
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
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setShowAdd(false)}>Avbryt</Button>
              <Button type="submit" disabled={isPending}>{isPending ? 'Lagrer...' : 'Lagre'}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={!!editItem} onOpenChange={(open) => !open && setEditItem(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Rediger gruppe</DialogTitle>
          </DialogHeader>
          {editItem && (
            <form action={handleUpdate} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="edit-name">Navn</Label>
                <Input id="edit-name" name="name" required defaultValue={editItem.name} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-weekday">Ukedag (valgfri)</Label>
                <Input id="edit-weekday" name="weekday" defaultValue={editItem.weekday ?? ''} />
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
            <AlertDialogTitle>Slett gruppe?</AlertDialogTitle>
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
