"use client";

import { ApiAdminWishlistResponse } from "@/app/api/admin/wishlist/_schema";
import { UserDB } from "@/lib/auth/types";
import { WishlistDB } from "@/lib/wishlists/types";
import Link from "next/link";
import { useState } from "react";
import { AvatarImage } from "../Avatar";

export const WishlistAdminInfo = ({ wishlist }: { wishlist: WishlistDB }) => {
  const { id, title, shortURL, admin, bgImg, slug } = wishlist;
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState<UserDB | undefined>();

  const loadMoreInfo = async () => {
    const info: ApiAdminWishlistResponse = await fetch(`/api/admin/wishlist`, {
      method: "POST",
      body: JSON.stringify({
        id,
        admin,
      }),
    }).then((res) => res.json());
    console.log({ info });
    setUser(info.user);
  };
  return (
    <li
      key={id}
      className="flex flex-col gap-4 p-4 rounded-md border border-white"
      style={{ backgroundImage: bgImg }}
    >
      <h3 className="font-headline">{title}</h3>
      <div className="grid grid-cols-2">
        <b>Admin</b>
        <span>{admin}</span>
        <b>id</b>
        <span>{id}</span>
        <b>slug</b>
        <span>{slug}</span>
        <b>shortURL</b>
        <span>{shortURL}</span>
      </div>
      <User user={user} />
      <div className="flex gap-4 justify-end">
        <Link href={`/wishlists/${shortURL}`}>Open</Link>
        {!user && (
          <button
            disabled={isLoading}
            onClick={() => {
              setIsLoading(true);
              loadMoreInfo().finally(() => setIsLoading(false));
            }}
          >
            Get user info
          </button>
        )}
      </div>
    </li>
  );
};

const User = ({ user }: { user?: UserDB }) => {
  if (!user) {
    return null;
  }
  return (
    <div className="flex gap-4 items-center rounded-md bg-gray-900 p-4">
      <AvatarImage name={user.name} imageUrl={user.image} />
      <div className="flex flex-col gap-1">
        <p className="font-bold">{user.name}</p>
        <a className="underline" href={`mailto:${user.email}`}>
          {user.email}
        </a>
      </div>
    </div>
  );
};
