import { NextRequest, NextResponse } from 'next/server';
import { addWishlistItem } from '@/lib/wishlists';
import { UserError } from '@/lib/result/error';
import { checkWishlistAccess } from '@/lib/wishlists/access';
import { getServerUserId } from '@/lib/auth';

export const POST = async (
  req: NextRequest,
  { params }: { params: { wishlistId: string } }
) => {
  try {
    const { wishlistId } = params;
    const userId = await getServerUserId();
    await checkWishlistAccess({ userId, wishlistId });
    const data = await req.json();
    const { title } = data;
    const wishlistItem = await addWishlistItem({ title }, wishlistId);
    return NextResponse.json(wishlistItem);
  } catch (error: any) {
    if (error instanceof UserError) {
      return NextResponse.json({
        error,
      });
    }
    return NextResponse.json({ error });
  }
};
