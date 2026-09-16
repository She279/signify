from flask import Blueprint, request, jsonify, g

from extensions import db
from models import RecognitionHistory
from auth_utils import login_required

history_bp = Blueprint("history", __name__)


@history_bp.get("")
@login_required
def list_history():
    query = RecognitionHistory.query.filter_by(user_id=g.current_user.id)

    range_filter = request.args.get("range")  # today | week | month | all
    if range_filter and range_filter != "all":
        from datetime import datetime, timedelta, timezone

        now = datetime.now(timezone.utc)
        if range_filter == "today":
            since = now.replace(hour=0, minute=0, second=0, microsecond=0)
        elif range_filter == "week":
            since = now - timedelta(days=7)
        elif range_filter == "month":
            since = now - timedelta(days=30)
        else:
            since = None
        if since:
            query = query.filter(RecognitionHistory.created_at >= since)

    search = request.args.get("q")
    if search:
        query = query.filter(RecognitionHistory.prediction.ilike(f"%{search}%"))

    items = query.order_by(RecognitionHistory.created_at.desc()).limit(500).all()
    return jsonify({"success": True, "history": [item.to_dict() for item in items]}), 200


@history_bp.post("")
@login_required
def create_history():
    data = request.get_json(silent=True) or {}
    prediction = (data.get("prediction") or "").strip()
    confidence = data.get("confidence")

    if not prediction:
        return jsonify({"success": False, "error": "Missing 'prediction'."}), 400
    if not isinstance(confidence, (int, float)):
        return jsonify({"success": False, "error": "Missing or invalid 'confidence'."}), 400

    entry = RecognitionHistory(
        user_id=g.current_user.id, prediction=prediction, confidence=float(confidence)
    )
    db.session.add(entry)
    db.session.commit()
    return jsonify({"success": True, "history": entry.to_dict()}), 201


@history_bp.delete("/<int:history_id>")
@login_required
def delete_one(history_id):
    entry = RecognitionHistory.query.filter_by(
        id=history_id, user_id=g.current_user.id
    ).first()
    if not entry:
        return jsonify({"success": False, "error": "History entry not found."}), 404

    db.session.delete(entry)
    db.session.commit()
    return jsonify({"success": True}), 200


@history_bp.delete("")
@login_required
def clear_history():
    RecognitionHistory.query.filter_by(user_id=g.current_user.id).delete()
    db.session.commit()
    return jsonify({"success": True}), 200
