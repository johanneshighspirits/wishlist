export enum WishlistKey {
  /** redis hash */
  User = 'user',
  /** redis hash */
  Wishlist = 'wishlist',
  /** redis set */
  UserWishlists = 'user_wishlists',
  /** redis hash */
  WishlistItem = 'wishlist_item',
  /** redis set */
  WishlistItems = 'wishlist_items',
  /**
   * ## SET
   * member emails
   */
  WishlistMembers = 'wishlist_members',
  /**
   * ## SET
   * all emails user has ever invited
   */
  UserRecentMembers = 'user_recent_members',
  /** redis hash */
  ShortURL = 'shortURL',
  /** redis set */
  Invitations = 'invitations',
}
