import Link from "next/link";
import { redirect } from "next/navigation";
import { createSupabaseServer } from "@/lib/supabase/server";

export default async function DashboardPage() {
  const supabase = await createSupabaseServer();
  const { data } = await supabase.auth.getUser();
  const user = data.user;

  if (!user) redirect("/auth/login");

  const { data: purchases } = await supabase
    .from("purchases")
    .select("status, course_id")
    .eq("user_id", user.id);

  const paidCourseIds = new Set(
    (purchases || []).filter((p) => p.status === "paid").map((p) => p.course_id)
  );

  const { data: courses } = await supabase
    .from("courses")
    .select("id,slug,title,description,is_free,price_php")
    .order("created_at", { ascending: true });

  const myCourses = (courses || []).filter((c) => c.is_free || paidCourseIds.has(c.id));

  return (
    <div className="mx-auto max-w-6xl p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold">Dashboard</h1>
          <p className="mt-1 text-slate-600">Logged in as: {user.email}</p>
        </div>

        <form action="/auth/logout" method="POST">
          <button className="rounded-md border px-3 py-2 text-sm">Logout</button>
        </form>
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-semibold">My Courses</h2>

        {myCourses.length === 0 ? (
          <div className="mt-4 rounded-xl border bg-white p-5">
            <p className="text-slate-600">No courses yet.</p>
            <Link className="mt-2 inline-block text-blue-600 hover:underline" href="/courses">
              Browse courses →
            </Link>
          </div>
        ) : (
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            {myCourses.map((c) => (
              <Link
                key={c.id}
                href={`/courses/${c.slug}`}
                className="rounded-2xl border bg-white p-5 shadow-sm transition hover:shadow-md"
              >
                <div className="flex items-center justify-between gap-3">
                  <h3 className="text-lg font-semibold">{c.title}</h3>
                  <span className="rounded-full border px-3 py-1 text-sm text-slate-700">
                    {c.is_free ? "Free" : "Purchased ✅"}
                  </span>
                </div>
                <p className="mt-2 text-sm text-slate-600">{c.description}</p>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}