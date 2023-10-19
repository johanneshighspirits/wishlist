import { WishlistItem } from '@/lib/wishlists/types';
import { ChangeEventHandler, useState } from 'react';
import { Form } from './forms/Form';
import { Input } from './forms/Input';
import { FieldConfig } from './forms/types';
import { createWishlistItem } from '@/app/actions';
import { Button } from './common/Button';

function toJson<T>(data: Response) {
  return data.json() as Promise<T>;
}

function apiFetch<T>(input: RequestInfo | URL, init?: RequestInit | undefined) {
  return fetch(input, init).then(toJson<T>);
}

const defaultButtonText = 'Lägg till i önskelistan (+)';

const fields: FieldConfig[] = [
  {
    name: 'title',
    type: 'text',
    placeholderText: 'Vad önskar du dig?',
    labelText: 'Titel',
  },
  {
    name: 'href',
    type: 'url',
    placeholderText: 'Länk till en affär',
    labelText: 'Produktlänk',
    onValueChange: async (value, context) => {
      // if (value) {
      //   try {
      //     const url = new URL(value);
      //     fetch(url).then((res) => {
      //       debugger;
      //     });
      //   } catch (err) {
      //     console.error(err);
      //   }
      // }
    },
  },
  {
    name: 'imageURL',
    type: 'url',
    placeholderText: 'Lägg till en bildlänk',
    labelText: 'Bild',
  },
];

export const CreateWishlistItem = ({
  wishlistId,
  onCreated,
}: {
  wishlistId: string;
  onCreated: (item: WishlistItem) => void;
}) => {
  const [buttonText, setButtonText] = useState(defaultButtonText);
  const [isProcessing, setIsProcessing] = useState(false);

  return (
    <div className="flex flex-col gap-4 p-4 border rounded-lg border-white">
      <Form
        fields={fields}
        action={async (data) => {
          setIsProcessing(true);
          setButtonText('Lägger till i önskelistan, vänta...');
          // const wishlistItem = await apiFetch<WishlistItem>(
          //   `/api/wishlists/${wishlistId}/items/new`,
          //   {
          //     method: 'POST',
          //     body: JSON.stringify({
          //       title: title.trim(),
          //     }),
          //   }
          // );
          const addItemToWishlist = createWishlistItem.bind(null, wishlistId);
          const wishlistItem = await addItemToWishlist(data);
          setIsProcessing(false);
          setButtonText(defaultButtonText);
          onCreated(wishlistItem);
        }}>
        {fields.map((field) => {
          return <Input name={field.name} key={field.name} />;
        })}
        <Button type="submit" disabled={isProcessing}>
          {buttonText}
        </Button>
      </Form>
    </div>
  );
};
