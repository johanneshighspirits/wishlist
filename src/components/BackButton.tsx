'use client';

import clsx from 'clsx';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { PropsWithChildren } from 'react';

export const BackButton = ({
  className,
  children,
}: PropsWithChildren<{ className?: string }>) => {
  const pathname = usePathname();
  if (pathname.split('/').length <= 2) {
    return null;
  }
  return (
    <Link
      className={clsx('cursor-pointer', className)}
      href={pathname.split('/').slice(0, -1).join('/') || '/'}>
      {children}
    </Link>
  );
};
