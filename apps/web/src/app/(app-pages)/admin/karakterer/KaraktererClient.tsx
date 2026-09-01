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
import { createCharacterAction, updateCharacterAction, deleteCharacterAction } from './actions';

type Character = {
  id: string;
  name: string;
  category: string | null;
  production_id: string;
  production: { id: string; name: string } | null;
};

type Production = { id: string; name: string; slug: string };

export function KaraktererClient({
  characters,
  productions,
}: {
  characters: Character[];
  productions: Production[];
}) {
  const [isPending, startTransition] = useTransition();
  const [showAdd, setShowAdd] = useState(false);
  const [editItem, setEditItem] = useState<Character | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  function handleCreate(formData: FormData) {
    startTransition(async () => {
      await createCharacterAction(formData);
      setShowAdd(false);
    });
  }

  function handleUpdate(formData: FormData) {
    if (!editItem) return;
    startTransition(async () => {
      await updateCharacterAction(editItem.id, formData);
      setEditItem(null);
    });
  }

  function handleDelete() {
    if (!deleteId) return;
    startTransition(async () => {
      await deleteCharacterAction(deleteId);
      setDeleteId(null);
    });
  }

  return (
    <>
      <div className="flex justify-end">
        <Button onClick={() => setShowAdd(true)} className="gap-2">
          <Plus className="size-4" aria-hidden="true" />
          Ny karakter
        </Button>
      </div>

      <div className="rounded-lg border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Navn</TableHead>
              <TableHead>Kategori</TableHead>
              <TableHead>Produksjon</TableHead>
              <TableHead className="w-24" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {characters.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} className="py-8 text-center text-muted-foreground">
                  Ingen karakterer ennå.
                </TableCell>
              </TableRow>
            )}
            {characters.map((c) => (
              <TableRow key={c.id}>
                <TableCell className="font-medium">{c.name}</TableCell>
                <TableCell className="text-muted-foreground">{c.category ?? '—'}</TableCell>
                <TableCell className="text-muted-foreground">
                  {c.production?.name ?? '—'}
                </TableCell>
                <TableCell>
                  <div className="flex gap-1">
                    <Button size="icon" variant="ghost" onClick={() => setEditItem(c)} aria-label="Rediger">
                      <Pencil className="size-4" aria-hidden="true" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => setDeleteId(c.id)}
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
            <DialogTitle>Ny karakter</DialogTitle>
          </DialogHeader>
          <form action={handleCreate} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="add-name">Navn</Label>
              <Input id="add-name" name="name" required placeholder="Dorothy" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="add-cat">Kategori (valgfri)</Label>
              <Input id="add-cat" name="category" placeholder="Hovedrolle" />
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
            <DialogTitle>Rediger karakter</DialogTitle>
          </DialogHeader>
          {editItem && (
            <form action={handleUpdate} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="edit-name">Navn</Label>
                <Input id="edit-name" name="name" required defaultValue={editItem.name} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-cat">Kategori (valgfri)</Label>
                <Input id="edit-cat" name="category" defaultValue={editItem.category ?? ''} />
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
            <AlertDialogTitle>Slett karakter?</AlertDialogTitle>
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
