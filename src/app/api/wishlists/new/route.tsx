import { NextRequest, NextResponse } from 'next/server';
import { addWishlist } from '@/lib/wishlists';
import { getServerUserId } from '@/lib/auth';
import { UserError } from '@/lib/result/error';

export const runtime = 'edge';

export const POST = async (req: NextRequest, res: NextResponse) => {
  try {
    const userId = await getServerUserId();
    const data = await req.json();
    const { title } = data;
    const wishlist = await addWishlist({ title }, userId);
    return NextResponse.json(wishlist);
  } catch (error: any) {
    if (error instanceof UserError) {
      return NextResponse.json({
        error,
      });
    }
    return NextResponse.json({ error });
  }
};
