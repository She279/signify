from flask import Blueprint, request, jsonify, g

from auth_utils import login_required
from ml.predictor import predictor
from ml.preprocessing import InvalidLandmarksError
from extensions import db
from models import RecognitionHistory

prediction_bp = Blueprint("prediction", __name__)


@prediction_bp.post("/predict")
@login_required
def predict():
    data = request.get_json(silent=True) or {}
    landmarks = data.get("landmarks")

    if landmarks is None:
        return jsonify({"success": False, "error": "Missing 'landmarks' in request body."}), 400

    try:
        result = predictor.predict(landmarks)
    except InvalidLandmarksError as exc:
        return jsonify({"success": False, "error": str(exc)}), 422
    except Exception:  # noqa: BLE001 - never leak internals to the client
        return jsonify(
            {"success": False, "error": "The model could not process this gesture. Please try again."}
        ), 500

    # Optionally persist to history in the same call if the client asks for it
    if data.get("save", False):
        entry = RecognitionHistory(
            user_id=g.current_user.id,
            prediction=result["prediction"],
            confidence=result["confidence"],
        )
        db.session.add(entry)
        db.session.commit()
        result["history_id"] = entry.id

    return jsonify(result), 200


@prediction_bp.get("/model-status")
@login_required
def model_status():
    return jsonify({"success": True, **predictor.status()}), 200
