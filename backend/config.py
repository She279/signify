"""
Application configuration.
Reads values from environment variables (see .env.example).
"""

import os
from datetime import timedelta
from dotenv import load_dotenv

load_dotenv()

BASE_DIR = os.path.abspath(os.path.dirname(__file__))


class Config:
    SECRET_KEY = os.environ.get("SECRET_KEY", "dev-secret-change-me")

    SQLALCHEMY_DATABASE_URI = os.environ.get(
        "DATABASE_URL", f"sqlite:///{os.path.join(BASE_DIR, 'database', 'signify.db')}"
    )
    SQLALCHEMY_TRACK_MODIFICATIONS = False

    # JWT-style auth token settings (simple HS256 token, stored client-side)
    JWT_SECRET = os.environ.get("JWT_SECRET", SECRET_KEY)
    JWT_EXPIRES = timedelta(days=7)

    # CORS
    CORS_ORIGINS = [
        origin.strip().rstrip("/")
        for origin in os.environ.get("CORS_ORIGINS", "http://localhost:5173").split(",")
        if origin.strip()
    ]

    # ML model path
    MODEL_PATH = os.path.join(BASE_DIR, "ml", "model", "sign_model.pkl")
    LABELS_PATH = os.path.join(BASE_DIR, "ml", "model", "labels.json")

    # Number of landmarks MediaPipe Hands returns per hand
    NUM_LANDMARKS = 21
