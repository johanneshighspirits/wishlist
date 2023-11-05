import { getServerUserEmail } from '@/lib/auth';
import { cachedUserHasAccess } from '@/lib/wishlists';
import { put } from '@vercel/blob';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest): Promise<NextResponse> {
  const userEmail = await getServerUserEmail();
  const searchParams = request.nextUrl.searchParams;
  const filename = searchParams.get('filename');
  const wishlistId = searchParams.get('wishlistId') || '';
  const hasAccess = await cachedUserHasAccess(wishlistId, userEmail);

  if (!hasAccess) {
    throw new Error('Not authorized');
  }
  if (!filename || !wishlistId) {
    return NextResponse.json({
      error: 'Bad request',
      message: 'Missing filename or wishlistId',
    });
  }

  if (!request.body) {
    return NextResponse.json({ error: 'No file provided' });
  }

  const blob = await put(filename, request.body, {
    access: 'public',
  });

  return NextResponse.json(blob);
}
