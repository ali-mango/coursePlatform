"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ChevronDown,
  LogOut,
  Settings,
  User as UserIcon,
} from "lucide-react";
import logo from "../../../assests/images/codeclover.png";

interface NavbarProps {
  user: {
    email?: string | null;
    user_metadata?: {
      full_name?: string | null;
    };
  } | null;
}

export default function NavbarClient({ user }: NavbarProps) {
  const pathname = usePathname();

  const isLessonPage =
    pathname?.includes("/courses/") && pathname?.includes("/lessons/");

  const email = user?.email ?? "";
  const displayName =
    user?.user_metadata?.full_name || email.split("@")[0] || "Account";

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white">
      <div
        className={
          isLessonPage
            ? "flex h-14 items-center justify-between px-4 lg:px-6"
            : "mx-auto flex h-14 max-w-6xl items-center justify-between px-6"
        }
      >
        <div className="flex items-center gap-10">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md bg-white">
              <Image
                src={logo}
                alt="CodeClover logo"
                width={38}
                height={38}
                className="object-contain"
                priority
              />
            </div>
            <span className="text-base font-semibold text-slate-900">
              CodeClover
            </span>
          </Link>

          <nav className="hidden items-center gap-8 md:flex">
            <Link
              href="/courses"
              className="text-xs font-medium text-slate-500 transition hover:text-slate-900"
            >
              Courses
            </Link>
            <Link
              href="/#pricing"
              className="text-xs font-medium text-slate-500 transition hover:text-slate-900"
            >
              Pricing
            </Link>
            <Link
              href="/#faq"
              className="text-xs font-medium text-slate-500 transition hover:text-slate-900"
            >
              FAQ
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-5">
          {user ? (
            <>
              <Link
                href="/dashboard"
                className="text-xs font-medium text-slate-700 transition hover:text-slate-900"
              >
                Dashboard
              </Link>

              <details className="group relative">
                <summary className="flex list-none cursor-pointer items-center gap-2 rounded-lg px-2 py-1.5 text-sm text-slate-700 transition hover:bg-slate-50">
                  <div className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                    <UserIcon className="h-3 w-3" />
                  </div>

                  <span className="max-w-[120px] truncate text-xs font-medium text-slate-700">
                    {displayName}
                  </span>

                  <ChevronDown className="h-3.5 w-3.5 text-slate-400 transition group-open:rotate-180" />
                </summary>

                <div className="absolute right-0 top-[calc(100%+10px)] w-56 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg">
                  <div className="border-b border-slate-100 px-4 py-3">
                    <p className="truncate text-sm font-medium text-slate-900">
                      {displayName}
                    </p>
                    <p className="truncate text-xs text-slate-400">{email}</p>
                  </div>

                  <div className="py-1.5">
                    <Link
                      href="/account"
                      className="flex items-center gap-2 px-4 py-2.5 text-sm text-slate-700 transition hover:bg-slate-50"
                    >
                      <Settings className="h-4 w-4 text-slate-400" />
                      <span>Manage Account</span>
                    </Link>

                    <form action="/auth/logout" method="POST">
                      <button
                        type="submit"
                        className="flex w-full items-center gap-2 px-4 py-2.5 text-left text-sm text-red-500 transition hover:bg-red-50"
                      >
                        <LogOut className="h-4 w-4" />
                        <span>Sign Out</span>
                      </button>
                    </form>
                  </div>
                </div>
              </details>
            </>
          ) : (
            <Link
              href="/auth/login"
              className="rounded-lg bg-blue-600 px-3 py-2 text-xs font-medium text-white transition hover:bg-blue-700"
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}