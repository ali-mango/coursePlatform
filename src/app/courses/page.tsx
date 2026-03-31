  import Link from "next/link";
  import { BookOpen, Clock, Sparkles } from "lucide-react";
  import { createSupabaseServer } from "@/lib/supabase/server";

  type CourseRow = {
    id: string;
    slug: string;
    title: string;
    description: string | null;
    is_free: boolean;
    price_php: number | null;
  };

  function formatPeso(n: number | null) {
    return `₱${Number(n || 0).toLocaleString("en-PH")}`;
  }

  function estimateHours(lessonCount: number, isFree: boolean) {
    if (lessonCount <= 0) return isFree ? "2 hours" : "10+ hours";
    if (lessonCount <= 8) return "2 hours";
    if (lessonCount >= 30) return "10+ hours";

    const hours = Math.max(2, Math.round((lessonCount * 18) / 60));
    return `${hours} hours`;
  }

  function getFallbackDescription(course: CourseRow) {
    if (course.is_free) {
      return "Get started with HTML & CSS basics. Build your first simple webpage from scratch in just 2 hours.";
    }

    return "Master HTML, CSS, and JavaScript fundamentals. Build real projects with hands-on lessons in every module. Perfect for beginners who want to build a solid foundation.";
  }

  export default async function CoursesPage() {
    const supabase = await createSupabaseServer();

    const { data: courses, error } = await supabase
      .from("courses")
      .select("id,slug,title,description,is_free,price_php")
      .order("created_at", { ascending: true });

    if (error) {
      return (
        <main className="min-h-screen bg-slate-50">
          <div className="mx-auto max-w-6xl px-6 py-10">
            <h1 className="text-3xl font-semibold text-slate-900">Courses</h1>
            <p className="mt-3 text-red-600">Error: {error.message}</p>
          </div>
        </main>
      );
    }

    const typedCourses = (courses ?? []) as CourseRow[];

    const lessonCounts = await Promise.all(
      typedCourses.map(async (course) => {
        const { count } = await supabase
          .from("lessons")
          .select("*", { count: "exact", head: true })
          .eq("course_id", course.id);

        return [course.id, count ?? 0] as const;
      })
    );

    const lessonCountMap = new Map(lessonCounts);

    const sortedCourses = [...typedCourses].sort((a, b) => {
      if (a.is_free === b.is_free) return 0;
      return a.is_free ? -1 : 1;
    });

    return (
      <main className="min-h-screen bg-slate-50">
        <div className="mx-auto max-w-6xl px-6 py-10">
          <div className="max-w-xl">
            <h1 className="text-4xl font-semibold tracking-tight text-slate-900">
              Courses
            </h1>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              Start with our free course or dive deep into fundamentals. Both
              designed for absolute beginners.
            </p>
          </div>

          {sortedCourses.length === 0 ? (
            <div className="mt-10 rounded-3xl border border-slate-200 bg-white p-8 text-sm text-slate-600">
              No courses found yet.
            </div>
          ) : (
            <div className="mt-10 grid gap-5 md:grid-cols-2">
              {sortedCourses.map((course) => {
                const lessonCount = lessonCountMap.get(course.id) ?? 0;
                const lessonsText =
                  lessonCount > 0
                    ? `${lessonCount} lessons`
                    : course.is_free
                      ? "8 lessons"
                      : "36 lessons";

                const hoursText = estimateHours(lessonCount, course.is_free);

                return (
                  <div
                    key={course.id}
                    className={[
                      "relative rounded-3xl bg-white p-5 shadow-sm",
                      course.is_free
                        ? "border border-slate-200"
                        : "border border-blue-300 border-t-4 border-t-blue-700",
                    ].join(" ")}
                  >
                  

                    <div className="flex items-start justify-between gap-4">
                      {course.is_free ? (
                        <span className="inline-flex items-center rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[11px] font-medium text-emerald-700">
                          Free
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 rounded-full border border-blue-200 bg-blue-50 px-2.5 py-1 text-[11px] font-medium text-blue-700">
                          <Sparkles className="h-3 w-3 fill-current" />
                          Most Popular
                        </span>
                      )}

                      <div className="text-right">
                        <div className="text-4xl font-semibold tracking-tight text-slate-900">
                          {course.is_free ? "Free" : formatPeso(course.price_php)}
                        </div>
                        {!course.is_free && (
                          <div className="mt-1 text-[11px] font-medium text-slate-500">
                            one-time
                          </div>
                        )}
                      </div>
                    </div>

                    <h2 className="mt-7 text-[30px] font-semibold tracking-tight text-slate-900">
                      {course.title}
                    </h2>

                    <p className="mt-3 min-h-[72px] text-sm leading-7 text-slate-600">
                      {course.description?.trim() || getFallbackDescription(course)}
                    </p>

                    <div className="mt-5 flex flex-wrap items-center gap-5 text-sm text-slate-500">
                      <span className="inline-flex items-center gap-2">
                        <BookOpen className="h-4 w-4" />
                        {lessonsText}
                      </span>
                      <span className="inline-flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        {hoursText}
                      </span>
                    </div>

                    <div className="mt-5 border-t border-slate-200" />

                    <Link
                      href={`/courses/${course.slug}`}
                      className={[
                        "mt-5 inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl text-sm font-semibold text-white transition",
                        course.is_free
                          ? "bg-emerald-500 hover:bg-emerald-600"
                          : "bg-blue-500 hover:bg-blue-600",
                      ].join(" ")}
                    >
                      {course.is_free ? "Start Free" : `Buy ${formatPeso(course.price_php)}`}
                      <span aria-hidden="true">→</span>
                    </Link>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>
    );
  }