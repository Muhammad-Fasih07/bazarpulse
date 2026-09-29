/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#FAFAFC",
        surface: {
          DEFAULT: "#FFFFFF",
          hover: "#F8FAFC",
          card: "#FFFFFF",
          border: "#E2E8F0",
          elevated: "#F1F5F9"
        },
        brand: {
          emerald: "#059669",
          emeraldDark: "#047857",
          emeraldLight: "#10B981",
          pearl: "#0F172A",
          muted: "#64748B",
          indigo: "#4F46E5",
          rose: "#E11D48",
          pink: "#EC4899",
          amber: "#D97706",
          cyan: "#0284C7",
          violet: "#7C3AED"
        },
        audience: {
          womenBg: "#FDF2F8",
          womenText: "#DB2777",
          womenBorder: "#FBCFE8",
          menBg: "#EFF6FF",
          menText: "#2563EB",
          menBorder: "#BFDBFE",
          kidsBg: "#FFFBEB",
          kidsText: "#D97706",
          kidsBorder: "#FDE68A",
          lawnBg: "#F5F3FF",
          lawnText: "#7C3AED",
          lawnBorder: "#DDD6FE"
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['Outfit', 'Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace']
      },
      animation: {
        'pulse-subtle': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'shimmer': 'shimmer 2s infinite linear',
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' }
        }
      }
    },
  },
  plugins: [],
};
