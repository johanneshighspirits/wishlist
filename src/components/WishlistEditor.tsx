'use client';

import { Wishlist, WishlistItem } from '@/lib/wishlists/types';
import { CreateWishlistItem } from './CreateWishlistItem';
import { Dispatch, PropsWithChildren, SetStateAction, useState } from 'react';
import { WishlistItems } from './WishlistItems';
import { FantasyBackground } from './FantasyBackground';
import { MAX_ITEMS } from '@/utils/settings';
import { useDialog } from './providers/DialogProvider';
import { printItemsToConsole } from '@/utils/print';

export const WishlistEditor = ({ wishlist }: { wishlist: Wishlist }) => {
  const [items, setItems] = useState<WishlistItem[]>(wishlist?.items || []);
  const { openDialog } = useDialog();
  if (!wishlist) {
    return null;
  }
  printItemsToConsole(wishlist.title, items);

  return (
    <>
      <FantasyBackground backgroundImage={wishlist.bgImg}>
        <WishlistItems
          wishlistId={wishlist.id}
          isReceiver={wishlist.isReceiver}
          items={items}
          onEdit={(editedItem, editedItems) => {
            const itemBefore = items.find((item) => item.id === editedItem?.id);
            const hasChanged = isWishlistItemEqual(editedItem, itemBefore);
            setItems(editedItems);
            if (hasChanged) {
              openDialog({
                title: 'Önskelistan uppdaterad',
                body: <p>{editedItem?.title} updaterad</p>,
              });
            }
          }}
        />
      </FantasyBackground>
      <ItemsForm items={items}>
        <CreateWishlistItem
          wishlistId={wishlist.id}
          onCreated={(newItem) => {
            setItems((state) => [...state, newItem]);
            openDialog({
              title: 'Önskelistan uppdaterad',
              body: <p>{newItem.title} tillagd</p>,
            });
          }}
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
        <p>Oj, vad många saker du önskar dig...</p>
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

type ItemKeys = keyof WishlistItem;
const ItemKeysToCheck: ItemKeys[] = [
  'title',
  'description',
  'href',
  'imageURL',
];

const isWishlistItemEqual = (a?: WishlistItem, b?: WishlistItem) => {
  if (a === b) {
    return false;
  }
  if (a === undefined || b === undefined) {
    return false;
  }

  for (const key of ItemKeysToCheck) {
    if (a[key] !== b[key]) {
      return true;
    }
  }
  return false;
};
