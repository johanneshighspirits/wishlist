'use client';

import { Wishlist, WishlistItem } from '@/lib/wishlists/types';
import { CreateWishlistItem } from './CreateWishlistItem';
import { useState } from 'react';
import { WishlistItems } from './WishlistItems';
import { FantasyBackground } from './FantasyBackground';

export const WishlistEditor = ({ wishlist }: { wishlist: Wishlist }) => {
  const [items, setItems] = useState<WishlistItem[]>(wishlist?.items || []);
  if (!wishlist) {
    return null;
  }

  return (
    <>
      <FantasyBackground backgroundImage={wishlist.bgImg}>
        <WishlistItems
          wishlistId={wishlist.id}
          items={items}
          onEdit={(editedItems) => setItems(editedItems)}
        />
      </FantasyBackground>
      <CreateWishlistItem
        wishlistId={wishlist.id}
        onCreated={(newItem) => setItems((state) => [...state, newItem])}
      />
    </>
  );
};
