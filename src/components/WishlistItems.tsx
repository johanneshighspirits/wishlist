import { WishlistItem } from '@/lib/wishlists/types';
import { useState } from 'react';
import Image from 'next/image';
import { Link } from './common/Link';
import { Button } from './common/Button';
import clsx from 'clsx';

type Action = 'reserve' | 'unreserve' | 'buy' | 'unbuy';

export const WishlistItems = ({
  wishlistId,
  items,
  onEdit,
}: {
  wishlistId: string;
  items: WishlistItem[];
  onEdit: (editedItems: WishlistItem[]) => void;
}) => {
  const [processing, setProcessing] = useState('');
  if (!items.length) {
    return null;
  }

  const handleClick = (id: string, action: Action) => async () => {
    setProcessing(action);
    onEdit(
      items.map((item) => {
        if (item.id === id) {
          return {
            ...item,
            ...(action === 'reserve'
              ? { isReservedBy: 'me', isReservedByMe: true }
              : {}),
            ...(action === 'unreserve'
              ? { isReservedBy: '', isReservedByMe: false }
              : {}),
            ...(action === 'buy'
              ? { isBoughtBy: 'me', isBoughtByMe: true }
              : {}),
            ...(action === 'unbuy'
              ? { isBoughtBy: '', isBoughtByMe: false }
              : {}),
          };
        }
        return item;
      })
    );
    const result = await fetch(
      `/api/wishlists/${wishlistId}/items/${id}/${action}`,
      {
        method: 'POST',
      }
    ).then((d) => d.json());
    onEdit(
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
    <ul className="grid gap-4 p-12">
      {[...items]
        .sort((a, b) => {
          const aIsReserved = Number(
            Boolean(a.isReservedBy || a.isReservedByMe)
          );
          const bIsReserved = Number(
            Boolean(b.isReservedBy || b.isReservedByMe)
          );
          const aIsBought = Number(Boolean(a.isBoughtBy || a.isBoughtByMe));
          const bIsBought = Number(Boolean(b.isBoughtBy || b.isBoughtByMe));
          return aIsBought + aIsReserved - (bIsBought + bIsReserved);
        })
        .map(
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
              <li
                className={clsx(
                  'grid grid-cols-[80px_repeat(3,1fr)] items-center border p-4 rounded-md gap-4 h-24',
                  isBoughtBy ? 'opacity-80 border-white/30' : 'border-white',
                  isReservedBy ? 'bg-white/5' : 'bg-white/20'
                )}
                key={id}>
                {imageURL && imageURL.startsWith('http') ? (
                  <Image
                    className="m-auto"
                    src={imageURL}
                    alt={title}
                    width={90}
                    height={90}
                  />
                ) : (
                  <span className="m-auto text-3xl">💝</span>
                )}

                <div className="flex flex-col gap-1 items-start">
                  <p className="font-headline text-lg">{title}</p>
                  {href ? <Link href={href}>Länk</Link> : <span></span>}
                </div>

                {isBoughtBy ? (
                  <span></span>
                ) : (
                  <div className="flex flex-col gap-2 items-center">
                    {isReservedBy ? (
                      <>
                        <span className="whitespace-pre">✨ Bokad ✨</span>
                        {isReservedByMe && (
                          <Button
                            variant="secondary"
                            disabled={processing === 'unreserve'}
                            onClick={handleClick(id, 'unreserve')}>
                            Avboka
                          </Button>
                        )}
                      </>
                    ) : (
                      <Button
                        variant="secondary"
                        disabled={processing === 'reserve'}
                        onClick={handleClick(id, 'reserve')}>
                        Boka
                      </Button>
                    )}
                  </div>
                )}
                <div className="flex flex-col gap-2 items-center">
                  {isBoughtBy ? (
                    <>
                      <span className="whitespace-pre">🎁 Köpt 🎁</span>
                      {isBoughtByMe && (
                        <Button
                          variant="secondary"
                          disabled={processing === 'unbuy'}
                          onClick={handleClick(id, 'unbuy')}>
                          Ångra köpt
                        </Button>
                      )}
                    </>
                  ) : (
                    <Button
                      variant="secondary"
                      disabled={processing === 'buy'}
                      onClick={handleClick(id, 'buy')}>
                      Markera som köpt
                    </Button>
                  )}
                </div>
              </li>
            );
          }
        )}
    </ul>
  );
};
