// src/components/ui/dashboard-account.tsx
"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  User,
  Lock,
  BookOpen,
  CheckCircle2,
  Trash2,
  Loader2,
  AlertTriangle,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";

/* ── types ── */
type CourseProgress = {
  courseTitle: string;
  courseSlug: string;
  totalLessons: number;
  completedLessons: number;
  isFree: boolean;
};

type PurchasedCourse = {
  title: string;
  slug: string;
  pricePHP: number | null;
  purchasedAt: string;
};

interface DashboardAccountProps {
  userEmail: string;
  userName: string;
  createdAt: string;
  purchasedCourses: PurchasedCourse[];
  courseProgress: CourseProgress[];
}

/* ── tabs ── */
const tabs = [
  { id: "profile", label: "Profile", icon: User },
  { id: "password", label: "Password", icon: Lock },
  { id: "purchases", label: "Purchases", icon: BookOpen },
  { id: "progress", label: "Progress", icon: CheckCircle2 },
  { id: "danger", label: "Delete Account", icon: Trash2 },
] as const;

type TabId = (typeof tabs)[number]["id"];

/* ── helpers ── */
function peso(n: number | null) {
  return `₱${Number(n || 0).toLocaleString("en-PH")}`;
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-PH", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

/* ── main component ── */
export function DashboardAccount({
  userEmail,
  userName,
  createdAt,
  purchasedCourses,
  courseProgress,
}: DashboardAccountProps) {
  const [activeTab, setActiveTab] = useState<TabId>("profile");

  return (
    <div className="mt-10">
      <h2 className="text-2xl font-semibold tracking-tight text-slate-900">
        Account Settings
      </h2>
      <p className="mt-1 text-sm text-slate-600">
        Manage your profile, password, and account preferences.
      </p>

      <div className="mt-6 grid gap-6 lg:grid-cols-[220px_1fr]">
        {/* Tab nav */}
        <nav className="flex flex-row gap-1 overflow-x-auto lg:flex-col">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            const isDanger = tab.id === "danger";

            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2.5 whitespace-nowrap rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                  isActive
                    ? isDanger
                      ? "bg-red-50 text-red-700"
                      : "bg-blue-50 text-blue-700"
                    : isDanger
                      ? "text-red-500 hover:bg-red-50/50"
                      : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                <Icon className="h-4 w-4 shrink-0" />
                {tab.label}
              </button>
            );
          })}
        </nav>

        {/* Tab content */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          {activeTab === "profile" && (
            <ProfileTab
              email={userEmail}
              name={userName}
              createdAt={createdAt}
            />
          )}
          {activeTab === "password" && <PasswordTab />}
          {activeTab === "purchases" && (
            <PurchasesTab purchases={purchasedCourses} />
          )}
          {activeTab === "progress" && (
            <ProgressTab progress={courseProgress} />
          )}
          {activeTab === "danger" && <DeleteAccountTab email={userEmail} />}
        </div>
      </div>
    </div>
  );
}

/* ── Profile Tab ── */
function ProfileTab({
  email,
  name,
  createdAt,
}: {
  email: string;
  name: string;
  createdAt: string;
}) {
  const [fullName, setFullName] = useState(name);
  const [isPending, startTransition] = useTransition();
  const [saved, setSaved] = useState(false);
  const router = useRouter();

  async function handleSave() {
    startTransition(async () => {
      const res = await fetch("/api/account/update-profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fullName }),
      });
      if (res.ok) {
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
        router.refresh();
      }
    });
  }

  return (
    <div>
      <h3 className="text-lg font-semibold text-slate-900">Profile Information</h3>
      <p className="mt-1 text-sm text-slate-500">
        Update your name. Your email cannot be changed.
      </p>

      <div className="mt-6 space-y-5">
        <div>
          <label className="block text-sm font-medium text-slate-700">
            Full Name
          </label>
          <input
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="mt-1.5 w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-slate-900 outline-none focus:border-blue-300 focus:ring-2 focus:ring-blue-100"
            placeholder="Your full name"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700">
            Email
          </label>
          <input
            type="email"
            value={email}
            disabled
            className="mt-1.5 w-full rounded-xl border border-slate-100 bg-slate-50 px-4 py-2.5 text-sm text-slate-500"
          />
          <p className="mt-1 text-xs text-slate-400">
            Email cannot be changed
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700">
            Member Since
          </label>
          <p className="mt-1.5 text-sm text-slate-600">{formatDate(createdAt)}</p>
        </div>

        <button
          onClick={handleSave}
          disabled={isPending || fullName === name}
          className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700 disabled:opacity-50"
        >
          {isPending ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : saved ? (
            <CheckCircle2 className="h-4 w-4" />
          ) : null}
          {saved ? "Saved!" : "Save Changes"}
        </button>
      </div>
    </div>
  );
}

