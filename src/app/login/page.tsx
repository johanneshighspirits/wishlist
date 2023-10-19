import { LoginRedirect } from '@/components/LoginRedirect';

export default function LoginPage({
  searchParams,
}: {
  searchParams: { returnUrl?: string };
}) {
  const { returnUrl = '/wishlists' } = searchParams;
  return (
    <section className="flex flex-col gap-4 font-body">
      <LoginRedirect url={returnUrl} />
    </section>
  );
}
