import { LoginRedirect } from '@/components/LoginRedirect';

export default function LoginPage({
  searchParams,
}: {
  searchParams: { returnUrl?: string };
}) {
  const { returnUrl = '/wishlists' } = searchParams;
  return (
    <section className="flex flex-col gap-4 font-body">
      <h1 className="font-headline text-2xl">Välkommen!</h1>
      <LoginRedirect
        loadingContent={<div>Laddar listor...</div>}
        url={returnUrl}
      />
    </section>
  );
}
