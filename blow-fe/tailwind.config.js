import {heroui} from "@heroui/theme"

/** @type {import('tailwindcss').Config} */
const config = {
  content: [
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-sans)"],
        mono: ["var(--font-mono)"],
      },
      colors: {
        primary: "#e31e24",
        secondary: '#2B2A29',
        dark: "#2B2A29",
        gray: '#D9D9D9'
      },
    },
  },
  darkMode: "class",
  plugins: [heroui({
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
  })],
}

module.exports = config;