# Signify — AI-Powered Real-Time Sign Language Translator

Signify watches a hand through your webcam, tracks it with MediaPipe Hands,
classifies the gesture with a Random Forest model, and turns the result into
text and speech — in real time, with no special hardware.

```
Webcam → Hand Detection → 21 Landmarks → Normalization
       → Random Forest Classification → Text → Speech
```

This is a full-stack final-year project: a React/Vite frontend, a Flask
backend, a SQLite database, and a pluggable ML prediction layer.

---

## 1. Project overview

| Layer     | Tech                                                              |
|-----------|--------------------------------------------------------------------|
| Frontend  | React, Vite, Tailwind CSS, Framer Motion, Lucide React, Axios, React Router, MediaPipe Hands, Web Speech API |
| Backend   | Python, Flask, Flask-CORS, SQLAlchemy                              |
| ML        | scikit-learn (Random Forest), joblib, NumPy                        |
| Database  | SQLite                                                              |

**What's real vs. demo:**
- Camera access, MediaPipe hand tracking, the 21-landmark overlay, the REST
  API, authentication, SQLite persistence, and text-to-speech are all fully
  functional — nothing is mocked.
- Sign *prediction* runs in **demo mode** until you place a trained
  `sign_model.pkl` in `backend/ml/model/`. Demo predictions are clearly
  labeled (`"is_demo": true` from the API, a "Demo model" badge in the UI) so
  it's never presented as more accurate than it is.
- The Contact form and "Forgot password" flow are UI-complete but not wired
  to a real email service — this is explicitly called out in the code and
  in the UI copy, with instructions for what backend endpoint to add.

---

## 2. Folder structure

```
signify/
├── frontend/                 React + Vite app
│   └── src/
│       ├── components/       Reusable UI (Navbar, Sidebar, Button, Card, ...)
│       ├── pages/             Landing, Login, Dashboard, Translator, ...
│       ├── layouts/           MainLayout (public), DashboardLayout (auth'd)
│       ├── hooks/              useAuth, useSpeech, useHandTracking, useTheme
│       └── services/api.js    Axios client + all API calls
│
├── backend/                   Flask API
│   ├── app.py                  App factory / entrypoint
│   ├── config.py                Env-driven configuration
│   ├── models/                  User, RecognitionHistory (SQLAlchemy)
│   ├── routes/                  auth, prediction, history, health, admin, dataset
│   ├── ml/
│   │   ├── preprocessing.py     Landmark normalization
│   │   ├── predictor.py         Model loading + demo fallback
│   │   └── model/sign_model.pkl  ← put your trained model here
│   ├── database/signify.db      SQLite file (created automatically)
│   └── MODEL_SETUP.md           How to plug in your trained model
│
└── README.md                  This file
```

---

## 3. Installation & running

You need **Node.js 18+** and **Python 3.9+** installed.

### Backend (Windows)

```
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
copy .env.example .env
python app.py
```

### Backend (macOS / Linux)

```
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
python app.py
```

The API starts at **http://localhost:5000**. On first run it creates
`backend/database/signify.db` automatically — no manual DB setup needed.

### Frontend (any OS)

Open a **second terminal**:

```
cd frontend
npm install
copy .env.example .env      (Windows)
cp .env.example .env        (macOS/Linux)
npm run dev
```

The app opens at **http://localhost:5173**.

Leave both terminals running while you use the app.

### Deploying the full app to Vercel

This repository includes a Vercel Python function for the Flask API, so the
Vercel project must use the repository root as its **Root Directory**. Do not
set the Root Directory to `frontend`.

1. Import the repository into Vercel and set **Root Directory** to `.`.
2. Set these environment variables in Vercel:

  ```
  SECRET_KEY=<long-random-value>
  JWT_SECRET=<different-long-random-value>
  CORS_ORIGINS=https://your-project.vercel.app
  ```

3. Deploy. The frontend uses the same-origin API automatically, so leave
  `VITE_API_URL` empty for this setup.

For a separately hosted backend, set `VITE_API_URL` to its public HTTPS URL
and set `CORS_ORIGINS` to the exact frontend URL instead.

---

## 4. How it all fits together (for beginners)

- **`frontend/`** is what you see in the browser. It's a single-page React
  app — clicking around never reloads the page, React Router just swaps
  which component is shown.
