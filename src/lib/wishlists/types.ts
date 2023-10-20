export type Wishlist = {
  id: string;
  title: string;
  receiverEmail?: string;
  isAdmin?: boolean;
  isReceiver?: boolean;
  slug: string;
  shortURL: string;
  bgImg?: string;
  items: WishlistItem[];
};

export type WishlistItem = {
  id: string;
  title: string;
  href?: string;
  imageURL?: string;
  isReservedBy?: string;
  isReservedByMe?: boolean;
  isBoughtBy?: string;
  isBoughtByMe?: boolean;
};
