'use client';
import { useSession } from 'next-auth/react';

export const LoginStatus = () => {
  const { data: session, status } = useSession();
  if (status !== 'authenticated') {
    return null;
  }
  const userName = session?.user?.name;
  const userEmail = session?.user?.email;

  return (
    <>
      {/* <p>{userName}</p> */}
      <p className="text-xs">{userEmail}</p>
    </>
  );
};
