import React from "react";
import { Loader2 } from "lucide-react";

export function Spinner({ size = 20, className = "" }) {
  return <Loader2 size={size} className={`animate-spin text-brand-600 ${className}`} />;
}

export function Skeleton({ className = "" }) {
  return (
    <div
      className={`animate-pulse-slow rounded-lg bg-black/5 dark:bg-white/10 ${className}`}
      aria-hidden="true"
    />
  );
}

export function FullPageLoader({ label = "Loading Signify…" }) {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center gap-3 text-ink-soft">
      <Spinner size={28} />
      <p className="text-sm">{label}</p>
    </div>
  );
}
