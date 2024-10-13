'use server';

import { generateShortUrl, slugify } from '@/utils/url';
import { WishlistKey } from './constants';
import { Invitation, Wishlist, WishlistItem } from './types';
import { kv } from '@vercel/kv';
import { getServerUser, getServerUserEmail, getServerUserId } from '../auth';
import { revalidateTag, unstable_cache } from 'next/cache';
import validator from 'validator';
import { sendInvitationEmail } from '../email/sendEmail';

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

export const cachedUserHasAccess = unstable_cache(
  async (wishlistId: string, userEmail: string) => {
    const isMember = await kv.sismember(
      `${WishlistKey.WishlistMembers}:${wishlistId}`,
      userEmail
    );
    return isMember === 1;
  },
  [WishlistKey.WishlistMembers],
  { revalidate: 3600, tags: [WishlistKey.WishlistMembers] }
);

export const cachedGetWishlist = unstable_cache(
  async (wishlistId: string) => {
    return kv.hgetall<Wishlist>(`${WishlistKey.Wishlist}:${wishlistId}`);
  },
  [WishlistKey.Wishlist],
  { revalidate: 3600, tags: [WishlistKey.Wishlist] }
);

export const cachedGetItems = unstable_cache(
  async (wishlistId: string) => {
    const itemIds = await kv.smembers(
      `${WishlistKey.WishlistItems}:${wishlistId}`
    );
    const items = await Promise.all(
      itemIds.map((itemId) =>
        kv.hgetall<WishlistItem>(`${WishlistKey.WishlistItem}:${itemId}`)
      )
    );
    return items.filter((item) => item !== null) as WishlistItem[];
  },
  [WishlistKey.WishlistItems, WishlistKey.WishlistItem],
  {
    revalidate: 3600,
    tags: [WishlistKey.WishlistItems, WishlistKey.WishlistItem],
  }
);

export const getWishlist = async (id: string): Promise<Wishlist | null> => {
  const { email, id: userId } = await getServerUser();
  const hasAccess = await cachedUserHasAccess(id, email);
  if (!hasAccess) {
    throw new Error('Du har inte behörighet att se denna önskelista');
  }
  const wishlist = await cachedGetWishlist(id);
  if (!wishlist) {
    return null;
  }
  const isReceiver = wishlist.receiverEmail === email;
  const items = await cachedGetItems(id);

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
  await kv.sadd(
    `${WishlistKey.UserRecentMembers}:${userId}`,
    newWishlist.receiverEmail
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
  revalidateTag(WishlistKey.Wishlist);
  revalidateTag(WishlistKey.WishlistItems);
  revalidateTag(WishlistKey.WishlistMembers);
  return newWishlist;
};

export const addEmailsToWishlist = async (
  emails: string[],
  wishlistId: string,
  wishlistTitle: string,
  shortURL: string
) => {
  const { id: userId, email: invitedBy } = await getServerUser();
  await kv.sadd(`${WishlistKey.WishlistMembers}:${wishlistId}`, ...emails);
  await kv.sadd(`${WishlistKey.UserRecentMembers}:${userId}`, ...emails);
  revalidateTag(WishlistKey.WishlistMembers);
  revalidateTag(WishlistKey.UserRecentMembers);
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

export const inviteEmailToWishlist = async (
  email: string,
  invitedBy: string,
  wishlistId: string,
  wishlistTitle: string,
  shortURL: string
) => {
  if (!validator.isEmail(email)) {
    throw new Error('Invalid email');
  }
  await kv.sadd(
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
  await sendInvitationEmail({ receiver: email, invitedBy, wishlistTitle });
};

export const addWishlistItem = async (
  wishlistItem: Omit<WishlistItem, 'id' | 'timestamp'>,
  wishlistId: string
) => {
  const id = crypto.randomUUID();
  const timestamp = Date.now();
  const newWishlistItem = {
    ...wishlistItem,
    id,
    timestamp,
  };
  await kv.hset(`${WishlistKey.WishlistItem}:${id}`, newWishlistItem);
  await kv.sadd(`${WishlistKey.WishlistItems}:${wishlistId}`, id);
  revalidateTag(WishlistKey.WishlistItem);
  revalidateTag(WishlistKey.WishlistItems);
  return newWishlistItem;
};

export const editWishlistItem = async (
  wishlistItem: Partial<WishlistItem> & { id: WishlistItem['id'] }
): Promise<WishlistItem> => {
  const key = `${WishlistKey.WishlistItem}:${wishlistItem.id}`;
  const item = await kv.hgetall<WishlistItem>(key);
  const editedWishlistItem = {
    ...item,
    ...wishlistItem,
  };
  await kv.hset(key, editedWishlistItem);
  revalidateTag(WishlistKey.WishlistItem);
  revalidateTag(WishlistKey.WishlistItems);
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
  revalidateTag(WishlistKey.WishlistItem);
  revalidateTag(WishlistKey.WishlistItems);
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
  revalidateTag(WishlistKey.UserWishlists);
  return updatedInvitation;
};
