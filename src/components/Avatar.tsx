'use client';
import { useSession } from 'next-auth/react';
import Image from 'next/image';

export const Avatar = () => {
  const { data: session } = useSession();
  const user = session?.user;
  if (!user?.image) {
    return null;
  }
  return (
    <Image
      className="rounded-full h-8 w-8"
      alt={user.name || 'Användarporträtt'}
      src={user.image}
      width="90"
      height="90"
    />
  );
};
