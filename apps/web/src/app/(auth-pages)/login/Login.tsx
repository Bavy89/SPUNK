'use client';

import { useAction } from 'next-safe-action/hooks';
import { useRouter } from 'next/navigation';
import { useRef, useState } from 'react';
import { toast } from 'sonner';

import { AuthCard } from '@/components/Auth/AuthCard';
import { EmailAndPassword } from '@/components/Auth/EmailAndPassword';
import { RedirectingPleaseWaitCard } from '@/components/Auth/RedirectingPleaseWaitCard';
import { signInWithPasswordAction } from '@/data/auth/auth';

export function Login({ next }: { next?: string }) {
  const [redirectInProgress, setRedirectInProgress] = useState(false);
  const toastRef = useRef<string | number | undefined>(undefined);
  const router = useRouter();

  function redirectToDashboard() {
    router.push(next ? `/auth/callback?next=${next}` : '/dashboard');
  }

  const { execute: executePassword, status: passwordStatus } = useAction(
    signInWithPasswordAction,
    {
      onExecute: () => {
        toastRef.current = toast.loading('Logger inn...');
      },
      onSuccess: () => {
        toast.success('Logget inn', { id: toastRef.current });
        toastRef.current = undefined;
        redirectToDashboard();
        setRedirectInProgress(true);
      },
      onError: ({ error }) => {
        toast.error(error.serverError ?? 'Kunne ikke logge inn', {
          id: toastRef.current,
        });
        toastRef.current = undefined;
      },
    }
  );

  if (redirectInProgress) {
    return (
      <RedirectingPleaseWaitCard
        message="Vennligst vent mens vi åpner oversikten."
        heading="Åpner oversikten"
      />
    );
  }

  return (
    <AuthCard
      title="Logg inn på Villekulla"
      description="Skriv inn e-post og passord for å fortsette."
    >
      <EmailAndPassword
        isLoading={passwordStatus === 'executing'}
        onSubmit={(data) => executePassword(data)}
        view="sign-in"
      />
    </AuthCard>
  );
}
