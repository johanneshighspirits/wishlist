'use client';

import { Wishlist } from '@/lib/wishlists/types';
import { Form, useForm } from './forms/Form';
import { SubmitButton } from './forms/SubmitButton';
import {
  Dispatch,
  PropsWithChildren,
  SetStateAction,
  Suspense,
  useState,
} from 'react';
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
          wishlistId={wishlist.id}
          fieldNames={fieldNames}
          setFieldNames={setFieldNames}></MoreEmailFields>
        {/* <RecentMembers wishlistId={wishlist.id}>

        </RecentMembers> */}
        {fieldNames.length > 0 ? (
          <SubmitButton>{buttonText}</SubmitButton>
        ) : null}
      </Form>
    </>
  );
};

const MoreEmailFields = ({
  wishlistId,
  fieldNames,
  setFieldNames,
}: {
  wishlistId: string;
  fieldNames: string[];
  setFieldNames: Dispatch<SetStateAction<string[]>>;
}) => {
  const { addField, updateField } = useForm();
  const [members, setMembers] = useState<string[]>([]);
  return (
    <>
      <Button
        variant="secondary"
        className="self-end my-4"
        onClick={(e) => {
          e.preventDefault();
          if (fieldNames.length === 0) {
            fetch(`/api/wishlists/${wishlistId}/members`, { method: 'POST' })
              .then((res) => res.json())
              .then(
                (result: { members: string[]; recentMembers: string[] }) => {
                  const { members, recentMembers } = result;
                  setMembers(members);
                  recentMembers.forEach((recentMember, i) => {
                    addField({
                      name: recentMember,
                      type: 'checkbox',
                      initialValue: recentMember,
                      labelText: recentMember,
                    });
                  });
                  setFieldNames((fieldNames) => [
                    ...fieldNames,
                    `member-${fieldNames.length}`,
                    ...recentMembers,
                  ]);
                  addField({
                    name: `member-${fieldNames.length}`,
                    type: 'email',
                    labelText: `Lägg till medlem ${
                      fieldNames.length > 1 ? fieldNames.length + 1 : ''
                    }`,
                    placeholderText: 'Epostadress att bjuda in',
                    validators: [
                      Validators.email(),
                      Validators.notInList({
                        list: members,
                        message: 'Användaren är redan inbjuden',
                      }),
                    ],
                  });
                }
              );
          }
        }}>
        {fieldNames.length > 0
          ? 'Lägg till ytterligare en epost'
          : 'Dela listan'}
      </Button>
      {members.length > 0 ? (
        <div className="flex flex-col gap-2 my-2">
          <div>
            <p className="italic text-gray-300">Redan inbjudna:</p>
            <p>{members.join(', ')}</p>
          </div>
        </div>
      ) : null}
    </>
  );
};
