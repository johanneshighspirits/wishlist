import { getServerUserEmail } from '@/lib/auth';
import { WishlistKey } from '@/lib/wishlists/constants';
import { Invitation } from '@/lib/wishlists/types';
import { kv } from '@vercel/kv';
import { InvitationItem } from './InvitationItem';

export const InvitationsEditor = async () => {
  const userEmail = await getServerUserEmail();
  const invitations = await kv.smembers<Invitation[]>(
    `${WishlistKey.Invitations}:${userEmail}`
  );
  if (
    !invitations.filter((inv) => !(inv.isDeclined || inv.isAccepted)).length
  ) {
    return null;
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
