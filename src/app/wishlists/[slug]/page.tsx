import { CreateWishlist } from '@/components/CreateWishlist';
import { FantasyBackground } from '@/components/FantasyBackground';
import { WishlistEditor } from '@/components/WishlistEditor';
import { getServerUserId } from '@/lib/auth';
import { WishlistKey } from '@/lib/wishlists/constants';
import { Wishlist, WishlistItem } from '@/lib/wishlists/types';
import { kv } from '@vercel/kv';

const idFromSlug = async (slug: string): Promise<string> => {
  const id: string =
    (await kv.hget<string>(`${WishlistKey.ShortURL}:${slug}`, 'id')) ?? '';
  return id;
};

const getWishlist = async (id: string): Promise<Wishlist | null> => {
  const userId = await getServerUserId();
  const wishlist = await kv.hgetall<Wishlist>(`${WishlistKey.Wishlist}:${id}`);
  if (!wishlist) {
    return null;
  }
  const itemIds = await kv.smembers(`${WishlistKey.WishlistItems}:${id}`);
  const items = (await Promise.all(
    itemIds.map((itemId) => kv.hgetall(`${WishlistKey.WishlistItem}:${itemId}`))
  ).then((items) => items.filter((item) => item !== null))) as WishlistItem[];

  const clientItems = items.map((item) => {
    return {
      ...item,
      isReservedByMe: item.isReservedBy?.toString() === userId,
      isBoughtByMe: item.isBoughtBy?.toString() === userId,
    };
  });
  return {
    ...wishlist,
    items: clientItems,
  };
};

type Props = {
  params: {
    slug: string;
  };
};

export default async function WishlistPage({ params: { slug } }: Props) {
  const id = await idFromSlug(slug);
  const wishlist = await getWishlist(id);
  if (!wishlist) {
    return (
      <section className="flex flex-col gap-16">
        <article className="flex flex-col gap-4">
          <h2 className="font-headline text-xl">
            Det är något fel som är trasigt...
          </h2>
          <p>
            Vi hittade ingen önskelista här, är du säker på att du har rätt
            adress?
          </p>
        </article>
        <article className="flex flex-col gap-4">
          <h3 className="font-headline text-xl">Skapa ny önskelista</h3>
          <CreateWishlist />
        </article>
      </section>
    );
  }

  return (
    <>
      <div className="flex gap-4 items-center">
        <FantasyBackground
          backgroundImage={wishlist.bgImg}
          className="w-8 h-8"></FantasyBackground>
        <h1 className="font-headline text-2xl">{wishlist.title}</h1>
      </div>
      <WishlistEditor wishlist={wishlist} />
    </>
  );
}
