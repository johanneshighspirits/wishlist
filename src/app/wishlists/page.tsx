import { Suspense } from "react";
import { InvitationsEditor } from "@/components/InvitationsEditor";
import { Wishlists } from "@/components/Wishlists";
import { Loading } from "@/components/Loading";

export default async function WishlistsPage() {
  return (
    <section className="flex flex-col gap-8">
      <Suspense>
        <InvitationsEditor />
      </Suspense>
      <Suspense fallback={<Loading>Laddar önskelistor...</Loading>}>
        <Wishlists />
      </Suspense>
    </section>
  );
}
