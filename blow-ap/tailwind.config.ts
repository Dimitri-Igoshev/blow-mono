import type { Config } from 'tailwindcss'
import { heroui } from "@heroui/theme";

export default {
  content: [
    "./index.html",
    './src/layouts/**/*.{js,ts,jsx,tsx,mdx}',
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: 'var(--color-primary)',
        secondary: 'var(--color-secondary)',
      }
    },
  },
  darkMode: "class",
  plugins: [
    heroui({
      defaultTheme: 'light',
      themes: {
        light: {
          layout: {
            hoverOpacity: 1,
          },
          colors: {
            focus: 'transparent',
          },
        },
        dark: {
          layout: {
            hoverOpacity: 1,
          },
          colors: {
            focus: 'transparent',
          },
        },
      },
    })
  ],
} satisfies Config