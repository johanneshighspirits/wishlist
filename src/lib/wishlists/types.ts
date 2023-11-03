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
  timestamp: number;
  description?: string;
  href?: string;
  imageURL?: string;
  isReservedBy?: string;
  isReservedByMe?: boolean;
  isBoughtBy?: string;
  isBoughtByMe?: boolean;
};

export type Invitation = {
  email: string;
  invitedBy: string;
  wishlistId: string;
  shortURL: string;
  wishlistTitle: string;
  isAccepted: boolean;
  isDeclined: boolean;
};
