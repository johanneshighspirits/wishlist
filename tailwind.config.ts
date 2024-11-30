import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        headline: ["var(--font-headline)"],
        body: ["var(--font-body)"],
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      zIndex: {
        1: "1",
      },
      boxShadow: {
        hint: "3px 5px 14px rgb(0 0 0 / .4)",
        "wizard-highlight":
          "0px 0px 1rem rgb(0 255 0 / 0.5), 0px 0px 0px 2px white",
      },
      animation: {
        "hint-x": "hint-x var(--animation-duration, 1.5s) infinite ease-in-out",
        "hint-y": "hint-y var(--animation-duration, 1.5s) infinite ease-in-out",
        "fade-in":
          "fade-in var(--animation-duration, 250ms) var(--animation-delay, 0s) backwards ease-out",
      },
      keyframes: {
        "fade-in": {
          from: {
            opacity: "0",
          },
          to: {
            opacity: "1",
          },
        },
        "hint-x": {
          "0%": {
            transform: "translateX(0px)",
          },
          "20%": {
            transform: "translateX(-16px)",
          },
          "40%": {
            transform: "translateX(-8px)",
          },
          "60%": {
            transform: "translateX(-14px)",
          },
          "100%": {
            transform: "translateX(0px)",
          },
        },
        "hint-y": {
          "0%": {
            transform: "translateY(0px)",
          },
          "20%": {
            transform: "translateY(-16px)",
          },
          "40%": {
            transform: "translateY(-8px)",
          },
          "60%": {
            transform: "translateY(-14px)",
          },
          "100%": {
            transform: "translateY(0px)",
          },
        },
      },
    },
  },
  plugins: [],
};
export default config;
