'use client';

import { useRouter } from 'next/navigation';
import { PropsWithChildren, useState } from 'react';
import { Form, useForm } from './forms/Form';
import { FieldConfig } from './forms/types';
import { createWishlist } from '@/app/actions';
import { Input } from './forms/Input';
import { Button } from './common/Button';
import { Validators } from './forms/Validators';
import { randomRadialGradient } from '@/utils/random';
import { FantasyBackground } from './FantasyBackground';

function toJson<T>(data: Response) {
  return data.json() as Promise<T>;
}

function apiFetch<T>(input: RequestInfo | URL, init?: RequestInit | undefined) {
  return fetch(input, init).then(toJson<T>);
}

const defaultButtonText = 'Skapa ny önskelista (+)';

const fields: FieldConfig[] = [
  {
    name: 'title',
    type: 'text',
    placeholderText: 'Namn på önskelistan',
    labelText: 'Titel',
    validators: [Validators.required()],
  },
  {
    name: 'receiverEmail',
    type: 'email',
    placeholderText: 'Mottagarens email',
    labelText: 'Önskare',
    infoText:
      'Skriv in epost till den som önskar, så göms vissa fält automatiskt. Vi vill ju inte avslöja något i förväg...',
    validators: [Validators.email()],
  },
];

const randomBg = () =>
  [
    randomRadialGradient(6),
    randomRadialGradient(4),
    randomRadialGradient(3),
  ].join(',');

export const CreateWishlist = () => {
  const [buttonText, setButtonText] = useState(defaultButtonText);
  const [bgImg, setImgBg] = useState(randomBg());
  const router = useRouter();
  const formAction = async (data: FormData) => {
    setButtonText('Skapar ny önskelista, vänta...');
    data.append('bgImg', bgImg);
    const wishlist = await createWishlist(data);
    setButtonText('Öppnar önskelistan...');
    setTimeout(() => {
      router.push(`/wishlists/${wishlist.shortURL}`);
    }, 1000);
  };

  const generateBackground = () => {
    setImgBg(randomBg());
  };

  return (
    <div className="flex flex-col gap-4 p-4 border rounded-lg border-white">
      <Form fields={fields} action={formAction}>
        {fields.map((field) => (
          <Input name={field.name} key={field.name} />
        ))}
        <FantasyBackground
          backgroundImage={bgImg}
          className="flex flex-col gap-4 items-center justify-center h-32 w-8/12 mx-auto my-8">
          <p>Slumpad bakgrundsfärg</p>
          <Button
            onClick={(e) => {
              e.preventDefault();
              generateBackground();
            }}>
            Generera ny
          </Button>
        </FantasyBackground>
        <SubmitButton>{buttonText}</SubmitButton>
      </Form>
    </div>
  );
};

const SubmitButton = ({ children }: PropsWithChildren) => {
  const { isValid, isProcessing } = useForm();
  return (
    <Button disabled={!isValid || isProcessing} type="submit">
      {children}
    </Button>
  );
};
