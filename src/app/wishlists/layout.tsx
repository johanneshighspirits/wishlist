import { PropsWithChildren } from 'react';

export default function WishlistLayout({ children }: PropsWithChildren) {
  return (
    <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex">
      <section className="flex m-auto max-w-lg">{children}</section>
    </div>
  );
}
