import "./globals.css";
import { Inter } from "next/font/google";
import Navbar from "../components/ui/site/Navbar";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="font-sans">
        <Navbar />
        <div className="min-h-screen bg-slate-50">{children}</div>
      </body>
    </html>
  );
}