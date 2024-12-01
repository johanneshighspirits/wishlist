import { WishlistItem } from "@/lib/wishlists/types";
import { z } from "zod";

export const apiAdminWishlistItemsSchema = z.object({
  wishlistId: z.string(),
});

export type ApiAdminWishlistItemsPayload = z.infer<
  typeof apiAdminWishlistItemsSchema
>;

export type ApiAdminWishlistItemsResponse = {
  wishlistId: string;
  items: WishlistItem[];
};
