import { NextResponse } from "next/server";
import {
  ApiAdminWishlistUserResponse,
  apiAdminWishlistUserSchema,
} from "./_schema";
import { kv } from "@vercel/kv";
import { getKeyMembers, getKeyUsers } from "@/lib/wishlists/constants";
import { UserDB } from "@/lib/auth/types";

export const POST = async (request: Request) => {
  const json = await request.json();
  const parseResult = apiAdminWishlistUserSchema.safeParse(json);
  if (!parseResult.success) {
    return NextResponse.json(
      { error: "Invalid payload", details: parseResult.error.errors },
      { status: 400 },
    );
  }

  const { id, admin } = parseResult.data;
  const user = await kv.hgetall<UserDB>(getKeyUsers(admin));
  return NextResponse.json<ApiAdminWishlistUserResponse>({ id, admin, user });
};
