'use client';
import { PropsWithChildren } from 'react';
import { Button } from './common/Button';

export const ShareLink = ({
  title,
  pathName,
  children,
}: PropsWithChildren<{ title: string; pathName: string }>) => {
  const handleClick = async () => {
    const url = `${location.origin}${pathName}`;
    console.log(url);
    try {
      if (navigator.share) {
        await navigator.share({
          title,
          url,
        });
      } else {
        await navigator.clipboard.writeText(url);
        alert(`Länk till Önskelistan är kopierad till urklipp.\n${url}`);
      }
    } catch {
      alert(`${title}:\n${url}`);
    }
  };
  return (
    <Button variant="secondary" onClick={handleClick}>
      {children ? (
        children
      ) : (
        <>
          Dela
          <span className="inline-block -translate-y-[1px] translate-x-1">
            ↗
          </span>
        </>
      )}
    </Button>
  );
};
