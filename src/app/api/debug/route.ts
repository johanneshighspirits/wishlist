import { WishlistItem } from '@/lib/wishlists/types';
import { kv } from '@vercel/kv';
import { NextResponse } from 'next/server';

// const itemKeys:string[] = [
// ];

export const GET = async () => {
  // let fakeTimestamp = Date.now();
  // const changedItems = [];
  // for (const itemKey of itemKeys) {
  //   const item = await kv.hgetall<WishlistItem>(itemKey);
  //   if (!item) {
  //     continue;
  //   }
  //   const editedItem = {
  //     ...item,
  //   };
  //   const { timestamp, href } = item;
  //   let needsUpdate = false;
  //   if (!timestamp) {
  //     editedItem.timestamp = fakeTimestamp += 1000;
  //     needsUpdate = true;
  //   }
  //   if (href) {
  //     if (!href.startsWith('https://')) {
  //       editedItem.href = '';
  //       needsUpdate = true;
  //     }
  //     if (href.includes('_next')) {
  //       console.log(itemKey, href);
  //     }
  //   }
  //   if (needsUpdate) {
  //     changedItems.push(editedItem);
  //     await kv.hset(itemKey, editedItem);
  //   }
  // }
  // return NextResponse.json({ changedItems })
  return NextResponse.json({ allYourBase: 'areBelongToUs' });
};
