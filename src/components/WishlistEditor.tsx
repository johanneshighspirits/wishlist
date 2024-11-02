'use client';

import { Wishlist, WishlistItem } from '@/lib/wishlists/types';
import { CreateWishlistItem } from './CreateWishlistItem';
import { Dispatch, PropsWithChildren, SetStateAction, useState } from 'react';
import { WishlistItems } from './WishlistItems';
import { FantasyBackground } from './FantasyBackground';
import { MAX_ITEMS } from '@/utils/settings';

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
      <ItemsForm items={items}>
        <CreateWishlistItem
          wishlistId={wishlist.id}
          onCreated={(newItem) => setItems((state) => [...state, newItem])}
        />
      </ItemsForm>
    </>
  );
};

const ItemsForm = ({
  items,
  children,
}: PropsWithChildren<{ items: WishlistItem[] }>) => {
  if (items.length > MAX_ITEMS) {
    return (
      <div className="flex flex-col gap-4">
        <p>
          Oj, vad många saker du önskar dig... {MAX_ITEMS} {items.length}
        </p>
        <p>
          Ta bort något ur listan innan du kan önska mer - eller skaffa
          premiumkonto 💸
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-col gap-4">
        {items.length === 0 ? (
          <>
            <p>Oj, här var det tomt...</p>
            <p>Använd formuläret 👇 för att lägga till något i listan</p>
          </>
        ) : (
          <p>Använd formuläret 👇 för att lägga till fler saker</p>
        )}
      </div>
      {children}
    </>
  );
};
