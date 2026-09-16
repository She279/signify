"""
Signify backend entrypoint.

Run with:  python app.py
Serves on: http://localhost:5000
"""

import os

from flask import Flask, jsonify
from flask_cors import CORS

from config import Config
from extensions import db


def create_app() -> Flask:
    app = Flask(__name__)
    app.config.from_object(Config)

    # Make sure the sqlite file's directory exists
    os.makedirs(os.path.join(os.path.dirname(__file__), "database"), exist_ok=True)

    db.init_app(app)
    CORS(app, resources={r"/api/*": {"origins": Config.CORS_ORIGINS}}, supports_credentials=True)

    # Import models so SQLAlchemy is aware of them before create_all()
    from models import User, RecognitionHistory  # noqa: F401

    from routes.auth import auth_bp
    from routes.prediction import prediction_bp
    from routes.history import history_bp
    from routes.health import health_bp
    from routes.admin import admin_bp
    from routes.dataset import dataset_bp

    app.register_blueprint(auth_bp, url_prefix="/api/auth")
    app.register_blueprint(prediction_bp, url_prefix="/api")
    app.register_blueprint(history_bp, url_prefix="/api/history")
    app.register_blueprint(health_bp, url_prefix="/api")
    app.register_blueprint(admin_bp, url_prefix="/api/admin")
    app.register_blueprint(dataset_bp, url_prefix="/api/dataset")

    with app.app_context():
        db.create_all()

    @app.errorhandler(404)
    def not_found(_err):
        return jsonify({"success": False, "error": "Not found."}), 404

    @app.errorhandler(500)
    def server_error(_err):
        return jsonify({"success": False, "error": "Internal server error."}), 500

    return app


app = create_app()

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
