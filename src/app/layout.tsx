import { Footer } from '@/components/Footer';
import { Header } from '@/components/Header';
import { Protected } from '@/components/Protected';
import './globals.css';
import type { Metadata } from 'next';
import { Inter, Glegoo } from 'next/font/google';
import clsx from 'clsx';
import { WizardProvider } from '@/components/WizardProvider';

const inter = Inter({ subsets: ['latin'], variable: '--font-body' });
const glegoo = Glegoo({
  weight: ['400', '700'],
  subsets: ['latin'],
  variable: '--font-headline',
});

export const metadata: Metadata = {
  title: '💝 Önskelistan 💝',
  description: 'Dela önskelistor med släkt och vänner',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={clsx(
          inter.variable,
          glegoo.variable,
          'min-h-screen flex flex-col font-body'
        )}>
        <Protected>
          <Header />
          <main className="flex flex-1 flex-col items-center justify-between p-4 lg:p-24">
            <WizardProvider>{children}</WizardProvider>
          </main>
          <Footer />
        </Protected>
      </body>
    </html>
  );
}
