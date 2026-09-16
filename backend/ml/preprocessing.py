"""
Landmark preprocessing for the Signify Random Forest classifier.

Ensure this preprocessing exactly matches the preprocessing used when
training sign_model.pkl. If you trained your model with a different
normalization scheme (different reference point, no z-axis, scale by a
different bone length, etc.) you MUST update this file to match, or the
trained model will receive out-of-distribution input and predict badly.

Expected raw input: a list of 21 landmark dicts, each with x, y, z in the
[0, 1] (or roughly [-1, 1] for z) range as produced by MediaPipe Hands.
"""

from __future__ import annotations

import numpy as np

NUM_LANDMARKS = 21
WRIST_INDEX = 0  # MediaPipe landmark 0 is the wrist


class InvalidLandmarksError(ValueError):
    """Raised when the incoming landmark payload is malformed."""


def validate_landmarks(landmarks) -> None:
    if not isinstance(landmarks, list):
        raise InvalidLandmarksError("landmarks must be a list")

    if len(landmarks) != NUM_LANDMARKS:
        raise InvalidLandmarksError(
            f"Expected {NUM_LANDMARKS} landmarks, received {len(landmarks)}"
        )

    for i, point in enumerate(landmarks):
        if not isinstance(point, dict):
            raise InvalidLandmarksError(f"landmark[{i}] must be an object with x, y, z")
        for axis in ("x", "y", "z"):
            if axis not in point:
                raise InvalidLandmarksError(f"landmark[{i}] missing '{axis}'")
            if not isinstance(point[axis], (int, float)):
                raise InvalidLandmarksError(f"landmark[{i}].{axis} must be numeric")


def normalize_landmarks(landmarks: list[dict]) -> np.ndarray:
    """
    Normalize 21 (x, y, z) landmarks relative to the wrist, then scale so the
    hand's overall size does not affect the feature vector.

    Steps:
      1. Translate all points so the wrist (landmark 0) sits at the origin.
      2. Scale by the maximum absolute coordinate value so features are
         roughly within [-1, 1], making the model robust to hand size /
         distance from camera.
      3. Flatten into a single 1D feature vector of length 63:
         [x1, y1, z1, x2, y2, z2, ..., x21, y21, z21]

    Returns:
        np.ndarray of shape (63,) dtype float32
    """
    validate_landmarks(landmarks)

    coords = np.array(
        [[p["x"], p["y"], p["z"]] for p in landmarks], dtype=np.float32
    )  # shape (21, 3)

    wrist = coords[WRIST_INDEX].copy()
    relative = coords - wrist

    max_value = np.max(np.abs(relative))
    if max_value > 1e-6:
        relative = relative / max_value

    return relative.flatten()  # shape (63,)


def landmarks_to_feature_row(landmarks: list[dict]) -> np.ndarray:
    """Convenience wrapper returning a (1, 63) row suitable for model.predict()."""
    return normalize_landmarks(landmarks).reshape(1, -1)
