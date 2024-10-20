"use server";

import { getServerUserId, getServerUserEmail } from "@/lib/auth";
import {
  addWishlistItem,
  addWishlist,
  inviteEmailsToWishlist,
} from "@/lib/wishlists";
import validator from "validator";

export async function createWishlist(formData: FormData) {
  const userId = await getServerUserId();
  const userEmail = await getServerUserEmail();
  const title = validator.escape(
    (formData.get("title") as string) || "[Namnlös önskelista]",
  );
  const isMine = (formData.get("isMine") as string) || "off";
  const receiverEmail = (formData.get("receiverEmail") as string) || "";
  const safeReceiverEmail = validator.isEmail(receiverEmail)
    ? receiverEmail
    : "";
  const bgImg = validator.escape((formData.get("bgImg") as string) || "");
  return addWishlist(
    {
      title,
      receiverEmail: isMine === "on" ? userEmail : safeReceiverEmail,
      bgImg,
    },
    userId,
  );
}

export async function createWishlistItem(
  wishlistId: string,
  formData: FormData,
) {
  const title = validator.escape(
    (formData.get("title") as string) || "[Ingen titel]",
  );
  const description = validator.escape(
    (formData.get("description") as string) || "",
  );
  const href = (formData.get("href") as string) || "";
  const safeHref = validator.isURL(href) ? href : "";
  const imageURL = (formData.get("imageURL") as string) || "";
  const safeImageURL = validator.isURL(imageURL) ? imageURL : "";
  return addWishlistItem(
    { title, description, href: safeHref, imageURL: safeImageURL },
    wishlistId,
  );
}

export async function inviteMembersToWishlist(
  wishlistId: string,
  wishlistTitle: string,
  shortURL: string,
  bgImg: string,
  formData: FormData,
) {
  const keys = ((formData.get("keys") as string) || "").split(" ");
  const emails = keys
    .map((key) => (formData.get(key) as string) || "")
    .map((email) => email.trim())
    .filter((email) => validator.isEmail(email));
  return inviteEmailsToWishlist(
    emails,
    wishlistId,
    validator.escape(wishlistTitle),
    shortURL,
    bgImg,
  );
}
