"""
Model loading + prediction wrapper.

If backend/ml/model/sign_model.pkl exists, it is loaded with joblib and used
for real predictions. If it does not exist, a deterministic DEMO predictor is
used instead so the full application (frontend, API, DB, history) can still
be exercised end-to-end before a trained model is available.

See MODEL_SETUP.md for how to plug in your trained model.
"""

from __future__ import annotations

import json
import os
import random
import time

import joblib
import numpy as np

from config import Config
from ml.preprocessing import landmarks_to_feature_row, InvalidLandmarksError

DEMO_LABELS = ["HELLO", "THANK YOU", "YES", "NO", "PLEASE", "HELP", "GOOD MORNING"]


class SignPredictor:
    def __init__(self):
        self.model = None
        self.labels: list[str] = []
        self.is_demo = True
        self.model_version = "demo-v0"
        self._load()

    def _load(self) -> None:
        if os.path.exists(Config.MODEL_PATH):
            try:
                self.model = joblib.load(Config.MODEL_PATH)
                self.is_demo = False
                self.model_version = "trained-v1"

                if os.path.exists(Config.LABELS_PATH):
                    with open(Config.LABELS_PATH, "r", encoding="utf-8") as f:
                        self.labels = json.load(f)
                elif hasattr(self.model, "classes_"):
                    self.labels = [str(c) for c in self.model.classes_]
                else:
                    self.labels = DEMO_LABELS

                print(f"[predictor] Loaded trained model from {Config.MODEL_PATH}")
            except Exception as exc:  # noqa: BLE001 - we want a clean fallback
                print(f"[predictor] Failed to load model ({exc}); using demo mode.")
                self.model = None
                self.is_demo = True
                self.labels = DEMO_LABELS
        else:
            print(
                "[predictor] No trained model found at "
                f"{Config.MODEL_PATH}. Running in DEMO mode. "
                "See backend/MODEL_SETUP.md."
            )
            self.is_demo = True
            self.labels = DEMO_LABELS

    def status(self) -> dict:
        return {
            "loaded": self.model is not None,
            "is_demo": self.is_demo,
            "model_version": self.model_version,
            "labels": self.labels,
        }

    def predict(self, landmarks: list[dict]) -> dict:
        """
        Returns:
            {
              "success": True,
              "prediction": "HELLO",
              "label": "HELLO",
              "confidence": 0.946,
              "is_demo": bool
            }
        Raises InvalidLandmarksError on bad input.
        """
        features = landmarks_to_feature_row(landmarks)  # validates + normalizes

        if self.is_demo or self.model is None:
            return self._demo_predict(features)

        return self._model_predict(features)

    def _model_predict(self, features: np.ndarray) -> dict:
        prediction = self.model.predict(features)[0]

        confidence = 1.0
        if hasattr(self.model, "predict_proba"):
            probabilities = self.model.predict_proba(features)[0]
            confidence = float(np.max(probabilities))

        label = str(prediction)
        return {
            "success": True,
            "prediction": label,
            "label": label,
            "confidence": round(confidence, 4),
            "is_demo": False,
        }

    def _demo_predict(self, features: np.ndarray) -> dict:
        """
        Deterministic-ish demo prediction so the UI has something believable
        to show before a real model is trained. Uses a hash of the feature
        vector so the same hand pose tends to return the same demo label.
        """
        seed = int(abs(np.sum(features) * 1000)) % len(DEMO_LABELS)
        label = DEMO_LABELS[seed]
        # Wobble the confidence a little so repeated demo calls don't look static
        confidence = 0.75 + (abs(np.sin(time.time() + seed)) * 0.2)

        return {
            "success": True,
            "prediction": label,
            "label": label,
            "confidence": round(min(confidence, 0.99), 4),
            "is_demo": True,
        }


# Singleton instance used by routes
predictor = SignPredictor()
