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
import {
  createProductionAction,
  updateProductionAction,
  deleteProductionAction,
} from './actions';

type Production = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  created_at: string;
};

export function ProduksjonerClient({ productions }: { productions: Production[] }) {
  const [isPending, startTransition] = useTransition();
  const [showAdd, setShowAdd] = useState(false);
  const [editItem, setEditItem] = useState<Production | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  function handleCreate(formData: FormData) {
    startTransition(async () => {
      await createProductionAction(formData);
      setShowAdd(false);
    });
  }

  function handleUpdate(formData: FormData) {
    if (!editItem) return;
    startTransition(async () => {
      await updateProductionAction(editItem.id, formData);
      setEditItem(null);
    });
  }

  function handleDelete() {
    if (!deleteId) return;
    startTransition(async () => {
      await deleteProductionAction(deleteId);
      setDeleteId(null);
    });
  }

  return (
    <>
      <div className="flex justify-end">
        <Button onClick={() => setShowAdd(true)} className="gap-2">
          <Plus className="size-4" aria-hidden="true" />
          Ny produksjon
        </Button>
      </div>

      <div className="rounded-lg border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Navn</TableHead>
              <TableHead>Slug</TableHead>
              <TableHead>Beskrivelse</TableHead>
              <TableHead className="w-24" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {productions.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} className="py-8 text-center text-muted-foreground">
                  Ingen produksjoner ennå.
                </TableCell>
              </TableRow>
            )}
            {productions.map((p) => (
              <TableRow key={p.id}>
                <TableCell className="font-medium">{p.name}</TableCell>
                <TableCell className="text-muted-foreground">{p.slug}</TableCell>
                <TableCell className="text-muted-foreground">{p.description ?? '—'}</TableCell>
                <TableCell>
                  <div className="flex gap-1">
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => setEditItem(p)}
                      aria-label="Rediger"
                    >
                      <Pencil className="size-4" aria-hidden="true" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => setDeleteId(p.id)}
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
            <DialogTitle>Ny produksjon</DialogTitle>
          </DialogHeader>
          <form action={handleCreate} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="add-name">Navn</Label>
              <Input id="add-name" name="name" required placeholder="Trollmannen fra Oz" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="add-desc">Beskrivelse (valgfri)</Label>
              <Input id="add-desc" name="description" placeholder="Vår 2026" />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setShowAdd(false)}>
                Avbryt
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending ? 'Lagrer...' : 'Lagre'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={!!editItem} onOpenChange={(open) => !open && setEditItem(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Rediger produksjon</DialogTitle>
          </DialogHeader>
          {editItem && (
            <form action={handleUpdate} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="edit-name">Navn</Label>
                <Input id="edit-name" name="name" required defaultValue={editItem.name} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-desc">Beskrivelse (valgfri)</Label>
                <Input id="edit-desc" name="description" defaultValue={editItem.description ?? ''} />
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setEditItem(null)}>
                  Avbryt
                </Button>
                <Button type="submit" disabled={isPending}>
                  {isPending ? 'Lagrer...' : 'Lagre'}
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Slett produksjon?</AlertDialogTitle>
            <AlertDialogDescription>
              Dette vil slette produksjonen og kan ikke angres.
            </AlertDialogDescription>
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
