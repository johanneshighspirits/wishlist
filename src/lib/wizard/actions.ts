'use server';

import { cookies } from 'next/headers';

export const storeReadHints = async (hints: string[]) => {
  try {
    const cookieValue = JSON.stringify(hints);
    cookies().set('hints', cookieValue);
  } catch {}
};
