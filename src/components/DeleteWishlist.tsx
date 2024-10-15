'use client';

import { Wishlist } from '@/lib/wishlists/types';
import { Button } from './common/Button';
import { useState } from 'react';
import { deleteWishlist } from '@/lib/wishlists';

export const DeleteWishlist = ({ wishlist }: { wishlist: Wishlist }) => {
  const [isDisabled, setIsDisabled] = useState(false);
  const handleClick = async () => {
    setIsDisabled(true);
    const shouldDelete = window.confirm(
      `Vill du verkligen ta bort ${wishlist.title}?`
    );
    if (shouldDelete) {
      await deleteWishlist(wishlist);
    }
    setIsDisabled(false);
  };
  return (
    <div className="flex flex-col items-center gap-2 border border-red-500 bg-red-900/50 w-full p-4 rounded-lg">
      <h2 className="text-lg">Danger zone</h2>
      <Button variant="destructive" onClick={handleClick} disabled={isDisabled}>
        Delete {wishlist.title}
      </Button>
    </div>
  );
};
