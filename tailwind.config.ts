import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        navy: {
          50: '#f0f5fa',
          100: '#e1ecf5',
          200: '#c3daeb',
          300: '#94bfdc',
          400: '#5e9dc8',
          500: '#3881b2',
          600: '#286794',
          700: '#215377',
          800: '#1d4663',
          900: '#0f2738',
          950: '#091824',
        },
        slate: {
          850: '#15202e',
          950: '#0a1017',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'Menlo', 'monospace'],
      },
    },
  },
  plugins: [],
} satisfies Config;
