import { WishlistItem } from '@/lib/wishlists/types';
import { PropsWithChildren, Suspense, useState } from 'react';
import Image from 'next/image';
import { Button } from './common/Button';
import clsx from 'clsx';
import { DBAction } from '@/app/api/wishlists/[wishlistId]/items/[wishlistItemId]/[action]/route';
import { WizardHint } from './WizardHint';
import { getHint } from '@/lib/wizard/hints';

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
    <ul className="grid gap-4 p-4 lg:p-12">
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
        .map((item) => (
          <Item
            isReceiver={isReceiver}
            item={item}
            key={item.id}
            onClick={handleClick}
            processing={processing}
          />
        ))}
    </ul>
  );
};

type ItemProps = {
  item: WishlistItem;
  onClick: (id: string, action: DBAction) => () => void;
  processing?: DBAction;
};

const Item = ({
  item,
  isReceiver,
  onClick,
  processing,
}: ItemProps & { isReceiver?: boolean }) => {
  const { id, href, imageURL, title, description, isBoughtBy, isReservedBy } =
    item;

  const handleDelete = () => {
    const shouldDelete = confirm(
      'Vill du verkligen ta bort denna present från önskelistan?'
    );
    if (shouldDelete) {
      onClick(id, 'delete');
    }
  };
  return (
    <li
      className={clsx(
        'relative grid grid-cols-4 lg:grid-cols-[80px_repeat(3,1fr)] lg:items-center border p-4 rounded-md gap-4 lg:min-h-24',
        isBoughtBy ? 'opacity-80 border-white/30' : 'border-white',
        isReservedBy ? 'bg-white/5' : 'bg-white/20'
      )}
      key={id}>
      <WizardHint {...getHint('external-link')} isDisabled={!href}>
        <ExternalLinkWrapper
          href={href}
          className="flex flex-col h-full rounded-sm">
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
          {href && (
            <span className="text-center text-xs text-sky-200 underline">
              länk
            </span>
          )}
        </ExternalLinkWrapper>
      </WizardHint>

      <ExternalLinkWrapper
        href={href}
        className="flex flex-col col-span-3 lg:col-span-1 gap-1 items-start">
        <p className="font-headline text-lg">{title}</p>
        {description && <p>{description}</p>}
      </ExternalLinkWrapper>

      {isReceiver ? null : (
        <Actions
          item={item}
          processing={processing}
          onClick={onClick}></Actions>
      )}

      <button
        className="absolute top-0 right-0 py-1 px-3 z-10 hover:bg-red-900 rounded-lg"
        disabled={processing === 'delete'}
        onClick={handleDelete}>
        x
      </button>
    </li>
  );
};

const ExternalLinkWrapper = ({
  href,
  className,
  children,
}: PropsWithChildren<{ href?: string; className?: string }>) => {
  return href ? (
    <a
      className={clsx('cursor-pointer', className)}
      href={href}
      target="_blank"
      rel="noopener noreferrer">
      {children}
    </a>
  ) : (
    <span className={className}>{children}</span>
  );
};

const Actions = ({
  item: { id, isBoughtBy, isBoughtByMe, isReservedBy, isReservedByMe },
  onClick,
  processing,
}: ItemProps) => {
  return (
    <>
      {isBoughtBy ? (
        <span></span>
      ) : (
        <div className="flex flex-col gap-2 col-span-4 lg:col-span-1 lg:items-center">
          {isReservedBy ? (
            <>
              {isReservedByMe ? (
                <>
                  <span className="whitespace-pre p-2 rounded-sm m-auto">
                    ✨ Bokad (av mej) ✨
                  </span>
                  <WizardHint {...getHint('item-button-booked-by-user')}>
                    <Button
                      variant="secondary"
                      className="bg-white/10"
                      disabled={processing === 'unreserve'}
                      onClick={onClick(id, 'unreserve')}>
                      Avboka
                    </Button>
                  </WizardHint>
                </>
              ) : (
                <WizardHint {...getHint('item-button-booked-by-someone')}>
                  <span className="whitespace-pre p-2 rounded-sm m-auto">
                    ✨ Bokad ✨
                  </span>
                </WizardHint>
              )}
            </>
          ) : (
            <WizardHint {...getHint('item-button-book')}>
              <Button
                variant="secondary"
                className="bg-white/10"
                disabled={processing === 'reserve'}
                onClick={onClick(id, 'reserve')}>
                Boka
              </Button>
            </WizardHint>
          )}
        </div>
      )}
      <div className="flex flex-col gap-2 col-span-4 lg:col-span-1 lg:items-center">
        {isBoughtBy ? (
          <>
            {isBoughtByMe ? (
              <>
                <span className="whitespace-pre p-2 rounded-sm m-auto">
                  🎁 Köpt (av mej) 🎁
                </span>
                <WizardHint {...getHint('item-button-bought-by-me')}>
                  <Button
                    variant="secondary"
                    className="bg-white/10"
                    disabled={processing === 'unbuy'}
                    onClick={onClick(id, 'unbuy')}>
                    Ångra köpt
                  </Button>
                </WizardHint>
              </>
            ) : (
              <WizardHint {...getHint('item-button-bought-by-someone')}>
                <span className="whitespace-pre p-2 rounded-sm m-auto">
                  🎁 Köpt 🎁
                </span>
              </WizardHint>
            )}
          </>
        ) : isReservedBy && !isReservedByMe ? (
          <span>Reserverad</span>
        ) : (
          <WizardHint {...getHint('item-button-buy')}>
            <Button
              variant="secondary"
              className="bg-white/10"
              disabled={processing === 'buy'}
              onClick={onClick(id, 'buy')}>
              Markera som köpt
            </Button>
          </WizardHint>
        )}
      </div>
    </>
  );
};
