import { InvitationsEditor } from '@/components/InvitationsEditor';
import { Suspense } from 'react';

export default async function InvitationsPage() {
  return (
    <section className="flex flex-col gap-8 mt-16">
      <Suspense fallback={<div>Laddar inbjudningar...</div>}>
        <InvitationsEditor showMessageIfEmpty />
      </Suspense>
    </section>
  );
}
