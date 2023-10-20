import { NextRequest, NextResponse } from 'next/server';
import { editWishlistItem, deleteWishlistItem } from '@/lib/wishlists';
import { UserError } from '@/lib/result/error';
import { getServerUserId } from '@/lib/auth';

export type DBAction = 'reserve' | 'unreserve' | 'buy' | 'unbuy' | 'delete';

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
    if (action === 'delete') {
      const result = await deleteWishlistItem({ wishlistId, wishlistItemId });
      return NextResponse.json({ result });
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
      return NextResponse.json({
        error,
      });
    }
    return NextResponse.json({ error });
  }
};
