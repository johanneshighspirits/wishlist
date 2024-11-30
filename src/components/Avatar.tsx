"use client";
import { useSession } from "next-auth/react";
import Image from "next/image";

export const Avatar = () => {
  const { data: session } = useSession();
  const user = session?.user;
  if (!user?.image) {
    return null;
  }
  return <AvatarImage name={user.name} imageUrl={user.image} />;
};

export const AvatarImage = ({
  name,
  imageUrl,
}: {
  name?: string | null;
  imageUrl: string;
}) => {
  return (
    <Image
      className="rounded-full h-8 w-8"
      alt={name || "Användarporträtt"}
      src={imageUrl}
      width="90"
      height="90"
    />
  );
};