/* ── Password Tab ── */
function PasswordTab() {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  async function handleChangePassword() {
    if (newPassword.length < 6) {
      setMessage({ type: "error", text: "Password must be at least 6 characters" });
      return;
    }
    if (newPassword !== confirmPassword) {
      setMessage({ type: "error", text: "Passwords don't match" });
      return;
    }

    startTransition(async () => {
      const res = await fetch("/api/account/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ newPassword }),
      });

      if (res.ok) {
        setMessage({ type: "success", text: "Password updated successfully" });
        setNewPassword("");
        setConfirmPassword("");
      } else {
        const data = await res.json();
        setMessage({ type: "error", text: data.error || "Failed to update password" });
      }
      setTimeout(() => setMessage(null), 4000);
    });
  }

  return (
    <div>
      <h3 className="text-lg font-semibold text-slate-900">Change Password</h3>
      <p className="mt-1 text-sm text-slate-500">
        Update your password. Use at least 6 characters.
      </p>

      <div className="mt-6 space-y-5">
        <div>
          <label className="block text-sm font-medium text-slate-700">
            New Password
          </label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="mt-1.5 w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-slate-900 outline-none focus:border-blue-300 focus:ring-2 focus:ring-blue-100"
            placeholder="••••••••"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700">
            Confirm New Password
          </label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="mt-1.5 w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-slate-900 outline-none focus:border-blue-300 focus:ring-2 focus:ring-blue-100"
            placeholder="••••••••"
          />
        </div>

        {message && (
          <div
            className={`rounded-xl px-4 py-3 text-sm ${
              message.type === "success"
                ? "bg-emerald-50 text-emerald-700"
                : "bg-red-50 text-red-700"
            }`}
          >
            {message.text}
          </div>
        )}

        <button
          onClick={handleChangePassword}
          disabled={isPending || !newPassword}
          className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700 disabled:opacity-50"
        >
          {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
          Update Password
        </button>
      </div>
    </div>
  );
}

