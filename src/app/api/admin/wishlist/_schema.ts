import { z } from "zod";

export const apiAdminWishlistSchema = z.object({
  id: z.string(),
  admin: z.string(),
});

export type ApiAdminWishlistPayload = z.infer<typeof apiAdminWishlistSchema>;

export type ApiAdminWishlistResponse = {
  id: string;
  admin: string;
  user: any;
};
