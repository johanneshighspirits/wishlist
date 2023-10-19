import { kv } from '@vercel/kv';
import { CreateWishlist } from '@/components/CreateWishlist';
import { WishlistKey } from '@/lib/wishlists/constants';
import { Wishlist } from '@/lib/wishlists/types';
import { OpenWishlist } from '@/components/OpenWishlist';
import { ShareLink } from '@/components/ShareLink';
import { getServerUserId } from '@/lib/auth';
import { PropsWithChildren, Suspense } from 'react';
import clsx from 'clsx';
import { LoremIpsum } from '@/components/LoremIpsum';
import { randomRadialGradient } from '@/utils/random';
import { FantasyBackground } from '@/components/FantasyBackground';

export default async function WishlistsPage() {
  const userId = await getServerUserId();
  const userWishlistIds = await kv.smembers(
    `${WishlistKey.UserWishlists}:${userId}`
  );
  const userWishlists = await Promise.all(
    userWishlistIds
      .map((wishlistId) => {
        return new Promise((res) => {
          kv.hgetall<Record<string, Wishlist>>(
            `${WishlistKey.Wishlist}:${wishlistId}`
          ).then((wishlist) => {
            res({
              ...wishlist,
              id: wishlistId,
            });
          });
        });
      })
      .filter((w) => w !== null) as Promise<Wishlist & { id: string }>[]
  );

  return (
    <section className="flex flex-col gap-8">
      {userWishlists.length > 0 ? (
        <article className="flex flex-col gap-4">
          <h3>Dina önskelistor</h3>
          <ul className="flex flex-col gap-8">
            {userWishlists.map((w) => (
              <li key={w.id}>
                <FantasyBackground
                  backgroundImage={w.bgImg}
                  className="flex flex-col gap-4 items-start py-6 px-8">
                  <div className="flex w-full justify-between items-center">
                    <p className="font-headline text-lg">{w.title}</p>
                    <ShareLink
                      title={w.title}
                      pathName={`/wishlist/${w.shortURL}`}></ShareLink>
                  </div>
                  <div className="h-24 blur-sm overflow-hidden">
                    <LoremIpsum
                      className="leading-6"
                      maxLines={4}
                      maxWords={8}
                    />
                  </div>
                  <OpenWishlist id={w.shortURL} className="mx-auto" />
                </FantasyBackground>
              </li>
            ))}
          </ul>
        </article>
      ) : null}
      <article className="flex flex-col gap-4">
        <h2>Skapa ny önskelista</h2>
        <CreateWishlist />
      </article>
    </section>
  );
}
