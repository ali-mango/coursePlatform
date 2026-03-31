// src/app/courses/[courseSlug]/lessons/[lessonSlug]/page.tsx
import Link from "next/link";
import { createSupabaseServer } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { getUserAndHasPaid } from "@/lib/entitlements";
import { LessonContent } from "@/components/ui/lesson-content";
import { LessonSidebar } from "@/components/ui/lesson-sidebar";
import { MarkCompleteButton } from "@/components/ui/mark-complete-button";
import {
  ChevronLeft,
  ChevronRight,
  Lock,
  ArrowLeft,
} from "lucide-react";

type LessonRow = {
  id: string;
  slug: string;
  title: string;
  lesson_order: number;
  module_title: string | null;
  is_preview: boolean;
};

function estimateReadingTime(markdown: string): number {
  const words = markdown.replace(/[#*`\[\]|\\>_\-]/g, "").split(/\s+/).length;
  const codeBlocks = (markdown.match(/```/g) || []).length / 2;
  return Math.max(3, Math.ceil(words / 200) + Math.ceil(codeBlocks * 1.5));
}

export default async function LessonPage({
  params,
}: {
  params: Promise<{ courseSlug: string; lessonSlug: string }>;
}) {
  const { courseSlug, lessonSlug } = await params;

  const supabase = await createSupabaseServer();

  /* ── course ── */
  const { data: course } = await supabase
    .from("courses")
    .select("id,slug,title,is_free,price_php")
    .eq("slug", courseSlug)
    .single();

  if (!course) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="text-center">
          <p className="text-slate-600">Course not found.</p>
          <Link
            className="mt-4 inline-block text-sm text-blue-600 hover:underline"
            href="/courses"
          >
            ← Back to courses
          </Link>
        </div>
      </div>
    );
  }

  /* ── all lessons (for sidebar + prev/next) ── */
  const { data: allLessons } = await supabaseAdmin
    .from("lessons")
    .select("id,slug,title,lesson_order,module_title,is_preview")
    .eq("course_id", course.id)
    .order("lesson_order", { ascending: true });

  const lessonRows = (allLessons ?? []) as LessonRow[];

  /* ── current lesson ── */
  const { data: lesson } = await supabaseAdmin
    .from("lessons")
    .select("id,title,content_md,lesson_order,module_title,is_preview")
    .eq("course_id", course.id)
    .eq("slug", lessonSlug)
    .single();

  if (!lesson) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="text-center">
          <p className="text-slate-600">Lesson not found.</p>
          <Link
            className="mt-4 inline-block text-sm text-blue-600 hover:underline"
            href={`/courses/${course.slug}`}
          >
            ← Back to course
          </Link>
        </div>
      </div>
    );
  }

  /* ── entitlement ── */
  const { user, hasPaid } = await getUserAndHasPaid(course.id);
  const unlocked = course.is_free || lesson.is_preview || hasPaid;

  /* ── progress ── */
  let completedLessonIds: string[] = [];
  if (user) {
    const { data: progressRows } = await supabase
      .from("lesson_progress")
      .select("lesson_id")
      .eq("user_id", user.id);

    completedLessonIds = (progressRows ?? []).map(
      (r: { lesson_id: string }) => r.lesson_id
    );
  }

  const isCurrentCompleted = completedLessonIds.includes(lesson.id);

  /* ── prev / next ── */
  const currentIndex = lessonRows.findIndex((l) => l.slug === lessonSlug);
  const prevLesson = currentIndex > 0 ? lessonRows[currentIndex - 1] : null;
  const nextLesson =
    currentIndex < lessonRows.length - 1 ? lessonRows[currentIndex + 1] : null;

  const canOpenLesson = (l: LessonRow) =>
    course.is_free || l.is_preview || hasPaid;

  /* ── reading time ── */
  const readingTime = estimateReadingTime(lesson.content_md);

  /* ── locked state ── */
  if (!unlocked) {
    return (
      <div className="flex min-h-screen bg-white">
        <LessonSidebar
          courseSlug={course.slug}
          courseTitle={course.title}
          lessons={lessonRows}
          currentSlug={lessonSlug}
          completedIds={completedLessonIds}
          isFree={course.is_free}
          hasPaid={hasPaid}
        />

        <div className="flex flex-1 flex-col">
          <div className="mx-auto w-full max-w-3xl px-6 py-10 lg:px-10">
            <Link
              className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700"
              href={`/courses/${course.slug}`}
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Course outline
            </Link>

            <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-100">
                <Lock className="h-5 w-5 text-slate-400" />
              </div>

              <h1 className="mt-4 text-2xl font-semibold text-slate-900">
                {lesson.title}
              </h1>
              <p className="mt-2 text-sm text-slate-600">
                This lesson is locked. Purchase the course to unlock all lessons.
              </p>

              <div className="mt-6 rounded-xl border bg-slate-50 p-5">
                <div className="text-lg font-semibold text-slate-900">
                  Unlock {course.title}
                </div>
                <div className="mt-1 text-sm text-slate-600">
                  ₱{course.price_php?.toLocaleString("en-PH")} · lifetime access
                </div>

                {!user ? (
                  <Link
                    className="mt-4 inline-flex w-full max-w-xs items-center justify-center rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700"
                    href="/auth/login"
                  >
                    Login to purchase
                  </Link>
                ) : (
                  <form action="/api/paymongo/checkout" method="POST" className="mt-4">
                    <input type="hidden" name="courseId" value={course.id} />
                    <button className="inline-flex w-full max-w-xs items-center justify-center rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700">
                      Buy ₱{course.price_php?.toLocaleString("en-PH")}
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* ── unlocked: render lesson ── */
  return (
    <div className="flex min-h-screen bg-white">
      {/* Sidebar */}
      <LessonSidebar
        courseSlug={course.slug}
        courseTitle={course.title}
        lessons={lessonRows}
        currentSlug={lessonSlug}
        completedIds={completedLessonIds}
        isFree={course.is_free}
        hasPaid={hasPaid}
      />

      {/* Main content */}
      <div className="flex flex-1 flex-col">
        {/* Top bar */}
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-100 bg-white/90 px-6 py-3 backdrop-blur-sm lg:px-10">
          <Link
            className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700"
            href={`/courses/${course.slug}`}
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">{course.title}</span>
            <span className="sm:hidden">Back</span>
          </Link>

          <div className="text-xs text-slate-400">
            {lesson.lesson_order} of {lessonRows.length}
          </div>
        </div>

        {/* Lesson body */}
        <article className="mx-auto w-full max-w-3xl px-6 py-12 lg:px-10">
          {/* Lesson header */}
          <header className="mb-10">
            <h1 className="text-[2.25rem] font-bold leading-tight tracking-tight text-slate-900">
              {lesson.title}
            </h1>

            {/* Subtitle: Module · Lesson # · Reading time */}
            <div className="mt-3 flex flex-wrap items-center gap-x-2 text-sm text-slate-400">
              {lesson.module_title && (
                <>
                  <span className="font-medium text-teal-600">
                    {lesson.module_title}
                  </span>
                  <span>·</span>
                </>
              )}
              <span>Lesson {lesson.lesson_order}</span>
              <span>·</span>
              <span>{readingTime} min read</span>
            </div>

            {/* Divider */}
            <div className="mt-8 border-b border-slate-100" />
          </header>

          {/* Markdown content */}
          <LessonContent markdown={lesson.content_md} />

          {/* Mark complete */}
          {user && (
            <div className="mt-12 flex justify-center border-t border-slate-100 pt-8">
              <MarkCompleteButton
                lessonId={lesson.id}
                initialCompleted={isCurrentCompleted}
              />
            </div>
          )}

          {/* Prev / Next */}
          <nav className="mt-10 grid grid-cols-2 gap-4 border-t border-slate-100 pt-8">
            {prevLesson ? (
              <Link
                href={
                  canOpenLesson(prevLesson)
                    ? `/courses/${course.slug}/lessons/${prevLesson.slug}`
                    : "#"
                }
                className={`group flex items-center gap-3 rounded-xl border p-4 transition ${
                  canOpenLesson(prevLesson)
                    ? "border-slate-200 bg-white hover:border-slate-300 hover:shadow-sm"
                    : "cursor-not-allowed border-slate-100 bg-slate-50 opacity-50"
                }`}
              >
                <ChevronLeft className="h-4 w-4 shrink-0 text-slate-300 transition group-hover:text-slate-500" />
                <div className="min-w-0">
                  <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                    Previous
                  </div>
                  <div className="mt-0.5 truncate text-sm font-medium text-slate-700">
                    {prevLesson.title}
                  </div>
                </div>
              </Link>
            ) : (
              <div />
            )}

            {nextLesson ? (
              <Link
                href={
                  canOpenLesson(nextLesson)
                    ? `/courses/${course.slug}/lessons/${nextLesson.slug}`
                    : "#"
                }
                className={`group flex items-center justify-end gap-3 rounded-xl border p-4 transition ${
                  canOpenLesson(nextLesson)
                    ? "border-slate-200 bg-white hover:border-slate-300 hover:shadow-sm"
                    : "cursor-not-allowed border-slate-100 bg-slate-50 opacity-50"
                }`}
              >
                <div className="min-w-0 text-right">
                  <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                    Next
                  </div>
                  <div className="mt-0.5 truncate text-sm font-medium text-slate-700">
                    {nextLesson.title}
                  </div>
                </div>
                <ChevronRight className="h-4 w-4 shrink-0 text-slate-300 transition group-hover:text-slate-500" />
              </Link>
            ) : (
              <div />
            )}
          </nav>
        </article>
      </div>
    </div>
  );
}