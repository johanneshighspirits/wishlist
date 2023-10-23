import { LoginRedirect } from '@/components/LoginRedirect';

export default function Home() {
  return (
    <section className="flex flex-col gap-4">
      <h2 className="font-headline text-2xl">Önskelistan</h2>
      <LoginRedirect
        loadingContent={
          <div className="text-gray-400">Försöker logga in, vänta lite...</div>
        }></LoginRedirect>
    </section>
  );
}
