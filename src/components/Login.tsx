'use client';
import { signIn, signOut, useSession } from 'next-auth/react';
import { Button } from './common/Button';

export const Login = () => {
  const { status } = useSession();

  if (status === 'loading') {
    return null;
  }

  if (status === 'authenticated') {
    return (
      <>
        <Button variant="tertiary" onClick={() => signOut()}>
          Logga ut
        </Button>
      </>
    );
  }

  return (
    <Button variant="secondary" onClick={() => signIn('google')}>
      Logga in
    </Button>
  );
};
