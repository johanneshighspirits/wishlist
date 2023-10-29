import { NextRequest, NextResponse } from 'next/server';
import { addWishlistItem } from '@/lib/wishlists';
import { UserError } from '@/lib/result/error';

export const runtime = 'edge';

export const POST = async (
  req: NextRequest,
  { params }: { params: { wishlistId: string } }
) => {
  try {
    const { wishlistId } = params;
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
