# Signify Backend

Flask REST API powering authentication, ML prediction, and recognition
history for the Signify sign-language translator.

## Setup (Windows)

```
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
copy .env.example .env
python app.py
```

## Setup (macOS / Linux)

```
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
python app.py
```

The API runs at `http://localhost:5000`. A SQLite database is created
automatically at `backend/database/signify.db` on first run.

## Adding your trained model

See [`MODEL_SETUP.md`](./MODEL_SETUP.md). Until a model is placed at
`backend/ml/model/sign_model.pkl`, predictions run in demo mode (clearly
flagged with `"is_demo": true` in every response).

## Key endpoints

| Method | Path                     | Auth  | Description                          |
|--------|--------------------------|-------|---------------------------------------|
| GET    | /api/health              | none  | Health check                          |
| POST   | /api/auth/register       | none  | Create account                        |
| POST   | /api/auth/login          | none  | Log in                                |
| GET    | /api/auth/me             | token | Current user                          |
| POST   | /api/auth/logout         | token | Logout (stateless)                    |
| POST   | /api/predict             | token | Predict a sign from landmarks         |
| GET    | /api/model-status        | token | Model load status                     |
| GET    | /api/history             | token | List history (supports ?range, ?q)    |
| POST   | /api/history             | token | Add a history entry manually          |
| DELETE | /api/history/<id>        | token | Delete one entry                      |
| DELETE | /api/history             | token | Clear all history                     |
| POST   | /api/dataset/collect     | token | Append a labeled training sample      |
| GET    | /api/dataset/download    | token | Download collected dataset as CSV     |
| GET    | /api/dataset/stats       | token | Dataset sample/label counts           |
| GET    | /api/admin/overview      | admin | Platform-wide stats                   |
| GET    | /api/admin/users         | admin | All users + prediction counts         |
| GET    | /api/admin/model         | admin | Model status (admin view)             |

All protected routes expect `Authorization: Bearer <token>`, where `<token>`
comes from the `register`/`login` response.

## Making a user an admin

There's no UI for this by design (admin routes are sensitive). Promote a
user directly in SQLite:

```
sqlite3 backend/database/signify.db "UPDATE users SET is_admin = 1 WHERE email = 'you@example.com';"
```

Restart nothing — this takes effect on your next request.
