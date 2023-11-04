import { authOptions } from '@/lib/auth/authOptions';
import { getServerSession } from 'next-auth/next';
import { redirect } from 'next/navigation';

export const getServerUserId = async () => {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;
  if (!userId) {
    return redirect('/login');
  }
  return userId;
};

export const getServerUserEmail = async () => {
  const session = await getServerSession(authOptions);
  const userEmail = session?.user?.email ?? '';
  return userEmail;
};

export const getServerUser = async () => {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return redirect('/login');
  }
  return { email: session?.user?.email ?? '', id: session?.user?.id ?? '' };
};
