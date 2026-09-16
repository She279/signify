import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Wraps MediaPipe Hands (loaded globally via CDN script tags in index.html)
 * to detect a hand from a <video> element, draw the 21 landmarks onto a
 * <canvas> overlay, and report the current landmark set upward.
 *
 * Status values: "idle" | "loading" | "camera-denied" | "no-camera" | "ready" | "no-hand" | "detected" | "error"
 */
export function useHandTracking({ onResults } = {}) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const handsRef = useRef(null);
  const cameraRef = useRef(null);
  const rafRef = useRef(null);

  const [status, setStatus] = useState("idle");
  const [landmarks, setLandmarks] = useState(null);
  const [handedness, setHandedness] = useState(null);

  const drawResults = useCallback((results) => {
    const canvas = canvasRef.current;
    const video = videoRef.current;
    if (!canvas || !video) return;

    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;
    const ctx = canvas.getContext("2d");
    ctx.save();
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const hasHand = results.multiHandLandmarks && results.multiHandLandmarks.length > 0;

    if (hasHand) {
      const handLm = results.multiHandLandmarks[0];

      if (window.drawConnectors && window.HAND_CONNECTIONS) {
        window.drawConnectors(ctx, handLm, window.HAND_CONNECTIONS, {
          color: "rgba(129, 140, 248, 0.9)",
          lineWidth: 3,
        });
      }
      if (window.drawLandmarks) {
        window.drawLandmarks(ctx, handLm, {
          color: "rgba(199, 210, 254, 0.95)",
          fillColor: "rgba(99, 102, 241, 1)",
          lineWidth: 1,
          radius: 3,
        });
      }

      const points = handLm.map((p) => ({ x: p.x, y: p.y, z: p.z }));
      setLandmarks(points);
      setHandedness(results.multiHandedness?.[0]?.label ?? null);
      setStatus("detected");
      onResults?.(points);
    } else {
      setLandmarks(null);
      setHandedness(null);
      setStatus((prev) => (prev === "error" || prev === "camera-denied" ? prev : "no-hand"));
      onResults?.(null);
    }

    ctx.restore();
  }, [onResults]);

  const start = useCallback(async () => {
    setStatus("loading");

    if (!navigator.mediaDevices?.getUserMedia) {
      setStatus("no-camera");
      return;
    }

    if (!window.Hands || !window.Camera) {
      setStatus("error");
      return;
    }

    try {
      if (!handsRef.current) {
        const hands = new window.Hands({
          locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`,
        });
        hands.setOptions({
          maxNumHands: 1,
          modelComplexity: 1,
          minDetectionConfidence: 0.6,
          minTrackingConfidence: 0.6,
        });
        hands.onResults(drawResults);
        handsRef.current = hands;
      }

      const video = videoRef.current;
      if (!video) return;

      const camera = new window.Camera(video, {
        onFrame: async () => {
          if (handsRef.current) {
            await handsRef.current.send({ image: video });
          }
        },
        width: 640,
        height: 480,
      });

      cameraRef.current = camera;
      await camera.start();
      setStatus((prev) => (prev === "detected" ? prev : "ready"));
    } catch (err) {
      if (err?.name === "NotAllowedError" || err?.name === "PermissionDeniedError") {
        setStatus("camera-denied");
      } else if (err?.name === "NotFoundError") {
        setStatus("no-camera");
      } else {
        setStatus("error");
      }
    }
  }, [drawResults]);

  const stop = useCallback(() => {
    cameraRef.current?.stop?.();
    cameraRef.current = null;
    const video = videoRef.current;
    if (video?.srcObject) {
      video.srcObject.getTracks().forEach((track) => track.stop());
      video.srcObject = null;
    }
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    setStatus("idle");
    setLandmarks(null);
    setHandedness(null);
  }, []);

  useEffect(() => stop, [stop]);

  return { videoRef, canvasRef, status, landmarks, handedness, start, stop };
}
