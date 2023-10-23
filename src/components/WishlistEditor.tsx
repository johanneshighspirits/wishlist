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
          isReceiver={wishlist.isReceiver}
          items={items}
          onEdit={(editedItems) => setItems(editedItems)}
        />
      </FantasyBackground>
      {items.length > 0 ? (
        <div className="mt-12">
          <p>Använd formuläret 👇 för att lägga till fler saker</p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          <p>Oj, här var det tomt...</p>
          <p>Använd formuläret 👇 för att lägga till något i listan</p>
        </div>
      )}
      <CreateWishlistItem
        wishlistId={wishlist.id}
        onCreated={(newItem) => setItems((state) => [...state, newItem])}
      />
    </>
  );
};
