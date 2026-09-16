import re

from flask import Blueprint, request, jsonify, g

from extensions import db
from models import User
from auth_utils import generate_token, login_required

auth_bp = Blueprint("auth", __name__)

EMAIL_RE = re.compile(r"^[^@\s]+@[^@\s]+\.[^@\s]+$")


@auth_bp.post("/register")
def register():
    data = request.get_json(silent=True) or {}
    name = (data.get("name") or "").strip()
    email = (data.get("email") or "").strip().lower()
    password = data.get("password") or ""

    if not name or len(name) < 2:
        return jsonify({"success": False, "error": "Please enter your full name."}), 400
    if not EMAIL_RE.match(email):
        return jsonify({"success": False, "error": "Please enter a valid email address."}), 400
    if len(password) < 6:
        return jsonify({"success": False, "error": "Password must be at least 6 characters."}), 400

    if User.query.filter_by(email=email).first():
        return jsonify({"success": False, "error": "An account with this email already exists."}), 409

    user = User(name=name, email=email)
    user.set_password(password)
    db.session.add(user)
    db.session.commit()

    token = generate_token(user.id)
    return jsonify({"success": True, "token": token, "user": user.to_public_dict()}), 201


@auth_bp.post("/login")
def login():
    data = request.get_json(silent=True) or {}
    email = (data.get("email") or "").strip().lower()
    password = data.get("password") or ""

    user = User.query.filter_by(email=email).first()
    if not user or not user.check_password(password):
        return jsonify({"success": False, "error": "Invalid email or password."}), 401

    token = generate_token(user.id)
    return jsonify({"success": True, "token": token, "user": user.to_public_dict()}), 200


@auth_bp.get("/me")
@login_required
def me():
    return jsonify({"success": True, "user": g.current_user.to_public_dict()}), 200


@auth_bp.post("/logout")
@login_required
def logout():
    # Stateless JWT: logout is handled client-side by discarding the token.
    return jsonify({"success": True, "message": "Logged out."}), 200
