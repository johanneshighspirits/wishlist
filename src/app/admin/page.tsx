import { WishlistAdminInfo } from "@/components/admin/WishlistAdminInfo";
import { getServerUserEmail } from "@/lib/auth";
import { cachedGetAllWishlists } from "@/lib/wishlists";
import { redirect } from "next/navigation";
import { Suspense } from "react";

export default async function AdminPage() {
  const email = await getServerUserEmail();
  if (email !== process.env.ADMIN_EMAIL) {
    redirect("/");
  }

  return (
    <div>
      <Suspense fallback={<p>Loading wishlists</p>}>
        <Wishlists email={email} />
      </Suspense>
    </div>
  );
}

const Wishlists = async ({ email }: { email: string }) => {
  if (!email) {
    return null;
  }
  const wishlists = await cachedGetAllWishlists(email);
  if (!wishlists || wishlists.length === 0) {
    return <div>No wishlists found in DB</div>;
  }
  return (
    <article className="flex flex-col gap-4">
      <h2 className="font-headline text-2xl">Wishlists</h2>
      <ul className="flex flex-col md:grid md:grid-cols-[repeat(auto-fit,minmax(480px,1fr))] gap-8">
        {wishlists.map((wishlist) => (
          <WishlistAdminInfo key={wishlist.id} wishlist={wishlist} />
        ))}
      </ul>
    </article>
  );
};
