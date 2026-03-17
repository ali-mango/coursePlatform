import Link from "next/link";
import { createSupabaseServer } from "@/lib/supabase/server";

export default async function CoursesPage() {
 const supabase = await createSupabaseServer();

  const { data: courses, error } = await supabase
    .from("courses")
    .select("id,slug,title,description,is_free,price_php")
    .order("created_at", { ascending: true });

  if (error) {
    return (
      <div className="p-6">
        <h1 className="text-xl font-semibold">Courses</h1>
        <p className="mt-2 text-red-600">Error: {error.message}</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl p-6">
      <h1 className="text-3xl font-semibold">Courses</h1>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {courses?.map((c) => (
          <Link
            key={c.id}
            href={`/courses/${c.slug}`}
            className="rounded-2xl border bg-white p-5 shadow-sm transition hover:shadow-md"
          >
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-lg font-semibold">{c.title}</h2>
              <span className="rounded-full border px-3 py-1 text-sm text-slate-700">
                {c.is_free ? "Free" : `₱${c.price_php}`}
              </span>
            </div>
            <p className="mt-2 text-sm text-slate-600">{c.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}