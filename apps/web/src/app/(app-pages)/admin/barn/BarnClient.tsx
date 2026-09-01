'use client';

import { useState, useTransition } from 'react';
import Link from 'next/link';
import { Plus, Pencil, Trash2, ChevronRight } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
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
import { createChildAction, updateChildAction, deleteChildAction } from './actions';

type Group = { id: string; name: string };
type Child = {
  id: string;
  display_name: string;
  created_at: string;
  child_groups: { group: Group | null }[];
};

export function BarnClient({ children }: { children: Child[] }) {
  const [isPending, startTransition] = useTransition();
  const [showAdd, setShowAdd] = useState(false);
  const [editItem, setEditItem] = useState<Child | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [query, setQuery] = useState('');

  const filtered = query.trim()
    ? children.filter((c) =>
        c.display_name.toLowerCase().includes(query.toLowerCase())
      )
    : children;

  function handleCreate(formData: FormData) {
    startTransition(async () => {
      await createChildAction(formData);
      setShowAdd(false);
    });
  }

  function handleUpdate(formData: FormData) {
    if (!editItem) return;
    startTransition(async () => {
      await updateChildAction(editItem.id, formData);
      setEditItem(null);
    });
  }

  function handleDelete() {
    if (!deleteId) return;
    startTransition(async () => {
      await deleteChildAction(deleteId);
      setDeleteId(null);
    });
  }

  return (
    <>
      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
          <Input
            placeholder="Søk på navn..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-9"
            autoComplete="off"
          />
        </div>
        <Button onClick={() => setShowAdd(true)} className="gap-2 shrink-0">
          <Plus className="size-4" aria-hidden="true" />
          Nytt barn
        </Button>
      </div>

      <div className="rounded-lg border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Navn</TableHead>
              <TableHead>Grupper</TableHead>
              <TableHead className="w-24" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 && (
              <TableRow>
                <TableCell colSpan={3} className="py-8 text-center text-muted-foreground">
                  {query ? `Ingen treff på "${query}"` : 'Ingen barn ennå.'}
                </TableCell>
              </TableRow>
            )}
            {filtered.map((child) => {
              const groups = child.child_groups
                .map((cg) => cg.group)
                .filter(Boolean) as Group[];
              return (
                <TableRow key={child.id}>
                  <TableCell className="font-medium">
                    <Link href={`/admin/barn/${child.id}`} className="hover:underline flex items-center gap-1">
                      {child.display_name}
                      <ChevronRight className="size-3 text-muted-foreground" />
                    </Link>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {groups.length === 0 ? (
                        <span className="text-muted-foreground">—</span>
                      ) : (
                        groups.map((g) => (
                          <Badge key={g.id} variant="secondary">{g.name}</Badge>
                        ))
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button size="icon" variant="ghost" onClick={() => setEditItem(child)} aria-label="Rediger">
                        <Pencil className="size-4" aria-hidden="true" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => setDeleteId(child.id)}
                        aria-label="Slett"
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="size-4" aria-hidden="true" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      <Dialog open={showAdd} onOpenChange={setShowAdd}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Nytt barn</DialogTitle>
          </DialogHeader>
          <form action={handleCreate} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="add-name">Navn</Label>
              <Input id="add-name" name="display_name" required placeholder="Ola Nordmann" />
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
            <DialogTitle>Rediger barn</DialogTitle>
          </DialogHeader>
          {editItem && (
            <form action={handleUpdate} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="edit-name">Navn</Label>
                <Input id="edit-name" name="display_name" required defaultValue={editItem.display_name} />
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
            <AlertDialogTitle>Slett barn?</AlertDialogTitle>
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
