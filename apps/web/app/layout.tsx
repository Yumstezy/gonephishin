import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Gone Phishin'",
  description: "Protect yourself, or someone you love, from phishing scams.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
