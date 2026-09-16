import React, { useCallback, useEffect, useRef, useState } from "react";
import { Volume2, Trash2 } from "lucide-react";
import Card from "../components/Card.jsx";
import Button from "../components/Button.jsx";
import CameraView from "../components/CameraView.jsx";
import PredictionCard from "../components/PredictionCard.jsx";
import { useHandTracking } from "../hooks/useHandTracking.js";
import { useSpeech } from "../hooks/useSpeech.js";
import { useToast } from "../components/Toast.jsx";
import * as api from "../services/api.js";

const PREDICT_INTERVAL_MS = 400;

export default function Translator() {
  const [prediction, setPrediction] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [sentence, setSentence] = useState([]);
  const [recent, setRecent] = useState([]);
  const lastLandmarksRef = useRef(null);
  const lastRequestAtRef = useRef(0);
  const { speak } = useSpeech();
  const { toast } = useToast();

  const onResults = useCallback((points) => {
    lastLandmarksRef.current = points;
  }, []);

  const { videoRef, canvasRef, status, landmarks, start, stop } = useHandTracking({ onResults });

  // Poll for predictions at a controlled interval instead of sending every frame.
  useEffect(() => {
    const interval = setInterval(async () => {
      const points = lastLandmarksRef.current;
      const now = Date.now();
      if (!points || now - lastRequestAtRef.current < PREDICT_INTERVAL_MS) return;
      lastRequestAtRef.current = now;

      setAnalyzing(true);
      try {
        const result = await api.predictSign(points, { save: true });
        setPrediction(result);
        setRecent((prev) => [
          { prediction: result.prediction, confidence: result.confidence, time: new Date() },
          ...prev,
        ].slice(0, 8));
      } catch (err) {
        // Silently skip failed frames; surface only persistent errors
      } finally {
        setAnalyzing(false);
      }
    }, PREDICT_INTERVAL_MS);

    return () => clearInterval(interval);
  }, []);

  function handleSpeak() {
    if (prediction) speak(prediction.prediction);
  }

  function handleCopy() {
    if (!prediction) return;
    navigator.clipboard?.writeText(prediction.prediction);
    toast("Copied to clipboard.", "success", 2000);
  }

  function handleClear() {
    setPrediction(null);
  }

  function handleAddToSentence() {
    if (!prediction) return;
    setSentence((prev) => [...prev, prediction.prediction]);
  }

  function speakSentence() {
    if (sentence.length) speak(sentence.join(" "));
  }

  return (
    <div className="mx-auto max-w-7xl px-5 py-10 lg:px-8">
      <div className="mb-8">
        <h1 className="font-display text-2xl font-bold text-ink sm:text-3xl">Live Translator</h1>
        <p className="mt-1.5 text-ink-soft">Show a sign to the camera to begin recognition.</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* LEFT: Camera */}
        <Card className="p-5">
          <CameraView
            videoRef={videoRef}
            canvasRef={canvasRef}
            status={status}
            onStart={start}
            onStop={stop}
            landmarkCount={landmarks?.length || 0}
          />
          {analyzing && (
            <p className="mt-3 text-xs font-medium text-brand-600">Analyzing gesture…</p>
          )}
        </Card>

        {/* RIGHT: Recognition panel */}
        <div className="flex flex-col gap-6">
          <Card className="p-6">
            <PredictionCard
              prediction={prediction}
              onSpeak={handleSpeak}
              onCopy={handleCopy}
              onClear={handleClear}
              onAddToSentence={handleAddToSentence}
            />
          </Card>

          <Card className="p-6">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="font-display text-base font-semibold text-ink">Sentence Builder</h2>
              {sentence.length > 0 && (
                <button
                  onClick={() => setSentence([])}
                  className="text-xs font-medium text-ink-soft hover:text-ink"
                >
                  Clear Sentence
                </button>
              )}
            </div>
            <div className="min-h-[52px] rounded-xl surface-2 px-4 py-3 text-sm text-ink">
              {sentence.length ? sentence.join(" ") : (
                <span className="text-ink-soft">Add recognized signs to build a sentence.</span>
              )}
            </div>
            <div className="mt-3 flex gap-2">
              <Button size="sm" variant="secondary" icon={Volume2} disabled={!sentence.length} onClick={speakSentence}>
                Speak Sentence
              </Button>
              <Button size="sm" variant="ghost" icon={Trash2} disabled={!sentence.length} onClick={() => setSentence([])}>
                Clear Sentence
              </Button>
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="mb-3 font-display text-base font-semibold text-ink">Recent Predictions</h2>
            {recent.length === 0 ? (
              <p className="text-sm text-ink-soft">Predictions will appear here as they're recognized.</p>
            ) : (
              <ul className="space-y-2">
                {recent.map((r, i) => (
                  <li
                    key={i}
                    className="flex items-center justify-between rounded-xl px-3 py-2 text-sm hover:bg-black/[0.02] dark:hover:bg-white/[0.03]"
                  >
                    <span className="font-medium text-ink">{r.prediction}</span>
                    <span className="text-xs text-ink-soft">
                      {Math.round(r.confidence * 100)}% ·{" "}
                      {r.time.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" })}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
