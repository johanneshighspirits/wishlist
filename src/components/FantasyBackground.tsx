'use client';

import { randomRadialGradient } from '@/utils/random';
import clsx from 'clsx';
import { PropsWithChildren, useEffect, useState } from 'react';

export const FantasyBackground = ({
  backgroundImage,
  className,
  children,
}: PropsWithChildren<{ backgroundImage?: string; className?: string }>) => {
  const [bg, setBg] = useState(backgroundImage);
  useEffect(() => {
    if (!backgroundImage) {
      setBg(
        [
          randomRadialGradient(6),
          randomRadialGradient(4),
          randomRadialGradient(3),
        ].join(',')
      );
    }
  }, [backgroundImage]);
  return (
    <div className={clsx('relative rounded-md overflow-hidden', className)}>
      <div
        style={{
          backgroundImage: bg,
          backgroundSize: '200% 200%',
        }}
        className="absolute inset-0 bg-white dark:bg-slate-800 -z-1"></div>
      {children}
    </div>
  );
};
