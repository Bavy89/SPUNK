'use client';

import { useAction } from 'next-safe-action/hooks';
import Link from 'next/link';
import { useRef, useState } from 'react';
import { Clock } from 'lucide-react';
import { toast } from 'sonner';

import { AuthCard } from '@/components/Auth/AuthCard';
import { EmailAndPassword } from '@/components/Auth/EmailAndPassword';
import { Button } from '@/components/ui/button';
import { signUpAction } from '@/data/auth/auth';

interface SignUpProps {
  next?: string;
}

export function SignUp({ next }: SignUpProps) {
  const [submitted, setSubmitted] = useState(false);
  const toastRef = useRef<string | number | undefined>(undefined);

  const { execute, status } = useAction(signUpAction, {
    onExecute: () => {
      toastRef.current = toast.loading('Oppretter konto...');
    },
    onSuccess: () => {
      toast.dismiss(toastRef.current);
      toastRef.current = undefined;
      setSubmitted(true);
    },
    onError: ({ error }) => {
      toast.error(error.serverError ?? 'Kunne ikke opprette konto', { id: toastRef.current });
      toastRef.current = undefined;
    },
  });

  if (submitted) {
    return (
      <AuthCard title="" description="">
        <div className="flex flex-col items-center gap-4 py-4 text-center">
          <div className="flex size-14 items-center justify-center rounded-full bg-primary/10 text-primary">
            <Clock className="size-7" aria-hidden="true" />
          </div>
          <div className="space-y-1">
            <h2 className="text-xl font-bold">Søknad sendt!</h2>
            <p className="text-sm text-muted-foreground">
              Administrator vil godkjenne tilgangen din. Du vil få beskjed når kontoen er klar.
            </p>
          </div>
          <Button variant="outline" asChild className="mt-2 w-full">
            <Link href="/login">Tilbake til innlogging</Link>
          </Button>
        </div>
      </AuthCard>
    );
  }

  return (
    <AuthCard
      title="Opprett konto"
      description="Fyll inn informasjonen din for å få tilgang."
      footer={
        <p className="w-full text-center text-sm text-muted-foreground">
          Har du allerede konto?{' '}
          <Button variant="link" className="h-auto px-0" asChild>
            <Link href="/login">Logg inn</Link>
          </Button>
        </p>
      }
    >
      <EmailAndPassword
        isLoading={status === 'executing'}
        onSubmit={(data) =>
          execute({ email: data.email, password: data.password, full_name: data.full_name ?? '', next })
        }
        view="sign-up"
      />
    </AuthCard>
  );
}
