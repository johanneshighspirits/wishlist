"use client";

import { UserDB } from "@/lib/auth/types";
import { WishlistDB, WishlistItem } from "@/lib/wishlists/types";
import Link from "next/link";
import { useState } from "react";
import { AvatarImage } from "../Avatar";
import { ApiAdminWishlistUserResponse } from "@/app/api/admin/wishlist/user/_schema";
import { ApiAdminWishlistItemsResponse } from "@/app/api/admin/wishlist/items/_schema";

export const WishlistAdminInfo = ({ wishlist }: { wishlist: WishlistDB }) => {
  const { id, title, shortURL, admin, bgImg, slug } = wishlist;

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
      <UserAdminInfo wishlistId={id} adminId={admin} />
      <WishlistItemsAdminInfo wishlistId={id} />
      <div className="flex gap-4 justify-end">
        <Link href={`/wishlists/${shortURL}`}>Open</Link>
      </div>
    </li>
  );
};

const UserAdminInfo = ({
  wishlistId,
  adminId,
}: {
  wishlistId: string;
  adminId: string;
}) => {
  const [user, setUser] = useState<UserDB | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const loadMoreInfo = async () => {
    const info: ApiAdminWishlistUserResponse = await fetch(
      `/api/admin/wishlist/user`,
      {
        method: "POST",
        body: JSON.stringify({
          id: wishlistId,
          admin: adminId,
        }),
      },
    ).then((res) => res.json());
    setUser(info.user);
  };

  if (!user) {
    return (
      <button
        disabled={isLoading}
        onClick={() => {
          setIsLoading(true);
          loadMoreInfo().finally(() => setIsLoading(false));
        }}
      >
        Get user info
      </button>
    );
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

const WishlistItemsAdminInfo = ({ wishlistId }: { wishlistId: string }) => {
  const [items, setItems] = useState<WishlistItem[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const loadMoreInfo = async () => {
    const info: ApiAdminWishlistItemsResponse = await fetch(
      `/api/admin/wishlist/items`,
      {
        method: "POST",
        body: JSON.stringify({
          wishlistId,
        }),
      },
    ).then((res) => res.json());
    setItems(info.items);
  };

  if (!items) {
    return (
      <button
        disabled={isLoading}
        onClick={() => {
          setIsLoading(true);
          loadMoreInfo().finally(() => setIsLoading(false));
        }}
      >
        Get wishlist items info
      </button>
    );
  }

  return (
    <div className="flex gap-4 items-center rounded-md bg-gray-900 p-4">
      <pre className="overflow-x-auto">{JSON.stringify(items, null, 2)}</pre>
    </div>
  );
};
