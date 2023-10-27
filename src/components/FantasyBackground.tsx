import { randomRadialGradient } from '@/utils/random';
import clsx from 'clsx';
import { PropsWithChildren } from 'react';

export const FantasyBackground = ({
  backgroundImage = [
    randomRadialGradient(6),
    randomRadialGradient(4),
    randomRadialGradient(3),
  ].join(','),
  className,
  children,
}: PropsWithChildren<{ backgroundImage?: string; className?: string }>) => {
  return (
    <div className={clsx('relative rounded-md overflow-hidden', className)}>
      <div
        style={{
          backgroundImage,
          backgroundSize: '200% 200%',
        }}
        className="absolute inset-0 bg-white dark:bg-slate-800 -z-1"></div>
      {children}
    </div>
  );
};
