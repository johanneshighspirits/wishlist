import { WishlistItem } from '@/lib/wishlists/types';
import { useState } from 'react';
import { Form } from './forms/Form';
import { Input } from './forms/Input';
import { FieldConfig } from './forms/types';
import { createWishlistItem } from '@/app/actions';
import { Validators } from './forms/Validators';
import { SubmitButton } from './forms/SubmitButton';

function toJson<T>(data: Response) {
  return data.json() as Promise<T>;
}

function apiFetch<T>(input: RequestInfo | URL, init?: RequestInit | undefined) {
  return fetch(input, init).then(toJson<T>);
}

const defaultButtonText = 'Lägg till i önskelistan (+)';

export const wishlistItemFields: FieldConfig<string>[] = [
  {
    name: 'title',
    type: 'text',
    placeholderText: 'Vad önskar du dig?',
    labelText: 'Titel',
    validators: [Validators.required()],
  },
  {
    name: 'description',
    type: 'text',
    placeholderText: 'Mer detaljer',
    labelText: 'Beskrivning',
    infoText: 'Berätta mer om det du önskar. Färg, modell, storlek osv...',
  },
  {
    name: 'href',
    type: 'url',
    placeholderText: 'Länk till en affär',
    labelText: 'Produktlänk',
    validators: [Validators.url()],
    onValueChange: (value, context) => {
      if (typeof value === 'string') {
        try {
          const url = new URL(value);
          return { value: `${url.origin}${url.pathname}` };
        } catch (err) {
          console.error(err);
        }
      }
      return { value };
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

  return (
    <div className="flex flex-col gap-4 p-4 border rounded-lg border-white">
      <Form
        fields={wishlistItemFields}
        action={async (data) => {
          setButtonText('Lägger till i önskelistan, vänta...');
          const addItemToWishlist = createWishlistItem.bind(null, wishlistId);
          const wishlistItem = await addItemToWishlist(data);
          setButtonText(defaultButtonText);
          onCreated(wishlistItem);
        }}>
        {wishlistItemFields.map((field) => {
          return <Input name={field.name} key={field.name} />;
        })}
        <SubmitButton>{buttonText}</SubmitButton>
      </Form>
    </div>
  );
};
