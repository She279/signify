import React from "react";
import { Volume2, Trash2 } from "lucide-react";

function formatDate(iso) {
  const d = new Date(iso);
  return d.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
}
function formatTime(iso) {
  const d = new Date(iso);
  return d.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" });
}

export default function HistoryTable({ items, onSpeak, onDelete }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-[rgb(var(--border))] text-xs uppercase tracking-wide text-ink-soft">
            <th className="py-3 pr-4 font-medium">Sign</th>
            <th className="py-3 pr-4 font-medium">Confidence</th>
            <th className="py-3 pr-4 font-medium">Date</th>
            <th className="py-3 pr-4 font-medium">Time</th>
            <th className="py-3 pr-4 font-medium">Actions</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr
              key={item.id}
              className="border-b border-[rgb(var(--border))] last:border-0 hover:bg-black/[0.02] dark:hover:bg-white/[0.03]"
            >
              <td className="py-3 pr-4 font-medium text-ink">{item.prediction}</td>
              <td className="py-3 pr-4 text-ink-soft">{Math.round(item.confidence * 100)}%</td>
              <td className="py-3 pr-4 text-ink-soft">{formatDate(item.created_at)}</td>
              <td className="py-3 pr-4 text-ink-soft">{formatTime(item.created_at)}</td>
              <td className="py-3 pr-4">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onSpeak(item.prediction)}
                    aria-label={`Speak ${item.prediction}`}
                    className="rounded-lg p-1.5 text-brand-600 hover:bg-brand-50 dark:hover:bg-brand-500/10"
                  >
                    <Volume2 size={16} />
                  </button>
                  <button
                    onClick={() => onDelete(item.id)}
                    aria-label={`Delete ${item.prediction} entry`}
                    className="rounded-lg p-1.5 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
