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
  console.log(`email: ${userEmail} invited to ${invitationKeys.join(", ")}`);
  const invitationRequests = await Promise.all<Promise<Invitation | null>[]>(
    invitationKeys.map((key) => kv.get<Invitation | null>(key)),
  );
  const invitations = invitationRequests?.filter(
    (inv) => inv !== null && !(inv.isDeclined || inv.isAccepted),
  ) as Invitation[];
  console.log(`email: ${userEmail} found ${invitations.length} invitations`);

  if (invitations.length === 0) {
    return showMessageIfEmpty ? (
      <div>
        <h2>Det finns inga inbjudningar här...</h2>
        <p>En inbjudan är bara giltig i en vecka</p>
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
