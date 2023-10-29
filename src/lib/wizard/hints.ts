import { WizardHintProps } from '@/components/WizardHint';

const hints = {
  'external-link': {
    text: 'Klicka på bilden för att öppna produktlänk<br/>(öppnas i nytt fönster)',
  },
  'item-button-book': {
    text: 'Klicka här för att reservera denna present<br/>(så ingen annan köper samma)',
  },
  'item-button-booked-by-user': {
    text: 'Du har tänkt köpa den här<br/>(klicka på avboka om du ångrar dej)',
  },
  'item-button-booked-by-someone': {
    text: 'Någon annan har reserverat den här.',
  },
  'item-button-buy': {
    text: 'Klicka här när du köpt denna present',
  },
  'item-button-bought-by-me': {
    text: 'Du har redan köpt denna present - Fantastiskt!<br/>(Klicka här om du ångrat dej)',
  },
  'item-button-bought-by-someone': {
    text: 'Någon annan har redan köpt denna present',
  },
} as const;

export const getHint = (key: keyof typeof hints): WizardHintProps => {
  return hints[key]
    ? { ...hints[key], hintType: key }
    : { isDisabled: true, hintType: 'undefined', text: '' };
};
