import kv from '@vercel/kv';
import { WishlistKey } from './constants';

export const checkWishlistAccess = async ({
  userId,
  wishlistId,
}: {
  userId: string;
  wishlistId: string;
}) => {
  const hasAccess = await kv.sismember(
    `${WishlistKey.UserWishlists}:${userId}`,
    wishlistId
  );
  if (!hasAccess) {
    throw new Error('401 Unauthorized');
  }
  return true;
};
