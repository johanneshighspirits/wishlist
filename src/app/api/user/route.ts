import { WishlistKey } from "./../../../lib/wishlists/constants";
import { authOptions } from "@/lib/auth/authOptions";
import { kv } from "@vercel/kv";
import { getServerSession } from "next-auth/next";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (session) {
    const user = await kv.hgetall(`${WishlistKey.User}:dev`);
    return NextResponse.json(user);
  } else {
    // console.log(session);
    return NextResponse.json({
      error:
        "You must be signed in to view the protected content on this page.",
    });
  }
}
