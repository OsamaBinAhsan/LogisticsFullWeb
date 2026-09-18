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
        obsidian: {
          DEFAULT: "#06080A",
          card: "#0E121B",
          border: "#1A2235",
          hover: "#131929",
        },
        teal: {
          DEFAULT: "#14B8A6",
          light: "#2DD4BF",
        },
        amber: {
          DEFAULT: "#F59E0B",
        },
        emerald: {
          DEFAULT: "#10B981",
        },
        "hazard-amber": "#F59E0B",
        "razor-crimson": "#EF4444",
        "hyper-teal": "#14B8A6",
        "delivery-green": "#10B981",
        "channel-pink": "#EC4899",
        "channel-blue": "#3B82F6",
        "channel-wa": "#22C55E",
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      backgroundImage: {
        "tactile-matrix":
          "radial-gradient(ellipse 80% 80% at 50% -20%, rgba(20,184,166,0.08), rgba(255,255,255,0))",
      },
      boxShadow: {
        "glow-amber": "0 0 12px rgba(245,158,11,0.35)",
        tactile: "inset 0 1px 0 0 rgba(255,255,255,0.06)",
      },
      fontFamily: {
        sans: ["var(--font-geist-sans)", "sans-serif"],
        mono: [
          "JetBrains Mono",
          "var(--font-geist-mono)",
          "monospace",
        ],
        grotesk: ["var(--font-space-grotesk)", "sans-serif"],
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
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "dyno-tape": "dyno-tape 20s linear infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
