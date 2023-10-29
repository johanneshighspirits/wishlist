import { FantasyBackground } from '@/components/FantasyBackground';
import { WishlistEditor } from '@/components/WishlistEditor';
import { SparkleText } from '@/components/common/SparkleText';
import { getServerUserId } from '@/lib/auth';
import { getWishlist } from '@/lib/wishlists';
import { WishlistKey } from '@/lib/wishlists/constants';
import { Wishlist } from '@/lib/wishlists/types';
import { randomRadialGradient } from '@/utils/random';
import { kv } from '@vercel/kv';
import { unstable_cache } from 'next/cache';

const idFromSlug = unstable_cache(
  async (slug: string): Promise<string> => {
    const id: string =
      (await kv.hget<string>(`${WishlistKey.ShortURL}:${slug}`, 'id')) ?? '';
    return id;
  },
  ['slug-id'],
  { revalidate: 24 * 60 * 60 }
);

const DEV_CACHE = false;
const bgImg = [
  randomRadialGradient(6),
  randomRadialGradient(4),
  randomRadialGradient(3),
].join(',');

const fetchWishlist = async (slug: string): Promise<Wishlist> => {
  if (DEV_CACHE) {
    return {
      id: 'id',
      title: 'title',
      slug: 'slug',
      shortURL: 'shortURL',
      bgImg,
      items: [
        {
          id: 'id',
          title: 'title',
          description: 'description',
          isBoughtBy: '123',
          isBoughtByMe: false,
          href: 'https://www.google.com',
        },
        {
          id: 'id3',
          title: 'title3',
          description: 'description3',
          isBoughtBy: 'me',
          isBoughtByMe: true,
        },
        {
          id: 'id4',
          title: 'title4',
          description: 'description4',
          isReservedBy: '1234',
          isReservedByMe: false,
        },
        {
          id: 'id5',
          title: 'title5',
          description: 'description5',
          isReservedBy: 'me',
          isReservedByMe: true,
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
