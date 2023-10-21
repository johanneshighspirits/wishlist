'use client';

import { Invitation } from '@/lib/wishlists/types';
import { Button } from './common/Button';
import { useRouter } from 'next/navigation';

export const InvitationItem = ({ invitation }: { invitation: Invitation }) => {
  const router = useRouter();
  const handleClick = (accept: boolean) => async () => {
    const result: Invitation = await fetch(
      `/api/invitations/${invitation.wishlistId}/${
        accept ? 'accept' : 'decline'
      }`,
      { method: 'POST' }
    ).then((res) => res.json());
    router.push(`/wishlists/${result.shortURL}`);
  };

  return (
    <li
      className="flex flex-col gap-8 border p-8 rounded-lg"
      key={invitation.wishlistId}>
      <h4 className="font-headline text-2xl">
        Inbjudan till {invitation.wishlistTitle}
      </h4>
      <p>
        {invitation.invitedBy} har bjudit in dig att följa{' '}
        <b className="italic">{invitation.wishlistTitle}</b>
      </p>
      <div className="flex gap-4 justify-center">
        <Button variant="secondary" onClick={handleClick(false)}>
          Avböj
        </Button>
        <Button onClick={handleClick(true)}>Acceptera inbjudan</Button>
      </div>
    </li>
  );
};
