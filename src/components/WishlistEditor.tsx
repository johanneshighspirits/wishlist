'use client';

import { Wishlist, WishlistItem } from '@/lib/wishlists/types';
import { CreateWishlistItem } from './CreateWishlistItem';
import { useState } from 'react';
import Image from 'next/image';
import { Link } from './common/Link';

export const WishlistEditor = ({ wishlist }: { wishlist: Wishlist }) => {
  const [items, setItems] = useState<WishlistItem[]>(wishlist?.items || []);
  const [processing, setProcessing] = useState('');
  if (!wishlist) {
    return null;
  }
  const { title } = wishlist;

  const reserveItem = async ({
    id,
    shouldReserve,
  }: {
    id: string;
    shouldReserve: boolean;
  }) => {
    setProcessing('reserve');
    const result = await fetch(
      `/api/wishlists/${wishlist.id}/items/${id}/${
        shouldReserve ? 'reserve' : 'unreserve'
      }`,
      {
        method: 'POST',
      }
    ).then((d) => d.json());
    setItems((items) =>
      items.map((item) => {
        if (item.id === result.id) {
          return {
            ...item,
            ...result,
          };
        }
        return item;
      })
    );
    setProcessing('');
  };
  const buyItem = async ({
    id,
    shouldBuy,
  }: {
    id: string;
    shouldBuy: boolean;
  }) => {
    setProcessing('buy');
    const result = await fetch(
      `/api/wishlists/${wishlist.id}/items/${id}/${
        shouldBuy ? 'buy' : 'unbuy'
      }`,
      {
        method: 'POST',
      }
    ).then((d) => d.json());
    setItems((items) =>
      items.map((item) => {
        if (item.id === result.id) {
          return {
            ...item,
            ...result,
          };
        }
        return item;
      })
    );
    setProcessing('');
  };
  return (
    <>
      <h2>{title}</h2>
      {items.map(
        ({
          id,
          href,
          imageURL,
          title,
          isBoughtBy,
          isBoughtByMe,
          isReservedBy,
          isReservedByMe,
        }) => {
          return (
            <li className="grid grid-cols-5" key={id}>
              <p>{title}</p>
              {href ? <Link href={href}>Länk</Link> : <span></span>}
              {imageURL && imageURL.startsWith('http') ? (
                <Image src={imageURL} alt={title} width={90} height={90} />
              ) : (
                <span></span>
              )}
              <div>
                {isReservedBy ? (
                  <>
                    <span className="whitespace-pre">✨ Bokad ✨</span>
                    {isReservedByMe && (
                      <button
                        disabled={processing === 'reserve'}
                        onClick={async () => {
                          await reserveItem({ id, shouldReserve: false });
                        }}>
                        Klicka för att avboka
                      </button>
                    )}
                  </>
                ) : (
                  <button
                    disabled={processing === 'reserve'}
                    onClick={async () => {
                      await reserveItem({ id, shouldReserve: true });
                    }}>
                    Boka
                  </button>
                )}
              </div>
              <div>
                {isBoughtBy ? (
                  <>
                    <span className="whitespace-pre">🎁 Köpt 🎁</span>
                    {isBoughtByMe && (
                      <button
                        disabled={processing === 'buy'}
                        onClick={async () => {
                          await buyItem({ id, shouldBuy: false });
                        }}>
                        Ångra köpt
                      </button>
                    )}
                  </>
                ) : (
                  <button
                    disabled={processing === 'buy'}
                    onClick={async () => {
                      await buyItem({ id, shouldBuy: true });
                    }}>
                    Markera som köpt
                  </button>
                )}
              </div>
            </li>
          );
        }
      )}
      <CreateWishlistItem
        wishlistId={wishlist.id}
        onCreated={(newItem) => setItems((state) => [...state, newItem])}
      />
    </>
  );
};
