import type { Metadata } from "next";
// @ts-ignore: allow importing global CSS without explicit type declarations
import "./globals.css";

export const metadata: Metadata = {
  title: "GymOS Pro",
  description: "Premium gym management platform for modern fitness businesses.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className="bg-slate-950 text-white antialiased">{children}</body>
    </html>
  );
}
