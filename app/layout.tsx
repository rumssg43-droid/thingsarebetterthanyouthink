import type { Metadata } from "next";
import { Geist, Fraunces } from "next/font/google";
import "./globals.css";

const geist = Geist({
  variable: "--font-sans",
  subsets: ["latin"],
});

const fraunces = Fraunces({
  variable: "--font-serif",
  subsets: ["latin"],
  axes: ["opsz", "SOFT"],
});

export const metadata: Metadata = {
  title: "Things Are Better Than You Think",
  description:
    "An evidence-based antidote to the doom cycle. A single story about how humanity is quietly winning, every time you refresh.",
  openGraph: {
    title: "Things Are Better Than You Think",
    description:
      "An evidence-based antidote to the doom cycle. A single story about how humanity is quietly winning, every time you refresh.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geist.variable} ${fraunces.variable} h-full antialiased`}
    >
      <body className="min-h-full">{children}</body>
    </html>
  );
}
