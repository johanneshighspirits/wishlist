'use client';

import { BackButton } from '@/components/BackButton';
import { CreateWishlist } from '@/components/CreateWishlist';
import { Button } from '@/components/common/Button';

export default function WishlistErrorPage({
  error,
}: {
  error: Error & { digest?: string };
}) {
  console.error(`${error.message} 💥 ${error.digest}`);
  return (
    <section className="flex flex-col gap-16">
      <article className="flex flex-col gap-4">
        <h2 className="font-headline text-xl">
          Det är något fel som är trasigt...
        </h2>
        <p>{error.message}</p>
      </article>
      <div className="flex flex-col gap-4">
        <h3 className="font-headline text-lg">Alla önskelistor</h3>
        <BackButton>
          <Button variant="secondary">
            &laquo; Tillbaka till alla önskelistor
          </Button>
        </BackButton>
      </div>
      <article className="flex flex-col gap-4">
        <h3 className="font-headline text-xl">Skapa ny önskelista</h3>
        <CreateWishlist />
      </article>
    </section>
  );
}
