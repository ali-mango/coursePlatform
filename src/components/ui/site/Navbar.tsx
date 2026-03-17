import Link from "next/link";
import { getUser } from "@/lib/auth";

export default async function Navbar() {
  const user = await getUser();

  return (
    <header className="border-b bg-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="text-lg font-semibold">
          Course Platform
        </Link>

        <nav className="flex items-center gap-4 text-sm">
          <Link className="text-slate-700 hover:underline" href="/courses">
            Courses
          </Link>

          {user ? (
            <>
              <Link className="text-slate-700 hover:underline" href="/dashboard">
                Dashboard
              </Link>

              <form action="/auth/logout" method="POST">
                <button className="rounded-md border px-3 py-2 text-sm">
                  Logout
                </button>
              </form>
            </>
          ) : (
            <Link className="rounded-md bg-blue-600 px-3 py-2 text-white" href="/auth/login">
              Login
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}