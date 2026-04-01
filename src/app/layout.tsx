// src/app/layout.tsx
import "./globals.css";
import "./highlight.css";
import { Inter } from "next/font/google";
import { Metadata } from "next";
import Navbar from "../components/ui/site/Navbar";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "CodeClover — Learn Web Development from Scratch",
    template: "%s | CodeClover",
  },
  description:
    "Free and affordable web development courses for complete beginners. Learn HTML, CSS, and build your first website step by step. No experience needed.",
  keywords: [
    "learn web development",
    "HTML course",
    "CSS course",
    "beginner web dev",
    "free coding course",
    "web development Philippines",
    "CodeClover",
    "build a website",
    "learn to code",
    "frontend development",
  ],
  authors: [{ name: "CodeClover" }],
  creator: "CodeClover",
  metadataBase: new URL("https://course-platform-five-sigma.vercel.app"),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://course-platform-five-sigma.vercel.app",
    siteName: "CodeClover",
    title: "CodeClover — Learn Web Development from Scratch",
    description:
      "Free and affordable web development courses for complete beginners. Learn HTML, CSS, and build your first website step by step.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "CodeClover — Learn Web Development from Scratch",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "CodeClover — Learn Web Development from Scratch",
    description:
      "Free and affordable web development courses for complete beginners. Learn HTML, CSS, and build your first website.",
    images: ["/og-image.jpg"],
  },
  icons: {
    icon: [{ url: "/codeclover.png", type: "image/png" }],
    apple: [{ url: "/codeclover.png", type: "image/png" }],
  },
  manifest: "/manifest.json",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="font-sans">
        <Navbar />
        <div className="min-h-screen bg-slate-50">{children}</div>
      </body>
    </html>
  );
}