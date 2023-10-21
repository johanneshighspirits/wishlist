'use server';

import { getServerUserId } from '@/lib/auth';
import { addWishlistItem, addWishlist } from '@/lib/wishlists';

export async function createWishlist(formData: FormData) {
  const userId = await getServerUserId();
  const title = (formData.get('title') as string) || '[Namnlös önskelista]';
  const receiverEmail = (formData.get('receiverEmail') as string) || '';
  const bgImg = (formData.get('bgImg') as string) || '';
  return addWishlist({ title, receiverEmail, bgImg }, userId);
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
