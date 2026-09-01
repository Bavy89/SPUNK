'use client';

import { KeyRound } from 'lucide-react';
import { useAction } from 'next-safe-action/hooks';
import Link from 'next/link';
import { useRef, useState, type JSX } from 'react';
import { toast } from 'sonner';

import { AuthCard } from '@/components/Auth/AuthCard';
import { Email } from '@/components/Auth/Email';
import { EmailConfirmationPendingCard } from '@/components/Auth/EmailConfirmationPendingCard';
import { Button } from '@/components/ui/button';
import { resetPasswordAction } from '@/data/auth/auth';

export function ForgotPassword(): JSX.Element {
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const toastRef = useRef<string | number | undefined>(undefined);

  const { execute, status } = useAction(resetPasswordAction, {
    onExecute: () => {
      toastRef.current = toast.loading('Sender tilbakestillingslenke...');
    },
    onSuccess: () => {
      toast.success('Tilbakestillingslenke sendt', { id: toastRef.current });
      toastRef.current = undefined;
      setSuccessMessage('En tilbakestillingslenke er sendt til e-posten din.');
    },
    onError: ({ error }) => {
      toast.error(error.serverError ?? 'Kunne ikke sende tilbakestillingslenke', {
        id: toastRef.current,
      });
      toastRef.current = undefined;
    },
  });

  if (successMessage) {
    return (
      <EmailConfirmationPendingCard
        message={successMessage}
        heading="Tilbakestillingslenke sendt"
        type="reset-password"
        resetSuccessMessage={setSuccessMessage}
      />
    );
  }

  return (
    <AuthCard
      title="Glemt passordet?"
      description="Skriv inn e-posten din så sender vi deg en sikker tilbakestillingslenke."
      icon={<KeyRound aria-hidden="true" />}
      footer={
        <Button variant="link" className="mx-auto h-auto" asChild>
          <Link href="/login">Tilbake til innlogging</Link>
        </Button>
      }
    >
      <Email
        onSubmit={(email) => execute({ email })}
        isLoading={status === 'executing'}
        view="forgot-password"
      />
    </AuthCard>
  );
}
