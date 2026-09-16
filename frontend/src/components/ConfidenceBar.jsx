import React from "react";
import { motion } from "framer-motion";

export default function ConfidenceBar({ value = 0, label = "Confidence" }) {
  const pct = Math.round(Math.max(0, Math.min(1, value)) * 100);
  const tone =
    pct >= 80 ? "bg-emerald-500" : pct >= 55 ? "bg-brand-500" : "bg-amber-500";

  return (
    <div className="w-full">
      <div className="mb-1.5 flex items-center justify-between text-xs text-ink-soft">
        <span>{label}</span>
        <span className="font-medium text-ink">{pct}%</span>
      </div>
      <div
        className="h-2 w-full overflow-hidden rounded-full bg-black/5 dark:bg-white/10"
        role="progressbar"
        aria-valuenow={pct}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={label}
      >
        <motion.div
          className={`h-full rounded-full ${tone}`}
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        />
      </div>
    </div>
  );
}
