import { FantasyBackground } from "@/components/FantasyBackground";
import { WishlistEditor } from "@/components/WishlistEditor";
import { SparkleText } from "@/components/common/SparkleText";
import { getServerUser } from "@/lib/auth";
import { getWishlist } from "@/lib/wishlists";
import { WishlistKey } from "@/lib/wishlists/constants";
import { Wishlist } from "@/lib/wishlists/types";
import { randomGradientBackground } from "@/utils/random";
import { kv } from "@vercel/kv";
import { unstable_cache } from "next/cache";

const cachedGetWishlistIdFromSlug = unstable_cache(
  async (slug: string): Promise<string> => {
    const id: string =
      (await kv.hget<string>(`${WishlistKey.ShortURL}:${slug}`, "id")) ?? "";
    return id;
  },
  ["slug-id"],
  { revalidate: 86400 /* 24 hours */ },
);

const bgImg = randomGradientBackground().backgroundImage;

const fetchWishlist = async (slug: string): Promise<Wishlist> => {
  if (process.env.DEV_CACHE === "true") {
    return {
      id: "id",
      title: "title",
      slug: "slug",
      shortURL: "shortURL",
      bgImg,
      items: [
        {
          id: "id",
          title: "title",
          description: "description",
          timestamp: 1,
          isBoughtBy: "123",
          isBoughtByMe: false,
          href: "https://www.google.com",
        },
        {
          id: "id2.75",
          title: "title2.75",
          description: "description2.75",
          timestamp: 2.75,
        },
        {
          id: "id2",
          title: "title2",
          description: "description2",
          timestamp: 2,
        },
        {
          id: "id2.5",
          title: "title2.5",
          description: "description2.5",
          timestamp: 2.5,
        },
        {
          id: "id3.9",
          title: "title3.9",
          description: "description3.9",
          timestamp: 3.9,
          isBoughtBy: "me",
          isBoughtByMe: true,
        },
        {
          id: "id3",
          title: "title3",
          description: "description3",
          timestamp: 3,
          isBoughtBy: "me",
          isBoughtByMe: true,
        },
        {
          id: "id3.1",
          title: "title3.1",
          description: "description3.1",
          timestamp: 3.1,
          isBoughtBy: "me",
          isBoughtByMe: true,
        },
        {
          id: "id4",
          title: "title4",
          description: "description4",
          timestamp: 4,
          isReservedBy: "1234",
          isReservedByMe: false,
        },
        {
          id: "id5",
          title: "title5",
          description: "description5",
          timestamp: 5,
          isReservedBy: "me",
          isReservedByMe: true,
        },
      ],
    };
  }
  const wishlistId = await cachedGetWishlistIdFromSlug(slug);
  const { email, id: userId } = await getServerUser();
  const wishlist = await getWishlist(wishlistId, email, userId);
  if (!wishlist) {
    throw new Error(
      "Vi hittade ingen önskelista här, är du säker på att du har rätt adress?",
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
    return { title: "💝 Önskelistan 💝" };
  }
}

export default async function WishlistPage({ params: { slug } }: Props) {
  const wishlist = await fetchWishlist(slug);
  return (
    <>
      <div className="flex gap-4 items-center">
        <FantasyBackground
          backgroundImage={wishlist.bgImg}
          className="w-8 h-8"
        ></FantasyBackground>
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
