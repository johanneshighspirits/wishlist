import { NextRequest, NextResponse } from "next/server";
import { UserError } from "@/lib/result/error";
import { kv } from "@vercel/kv";
import {
  WishlistKey,
  getKeyInvitation,
  getKeyMembers,
  getKeyPendingWishlistInvitations,
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
    const memberEmails = (await kv.sunion(
      getKeyMembers(wishlistId),
      getKeyPendingWishlistInvitations(wishlistId),
    )) as string[];

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

    const recentMembers = await kv.smembers(
      `${WishlistKey.UserRecentMembers}:${userId}`,
    );
    const recentUninvitedMembers = new Set([
      ...recentMembers,
      ...members.map((m) => m.email),
    ]);
    return NextResponse.json({
      members,
      recentMembers: [...recentUninvitedMembers],
    });
  } catch (error: any) {
    if (error instanceof UserError) {
      return NextResponse.json({
        error,
      });
    }
    return NextResponse.json({ error });
  }
};
