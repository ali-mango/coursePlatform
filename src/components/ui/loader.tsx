"use client";

export default function AuthLoader({
  label = "Please wait...",
}: {
  label?: string;
}) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/55 backdrop-blur-sm">
      <div className="flex flex-col items-center">
        <div className="auth-loader" aria-hidden="true">
          <div className="auth-loader-circle" />
          <div className="auth-loader-circle" />
          <div className="auth-loader-circle" />
          <div className="auth-loader-circle" />
          <div className="auth-loader-circle" />
          <div className="auth-loader-circle" />
          <div className="auth-loader-circle" />
          <div className="auth-loader-circle" />
        </div>

        <p className="mt-8 text-sm font-medium text-white/85">{label}</p>
      </div>
    </div>
  );
}