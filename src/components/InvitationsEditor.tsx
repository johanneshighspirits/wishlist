import { getServerUserEmail } from "@/lib/auth";
import { getKeyUserInvitations } from "@/lib/wishlists/constants";
import { Invitation } from "@/lib/wishlists/types";
import { kv } from "@vercel/kv";
import { InvitationItem } from "./InvitationItem";

export const InvitationsEditor = async () => {
  const userEmail = await getServerUserEmail();
  const invitationKeys = await kv.smembers<string[]>(
    getKeyUserInvitations(userEmail),
  );
  const invitationRequests = await Promise.all<Promise<Invitation | null>[]>(
    invitationKeys.map((key) => kv.get<Invitation | null>(key)),
  );
  const invitations = invitationRequests?.filter(
    (inv) => inv !== null && !(inv.isDeclined || inv.isAccepted),
  ) as Invitation[];

  return invitations.length > 0 ? (
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
  ) : null;
};
