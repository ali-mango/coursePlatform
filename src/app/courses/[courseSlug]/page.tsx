// src/app/courses/[courseSlug]/page.tsx
import Link from "next/link";
import { redirect } from "next/navigation";
import { createSupabaseServer } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { getUserAndHasPaid } from "@/lib/entitlements";
import { Clock, BookOpen, Users, Lock, CheckCircle2, Circle } from "lucide-react";

type LessonRow = {
  slug: string;
  title: string;
  lesson_order: number;
  module_title: string | null;
  is_preview: boolean;
};

function peso(n: number) {
  return `₱${Number(n || 0).toLocaleString("en-PH")}`;
}

// simple heuristics for now
function estimateHours(lessonCount: number) {
  if (lessonCount <= 0) return "—";
  const mins = Math.max(lessonCount * 12, 45); // ~12 mins avg
  if (mins < 60) return `${mins} min`;
  const hrs = Math.round((mins / 60) * 10) / 10;
  return `${hrs}+ hours`;
}

export default async function CoursePage({
  params,
}: {
  params: Promise<{ courseSlug: string }>;
}) {
  const { courseSlug } = await params;

  const supabase = await createSupabaseServer();
  const { data: auth } = await supabase.auth.getUser();
  const user = auth.user;

  const { data: course, error: courseErr } = await supabase
    .from("courses")
    .select("id,slug,title,description,is_free,price_php")
    .eq("slug", courseSlug)
    .single();

  if (courseErr || !course) {
    return (
      <div className="mx-auto max-w-6xl px-6 py-10">
        <p className="text-slate-600">Course not found.</p>
        <Link className="mt-4 inline-block text-blue-600 hover:underline" href="/courses">
          Back to courses →
        </Link>
      </div>
    );
  }

  const { data: lessons } = await supabaseAdmin
    .from("lessons")
    .select("slug,title,lesson_order,module_title,is_preview")
    .eq("course_id", course.id)
    .order("lesson_order", { ascending: true });

  const lessonRows = (lessons ?? []) as LessonRow[];

  // entitlement
  const entitlement = await getUserAndHasPaid(course.id);
  const hasPaid = entitlement.hasPaid;
  const unlocked = course.is_free || hasPaid;

  // group by module_title
  const modules = new Map<string, LessonRow[]>();
  for (const l of lessonRows) {
    const key = (l.module_title || "Module").trim();
    if (!modules.has(key)) modules.set(key, []);
    modules.get(key)!.push(l);
  }

  // stats (placeholder students for now)
  const totalLessons = lessonRows.length;
  const hoursText = estimateHours(totalLessons);
  const studentsText = course.is_free ? "1200+ students" : "500+ students";

  // progress placeholder (later: real progress table)
  const completed = 0;
  const percent = totalLessons ? Math.round((completed / totalLessons) * 100) : 0;

  return (
    <main className="bg-slate-50">
      <div className="mx-auto max-w-6xl px-6 py-10">
        {/* Header */}
        <div className="flex items-center justify-between">
          <Link className="text-sm text-slate-600 hover:underline" href="/courses">
            ← Courses
          </Link>

          {!course.is_free && !unlocked ? (
            <div className="rounded-full border bg-white px-3 py-1 text-sm text-slate-700">
              {peso(course.price_php)}
            </div>
          ) : null}
        </div>

        {/* Title block */}
        <div className="mt-8">
          <div className="inline-flex items-center gap-2 rounded-full border bg-white px-3 py-1 text-xs font-medium">
            {course.is_free ? (
              <span className="text-emerald-700">Free Course</span>
            ) : unlocked ? (
              <span className="text-blue-700">Unlocked</span>
            ) : (
              <span className="text-slate-700">Locked</span>
            )}
          </div>

          <h1 className="mt-4 text-4xl font-semibold tracking-tight text-slate-900">
            {course.title}
          </h1>
          <p className="mt-2 max-w-3xl text-slate-600">{course.description}</p>

          {/* Stats row */}
          <div className="mt-5 flex flex-wrap items-center gap-5 text-sm text-slate-600">
            <span className="inline-flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              {totalLessons} lessons
            </span>
            <span className="inline-flex items-center gap-2">
              <Clock className="h-4 w-4" />
              {hoursText}
            </span>
            <span className="inline-flex items-center gap-2">
              <Users className="h-4 w-4" />
              {studentsText}
            </span>
          </div>
        </div>

        {/* Main layout */}
        <div className="mt-10 grid gap-6 lg:grid-cols-[1fr_320px]">
          {/* Modules */}
          <div className="space-y-5">
            {Array.from(modules.entries()).map(([moduleTitle, rows], idx) => {
              const moduleNumber = idx + 1;
              const moduleLessonCount = rows.length;

              return (
                <section key={moduleTitle} className="rounded-2xl border bg-white p-4 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-50 text-xs font-semibold text-blue-700">
                        {moduleNumber}
                      </div>
                      <div>
                        <div className="font-semibold text-slate-900">{moduleTitle}</div>
                        <div className="text-xs text-slate-500">{moduleLessonCount} lessons</div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 rounded-xl border bg-white">
                    {rows.map((l) => {
                      const locked = !unlocked && !l.is_preview;

                      return (
                        <div
                          key={l.slug}
                          className="flex items-center justify-between gap-4 border-b px-4 py-3 last:border-b-0"
                        >
                          <div className="flex items-center gap-3">
                            {locked ? (
                              <Lock className="h-4 w-4 text-slate-400" />
                            ) : (
                              <Circle className="h-4 w-4 text-slate-300" />
                            )}

                            <div className="min-w-0">
                              <div className="truncate text-sm font-medium text-slate-900">
                                {l.title}
                              </div>

                              {!unlocked && l.is_preview ? (
                                <div className="mt-1 inline-flex rounded-full border px-2 py-0.5 text-[11px] text-slate-600">
                                  Preview
                                </div>
                              ) : null}
                            </div>
                          </div>

                          {locked ? (
                            <span className="text-xs text-slate-500">Locked</span>
                          ) : (
                            <Link
                              className="text-sm text-blue-600 hover:underline"
                              href={`/courses/${course.slug}/lessons/${l.slug}`}
                            >
                              Open
                            </Link>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </section>
              );
            })}
          </div>

          {/* Sidebar */}
          <aside className="h-fit rounded-2xl border bg-white p-5 shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <div className="font-semibold text-slate-900">Your Progress</div>
                <div className="mt-1 text-xs text-slate-500">
                  {completed} of {totalLessons} lessons
                </div>
              </div>
              <div className="text-xs font-medium text-blue-700">{percent}%</div>
            </div>

            <div className="mt-4 h-2 w-full rounded-full bg-slate-200">
              <div className="h-2 rounded-full bg-blue-600" style={{ width: `${percent}%` }} />
            </div>

            {!course.is_free && !unlocked ? (
              <div className="mt-5 rounded-xl border bg-slate-50 p-4">
                <div className="text-sm font-semibold text-slate-900">Unlock this course</div>
                <div className="mt-1 text-xs text-slate-600">
                  {peso(course.price_php)} • lifetime access
                </div>

                {!user ? (
                  <Link
                    className="mt-4 inline-flex w-full items-center justify-center rounded-xl bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                    href="/auth/login"
                  >
                    Login to buy
                  </Link>
                ) : (
                  <form action="/api/paymongo/checkout" method="POST" className="mt-4">
                    <input type="hidden" name="courseId" value={course.id} />
                    <button className="inline-flex w-full items-center justify-center rounded-xl bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">
                      Buy {peso(course.price_php)}
                    </button>
                  </form>
                )}
              </div>
            ) : (
              <div className="mt-5 rounded-xl border bg-emerald-50 p-4">
                <div className="flex items-center gap-2 text-sm font-semibold text-emerald-800">
                  <CheckCircle2 className="h-4 w-4" />
                  {course.is_free ? "Free access" : "Course unlocked"}
                </div>
                <p className="mt-1 text-xs text-emerald-800/80">
                  You can open any lesson anytime.
                </p>
              </div>
            )}
          </aside>
        </div>
      </div>
    </main>
  );
}