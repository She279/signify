import React, { useEffect, useState } from "react";
import {
  Users,
  BarChart3,
  Gauge,
  Sparkles,
  Database,
  Cpu,
  ShieldCheck,
} from "lucide-react";
import Card from "../components/Card.jsx";
import StatCard from "../components/StatCard.jsx";
import { Skeleton } from "../components/Loader.jsx";
import { ErrorState } from "../components/EmptyState.jsx";
import * as api from "../services/api.js";

const TABS = ["Overview", "Users", "Dataset", "Model"];

export default function Admin() {
  const [tab, setTab] = useState("Overview");
  const [overview, setOverview] = useState(null);
  const [users, setUsers] = useState(null);
  const [dataset, setDataset] = useState(null);
  const [model, setModel] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    api.getAdminOverview().then(setOverview).catch((e) => setError(e.message));
    api.getAdminUsers().then((r) => setUsers(r.users)).catch(() => {});
    api.getDatasetStats().then(setDataset).catch(() => {});
    api.getAdminModelInfo().then(setModel).catch(() => {});
  }, []);

  if (error) {
    return (
      <ErrorState
        title="Admin access unavailable"
        description={error}
      />
    );
  }

  return (
    <div>
      <div className="flex items-center gap-2">
        <ShieldCheck className="text-brand-600" size={22} />
        <h1 className="font-display text-2xl font-bold text-ink">Admin Panel</h1>
      </div>
      <p className="mt-1 text-sm text-ink-soft">
        Overview of Signify's users, predictions, dataset, and model status.
      </p>

      <div className="mt-6 flex gap-1 overflow-x-auto rounded-xl surface-2 p-1">
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`whitespace-nowrap rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
              tab === t ? "bg-brand-600 text-white" : "text-ink-soft hover:text-ink"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === "Overview" && (
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard icon={Users} label="Total Users" value={overview ? overview.total_users : "—"} />
          <StatCard icon={BarChart3} label="Total Predictions" value={overview ? overview.total_predictions : "—"} />
          <StatCard icon={Sparkles} label="Most Common Sign" value={overview ? overview.most_common_sign || "—" : "—"} />
          <StatCard
            icon={Gauge}
            label="Average Confidence"
            value={overview ? `${Math.round((overview.average_confidence || 0) * 100)}%` : "—"}
          />
        </div>
      )}

      {tab === "Users" && (
        <Card className="mt-6 overflow-x-auto p-0">
          {!users ? (
            <div className="space-y-3 p-6">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          ) : (
            <table className="w-full text-left text-sm">
              <thead className="border-b border-[rgb(var(--border))] text-xs uppercase tracking-wide text-ink-soft">
                <tr>
                  <th className="px-5 py-3 font-medium">Name</th>
                  <th className="px-5 py-3 font-medium">Email</th>
                  <th className="px-5 py-3 font-medium">Joined</th>
                  <th className="px-5 py-3 font-medium">Predictions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[rgb(var(--border))]">
                {users.map((u) => (
                  <tr key={u.id}>
                    <td className="px-5 py-3 font-medium text-ink">{u.name}</td>
                    <td className="px-5 py-3 text-ink-soft">{u.email}</td>
                    <td className="px-5 py-3 text-ink-soft">
                      {new Date(u.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-5 py-3 text-ink-soft">{u.prediction_count}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </Card>
      )}

      {tab === "Dataset" && (
        <Card className="mt-6 p-6">
          <div className="mb-4 flex items-center gap-2 text-brand-600">
            <Database size={18} />
            <h2 className="font-display text-base font-semibold text-ink">Collected Dataset</h2>
          </div>
          <div className="grid grid-cols-2 gap-6 text-center sm:grid-cols-2">
            <div>
              <p className="font-display text-2xl font-bold text-ink">{dataset?.samples ?? 0}</p>
              <p className="text-xs text-ink-soft">Samples</p>
            </div>
            <div>
              <p className="font-display text-2xl font-bold text-ink">{dataset?.labels ?? 0}</p>
              <p className="text-xs text-ink-soft">Labels</p>
            </div>
          </div>
          {dataset?.by_label && Object.keys(dataset.by_label).length > 0 && (
            <ul className="mt-6 space-y-1.5 text-sm">
              {Object.entries(dataset.by_label).map(([label, count]) => (
                <li key={label} className="flex justify-between text-ink-soft">
                  <span className="text-ink">{label}</span>
                  <span>{count}</span>
                </li>
              ))}
            </ul>
          )}
          <p className="mt-6 text-xs text-ink-soft">
            Collect more samples using the Data Collection flow (POST to
            <code className="mx-1 rounded bg-black/5 px-1.5 py-0.5 dark:bg-white/10">/api/dataset/collect</code>
            ), then download via
            <code className="mx-1 rounded bg-black/5 px-1.5 py-0.5 dark:bg-white/10">/api/dataset/download</code>.
          </p>
        </Card>
      )}

      {tab === "Model" && (
        <Card className="mt-6 p-6">
          <div className="mb-4 flex items-center gap-2 text-brand-600">
            <Cpu size={18} />
            <h2 className="font-display text-base font-semibold text-ink">Model Status</h2>
          </div>
          {!model ? (
            <Skeleton className="h-20 w-full" />
          ) : (
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-ink-soft">Status</span>
                <span className={`font-medium ${model.loaded ? "text-emerald-500" : "text-amber-500"}`}>
                  {model.loaded ? "Loaded" : "Not Loaded (Demo Mode)"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-ink-soft">Version</span>
                <span className="font-medium text-ink">{model.model_version}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-ink-soft">Labels</span>
                <span className="font-medium text-ink">{model.labels?.length ?? 0}</span>
              </div>
              <p className="pt-2 text-xs text-ink-soft">
                See <code className="rounded bg-black/5 px-1.5 py-0.5 dark:bg-white/10">backend/MODEL_SETUP.md</code>{" "}
                to add a trained <code className="rounded bg-black/5 px-1.5 py-0.5 dark:bg-white/10">sign_model.pkl</code>.
              </p>
            </div>
          )}
        </Card>
      )}
    </div>
  );
}
