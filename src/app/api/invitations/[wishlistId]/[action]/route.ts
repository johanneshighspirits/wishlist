import { handleInvitation } from '@/lib/wishlists';
import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'edge';

export async function POST(
  req: NextRequest,
  {
    params,
  }: {
    params: {
      wishlistId: string;
      action: 'accept' | 'decline';
    };
  }
) {
  const { action, wishlistId } = params;
  const result = await handleInvitation(wishlistId, action === 'accept');
  return NextResponse.json(result);
}
