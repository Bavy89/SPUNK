'use client';

import { LockKeyhole, Mail, User } from 'lucide-react';
import type { ComponentProps } from 'react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field';
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from '@/components/ui/input-group';
import { Spinner } from '@/components/ui/spinner';
import { cn } from '@/lib/utils';

export const EmailAndPassword = ({
  onSubmit,
  view,
  isLoading,
  className,
  ...buttonProps
}: {
  onSubmit: (data: { email: string; password: string; full_name?: string }) => void;
  view: 'sign-in' | 'sign-up';
  isLoading: boolean;
} & Omit<ComponentProps<typeof Button>, 'children' | 'type'>) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit({ email, password, ...(view === 'sign-up' ? { full_name: fullName } : {}) });
      }}
      data-testid="password-form"
    >
      <FieldGroup className="gap-5">
        {view === 'sign-up' && (
          <Field>
            <FieldLabel htmlFor="sign-up-name">Fullt navn</FieldLabel>
            <InputGroup>
              <InputGroupAddon>
                <User aria-hidden="true" />
              </InputGroupAddon>
              <InputGroupInput
                id="sign-up-name"
                name="full_name"
                type="text"
                disabled={isLoading}
                value={fullName}
                placeholder="Ola Nordmann"
                onChange={(event) => setFullName(event.target.value)}
                autoComplete="name"
                required
              />
            </InputGroup>
          </Field>
        )}
        <Field>
          <FieldLabel htmlFor={`${view}-email`}>E-postadresse</FieldLabel>
          <InputGroup>
            <InputGroupAddon>
              <Mail aria-hidden="true" />
            </InputGroupAddon>
            <InputGroupInput
              id={`${view}-email`}
              name="email"
              type="email"
              disabled={isLoading}
              value={email}
              data-strategy="email-password"
              placeholder="email@example.com"
              onChange={(event) => setEmail(event.target.value)}
              autoComplete="email"
              required
            />
          </InputGroup>
        </Field>
        <Field>
          <FieldLabel htmlFor={`${view}-password`}>Passord</FieldLabel>
          <InputGroup>
            <InputGroupAddon>
              <LockKeyhole aria-hidden="true" />
            </InputGroupAddon>
            <InputGroupInput
              id={`${view}-password`}
              name="password"
              type="password"
              disabled={isLoading}
              value={password}
              placeholder={view === 'sign-in' ? 'Skriv inn passord' : 'Velg et passord'}
              onChange={(event) => setPassword(event.target.value)}
              autoComplete={view === 'sign-in' ? 'current-password' : 'new-password'}
              required
            />
          </InputGroup>
          {view === 'sign-in' ? (
            <div className="flex justify-end">
              <Button variant="link" className="h-auto px-0 text-xs" asChild>
                <a href="/forgot-password">Glemt passord?</a>
              </Button>
            </div>
          ) : null}
        </Field>
        <Button
          {...buttonProps}
          disabled={isLoading || buttonProps.disabled}
          type="submit"
          className={cn('w-full', className)}
        >
          {isLoading ? <Spinner aria-hidden="true" /> : null}
          {isLoading
            ? 'Logger inn...'
            : view === 'sign-in'
              ? 'Logg inn'
              : 'Opprett konto'}
        </Button>
      </FieldGroup>
    </form>
  );
};
