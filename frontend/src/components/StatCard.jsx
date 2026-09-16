import React from "react";
import Card from "./Card.jsx";

export default function StatCard({ icon: Icon, label, value, hint, accent = "text-brand-600" }) {
  return (
    <Card className="p-5">
      <div className="flex items-center gap-3">
        {Icon && (
          <div className={`flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 dark:bg-brand-500/10 ${accent}`}>
            <Icon size={20} />
          </div>
        )}
        <div>
          <p className="font-display text-2xl font-semibold text-ink">{value}</p>
          <p className="text-xs text-ink-soft">{label}</p>
        </div>
      </div>
      {hint && <p className="mt-3 text-xs text-ink-soft">{hint}</p>}
    </Card>
  );
}
