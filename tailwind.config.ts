import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        // Kinetic Editorial Commerce Material 3 Tokens
        surface: "#faf8ff",
        "surface-dim": "#d2d9f4",
        "surface-bright": "#faf8ff",
        "surface-container-lowest": "#ffffff",
        "surface-container-low": "#f2f3ff",
        "surface-container": "#eaedff",
        "surface-container-high": "#e2e7ff",
        "surface-container-highest": "#dae2fd",
        "on-surface": "#131b2e",
        "on-surface-variant": "#434655",
        "inverse-surface": "#283044",
        "inverse-on-surface": "#eef0ff",
        outline: "#737686",
        "outline-variant": "#c3c6d7",
        "surface-tint": "#0053db",
        "surface-variant": "#dae2fd",

        "primary-fixed": "#dbe1ff",
        "primary-fixed-dim": "#b4c5ff",
        "on-primary-fixed": "#00174b",
        "on-primary-fixed-variant": "#003ea8",
        "inverse-primary": "#b4c5ff",

        "secondary-fixed": "#b2f746",
        "secondary-fixed-dim": "#98da27",
        "on-secondary-fixed": "#121f00",
        "on-secondary-fixed-variant": "#334f00",
        "on-secondary": "#ffffff",
        "on-secondary-container": "#496f00",

        "tertiary-fixed": "#ffdcc5",
        "tertiary-fixed-dim": "#ffb783",
        "on-tertiary-fixed": "#301400",
        "on-tertiary-fixed-variant": "#713700",
        "on-tertiary": "#ffffff",
        "on-tertiary-container": "#ffede3",

        // Tactical Logistics Tokens
        obsidian: {
          DEFAULT: "#06080A",
          card: "#0E121B",
          border: "#1A2235",
          hover: "#131929",
        },
        "hazard-amber": "#F59E0B",
        "razor-crimson": "#EF4444",
        "hyper-teal": "#14B8A6",
        "delivery-green": "#10B981",
        "channel-pink": "#EC4899",
        "channel-blue": "#3B82F6",
        "channel-wa": "#22C55E",

        // shadcn compatible tokens mapped to Kinetic Palette
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "#004ac6",
          container: "#2563eb",
          foreground: "#ffffff",
        },
        secondary: {
          DEFAULT: "#446900",
          container: "#b2f746",
          foreground: "#ffffff",
        },
        tertiary: {
          DEFAULT: "#864300",
          container: "#aa5700",
          foreground: "#ffffff",
        },
        destructive: {
          DEFAULT: "#ba1a1a",
          foreground: "#ffffff",
        },
        error: {
          DEFAULT: "#ba1a1a",
          container: "#ffdad6",
          foreground: "#ffffff",
          "on-container": "#93000a",
        },
        muted: {
          DEFAULT: "#eaedff",
          foreground: "#434655",
        },
        accent: {
          DEFAULT: "#b2f746",
          foreground: "#121f00",
        },
        popover: {
          DEFAULT: "#ffffff",
          foreground: "#131b2e",
        },
        card: {
          DEFAULT: "#ffffff",
          foreground: "#131b2e",
        },
      },
      backgroundImage: {
        "tactile-matrix":
          "radial-gradient(ellipse 80% 80% at 50% -20%, rgba(20,184,166,0.08), rgba(255,255,255,0))",
        "hero-gradient":
          "radial-gradient(ellipse 80% 60% at 50% -10%, rgba(37,99,235,0.12), rgba(178,247,70,0.08), transparent)",
      },
      boxShadow: {
        "glow-amber": "0 0 12px rgba(245,158,11,0.35)",
        "glow-cobalt": "0 0 20px rgba(37,99,235,0.25)",
        tactile: "inset 0 1px 0 0 rgba(255,255,255,0.06)",
        card: "0 1px 4px rgba(0,0,0,0.04), 0 4px 16px rgba(0,0,0,0.02)",
        "card-hover": "0 12px 32px -8px rgba(15,23,42,0.08), 0 4px 12px -2px rgba(15,23,42,0.04)",
      },
      fontFamily: {
        sans: ["'Plus Jakarta Sans'", "sans-serif"],
        headline: ["'Space Grotesk'", "sans-serif"],
        mono: ["'JetBrains Mono'", "monospace"],
        "display-hero": ["'Space Grotesk'", "sans-serif"],
        "headline-lg": ["'Space Grotesk'", "sans-serif"],
        "headline-md": ["'Space Grotesk'", "sans-serif"],
        "headline-sm": ["'Space Grotesk'", "sans-serif"],
        "body-lg": ["'Plus Jakarta Sans'", "sans-serif"],
        "body-md": ["'Plus Jakarta Sans'", "sans-serif"],
        "body-sm": ["'Plus Jakarta Sans'", "sans-serif"],
        "label-lg": ["'Plus Jakarta Sans'", "sans-serif"],
        "label-md": ["'Plus Jakarta Sans'", "sans-serif"],
        "label-sm": ["'Plus Jakarta Sans'", "sans-serif"],
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "dyno-tape": {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        marquee: {
          "0%": { transform: "translateX(0%)" },
          "100%": { transform: "translateX(-50%)" },
        },
        "radar-spin": {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "dyno-tape": "dyno-tape 20s linear infinite",
        marquee: "marquee 32s linear infinite",
        "radar-spin": "radar-spin 3.5s linear infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
