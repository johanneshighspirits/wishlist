import { WishlistItem } from '@/lib/wishlists/types';
import { PropsWithChildren, Suspense, useState } from 'react';
import Image from 'next/image';
import { Button } from './common/Button';
import clsx from 'clsx';
import { DBAction } from '@/app/api/wishlists/[wishlistId]/items/[wishlistItemId]/[action]/route';
import { WizardHint } from './WizardHint';
import { getHint } from '@/lib/wizard/hints';
import { Form } from './forms/Form';
import { wishlistItemFields } from './CreateWishlistItem';
import { Input } from './forms/Input';
import { SubmitButton } from './forms/SubmitButton';
import { editWishlistItem } from '@/lib/wishlists';

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

  const handleEdited = (id: string, editedItem: WishlistItem) => {
    onEdit(
      items.map((item) => {
        if (item.id === id) {
          return {
            ...item,
            ...editedItem,
          };
        }
        return item;
      })
    );
  };

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

  const sortedItems = [...items]
    .sort((a, b) => (a.timestamp > b.timestamp ? 1 : -1))
    .reduce<WishlistItem[][]>(
      (result, item) => {
        const [available, reserved, bought] = result;
        if (item.isReservedBy) {
          reserved.push(item);
        } else if (item.isBoughtBy) {
          bought.push(item);
        } else {
          available.push(item);
        }
        return result;
      },
      [[], [], []]
    );

  return (
    <ul className="grid gap-4 p-4 lg:p-12">
      {sortedItems.flat().map((item) => (
        <Item
          isReceiver={isReceiver}
          wishlistId={wishlistId}
          item={item}
          key={item.id}
          onClick={handleClick}
          onEdited={handleEdited}
          processing={processing}
        />
      ))}
    </ul>
  );
};

type ItemProps = {
  item: WishlistItem;
  wishlistId?: string;
  onClick: (id: string, action: DBAction) => () => void;
  onEdited?: (id: string, item: WishlistItem) => void;
  processing?: DBAction;
};

const Item = ({
  item,
  isReceiver,
  onClick,
  onEdited,
  processing,
}: ItemProps & { isReceiver?: boolean }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [buttonText, setButtonText] = useState('Spara ändringar');
  const { id, href, imageURL, title, description, isBoughtBy, isReservedBy } =
    item;

  const handleDelete = () => {
    const shouldDelete = confirm(
      'Vill du verkligen ta bort denna present från önskelistan?'
    );
    if (shouldDelete) {
      onClick(id, 'delete')();
    }
  };
  return (
    <li
      className={clsx(
        'relative grid grid-cols-4 lg:grid-cols-[80px_repeat(3,1fr)] lg:items-center border px-4 py-6 rounded-md gap-4 lg:min-h-24',
        isBoughtBy ? 'opacity-70 border-white/30' : 'border-white',
        isReservedBy || isBoughtBy ? 'bg-white/5' : 'bg-white/20'
      )}
      key={id}>
      {isEditing ? (
        <div className="col-span-4">
          <h3 className="font-headline text-2xl">Redigera önskan</h3>
          <Form
            className="border-4 border-dotted border-orange-300 p-4 rounded-xl"
            action={async (data) => {
              setButtonText('Sparar ändringar, vänta...');
              const editedItem: Partial<WishlistItem> = {};
              wishlistItemFields.forEach((field) => {
                const value = data.get(field.name);
                if (value !== null) {
                  (editedItem as any)[field.name] = value;
                }
              });
              const result = await editWishlistItem({
                ...editedItem,
                id,
              });
              setButtonText('Spara ändringar');
              setIsEditing(false);
              onEdited?.(id, result);
            }}
            fields={wishlistItemFields.map((field) => {
              return {
                ...field,
                initialValue: (item as any)[field.name] || '',
              };
            })}>
            {wishlistItemFields.map((field) => {
              return <Input name={field.name} key={field.name} />;
            })}
            <div className="flex gap-4 justify-center items-center">
              <Button
                variant="secondary"
                onClick={(e) => {
                  e.preventDefault();
                  setIsEditing(false);
                }}>
                Avbryt
              </Button>
              <SubmitButton>{buttonText}</SubmitButton>
            </div>
          </Form>
        </div>
      ) : (
        <>
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

          <div className="absolute flex top-1 right-1 z-10">
            <button
              className="py-1 px-3 hover:bg-orange-500 rounded-lg"
              disabled={processing === 'edit'}
              onClick={() => setIsEditing(true)}>
              ✎
            </button>
            <button
              className="py-1 px-3 hover:bg-red-900 rounded-lg"
              disabled={processing === 'delete'}
              onClick={handleDelete}>
              x
            </button>
          </div>
        </>
      )}
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
        ) : isReservedByMe || !isReservedBy ? (
          <WizardHint {...getHint('item-button-buy')}>
            <Button
              variant="secondary"
              className="bg-white/10"
              disabled={processing === 'buy'}
              onClick={onClick(id, 'buy')}>
              Markera som köpt
            </Button>
          </WizardHint>
        ) : null}
      </div>
    </>
  );
};
