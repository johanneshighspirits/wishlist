import { NextResponse } from "next/server";
import {
  ApiAdminWishlistItemsResponse,
  apiAdminWishlistItemsSchema,
} from "./_schema";
import { cachedGetItems } from "@/lib/wishlists";

export const POST = async (request: Request) => {
  const json = await request.json();
  const parseResult = apiAdminWishlistItemsSchema.safeParse(json);
  if (!parseResult.success) {
    return NextResponse.json(
      { error: "Invalid payload", details: parseResult.error.errors },
      { status: 400 },
    );
  }

  const { wishlistId } = parseResult.data;
  const items = await cachedGetItems(wishlistId);
  return NextResponse.json<ApiAdminWishlistItemsResponse>({
    wishlistId,
    items,
  });
};
