import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Agentiq Capital | Slide Deck",
  description: "Agentiq Capital - Building the future of financial intelligence through advanced visualization and AI-powered analytics. A Bellevue, WA tech startup pioneering ASI in finance.",
  keywords: ["fintech", "AI", "financial intelligence", "stock visualization", "ASI", "Agentiq Capital"],
  authors: [{ name: "Agentiq Capital, Inc." }],
  openGraph: {
    title: "Agentiq Capital | VC Pitch Presentation",
    description: "Computationally Informed Finance, ASI Via the Capital Market",
    type: "website",
  },
   icons: {
    icon: [
      { url: '/logo1.svg', type: 'image/svg+xml' },
    ],
    shortcut: '/logo1.svg',
    apple: '/logo1.svg'
  },
};



export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-(--color-charcoal) text-(--color-text-primary)`}
      >
        {children}
      </body>
    </html>
  );
}
