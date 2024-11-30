export enum WishlistKey {
  /** redis hash */
  User = "user",
  /** redis hash */
  Wishlist = "wishlist",
  /** redis set */
  UserWishlists = "user_wishlists",
  /** redis hash */
  WishlistItem = "wishlist_item",
  /** redis set */
  WishlistItems = "wishlist_items",
  /**
   * ## SET
   * member emails
   */
  WishlistMembers = "wishlist_members",
  /**
   * ## SET
   * all emails user has ever invited
   */
  UserRecentMembers = "user_recent_members",
  /** redis hash */
  ShortURL = "shortURL",
  Invitations = "invitations",
  PendingInvitations = "pending_invitations",
}

/**
 * A HASH with a user object
 */
export const getKeyUsers = (userId: string) => `${WishlistKey.User}:${userId}`;
/**
 * A SET with all users emails for this wishlist
 */
export const getKeyMembers = (wishlistId: string) =>
  `${WishlistKey.WishlistMembers}:${wishlistId}`;

/**
 * A single KEY/VALUE invitation
 */
export const getKeyInvitation = (email: string, wishlistId: string) =>
  `${WishlistKey.Invitations}:${email}:${wishlistId}`;
/**
 * A SET with all invitation keys for this user
 */
export const getKeyUserInvitations = (email: string) =>
  `${WishlistKey.Invitations}:${email}`;
/**
 * A SET with all pending invitations for a wishlist
 */
export const getKeyPendingWishlistInvitations = (wishlistId: string) =>
  `${WishlistKey.PendingInvitations}:${wishlistId}`;
