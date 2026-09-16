"""
Lightweight JWT-based auth helpers.

The token is issued on login/register and stored client-side (localStorage).
Every protected route reads it from the `Authorization: Bearer <token>` header.
"""

from __future__ import annotations

from datetime import datetime, timezone
from functools import wraps

import jwt
from flask import request, jsonify, g

from config import Config
from models import User


def generate_token(user_id: int) -> str:
    payload = {
        "sub": user_id,
        "iat": datetime.now(timezone.utc),
        "exp": datetime.now(timezone.utc) + Config.JWT_EXPIRES,
    }
    return jwt.encode(payload, Config.JWT_SECRET, algorithm="HS256")


def decode_token(token: str) -> int | None:
    try:
        payload = jwt.decode(token, Config.JWT_SECRET, algorithms=["HS256"])
        return int(payload["sub"])
    except jwt.PyJWTError:
        return None


def get_bearer_token() -> str | None:
    header = request.headers.get("Authorization", "")
    if header.startswith("Bearer "):
        return header.split(" ", 1)[1].strip()
    return None


def login_required(fn):
    @wraps(fn)
    def wrapper(*args, **kwargs):
        token = get_bearer_token()
        if not token:
            return jsonify({"success": False, "error": "Authentication required."}), 401

        user_id = decode_token(token)
        if user_id is None:
            return jsonify({"success": False, "error": "Invalid or expired session."}), 401

        user = User.query.get(user_id)
        if not user:
            return jsonify({"success": False, "error": "User not found."}), 401

        g.current_user = user
        return fn(*args, **kwargs)

    return wrapper


def admin_required(fn):
    @wraps(fn)
    def wrapper(*args, **kwargs):
        token = get_bearer_token()
        if not token:
            return jsonify({"success": False, "error": "Authentication required."}), 401

        user_id = decode_token(token)
        if user_id is None:
            return jsonify({"success": False, "error": "Invalid or expired session."}), 401

        user = User.query.get(user_id)
        if not user:
            return jsonify({"success": False, "error": "User not found."}), 401

        if not user.is_admin:
            return jsonify({"success": False, "error": "Admin access required."}), 403

        g.current_user = user
        return fn(*args, **kwargs)

    return wrapper