- **MediaPipe Hands** runs entirely *inside your browser* (loaded from a
  CDN in `index.html`). It looks at your webcam video and outputs 21 (x, y,
  z) points describing your hand — no video ever leaves your computer.
- Every ~400ms, the frontend sends just those 21 points (not video) to the
  backend at `POST /api/predict`.
- **`backend/`** is a Flask server. It normalizes the points, feeds them to
  a Random Forest model (`backend/ml/predictor.py`), and sends back a
  predicted sign + confidence score as JSON.
- The frontend shows that prediction, can speak it aloud with the browser's
  built-in `speechSynthesis` API, and (if you're logged in) saves it to
  **SQLite** via SQLAlchemy so it shows up in your History page later.
- **Authentication** uses a simple signed token (JWT): when you log in, the
  backend gives your browser a token, which gets attached to every future
  request so the backend knows who you are.

---

## 5. Adding your trained Random Forest model

Full details in [`backend/MODEL_SETUP.md`](./backend/MODEL_SETUP.md). Short
version:

1. Train a `RandomForestClassifier` on 63-length feature vectors (21
   landmarks × x/y/z, normalized relative to the wrist — see
   `backend/ml/preprocessing.py`).
2. Save it: `joblib.dump(model, "backend/ml/model/sign_model.pkl")`
3. Optionally save your label order to `backend/ml/model/labels.json`.
4. Restart the backend. `GET /api/model-status` (while logged in) confirms
   it loaded.

No trained model yet? The app still works end-to-end in demo mode — useful
for testing the UI, auth, history, and API before your model is ready. You
can also use the built-in dataset collector (`POST /api/dataset/collect`,
exposed via the Admin → Dataset tab) to gather training samples from your
own webcam.

---

## 6. Testing the API directly

With the backend running:

```bash
# Register
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"secret123"}'

# Copy the "token" from the response, then:
curl -X POST http://localhost:5000/api/predict \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{"landmarks":[{"x":0.5,"y":0.5,"z":0.0}, ... 21 points total]}'
```

## 7. Testing webcam translation in the browser

1. Register/log in at http://localhost:5173.
2. Go to **Translator** (from the dashboard sidebar).
3. Click **Start Camera** and allow browser camera permission.
4. Show your hand — you should see 21 tracked points overlaid on the video
   and a status pill switch to "Hand detected."
5. A prediction appears on the right every ~400ms while a hand is visible.
   Click **Speak** to hear it, or **Add to Sentence** to build a phrase.

---

## 8. Common errors & fixes

| Problem | Fix |
|---|---|
| Frontend shows network errors on login/predict | For local development, run the backend on port 5000. For deployment, set `frontend/.env` to the public backend URL with `VITE_API_URL=https://api.example.com`, then rebuild the frontend. If both apps share one origin, leave `VITE_API_URL` empty. |
| "Camera access is required..." | Your browser blocked camera permission — click the camera icon in the address bar and allow it, then click "Try Again." |
| Hand tracking never shows landmarks | Check your browser console — MediaPipe scripts load from a CDN (`index.html`), so you need an internet connection the first time, even though the app runs locally. |
| `unable to open database file` on backend startup | Make sure you're running `python app.py` from inside `backend/`, and that the `backend/database/` folder exists (it's created automatically, but antivirus/permissions can occasionally block it). |
| Predictions look random / low accuracy | You're in demo mode (check `GET /api/model-status`). Train and add a real model per `backend/MODEL_SETUP.md`. |
| CORS errors in the browser console | Check `CORS_ORIGINS` in `backend/.env` contains the exact public frontend URL, including `https://` and the port if applicable. Separate multiple origins with commas. |
| `pip install` fails on `mediapipe`/`opencv-python` | Those are commented out in `requirements.txt` — they're only needed if you build a Python-side video pipeline. The default browser-based pipeline doesn't need them. |

---

## 9. Future scope

- Two-handed and dynamic (motion) sign recognition
- Expanded vocabulary via community dataset collection
- Real email service for Contact and password reset
- Multi-language speech output
- Mobile app wrapper

---

## 10. Screenshots

_Add screenshots of the Landing, Translator, Dashboard, and History pages
here once you've run the app locally._
