import type { Config } from "tailwindcss";

export default {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Maps `bg-primary`, `text-primary`, `text-primary/70` etc. to the
        // CSS variable defined in globals.css. The `<alpha-value>` placeholder
        // is what makes Tailwind's `/70` opacity modifier work.
        primary: "rgb(var(--primary) / <alpha-value>)",
      },
    },
  },
  plugins: [],
} satisfies Config;
