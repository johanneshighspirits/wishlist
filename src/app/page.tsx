import { Link } from '@/components/common/Link';

export default function Home() {
  return (
    <section className="flex flex-col gap-4">
      <h2 className="font-headline text-2xl">Önskelistan</h2>
      <Link href="/wishlists">Till önskelistorna</Link>
    </section>
  );
}
