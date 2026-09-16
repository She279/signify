"""
Shared extension instances. Kept separate from app.py to avoid circular imports
between models/ and routes/.
"""

from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()
