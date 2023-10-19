import { generateShortUrl, slugify } from '@/utils/url';
import { WishlistKey } from './constants';
import { Wishlist, WishlistItem } from './types';
import { kv } from '@vercel/kv';

export const getUniqueShortURL = async (uuid: string): Promise<string> => {
  let length = 6;
  let shortURL = generateShortUrl(uuid, length);
  let isNotUnique = true;
  while (isNotUnique) {
    const shortURLExists = await kv.exists(
      `${WishlistKey.ShortURL}:${shortURL}`
    );
    isNotUnique = shortURLExists > 0;
    if (!isNotUnique) {
      return shortURL;
    } else {
      length += 1;
      shortURL = generateShortUrl(uuid, length);
    }
  }
  return uuid;
};

export const addWishlist = async (
  wishlist: Pick<Wishlist, 'title' | 'receiverEmail' | 'bgImg'>,
  userId: string
) => {
  const id = crypto.randomUUID();
  const slug = slugify(wishlist.title);
  const shortURL = await getUniqueShortURL(id);
  const newWishlist = {
    ...wishlist,
    id,
    slug,
    shortURL,
    admin: userId,
  };
  await kv.hset(`${WishlistKey.Wishlist}:${id}`, newWishlist);
  await kv.hset(`${WishlistKey.ShortURL}:${shortURL}`, {
    id,
    slug,
    admin: userId,
  });
  await kv.sadd(`${WishlistKey.UserWishlists}:${userId}`, id);
  return newWishlist;
};

export const addWishlistItem = async (
  wishlistItem: Omit<WishlistItem, 'id'>,
  wishlistId: string
) => {
  const id = crypto.randomUUID();
  const newWishlistItem = {
    ...wishlistItem,
    id,
  };
  await kv.hset(`${WishlistKey.WishlistItem}:${id}`, newWishlistItem);
  await kv.sadd(`${WishlistKey.WishlistItems}:${wishlistId}`, id);
  return newWishlistItem;
};

export const editWishlistItem = async (
  wishlistItem: Partial<WishlistItem> & { id: WishlistItem['id'] }
) => {
  const key = `${WishlistKey.WishlistItem}:${wishlistItem.id}`;
  const item = kv.hgetall(key);
  const editedWishlistItem = {
    ...item,
    ...wishlistItem,
  };
  await kv.hset(key, editedWishlistItem);
  return editedWishlistItem;
};
