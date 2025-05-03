import { WishlistItem } from '@/lib/wishlists/types';

const itemsToText = (items: WishlistItem[]) => {
  return items
    .map((item) => {
      const { title, description, href, isBoughtBy, isReservedBy } = item;
      if (isBoughtBy || isReservedBy) {
        return null;
      }
      return [title, description, href].filter(Boolean).join('\n');
    })
    .filter(Boolean)
    .join('\n\n');
};
export const printItemsToConsole = (title: string, items: WishlistItem[]) => {
  console.log(
    `${title
      .split('')
      .map((c) => '=')
      .join('')}\n${title}\n${title
      .split('')
      .map((c) => '=')
      .join('')}\n\n${itemsToText(items)}\n${title
      .split('')
      .map((c) => '-')
      .join('')}\n`
  );
};
