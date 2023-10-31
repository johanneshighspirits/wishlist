'use server';

import { generateShortUrl, slugify } from '@/utils/url';
import { WishlistKey } from './constants';
import { Invitation, Wishlist, WishlistItem } from './types';
import { kv } from '@vercel/kv';
import { getServerUserEmail, getServerUserId } from '../auth';

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

export const getWishlist = async (id: string): Promise<Wishlist | null> => {
  const userEmail = await getServerUserEmail();
  const hasAccess =
    (await kv.sismember(`${WishlistKey.WishlistMembers}:${id}`, userEmail)) ===
    1;
  if (!hasAccess) {
    throw new Error('Du har inte behörighet att se denna önskelista');
  }
  const wishlist = await kv.hgetall<Wishlist>(`${WishlistKey.Wishlist}:${id}`);
  if (!wishlist) {
    return null;
  }
  const userId = await getServerUserId();
  const isReceiver = wishlist.receiverEmail === userEmail;
  const itemIds = await kv.smembers(`${WishlistKey.WishlistItems}:${id}`);
  const items = (await Promise.all(
    itemIds.map((itemId) => kv.hgetall(`${WishlistKey.WishlistItem}:${itemId}`))
  ).then((items) => items.filter((item) => item !== null))) as WishlistItem[];

  const clientItems: WishlistItem[] = items.map((item) => {
    if (isReceiver) {
      // User is receiver - hide some fields
      const { isReservedBy, isBoughtBy, ...clientItem } = item;
      return {
        ...clientItem,
        isReceiver,
      };
    } else {
      return {
        ...item,
        isReservedByMe: item.isReservedBy?.toString() === userId,
        isBoughtByMe: item.isBoughtBy?.toString() === userId,
      };
    }
  });

  return {
    ...wishlist,
    items: clientItems,
    isReceiver,
  };
};

export const addWishlist = async (
  wishlist: Pick<Wishlist, 'title' | 'receiverEmail' | 'bgImg'>,
  userId: string
) => {
  const userEmail = await getServerUserEmail();
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
  await kv.sadd(
    `${WishlistKey.WishlistMembers}:${id}`,
    newWishlist.receiverEmail,
    userEmail
  );
  if (newWishlist.receiverEmail && newWishlist.receiverEmail !== userEmail) {
    await inviteEmailToWishlist(
      newWishlist.receiverEmail,
      userEmail,
      id,
      newWishlist.title,
      newWishlist.shortURL
    );
  }
  return newWishlist;
};

export const addEmailsToWishlist = async (
  emails: string[],
  wishlistId: string,
  wishlistTitle: string,
  shortURL: string
) => {
  const invitedBy = await getServerUserEmail();
  await kv.sadd(`${WishlistKey.WishlistMembers}:${wishlistId}`, ...emails);
  for (const email of emails) {
    await inviteEmailToWishlist(
      email,
      invitedBy,
      wishlistId,
      wishlistTitle,
      shortURL
    );
  }
  return emails;
};

export const inviteEmailToWishlist = (
  email: string,
  invitedBy: string,
  wishlistId: string,
  wishlistTitle: string,
  shortURL: string
) => {
  return kv.sadd(
    `${WishlistKey.Invitations}:${email}`,
    JSON.stringify({
      email,
      invitedBy,
      wishlistId,
      wishlistTitle,
      shortURL,
      isAccepted: false,
      isDeclined: false,
    })
  );
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
  return editedWishlistItem as WishlistItem;
};

export const deleteWishlistItem = async ({
  wishlistId,
  wishlistItemId,
}: {
  wishlistId: string;
  wishlistItemId: string;
}) => {
  const itemKey = `${WishlistKey.WishlistItem}:${wishlistItemId}`;
  await kv.del(itemKey);
  await kv.srem(`${WishlistKey.WishlistItems}:${wishlistId}`, wishlistItemId);
  return {
    success: true,
    message: `WishlistItem ${wishlistItemId} deleted from wishlist ${wishlistId}`,
  };
};

export const handleInvitation = async (wishlistId: string, accept: boolean) => {
  const userId = await getServerUserId();
  const userEmail = await getServerUserEmail();
  const allInvitations = await kv.smembers<Invitation[]>(
    `${WishlistKey.Invitations}:${userEmail}`
  );
  const invitation = allInvitations.find(
    (inv) => inv.wishlistId === wishlistId
  );
  await kv.srem(`${WishlistKey.Invitations}:${userEmail}`, invitation);
  const updatedInvitation = {
    ...invitation,
    ...(accept
      ? { isAccepted: true, isDeclined: false }
      : { isAccepted: false, isDeclined: true }),
  };
  await kv.sadd(`${WishlistKey.Invitations}:${userEmail}`, updatedInvitation);
  if (accept) {
    await kv.sadd(`${WishlistKey.UserWishlists}:${userId}`, wishlistId);
  } else {
    await kv.srem(`${WishlistKey.UserWishlists}:${userId}`, wishlistId);
  }
  return updatedInvitation;
};
