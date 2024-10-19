"use client";

import { Wishlist } from "@/lib/wishlists/types";
import { Button } from "./common/Button";
import { useState } from "react";
import { deleteWishlist } from "@/lib/wishlists";
import clsx from "clsx";

export const DeleteWishlist = ({ wishlist }: { wishlist: Wishlist }) => {
  const [showDangerZone, setShowDangerZone] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);
  const handleClick = async () => {
    setIsDisabled(true);
    const shouldDelete = window.confirm(
      `Vill du verkligen ta bort ${wishlist.title}?`,
    );
    if (shouldDelete) {
      await deleteWishlist(wishlist);
    }
    setIsDisabled(false);
  };
  return (
    <div
      className={clsx(
        "flex flex-col items-center gap-4 border w-full mt-4 p-4 rounded-lg",
        showDangerZone ? "border-red-500 bg-red-900/50" : "border-white",
      )}
    >
      <h2 className="text-lg font-headline">Danger zone</h2>
      {showDangerZone && (
        <>
          <Button
            variant="destructive"
            onClick={handleClick}
            disabled={isDisabled}
          >
            Radera {wishlist.title}
          </Button>
          <p>
            <b className="font-bold">OBS!</b> Detta går inte att ångra
          </p>
        </>
      )}
      <Button
        variant="tertiary"
        onClick={() => setShowDangerZone((state) => !state)}
      >
        {showDangerZone ? "Dölj" : "Visa"} alternativ för att radera önskelistan
      </Button>
    </div>
  );
};
