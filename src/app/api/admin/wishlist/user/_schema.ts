import { UserDB } from "@/lib/auth/types";
import { z } from "zod";

export const apiAdminWishlistUserSchema = z.object({
  id: z.string(),
  admin: z.string(),
});

export type ApiAdminWishlistUserPayload = z.infer<
  typeof apiAdminWishlistUserSchema
>;

export type ApiAdminWishlistUserResponse = {
  id: string;
  admin: string;
  user: UserDB | null;
};
