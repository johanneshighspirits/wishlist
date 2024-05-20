import { PropsWithChildren } from 'react';
import { WizardProvider } from './WizardProvider';
import { cookies } from 'next/headers';

export const WizardLoader = async ({ children }: PropsWithChildren) => {
  const readHints = getHints();
  return <WizardProvider readHints={readHints}>{children}</WizardProvider>;
};

const getHints = () => {
  try {
    const cookieValue = cookies().get('hints')?.value;
    const hints = new Set<string>(JSON.parse(cookieValue || '[]'));
    return hints;
  } catch {
    return new Set<string>();
  }
};
