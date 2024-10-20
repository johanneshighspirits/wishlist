import { NextRequest, NextResponse } from "next/server";
import { UserError } from "@/lib/result/error";
import { kv } from "@vercel/kv";
import {
  WishlistKey,
  getKeyInvitation,
  getKeyMembers,
} from "@/lib/wishlists/constants";
import { getServerUser, getServerUserId } from "@/lib/auth";
import { Invitation } from "@/lib/wishlists/types";

export const POST = async (
  req: NextRequest,
  { params }: { params: { wishlistId: string } },
) => {
  try {
    const { id: userId, email: userEmail } = await getServerUser();
    const { wishlistId } = params;
    const memberEmails = await kv.smembers(getKeyMembers(wishlistId));
    const members = await Promise.all(
      memberEmails.map(async (memberEmail) => {
        const invitation = await kv.get<Invitation>(
          getKeyInvitation(memberEmail, wishlistId),
        );
        return {
          email: memberEmail,
          isCurrentUser: userEmail === memberEmail,
          accepted: invitation?.isAccepted || false,
          declined: invitation?.isDeclined || false,
        };
      }),
    );

    const recentMembers = await kv.sdiff(
      `${WishlistKey.UserRecentMembers}:${userId}`,
      getKeyMembers(wishlistId),
    );
    return NextResponse.json({ members, recentMembers });
  } catch (error: any) {
    if (error instanceof UserError) {
      return NextResponse.json({
        error,
      });
    }
    return NextResponse.json({ error });
  }
};
