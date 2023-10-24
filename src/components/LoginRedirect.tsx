'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, ReactNode } from 'react';

export const LoginRedirect = ({
  url = '/wishlists',
  loadingContent,
  notLoggedInContent,
  hideStatus = false,
}: {
  url?: string;
  loadingContent?: ReactNode;
  notLoggedInContent?: ReactNode;
  hideStatus?: boolean;
}) => {
  const { status } = useSession();
  const router = useRouter();
  useEffect(() => {
    if (status === 'authenticated') {
      router.push(url);
    }
  }, [url, status, router]);
  if (status === 'loading') {
    return loadingContent ?? null;
  }
  if (status === 'unauthenticated') {
    return (
      notLoggedInContent ?? (
        <>
          <p>Logga in med knappen uppe till höger ↗</p>
          <div className="mt-8 flex justify-center w-full"></div>
        </>
      )
    );
  }
};
