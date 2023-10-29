import { NextRequest, NextResponse } from 'next/server';
import { UserError } from '@/lib/result/error';
import { kv } from '@vercel/kv';
import { WishlistKey } from '@/lib/wishlists/constants';

export const runtime = 'edge';

export const POST = async (
  req: NextRequest,
  { params }: { params: { wishlistId: string } }
) => {
  try {
    const { wishlistId } = params;
    const members = await kv.smembers(
      `${WishlistKey.WishlistMembers}:${wishlistId}`
    );
    return NextResponse.json(members);
  } catch (error: any) {
    if (error instanceof UserError) {
      return NextResponse.json({
        error,
      });
    }
    return NextResponse.json({ error });
  }
};
