'use server';

import { getServerUserId, getServerUserEmail } from '@/lib/auth';
import {
  addWishlistItem,
  addWishlist,
  addEmailsToWishlist,
} from '@/lib/wishlists';

export async function createWishlist(formData: FormData) {
  const userId = await getServerUserId();
  const userEmail = await getServerUserEmail();
  const title = (formData.get('title') as string) || '[Namnlös önskelista]';
  const isMine = (formData.get('isMine') as string) || 'off';
  const receiverEmail = (formData.get('receiverEmail') as string) || '';
  const bgImg = (formData.get('bgImg') as string) || '';
  return addWishlist(
    {
      title,
      receiverEmail: isMine === 'on' ? userEmail : receiverEmail,
      bgImg,
    },
    userId
  );
}

export async function createWishlistItem(
  wishlistId: string,
  formData: FormData
) {
  const title = (formData.get('title') as string) || '[Ingen titel]';
  const description = (formData.get('description') as string) || '';
  const href = (formData.get('href') as string) || '';
  const imageURL = (formData.get('imageURL') as string) || '';
  return addWishlistItem({ title, description, href, imageURL }, wishlistId);
}

export async function addMembersToWishlist(
  wishlistId: string,
  wishlistTitle: string,
  shortURL: string,
  formData: FormData
) {
  const keys = ((formData.get('keys') as string) || '').split(' ');

  const emails = keys
    .map((key) => (formData.get(key) as string) || '')
    .map((email) => email.trim())
    .filter((email) => !!email);
  return addEmailsToWishlist(emails, wishlistId, wishlistTitle, shortURL);
}
