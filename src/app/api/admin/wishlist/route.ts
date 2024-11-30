import { NextResponse } from "next/server";
import { ApiAdminWishlistResponse, apiAdminWishlistSchema } from "./_schema";
import { kv } from "@vercel/kv";
import { getKeyMembers, getKeyUsers } from "@/lib/wishlists/constants";

export const POST = async (request: Request) => {
  const json = await request.json();
  const parseResult = apiAdminWishlistSchema.safeParse(json);
  if (!parseResult.success) {
    return NextResponse.json(
      { error: "Invalid payload", details: parseResult.error.errors },
      { status: 400 },
    );
  }

  const { id, admin } = parseResult.data;
  const user = await kv.hgetall(getKeyUsers(admin));
  return NextResponse.json<ApiAdminWishlistResponse>({ id, admin, user });
};
