from flask import Blueprint, jsonify
from sqlalchemy import func

from extensions import db
from models import User, RecognitionHistory
from ml.predictor import predictor
from auth_utils import admin_required

admin_bp = Blueprint("admin", __name__)


@admin_bp.get("/overview")
@admin_required
def overview():
    total_users = db.session.query(func.count(User.id)).scalar() or 0
    total_predictions = db.session.query(func.count(RecognitionHistory.id)).scalar() or 0

    top_sign_row = (
        db.session.query(
            RecognitionHistory.prediction, func.count(RecognitionHistory.id).label("count")
        )
        .group_by(RecognitionHistory.prediction)
        .order_by(func.count(RecognitionHistory.id).desc())
        .first()
    )
    most_common_sign = top_sign_row[0] if top_sign_row else None

    avg_confidence = db.session.query(func.avg(RecognitionHistory.confidence)).scalar()

    return jsonify(
        {
            "success": True,
            "total_users": total_users,
            "total_predictions": total_predictions,
            "most_common_sign": most_common_sign,
            "average_confidence": round(float(avg_confidence), 4) if avg_confidence else 0,
            "model": predictor.status(),
        }
    ), 200


@admin_bp.get("/users")
@admin_required
def list_users():
    users = User.query.order_by(User.created_at.desc()).all()
    result = []
    for u in users:
        prediction_count = (
            db.session.query(func.count(RecognitionHistory.id))
            .filter(RecognitionHistory.user_id == u.id)
            .scalar()
            or 0
        )
        row = u.to_public_dict()
        row["prediction_count"] = prediction_count
        result.append(row)
    return jsonify({"success": True, "users": result}), 200


@admin_bp.get("/model")
@admin_required
def model_info():
    return jsonify({"success": True, **predictor.status()}), 200
