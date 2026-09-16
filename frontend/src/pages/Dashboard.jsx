import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { BarChart3, Calendar, Gauge, GraduationCap, Camera, ArrowRight, Volume2 } from "lucide-react";
import Card from "../components/Card.jsx";
import StatCard from "../components/StatCard.jsx";
import Button from "../components/Button.jsx";
import { Skeleton } from "../components/Loader.jsx";
import { EmptyState } from "../components/EmptyState.jsx";
import { useAuth } from "../hooks/useAuth.jsx";
import { useSpeech } from "../hooks/useSpeech.js";
import * as api from "../services/api.js";

export default function Dashboard() {
  const { user } = useAuth();
  const { speak } = useSpeech();
  const [history, setHistory] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .getHistory()
      .then((res) => setHistory(res.history))
      .catch(() => setHistory([]))
      .finally(() => setLoading(false));
  }, []);

  const total = history?.length || 0;
  const today = history
    ? history.filter((h) => new Date(h.created_at).toDateString() === new Date().toDateString()).length
    : 0;
  const avgConfidence = history?.length
    ? Math.round((history.reduce((s, h) => s + h.confidence, 0) / history.length) * 100)
    : 0;
  const uniqueSigns = history ? new Set(history.map((h) => h.prediction)).size : 0;

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-ink">Welcome back, {user?.name?.split(" ")[0]}!</h1>
      <p className="mt-1 text-sm text-ink-soft">Here's your communication activity.</p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={BarChart3} label="Total Translations" value={loading ? "—" : total} />
        <StatCard icon={Calendar} label="Today's Translations" value={loading ? "—" : today} />
        <StatCard icon={Gauge} label="Average Confidence" value={loading ? "—" : `${avgConfidence}%`} />
        <StatCard icon={GraduationCap} label="Signs Learned" value={loading ? "—" : uniqueSigns} />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-1 flex flex-col justify-between p-6">
          <div>
            <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-brand-600 text-white">
              <Camera size={20} />
            </div>
            <h2 className="font-display text-lg font-semibold text-ink">Start Translating</h2>
            <p className="mt-1.5 text-sm text-ink-soft">
              Open the live translator and show a sign to your webcam.
            </p>
          </div>
          <Button as={Link} to="/translator" className="mt-6 w-full" icon={ArrowRight}>
            Open Translator
          </Button>
        </Card>

        <Card className="p-6 lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-display text-lg font-semibold text-ink">Recent History</h2>
            <Link to="/history" className="text-sm font-medium text-brand-600 hover:underline">
              View all
            </Link>
          </div>

          {loading ? (
            <div className="space-y-3">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          ) : history.length === 0 ? (
            <EmptyState
              title="No translations yet"
              description="Your recognized signs will show up here once you start translating."
              action={
                <Button as={Link} to="/translator" size="sm">
                  Start Translating
                </Button>
              }
            />
          ) : (
            <ul className="divide-y divide-[rgb(var(--border))]">
              {history.slice(0, 6).map((item) => (
                <li key={item.id} className="flex items-center justify-between py-3">
                  <div>
                    <p className="text-sm font-medium text-ink">{item.prediction}</p>
                    <p className="text-xs text-ink-soft">
                      {Math.round(item.confidence * 100)}% ·{" "}
                      {new Date(item.created_at).toLocaleString(undefined, {
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                  <button
                    onClick={() => speak(item.prediction)}
                    aria-label={`Speak ${item.prediction}`}
                    className="rounded-lg p-2 text-brand-600 hover:bg-brand-50 dark:hover:bg-brand-500/10"
                  >
                    <Volume2 size={16} />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>
    </div>
  );
}
