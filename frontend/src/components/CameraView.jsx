import React from "react";
import { Video, VideoOff, RefreshCw, AlertCircle } from "lucide-react";
import Button from "./Button.jsx";

const STATUS_COPY = {
  idle: { label: "Camera off", tone: "bg-ink-soft" },
  loading: { label: "Starting camera…", tone: "bg-amber-500 animate-pulse-slow" },
  "camera-denied": { label: "Camera access denied", tone: "bg-rose-500" },
  "no-camera": { label: "No camera detected", tone: "bg-rose-500" },
  error: { label: "Tracking error", tone: "bg-rose-500" },
  ready: { label: "Camera ready", tone: "bg-emerald-500" },
  "no-hand": { label: "No hand detected", tone: "bg-amber-500" },
  detected: { label: "Hand detected", tone: "bg-emerald-500 animate-pulse-slow" },
};

export default function CameraView({
  videoRef,
  canvasRef,
  status,
  onStart,
  onStop,
  landmarkCount = 0,
}) {
  const copy = STATUS_COPY[status] || STATUS_COPY.idle;
  const isRunning = !["idle", "camera-denied", "no-camera", "error"].includes(status);

  return (
    <div>
      <div className="relative aspect-video w-full overflow-hidden rounded-2xl bg-slate-900">
        <video
          ref={videoRef}
          className="absolute inset-0 h-full w-full -scale-x-100 object-cover opacity-90"
          autoPlay
          playsInline
          muted
          aria-hidden="true"
        />
        <canvas
          ref={canvasRef}
          className="absolute inset-0 h-full w-full -scale-x-100"
          aria-hidden="true"
        />

        {!isRunning && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-slate-900/90 px-6 text-center">
            {status === "camera-denied" ? (
              <>
                <AlertCircle className="text-rose-400" size={28} />
                <p className="max-w-xs text-sm text-slate-200">
                  Camera access is required for real-time sign translation.
                </p>
                <Button size="sm" onClick={onStart} icon={RefreshCw}>
                  Try Again
                </Button>
              </>
            ) : status === "no-camera" ? (
              <>
                <AlertCircle className="text-rose-400" size={28} />
                <p className="text-sm text-slate-200">No camera detected.</p>
              </>
            ) : (
              <>
                <Video className="text-slate-400" size={28} />
                <p className="text-sm text-slate-300">Show a sign to the camera.</p>
                <Button size="sm" onClick={onStart}>
                  Start Camera
                </Button>
              </>
            )}
          </div>
        )}

        <div className="absolute left-3 top-3 flex items-center gap-2 rounded-full bg-black/50 px-3 py-1.5 text-xs font-medium text-white backdrop-blur">
          <span className={`h-2 w-2 rounded-full ${copy.tone}`} aria-hidden="true" />
          <span>{copy.label}</span>
        </div>

        {status === "detected" && (
          <div className="absolute bottom-3 left-3 rounded-full bg-black/50 px-3 py-1.5 text-xs font-medium text-white backdrop-blur">
            Landmarks detected: {landmarkCount}
          </div>
        )}
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        <Button size="sm" variant="secondary" onClick={onStart} disabled={isRunning} icon={Video}>
          Start Camera
        </Button>
        <Button size="sm" variant="ghost" onClick={onStop} disabled={!isRunning} icon={VideoOff}>
          Stop Camera
        </Button>
      </div>
    </div>
  );
}
