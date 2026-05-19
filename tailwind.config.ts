import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        "primary": "#005D91",
        "accent": "#B1976B",
        "navy": "#0A1118",
        "slate-blue": "#4F5B93",
        "ice-white": "#F4F7FF",
        "on-background": "#1A1F36",
        "on-surface": "#1A1F36",
        "background": "#F4F7FF",
        "surface": "#FFFFFF",
        "surface-variant": "#F4F7FF",
        "primary-fixed-dim": "#AEC6E6",
        "primary-fixed": "#DCE8F7",
        "outline": "#89909B",
        "tertiary-fixed": "#E6E9F0",
        "surface-container": "#F2F4F7",
        "on-primary": "#FFFFFF",
        "error-container": "#FEE2E2",
        "on-tertiary-fixed-variant": "#4A5568",
        "tertiary-fixed-dim": "#CBD5E1",
        "tertiary-container": "#475569",
        "surface-dim": "#E5E7EB",
        "surface-container-low": "#F9FAFB",
        "secondary-container": "#E2E8F0",
        "on-primary-fixed-variant": "#0F2C59",
        "on-error-container": "#991B1B",
        "outline-variant": "#D1D5DB",
        "on-tertiary-fixed": "#1E293B",
        "tertiary": "#334155",
        "surface-container-high": "#E5E7EB",
        "inverse-primary": "#93C5FD",
        "surface-container-highest": "#D1D5DB",
        "on-surface-variant": "#4B5563",
        "secondary-fixed-dim": "#94A3B8",
        "secondary-fixed": "#CBD5E1",
        "surface-tint": "#2B59FF",
        "on-tertiary": "#F8FAFC",
        "on-primary-container": "#DBEAFE",
        "on-tertiary-container": "#F1F5F9",
        "surface-bright": "#FFFFFF",
        "secondary": "#6B5AED",
        "inverse-surface": "#1F2937",
        "on-secondary": "#FFFFFF",
        "on-error": "#FFFFFF",
        "on-secondary-fixed": "#0F172A",
        "error": "#DC2626",
        "primary-container": "#172A46",
        "inverse-on-surface": "#F9FAFB",
        "on-secondary-fixed-variant": "#334155",
        "on-secondary-container": "#475569",
        "surface-container-lowest": "#FFFFFF",
        "teal-brand": "#0D9488",
        "scholarly-blue": "#0A1118",
        "gold-accent": "#B1976B",
        "give-silver": "#E2E8F0",
        "brand-gradient": "linear-gradient(to right, #005D91, #B1976B)"
      },
      borderRadius: {
        "DEFAULT": "0.375rem",
        "lg": "0.6rem",
        "xl": "1rem",
        "2xl": "1.5rem",
        "3xl": "2.5rem",
        "full": "9999px"
      },
      boxShadow: {
        "premium": "0 20px 50px -12px rgba(0, 0, 0, 0.08), 0 10px 30px -10px rgba(0, 93, 145, 0.05)",
        "premium-hover": "0 30px 60px -12px rgba(0, 0, 0, 0.12), 0 18px 40px -10px rgba(0, 93, 145, 0.08)",
        "glass": "0 8px 32px 0 rgba(31, 38, 135, 0.07)",
        "soft": "0 10px 30px -5px rgba(0, 0, 0, 0.03)",
        "inner-glow": "inset 0 0 20px rgba(255, 255, 255, 0.5)",
      },
      keyframes: {
        slowZoom: {
          '0%': { transform: 'scale(1)' },
          '100%': { transform: 'scale(1.1)' },
        }
      },
      animation: {
        'slow-zoom': 'slowZoom 20s ease-in-out infinite alternate',
      },
      fontFamily: {
        "headline": ["Gayathri", "Lexend", "sans-serif"],
        "body": ["Manjari", "Inter", "sans-serif"],
        "label": ["Inter", "sans-serif"],
        "montserrat": ["Montserrat", "sans-serif"],
        "open-sans": ["Open Sans", "sans-serif"]
      }
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
    require('@tailwindcss/forms'),
    require('@tailwindcss/aspect-ratio'),
    require('@tailwindcss/container-queries'),
  ],
};
export default config;
