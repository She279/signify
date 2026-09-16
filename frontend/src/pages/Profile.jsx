import React, { useEffect, useState } from "react";
import Card from "../components/Card.jsx";
import Input from "../components/Input.jsx";
import Button from "../components/Button.jsx";
import { useAuth } from "../hooks/useAuth.jsx";
import { useToast } from "../components/Toast.jsx";
import * as api from "../services/api.js";

export default function Profile() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [stats, setStats] = useState(null);
  const [name, setName] = useState(user?.name || "");
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    api
      .getHistory()
      .then((res) => {
        const history = res.history;
        const counts = {};
        history.forEach((h) => (counts[h.prediction] = (counts[h.prediction] || 0) + 1));
        const mostCommon = Object.entries(counts).sort((a, b) => b[1] - a[1])[0]?.[0] || "—";
        const avg = history.length
          ? Math.round((history.reduce((s, h) => s + h.confidence, 0) / history.length) * 100)
          : 0;
        setStats({ total: history.length, mostCommon, avg });
      })
      .catch(() => setStats({ total: 0, mostCommon: "—", avg: 0 }));
  }, []);

  function handleSaveProfile(e) {
    e.preventDefault();
    // NOTE: profile editing is UI-ready; wire this to a PATCH /api/auth/me
    // endpoint if you extend the backend to support it.
    setEditing(false);
    toast("Profile updated locally. Connect a backend endpoint to persist this.", "info");
  }

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="font-display text-2xl font-bold text-ink">Profile</h1>

      <Card className="mt-6 p-6">
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-brand-100 text-xl font-semibold text-brand-700 dark:bg-brand-500/20 dark:text-brand-300">
            {user?.name?.[0]?.toUpperCase()}
          </div>
          <div>
            <p className="font-display text-lg font-semibold text-ink">{user?.name}</p>
            <p className="text-sm text-ink-soft">{user?.email}</p>
            <p className="mt-1 text-xs text-ink-soft">
              Joined{" "}
              {user?.created_at &&
                new Date(user.created_at).toLocaleDateString(undefined, {
                  month: "long",
                  year: "numeric",
                  day: "numeric",
                })}
            </p>
          </div>
        </div>

        {editing ? (
          <form onSubmit={handleSaveProfile} className="mt-6 space-y-4">
            <Input label="Full Name" value={name} onChange={(e) => setName(e.target.value)} />
            <div className="flex gap-2">
              <Button type="submit" size="sm">
                Save Changes
              </Button>
              <Button type="button" variant="secondary" size="sm" onClick={() => setEditing(false)}>
                Cancel
              </Button>
            </div>
          </form>
        ) : (
          <Button variant="secondary" size="sm" className="mt-6" onClick={() => setEditing(true)}>
            Edit Profile
          </Button>
        )}
      </Card>

      <Card className="mt-6 p-6">
        <h2 className="mb-4 font-display text-base font-semibold text-ink">Statistics</h2>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="font-display text-xl font-bold text-ink">{stats?.total ?? "—"}</p>
            <p className="text-xs text-ink-soft">Total translations</p>
          </div>
          <div>
            <p className="font-display text-xl font-bold text-ink">{stats?.mostCommon ?? "—"}</p>
            <p className="text-xs text-ink-soft">Most recognized sign</p>
          </div>
          <div>
            <p className="font-display text-xl font-bold text-ink">{stats?.avg ?? 0}%</p>
            <p className="text-xs text-ink-soft">Average confidence</p>
          </div>
        </div>
      </Card>

      <Card className="mt-6 p-6">
        <h2 className="mb-1 font-display text-base font-semibold text-ink">Change Password</h2>
        <p className="mb-4 text-sm text-ink-soft">
          Password changes aren't wired to the backend yet — add a
          `PATCH /api/auth/password` route to enable this.
        </p>
        <Button variant="secondary" size="sm" disabled>
          Change Password
        </Button>
      </Card>
    </div>
  );
}
