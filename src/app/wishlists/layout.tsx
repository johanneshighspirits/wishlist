import { PropsWithChildren } from 'react';

export default function WishlistLayout({ children }: PropsWithChildren) {
  return (
    <div className="w-full items-center justify-between font-mono text-sm lg:flex">
      <section className="flex flex-col m-auto max-w-screen xl:max-w-5xl gap-8">
        {children}
      </section>
    </div>
  );
}
