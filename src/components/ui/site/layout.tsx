// src/app/(site)/layout.tsx
import Navbar from "@/components/ui/site/Navbar";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-slate-50">{children}</div>
    </>
  );
}