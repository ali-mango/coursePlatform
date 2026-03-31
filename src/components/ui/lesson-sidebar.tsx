// src/components/ui/lesson-sidebar.tsx
"use client";

import Link from "next/link";
import { useState } from "react";
import {
  CheckCircle2,
  Circle,
  Lock,
  Menu,
  X,
  BookOpen,
} from "lucide-react";

type LessonRow = {
  id: string;
  slug: string;
  title: string;
  lesson_order: number;
  module_title: string | null;
  is_preview: boolean;
};

interface LessonSidebarProps {
  courseSlug: string;
  courseTitle: string;
  lessons: LessonRow[];
  currentSlug: string;
  completedIds: string[];
  isFree: boolean;
  hasPaid: boolean;
}

export function LessonSidebar({
  courseSlug,
  courseTitle,
  lessons,
  currentSlug,
  completedIds,
  isFree,
  hasPaid,
}: LessonSidebarProps) {
  const [open, setOpen] = useState(false);

  const canOpen = (l: LessonRow) => isFree || l.is_preview || hasPaid;

  // Group by module
  const modules = new Map<string, LessonRow[]>();
  for (const l of lessons) {
    const key = (l.module_title || "Lessons").trim();
    if (!modules.has(key)) modules.set(key, []);
    modules.get(key)!.push(l);
  }

  const completedCount = lessons.filter((l) => completedIds.includes(l.id)).length;
  const percent = lessons.length
    ? Math.round((completedCount / lessons.length) * 100)
    : 0;

  const sidebarContent = (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="border-b px-4 py-4">
        <Link
          href={`/courses/${courseSlug}`}
          className="flex items-center gap-2 text-sm font-semibold text-slate-900 hover:text-blue-600"
        >
          <BookOpen className="h-4 w-4" />
          <span className="truncate">{courseTitle}</span>
        </Link>

        {/* Progress bar */}
        <div className="mt-3 flex items-center gap-3">
          <div className="h-1.5 flex-1 rounded-full bg-slate-200">
            <div
              className="h-1.5 rounded-full bg-blue-600 transition-all"
              style={{ width: `${percent}%` }}
            />
          </div>
          <span className="text-xs font-medium text-slate-500">
            {completedCount}/{lessons.length}
          </span>
        </div>
      </div>

      {/* Lesson list */}
      <nav className="flex-1 overflow-y-auto px-2 py-3">
        {Array.from(modules.entries()).map(([moduleTitle, rows], idx) => (
          <div key={moduleTitle} className={idx > 0 ? "mt-4" : ""}>
            <div className="px-2 pb-1.5 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
              {moduleTitle}
            </div>

            {rows.map((l) => {
              const isCurrent = l.slug === currentSlug;
              const isCompleted = completedIds.includes(l.id);
              const locked = !canOpen(l);

              return (
                <Link
                  key={l.slug}
                  href={
                    locked
                      ? "#"
                      : `/courses/${courseSlug}/lessons/${l.slug}`
                  }
                  onClick={() => setOpen(false)}
                  className={`flex items-center gap-2.5 rounded-lg px-2 py-2 text-sm transition ${
                    isCurrent
                      ? "bg-blue-50 font-medium text-blue-700"
                      : locked
                        ? "cursor-not-allowed text-slate-400"
                        : "text-slate-700 hover:bg-slate-100"
                  }`}
                >
                  {/* Status icon */}
                  {locked ? (
                    <Lock className="h-3.5 w-3.5 shrink-0 text-slate-300" />
                  ) : isCompleted ? (
                    <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-emerald-500" />
                  ) : isCurrent ? (
                    <Circle className="h-3.5 w-3.5 shrink-0 fill-blue-600 text-blue-600" />
                  ) : (
                    <Circle className="h-3.5 w-3.5 shrink-0 text-slate-300" />
                  )}

                  <span className="truncate">{l.title}</span>
                </Link>
              );
            })}
          </div>
        ))}
      </nav>
    </div>
  );

  return (
    <>
      {/* Mobile toggle */}
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-4 left-4 z-30 flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 text-white shadow-lg lg:hidden"
        aria-label="Open lesson menu"
      >
        <Menu className="h-5 w-5" />
      </button>

      {/* Mobile drawer overlay */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Mobile drawer */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-72 transform border-r bg-white transition-transform duration-200 lg:hidden ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <button
          onClick={() => setOpen(false)}
          className="absolute right-3 top-3 rounded-md p-1 text-slate-400 hover:text-slate-600"
          aria-label="Close menu"
        >
          <X className="h-5 w-5" />
        </button>
        {sidebarContent}
      </aside>

      {/* Desktop sidebar */}
      <aside className="hidden w-72 shrink-0 border-r bg-white lg:block">
        <div className="sticky top-0 h-screen overflow-hidden">
          {sidebarContent}
        </div>
      </aside>
    </>
  );
}