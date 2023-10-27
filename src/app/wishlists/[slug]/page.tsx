import { FantasyBackground } from '@/components/FantasyBackground';
import { WishlistEditor } from '@/components/WishlistEditor';
import { SparkleText } from '@/components/common/SparkleText';
import { getServerUserId } from '@/lib/auth';
import { getWishlist } from '@/lib/wishlists';
import { WishlistKey } from '@/lib/wishlists/constants';
import { Wishlist } from '@/lib/wishlists/types';
import { kv } from '@vercel/kv';

const idFromSlug = async (slug: string): Promise<string> => {
  const id: string =
    (await kv.hget<string>(`${WishlistKey.ShortURL}:${slug}`, 'id')) ?? '';
  return id;
};

const DEV_CACHE = true;

const fetchWishlist = async (slug: string): Promise<Wishlist> => {
  if (DEV_CACHE) {
    return {
      id: 'id',
      title: 'title',
      slug: 'slug',
      shortURL: 'shortURL',
      items: [
        {
          id: 'id',
          title: 'title',
          description: 'description',
        },
        {
          id: 'id2',
          title: 'title2',
          description: 'description2',
        },
      ],
    };
  }
  const id = await idFromSlug(slug);
  const userId = await getServerUserId();
  const hasAccess = await kv.sismember(
    `${WishlistKey.UserWishlists}:${userId}`,
    id
  );
  if (hasAccess === 0) {
    throw new Error(
      'Du saknar rättigheter att se denna önskelista. Är du säker på att du har rätt adress?'
    );
  }
  const wishlist = await getWishlist(id);
  if (!wishlist) {
    throw new Error(
      'Vi hittade ingen önskelista här, är du säker på att du har rätt adress?'
    );
  }
  return wishlist;
};

type Props = {
  params: {
    slug: string;
  };
};

export async function generateMetadata({ params: { slug } }: Props) {
  try {
    const wishlist = await fetchWishlist(slug);
    return { title: `💝 ${wishlist.title} 💝` };
  } catch {
    return { title: '💝 Önskelistan 💝' };
  }
}

export default async function WishlistPage({ params: { slug } }: Props) {
  const wishlist = await fetchWishlist(slug);

  return (
    <>
      <div className="flex gap-4 items-center">
        <FantasyBackground
          backgroundImage={wishlist.bgImg}
          className="w-8 h-8"></FantasyBackground>
        <h1 className="font-headline text-2xl">
          <SparkleText hideSparkle={!wishlist.isReceiver}>
            {wishlist.title}
          </SparkleText>
        </h1>
      </div>
      <WishlistEditor wishlist={wishlist} />
    </>
  );
}
