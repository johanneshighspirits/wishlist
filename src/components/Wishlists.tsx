import { kv } from "@vercel/kv";
import { CreateWishlist } from "@/components/CreateWishlist";
import { OpenWishlist } from "@/components/OpenWishlist";
import { getServerUser, getServerUserId } from "@/lib/auth";
import { LoremIpsum } from "@/components/LoremIpsum";
import { FantasyBackground } from "@/components/FantasyBackground";
import { SparkleText } from "@/components/common/SparkleText";
import { cachedGetWishlists } from "@/lib/wishlists";
import { MembersEditor } from "@/components/MembersEditor";
import { DeleteWishlist } from "@/components/DeleteWishlist";
import { MAX_WISHLISTS } from "@/utils/settings";
import { Detail } from "./Detail";
import { Collapsable } from "./Collapsable";

export const Wishlists = async () => {
  const { email, id: userId } = await getServerUser();
  const userWishlists = await cachedGetWishlists(email, userId);

  if (userWishlists === null) {
    return (
      <div className="flex flex-col gap-4">
        <h1 className="font-headline text-2xl">Något gick fel</h1>
        <p>Försök igen senare</p>
      </div>
    );
  }
  return (
    <>
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
        {userWishlists.length < MAX_WISHLISTS ? (
          <Collapsable title="Skapa ny önskelista">
            <h2 className="font-headline text-2xl">Skapa ny önskelista</h2>
            <CreateWishlist />
          </Collapsable>
        ) : (
          <>
            <h2>Max antal önskelistor uppnått.</h2>
            <p>Radera en av dina önskelistor eller skapa ett premiumkonto 💰</p>
          </>
        )}
      </article>
    </>
  );
};
