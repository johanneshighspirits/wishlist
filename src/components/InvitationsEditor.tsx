import { getServerUserEmail } from "@/lib/auth";
import { getKeyUserInvitations } from "@/lib/wishlists/constants";
import { Invitation } from "@/lib/wishlists/types";
import { kv } from "@vercel/kv";
import { InvitationItem } from "./InvitationItem";

export const InvitationsEditor = async ({
  showMessageIfEmpty,
}: {
  showMessageIfEmpty?: boolean;
}) => {
  const userEmail = await getServerUserEmail();
  const invitationKeys = await kv.smembers<string[]>(
    getKeyUserInvitations(userEmail),
  );
  const invitationRequests = await Promise.all<Promise<Invitation | null>[]>(
    invitationKeys.map((key) => kv.get<Invitation | null>(key)),
  );
  console.log(
    `email: ${userEmail} found ${invitationRequests.length} invitations`,
  );
  const invitations = invitationRequests?.filter(
    (inv) => inv !== null && !(inv.isDeclined || inv.isAccepted),
  ) as Invitation[];
  console.log(
    `email: ${userEmail} after filtering: ${invitations.length} invitations`,
  );

  if (invitations.length === 0) {
    return showMessageIfEmpty ? (
      <div className="flex flex-col gap-4">
        <h2 className="font-headline text-2xl">
          Det finns inga obesvarade inbjudningar här...
        </h2>
        <p>
          En inbjudan är bara giltig i en vecka, har det gått längre än så - be
          om att bli inbjuden igen
        </p>
      </div>
    ) : null;
  }
  return (
    <div>
      <ul className="flex flex-col gap-8">
        {invitations.map((invitation) => (
          <InvitationItem
            invitation={invitation}
            key={invitation.wishlistId + invitation.invitedBy}
          />
        ))}
      </ul>
    </div>
  );
};
