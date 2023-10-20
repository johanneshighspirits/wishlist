import Link from 'next/link';
import { Login } from './Login';
import { LoginStatus } from './LoginStatus';
import { BackButton } from './BackButton';

export const Header = () => {
  return (
    <header className="sticky left-0 top-0 flex h-24 w-full justify-center border-b border-gray-300 bg-gradient-to-b from-zinc-200 pb-6 pt-8 backdrop-blur dark:border-neutral-800 dark:bg-zinc-900/40 dark:from-inherit lg:static lg:w-auto lg:border lg:bg-gray-200 lg:p-4 lg:dark:bg-zinc-800/30 z-50">
      <div className="flex flex-row gap-4 w-screen px-8 items-center">
        <MenuIcon />
        <div className="flex-1">
          <Link href="/">
            <h1 className="font-headline">Önskelistan</h1>
          </Link>
          <BackButton className="block absolute mt-2 text-xs text-white/70 hover:text-white font-serif italic">
            &laquo; Tillbaka
          </BackButton>
        </div>
        <div>
          <Login />
          <LoginStatus />
        </div>
      </div>
    </header>
  );
};

const MenuIcon = () => {
  return <span className="text-2xl">💝</span>;
  return (
    <button className="group w-8 h-8 flex flex-col gap-2 space-between">
      <span className="block bg-white h-0.5 w-full group-hover:rotate-45 group-hover:translate-y-3 transition-transform"></span>
      <span className="block bg-white h-0.5 w-full group-hover:opacity-0 transition-opacity"></span>
      <span className="block bg-white h-0.5 w-full group-hover:-rotate-45 group-hover:-translate-y-2 transition-transform"></span>
    </button>
  );
};
