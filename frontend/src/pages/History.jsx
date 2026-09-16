import React, { useEffect, useMemo, useState } from "react";
import { Search, Trash2 } from "lucide-react";
import Card from "../components/Card.jsx";
import Button from "../components/Button.jsx";
import Input from "../components/Input.jsx";
import Modal from "../components/Modal.jsx";
import HistoryTable from "../components/HistoryTable.jsx";
import { Skeleton } from "../components/Loader.jsx";
import { EmptyState, ErrorState } from "../components/EmptyState.jsx";
import { useSpeech } from "../hooks/useSpeech.js";
import { useToast } from "../components/Toast.jsx";
import * as api from "../services/api.js";

const RANGE_OPTIONS = [
  { value: "all", label: "All Time" },
  { value: "today", label: "Today" },
  { value: "week", label: "This Week" },
  { value: "month", label: "This Month" },
];

export default function History() {
  const [items, setItems] = useState(null);
  const [error, setError] = useState(null);
  const [range, setRange] = useState("all");
  const [query, setQuery] = useState("");
  const [confirmClear, setConfirmClear] = useState(false);
  const { speak } = useSpeech();
  const { toast } = useToast();

  function load() {
    setError(null);
    setItems(null);
    api
      .getHistory({ range, q: query || undefined })
      .then((res) => setItems(res.history))
      .catch((err) => setError(err.message));
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [range]);

  const filtered = useMemo(() => {
    if (!items) return [];
    if (!query) return items;
    return items.filter((i) => i.prediction.toLowerCase().includes(query.toLowerCase()));
  }, [items, query]);

  async function handleDelete(id) {
    try {
      await api.deleteHistoryItem(id);
      setItems((prev) => prev.filter((i) => i.id !== id));
      toast("Entry deleted.", "success", 2000);
    } catch (err) {
      toast(err.message, "error");
    }
  }

  async function handleClearAll() {
    try {
      await api.clearHistory();
      setItems([]);
      toast("History cleared.", "success");
    } catch (err) {
      toast(err.message, "error");
    } finally {
      setConfirmClear(false);
    }
  }

  return (
    <div>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-ink">Your communication history</h1>
          <p className="mt-1 text-sm text-ink-soft">Every sign Signify has recognized for you.</p>
        </div>
        <Button
          variant="danger"
          size="sm"
          icon={Trash2}
          disabled={!items?.length}
          onClick={() => setConfirmClear(true)}
        >
          Clear History
        </Button>
      </div>

      <Card className="p-5">
        <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-soft" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && load()}
              placeholder="Search recognized signs…"
              className="w-full rounded-xl border border-[rgb(var(--border))] bg-transparent py-2.5 pl-9 pr-3 text-sm text-ink placeholder:text-ink-soft/70 focus:border-brand-500"
            />
          </div>
          <div className="flex gap-1.5 overflow-x-auto">
            {RANGE_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                onClick={() => setRange(opt.value)}
                className={`shrink-0 rounded-lg px-3 py-2 text-xs font-medium transition-colors ${
                  range === opt.value
                    ? "bg-brand-600 text-white"
                    : "surface-2 text-ink-soft hover:text-ink"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {error ? (
          <ErrorState description={error} onRetry={load} />
        ) : items === null ? (
          <div className="space-y-3">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        ) : filtered.length === 0 ? (
          <EmptyState
            title="No history yet"
            description="Recognized signs will appear here once you start translating."
          />
        ) : (
          <HistoryTable items={filtered} onSpeak={speak} onDelete={handleDelete} />
        )}
      </Card>

      <Modal
        open={confirmClear}
        onClose={() => setConfirmClear(false)}
        title="Clear all history?"
        footer={
          <>
            <Button variant="secondary" size="sm" onClick={() => setConfirmClear(false)}>
              Cancel
            </Button>
            <Button variant="danger" size="sm" onClick={handleClearAll}>
              Clear History
            </Button>
          </>
        }
      >
        This permanently deletes every recognized sign in your history. This action cannot be undone.
      </Modal>
    </div>
  );
}
