'use client';

import { Wishlist } from '@/lib/wishlists/types';
import { Form, useForm } from './forms/Form';
import { SubmitButton } from './forms/SubmitButton';
import { Dispatch, SetStateAction, useState } from 'react';
import { FieldConfig } from './forms/types';
import { Validators } from './forms/Validators';
import { Input } from './forms/Input';
import { Button } from './common/Button';
import { addMembersToWishlist } from '@/app/actions';

const fields: FieldConfig<string>[] = [
  // {
  //   name: 'member-0',
  //   type: 'email',
  //   labelText: 'Medlem 1',
  //   placeholderText: 'Epostadress',
  //   validators: [Validators.email()],
  // },
];

export const MembersEditor = ({ wishlist }: { wishlist: Wishlist }) => {
  const [fieldNames, setFieldNames] = useState<string[]>([]);
  const [buttonText, setButtonText] = useState('Bjud in användare');
  const formAction = async (data: FormData) => {
    if (fieldNames.length <= 0) {
      return;
    }
    setButtonText('Bjuder in medlemmar, vänta...');
    data.append('keys', fieldNames.join(' '));
    const enhancedAddMembers = addMembersToWishlist.bind(
      null,
      wishlist.id,
      wishlist.title,
      wishlist.shortURL
    );
    const addedMembers = await enhancedAddMembers(data);
    console.log(`Added ${addedMembers.join(', ')}`);
    setButtonText('Medlemmar tillagda');
    alert(`Inbjudna medlemmar: ${addedMembers.join(', ')}`);
    setFieldNames([]);
    setButtonText('Bjud in användare');
  };

  return (
    <>
      <p>Dela listan med andra genom att klicka på knappen ↘</p>
      <Form fields={fields} action={formAction}>
        {fieldNames.map((fieldName) => {
          return <Input name={fieldName} key={fieldName} />;
        })}
        <MoreEmailFields
          fieldNames={fieldNames}
          setFieldNames={setFieldNames}
        />
        {fieldNames.length > 0 ? (
          <SubmitButton>{buttonText}</SubmitButton>
        ) : null}
      </Form>
    </>
  );
};

const MoreEmailFields = ({
  fieldNames,
  setFieldNames,
}: {
  fieldNames: string[];
  setFieldNames: Dispatch<SetStateAction<string[]>>;
}) => {
  const { addField } = useForm();
  return (
    <Button
      variant="secondary"
      className="self-end"
      onClick={(e) => {
        e.preventDefault();
        addField({
          name: `member-${fieldNames.length}`,
          type: 'email',
          labelText: `Lägg till medlem ${
            fieldNames.length > 1 ? fieldNames.length + 1 : ''
          }`,
          placeholderText: 'Epostadress att bjuda in',
          validators: [Validators.email()],
        });
        setFieldNames((fieldNames) => [
          ...fieldNames,
          `member-${fieldNames.length}`,
        ]);
      }}>
      {fieldNames.length > 0 ? 'Lägg till ytterligare en epost' : 'Dela listan'}
    </Button>
  );
};
