'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export const LoginRedirect = ({
  url = '/wishlists',
  hideStatus = false,
}: {
  url?: string;
  hideStatus?: boolean;
}) => {
  const { status } = useSession();
  const router = useRouter();
  useEffect(() => {
    if (status === 'authenticated') {
      router.push(url);
    }
  }, [url, status, router]);
  if (hideStatus === true) {
    return null;
  }
  return status === 'loading' ? (
    'Vänta lite...'
  ) : (
    <>
      <h1 className="font-headline text-2xl">Välkommen!</h1>
      <p>Logga in med knappen uppe till höger ↗</p>
      <div className="mt-8 flex justify-center w-full"></div>
    </>
  );
};