/* ── Purchases Tab ── */
function PurchasesTab({ purchases }: { purchases: PurchasedCourse[] }) {
  return (
    <div>
      <h3 className="text-lg font-semibold text-slate-900">My Purchases</h3>
      <p className="mt-1 text-sm text-slate-500">
        Courses you&apos;ve purchased with lifetime access.
      </p>

      {purchases.length === 0 ? (
        <div className="mt-8 text-center">
          <BookOpen className="mx-auto h-10 w-10 text-slate-300" />
          <p className="mt-3 text-sm text-slate-500">No purchases yet</p>
          <Link
            href="/courses"
            className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-blue-600 hover:text-blue-700"
          >
            Browse courses <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      ) : (
        <div className="mt-6 space-y-3">
          {purchases.map((p) => (
            <Link
              key={p.slug}
              href={`/courses/${p.slug}`}
              className="flex items-center justify-between rounded-xl border border-slate-200 p-4 transition hover:border-slate-300 hover:bg-slate-50"
            >
              <div>
                <div className="font-medium text-slate-900">{p.title}</div>
                <div className="mt-0.5 text-xs text-slate-500">
                  Purchased {formatDate(p.purchasedAt)} · {peso(p.pricePHP)}
                </div>
              </div>
              <ArrowRight className="h-4 w-4 text-slate-400" />
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

/* ── Progress Tab ── */
function ProgressTab({ progress }: { progress: CourseProgress[] }) {
  return (
    <div>
      <h3 className="text-lg font-semibold text-slate-900">Lesson Progress</h3>
      <p className="mt-1 text-sm text-slate-500">
        Track your learning across all courses.
      </p>

      {progress.length === 0 ? (
        <div className="mt-8 text-center">
          <CheckCircle2 className="mx-auto h-10 w-10 text-slate-300" />
          <p className="mt-3 text-sm text-slate-500">
            No progress yet — start a lesson!
          </p>
        </div>
      ) : (
        <div className="mt-6 space-y-5">
          {progress.map((cp) => {
            const percent = cp.totalLessons
              ? Math.round((cp.completedLessons / cp.totalLessons) * 100)
              : 0;

            return (
              <Link
                key={cp.courseSlug}
                href={`/courses/${cp.courseSlug}`}
                className="block rounded-xl border border-slate-200 p-4 transition hover:border-slate-300 hover:bg-slate-50"
              >
                <div className="flex items-center justify-between">
                  <div className="font-medium text-slate-900">
                    {cp.courseTitle}
                  </div>
                  <span
                    className={`text-xs font-semibold ${
                      percent === 100 ? "text-emerald-600" : "text-blue-600"
                    }`}
                  >
                    {percent}%
                  </span>
                </div>

                <div className="mt-2 text-xs text-slate-500">
                  {cp.completedLessons} of {cp.totalLessons} lessons completed
                </div>

                <div className="mt-2 h-2 w-full rounded-full bg-slate-100">
                  <div
                    className={`h-2 rounded-full transition-all ${
                      percent === 100 ? "bg-emerald-500" : "bg-blue-500"
                    }`}
                    style={{ width: `${percent}%` }}
                  />
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}

/* ── Delete Account Tab ── */
function DeleteAccountTab({ email }: { email: string }) {
  const [confirmText, setConfirmText] = useState("");
  const [isPending, startTransition] = useTransition();
  const [showConfirm, setShowConfirm] = useState(false);
  const router = useRouter();

  const canDelete = confirmText === "DELETE";

  async function handleDelete() {
    startTransition(async () => {
      const res = await fetch("/api/account/delete", {
        method: "DELETE",
      });
      if (res.ok) {
        router.push("/");
        router.refresh();
      }
    });
  }

  return (
    <div>
      <h3 className="text-lg font-semibold text-red-700">Delete Account</h3>
      <p className="mt-1 text-sm text-slate-500">
        Permanently delete your account and all associated data.
      </p>

      <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-5">
        <div className="flex items-start gap-3">
          <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-red-500" />
          <div>
            <div className="text-sm font-semibold text-red-800">
              This action is permanent
            </div>
            <p className="mt-1 text-sm leading-6 text-red-700">
              Deleting your account will permanently remove your profile,
              lesson progress, and purchase history. This cannot be undone.
            </p>
          </div>
        </div>
      </div>

      {!showConfirm ? (
        <button
          onClick={() => setShowConfirm(true)}
          className="mt-5 inline-flex items-center gap-2 rounded-xl border border-red-200 px-4 py-2.5 text-sm font-medium text-red-600 transition hover:bg-red-50"
        >
          <Trash2 className="h-4 w-4" />
          I want to delete my account
        </button>
      ) : (
        <div className="mt-5 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700">
              Type <span className="font-bold text-red-600">DELETE</span> to confirm
            </label>
            <input
              type="text"
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              className="mt-1.5 w-full max-w-xs rounded-xl border border-red-200 px-4 py-2.5 text-sm text-slate-900 outline-none focus:border-red-300 focus:ring-2 focus:ring-red-100"
              placeholder="DELETE"
            />
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleDelete}
              disabled={!canDelete || isPending}
              className="inline-flex items-center gap-2 rounded-xl bg-red-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-red-700 disabled:opacity-50"
            >
              {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
              Delete My Account
            </button>
            <button
              onClick={() => {
                setShowConfirm(false);
                setConfirmText("");
              }}
              className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}