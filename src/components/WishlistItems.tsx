import { WishlistItem } from '@/lib/wishlists/types';
import { useState } from 'react';
import Image from 'next/image';
import { Link } from './common/Link';
import { Button } from './common/Button';
import clsx from 'clsx';
import { DBAction } from '@/app/api/wishlists/[wishlistId]/items/[wishlistItemId]/[action]/route';

export const WishlistItems = ({
  wishlistId,
  isReceiver,
  items,
  onEdit,
}: {
  wishlistId: string;
  isReceiver?: boolean;
  items: WishlistItem[];
  onEdit: (editedItems: WishlistItem[]) => void;
}) => {
  const [processing, setProcessing] = useState<DBAction>();

  if (!items.length) {
    return null;
  }

  const handleClick = (id: string, action: DBAction) => async () => {
    setProcessing(action);
    if (action === 'delete') {
      onEdit(items.filter((item) => item.id !== id));
    } else {
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
    }
    const result = await fetch(
      `/api/wishlists/${wishlistId}/items/${id}/${action}`,
      {
        method: 'POST',
      }
    ).then((d) => d.json());
    if (action !== 'delete') {
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
    }
    setProcessing(undefined);
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
        .map((item) => {
          const { id, href, imageURL, title, isBoughtBy, isReservedBy } = item;
          return (
            <li
              className={clsx(
                'relative grid grid-cols-[80px_repeat(3,1fr)] items-center border p-4 rounded-md gap-4 h-24',
                isBoughtBy ? 'opacity-80 border-white/30' : 'border-white',
                isReservedBy ? 'bg-white/5' : 'bg-white/20'
              )}
              key={id}>
              {imageURL && imageURL.startsWith('https') ? (
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
              {isReceiver ? null : (
                <Actions
                  item={item}
                  processing={processing}
                  onClick={handleClick}></Actions>
              )}

              <button
                className="absolute top-0 right-0 py-1 px-3 z-10 hover:bg-red-900 rounded-lg"
                disabled={processing === 'delete'}
                onClick={handleClick(id, 'delete')}>
                x
              </button>
            </li>
          );
        })}
    </ul>
  );
};

const Actions = ({
  item: { id, isBoughtBy, isBoughtByMe, isReservedBy, isReservedByMe },
  onClick,
  processing,
}: {
  item: WishlistItem;
  onClick: (id: string, action: DBAction) => () => void;
  processing?: DBAction;
}) => {
  return (
    <>
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
                  onClick={onClick(id, 'unreserve')}>
                  Avboka
                </Button>
              )}
            </>
          ) : (
            <Button
              variant="secondary"
              disabled={processing === 'reserve'}
              onClick={onClick(id, 'reserve')}>
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
                onClick={onClick(id, 'unbuy')}>
                Ångra köpt
              </Button>
            )}
          </>
        ) : isReservedBy && !isReservedByMe ? (
          <span>Reserverad</span>
        ) : (
          <Button
            variant="secondary"
            disabled={processing === 'buy'}
            onClick={onClick(id, 'buy')}>
            Markera som köpt
          </Button>
        )}
      </div>
    </>
  );
};
