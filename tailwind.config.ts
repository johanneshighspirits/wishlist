import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        headline: ['var(--font-headline)'],
        body: ['var(--font-body)'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      zIndex: {
        1: '1',
      },
      boxShadow: {
        hint: '3px 5px 14px rgb(0 0 0 / .4)',
      },
      animation: {
        'hint-x': 'hint-x 1.5s infinite ease-in-out',
        'hint-y': 'hint-y 1.5s infinite ease-in-out',
      },
      keyframes: {
        'hint-x': {
          '0%': {
            transform: 'translateX(0px)',
          },
          '20%': {
            transform: 'translateX(-16px)',
          },
          '40%': {
            transform: 'translateX(-8px)',
          },
          '60%': {
            transform: 'translateX(-14px)',
          },
          '100%': {
            transform: 'translateX(0px)',
          },
        },
        'hint-y': {
          '0%': {
            transform: 'translateY(0px)',
          },
          '20%': {
            transform: 'translateY(-16px)',
          },
          '40%': {
            transform: 'translateY(-8px)',
          },
          '60%': {
            transform: 'translateY(-14px)',
          },
          '100%': {
            transform: 'translateY(0px)',
          },
        },
      },
    },
  },
  plugins: [],
};
export default config;
