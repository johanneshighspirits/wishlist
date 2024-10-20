import { kv } from "@vercel/kv";
import { CreateWishlist } from "@/components/CreateWishlist";
import { WishlistKey } from "@/lib/wishlists/constants";
import { Wishlist } from "@/lib/wishlists/types";
import { OpenWishlist } from "@/components/OpenWishlist";
import { getServerUserId } from "@/lib/auth";
import { LoremIpsum } from "@/components/LoremIpsum";
import { FantasyBackground } from "@/components/FantasyBackground";
import { SparkleText } from "@/components/common/SparkleText";
import { getWishlist } from "@/lib/wishlists";
import { MembersEditor } from "@/components/MembersEditor";
import { Suspense } from "react";
import { InvitationsEditor } from "@/components/InvitationsEditor";
import { DeleteWishlist } from "@/components/DeleteWishlist";

async function fetchWishlists() {
  const userId = await getServerUserId();
  const userWishlistIds = await kv.smembers(
    `${WishlistKey.UserWishlists}:${userId}`,
  );
  return Promise.allSettled<Promise<Wishlist>[]>(
    userWishlistIds
      .map((wishlistId) =>
        getWishlist(wishlistId).catch((err) => {
          console.error(err);
          return null;
        }),
      )
      .filter((w) => w !== null) as Promise<Wishlist>[],
  ).then(
    (settled) =>
      settled
        .map((promise) =>
          promise.status === "fulfilled" ? promise.value : null,
        )
        .filter((w) => w !== null) as Wishlist[],
  );
}

export default async function WishlistsPage() {
  const userWishlists = await fetchWishlists();
  return (
    <section className="flex flex-col gap-8">
      <Suspense>
        <InvitationsEditor />
      </Suspense>
      {userWishlists.length > 0 ? (
        <article className="flex flex-col gap-4">
          <h3>Dina önskelistor</h3>
          <ul className="flex flex-col gap-8">
            {userWishlists.map((w) => (
              <li key={w.id} className="text-white">
                <FantasyBackground
                  backgroundImage={w.bgImg}
                  className="flex flex-col gap-4 items-start p-4 lg:py-6 lg:px-8"
                >
                  <div className="flex w-full justify-between items-center">
                    <p className="font-headline text-lg">
                      <SparkleText hideSparkle={!w.isReceiver}>
                        {w.title}
                      </SparkleText>
                    </p>
                    {/* <ShareLink
                      title={w.title}
                      pathName={`/wishlist/${w.shortURL}`}></ShareLink> */}
                  </div>
                  <MembersEditor wishlist={w} />
                  <div className="hidden lg:block h-24 blur-sm overflow-hidden">
                    <LoremIpsum
                      className="leading-6"
                      maxLines={4}
                      maxWords={8}
                    />
                  </div>
                  <OpenWishlist id={w.shortURL} className="mx-auto" />
                  {!w.isReceiver && (
                    <OpenWishlist
                      readOnly
                      id={w.shortURL}
                      className="mx-auto"
                    />
                  )}
                  {w.isAdmin && <DeleteWishlist wishlist={w} />}
                </FantasyBackground>
              </li>
            ))}
          </ul>
        </article>
      ) : null}
      <article className="flex flex-col gap-4">
        {userWishlists.length < 2 ? (
          <>
            <h2>Skapa ny önskelista</h2>
            <CreateWishlist />
          </>
        ) : (
          <>
            <h2>Max antal önskelistor uppnått.</h2>
            <p>Radera en av dina önskelistor eller skapa ett premiumkonto 💰</p>
          </>
        )}
      </article>
    </section>
  );
}
