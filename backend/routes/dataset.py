"""
Optional module for collecting labeled landmark samples so you can train
your own Random Forest model later. Samples are appended to a CSV file at
backend/database/dataset.csv with columns:

label, x1, y1, z1, x2, y2, z2, ..., x21, y21, z21
"""

import csv
import os

from flask import Blueprint, request, jsonify, send_file

from auth_utils import login_required
from ml.preprocessing import validate_landmarks, InvalidLandmarksError

dataset_bp = Blueprint("dataset", __name__)

BASE_DIR = os.path.abspath(os.path.dirname(os.path.dirname(__file__)))
DATASET_PATH = os.path.join(BASE_DIR, "database", "dataset.csv")


def _header():
    header = ["label"]
    for i in range(1, 22):
        header += [f"x{i}", f"y{i}", f"z{i}"]
    return header


@dataset_bp.post("/collect")
@login_required
def collect_sample():
    data = request.get_json(silent=True) or {}
    label = (data.get("label") or "").strip().upper()
    landmarks = data.get("landmarks")

    if not label:
        return jsonify({"success": False, "error": "Missing 'label'."}), 400

    try:
        validate_landmarks(landmarks)
    except InvalidLandmarksError as exc:
        return jsonify({"success": False, "error": str(exc)}), 422

    row = [label]
    for point in landmarks:
        row += [point["x"], point["y"], point["z"]]

    file_exists = os.path.exists(DATASET_PATH)
    os.makedirs(os.path.dirname(DATASET_PATH), exist_ok=True)
    with open(DATASET_PATH, "a", newline="", encoding="utf-8") as f:
        writer = csv.writer(f)
        if not file_exists:
            writer.writerow(_header())
        writer.writerow(row)

    return jsonify({"success": True, "message": f"Sample for '{label}' saved."}), 201


@dataset_bp.get("/download")
@login_required
def download_dataset():
    if not os.path.exists(DATASET_PATH):
        return jsonify({"success": False, "error": "No dataset collected yet."}), 404
    return send_file(DATASET_PATH, as_attachment=True, download_name="signify_dataset.csv")


@dataset_bp.get("/stats")
@login_required
def dataset_stats():
    if not os.path.exists(DATASET_PATH):
        return jsonify({"success": True, "samples": 0, "labels": 0, "by_label": {}}), 200

    counts = {}
    with open(DATASET_PATH, "r", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        for row in reader:
            counts[row["label"]] = counts.get(row["label"], 0) + 1

    total = sum(counts.values())
    return jsonify(
        {"success": True, "samples": total, "labels": len(counts), "by_label": counts}
    ), 200
