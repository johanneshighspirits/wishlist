import { NextRequest, NextResponse } from 'next/server';
import { editWishlistItem, deleteWishlistItem } from '@/lib/wishlists';
import { UserError } from '@/lib/result/error';
import { getServerUserId } from '@/lib/auth';
import { checkWishlistAccess } from '@/lib/wishlists/access';
import { revalidateTag } from 'next/cache';
import { WishlistKey } from '@/lib/wishlists/constants';

export type DBAction =
  | 'reserve'
  | 'unreserve'
  | 'buy'
  | 'unbuy'
  | 'delete'
  | 'edit';

export const POST = async (
  req: NextRequest,
  {
    params,
  }: {
    params: {
      wishlistId: string;
      wishlistItemId: string;
      action: DBAction;
    };
  }
) => {
  try {
    const userId = await getServerUserId();
    const { wishlistId, wishlistItemId, action } = params;
    await checkWishlistAccess({ userId, wishlistId });
    if (action === 'delete') {
      const result = await deleteWishlistItem({ wishlistId, wishlistItemId });
      if (result.success) {
        revalidateTag(WishlistKey.WishlistItem);
        revalidateTag(WishlistKey.WishlistItems);
        return NextResponse.json({ result });
      } else {
        return NextResponse.json({ error: result.message }, { status: 400 });
      }
    }
    const data = await req.json().catch(() => ({}));
    const wishlistItem = await editWishlistItem({
      ...data,
      ...(action === 'reserve' ? { isReservedBy: userId } : {}),
      ...(action === 'unreserve' ? { isReservedBy: null } : {}),
      ...(action === 'buy' ? { isBoughtBy: userId } : {}),
      ...(action === 'unbuy' ? { isBoughtBy: null } : {}),
      id: wishlistItemId,
    });
    if (!wishlistItem) {
      throw new Error('Could not update item');
    }
    return NextResponse.json({
      ...wishlistItem,
      isReservedByMe: userId === wishlistItem.isReservedBy,
      isBoughtByMe: userId === wishlistItem.isBoughtBy,
    });
  } catch (error: any) {
    console.error(error);
    if (error instanceof UserError) {
      return NextResponse.json(
        {
          error,
        },
        { status: error.statusCode }
      );
    }
    return NextResponse.json({ error }, { status: 500 });
  }
};
