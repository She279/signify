import React, { useEffect, useState } from "react";
import Card from "../components/Card.jsx";
import Button from "../components/Button.jsx";
import { useSpeech } from "../hooks/useSpeech.js";
import { useTheme } from "../hooks/useTheme.js";
import { useToast } from "../components/Toast.jsx";

const DEFAULT_SETTINGS = {
  speechEnabled: true,
  autoSpeak: false,
  confidenceThreshold: 0.6,
  voiceName: "",
  rate: 1,
  pitch: 1,
  volume: 1,
};

function loadSettings() {
  try {
    const raw = localStorage.getItem("signify_settings");
    return raw ? { ...DEFAULT_SETTINGS, ...JSON.parse(raw) } : DEFAULT_SETTINGS;
  } catch {
    return DEFAULT_SETTINGS;
  }
}

function Toggle({ checked, onChange, label, description }) {
  return (
    <div className="flex items-center justify-between py-3">
      <div>
        <p className="text-sm font-medium text-ink">{label}</p>
        {description && <p className="text-xs text-ink-soft">{description}</p>}
      </div>
      <button
        role="switch"
        aria-checked={checked}
        aria-label={label}
        onClick={() => onChange(!checked)}
        className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${
          checked ? "bg-brand-600" : "bg-black/10 dark:bg-white/15"
        }`}
      >
        <span
          className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${
            checked ? "translate-x-5" : "translate-x-0.5"
          }`}
        />
      </button>
    </div>
  );
}

export default function Settings() {
  const [settings, setSettings] = useState(loadSettings);
  const { voices, speak } = useSpeech();
  const { theme, setTheme } = useTheme();
  const { toast } = useToast();

  function update(patch) {
    setSettings((prev) => ({ ...prev, ...patch }));
  }

  function save() {
    localStorage.setItem("signify_settings", JSON.stringify(settings));
    toast("Settings saved.", "success", 2000);
  }

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="font-display text-2xl font-bold text-ink">Settings</h1>

      <Card className="mt-6 divide-y divide-[rgb(var(--border))] p-6">
        <Toggle
          checked={settings.speechEnabled}
          onChange={(v) => update({ speechEnabled: v })}
          label="Speech enabled"
          description="Allow Signify to speak recognized signs aloud."
        />
        <Toggle
          checked={settings.autoSpeak}
          onChange={(v) => update({ autoSpeak: v })}
          label="Auto speak"
          description="Automatically speak each new recognized sign."
        />
      </Card>

      <Card className="mt-6 p-6">
        <h2 className="mb-4 font-display text-base font-semibold text-ink">Recognition</h2>
        <label className="mb-1.5 block text-sm font-medium text-ink">
          Confidence threshold: {Math.round(settings.confidenceThreshold * 100)}%
        </label>
        <input
          type="range"
          min={0.3}
          max={0.95}
          step={0.05}
          value={settings.confidenceThreshold}
          onChange={(e) => update({ confidenceThreshold: parseFloat(e.target.value) })}
          className="w-full accent-brand-600"
        />
        <p className="mt-1.5 text-xs text-ink-soft">
          Predictions below this confidence are shown but flagged as low-confidence.
        </p>
      </Card>

      <Card className="mt-6 p-6">
        <h2 className="mb-4 font-display text-base font-semibold text-ink">Speech</h2>

        <label className="mb-1.5 block text-sm font-medium text-ink">Voice</label>
        <select
          value={settings.voiceName}
          onChange={(e) => update({ voiceName: e.target.value })}
          className="mb-4 w-full rounded-xl border border-[rgb(var(--border))] bg-transparent px-3.5 py-2.5 text-sm text-ink"
        >
          <option value="">System default</option>
          {voices.map((v) => (
            <option key={v.name} value={v.name}>
              {v.name} ({v.lang})
            </option>
          ))}
        </select>

        <div className="grid gap-4 sm:grid-cols-3">
          {["rate", "pitch", "volume"].map((key) => (
            <div key={key}>
              <label className="mb-1.5 block text-xs font-medium capitalize text-ink-soft">
                {key}: {settings[key]}
              </label>
              <input
                type="range"
                min={key === "pitch" ? 0 : 0.5}
                max={2}
                step={0.1}
                value={settings[key]}
                onChange={(e) => update({ [key]: parseFloat(e.target.value) })}
                className="w-full accent-brand-600"
              />
            </div>
          ))}
        </div>

        <Button
          variant="secondary"
          size="sm"
          className="mt-4"
          onClick={() => speak("This is how Signify will sound.", settings)}
        >
          Test Voice
        </Button>
      </Card>

      <Card className="mt-6 p-6">
        <h2 className="mb-4 font-display text-base font-semibold text-ink">Theme</h2>
        <div className="flex gap-2">
          {["light", "dark"].map((t) => (
            <button
              key={t}
              onClick={() => setTheme(t)}
              className={`flex-1 rounded-xl border px-4 py-2.5 text-sm font-medium capitalize transition-colors ${
                theme === t
                  ? "border-brand-500 bg-brand-50 text-brand-700 dark:bg-brand-500/10 dark:text-brand-300"
                  : "border-[rgb(var(--border))] text-ink-soft"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </Card>

      <Button className="mt-6" onClick={save}>
        Save Settings
      </Button>
    </div>
  );
}
