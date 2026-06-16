import { Hanken_Grotesk } from "next/font/google";

/**
 * App fonts, configured once here and reused across the app.
 * Each font exposes a CSS variable so it can be referenced from
 * globals.css (`@theme`) and applied via Tailwind utilities.
 */
export const hankenGrotesk = Hanken_Grotesk({
  subsets: ["latin"],
  variable: "--font-hanken-grotesk",
  display: "swap",
});
