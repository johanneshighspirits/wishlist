import Image from 'next/image';

export const Footer = () => {
  return (
    <footer className="relative bottom-0 left-0 flex w-full items-end justify-center bg-gradient-to-t from-white via-white dark:from-black dark:via-black lg:static lg:h-auto lg:w-auto lg:bg-none">
      <div className="pointer-events-none flex place-items-center gap-2 p-8 lg:pointer-events-auto lg:p-4 text-xs text-gray-500">
        &copy; {new Date().getFullYear()}
      </div>
    </footer>
  );
};
