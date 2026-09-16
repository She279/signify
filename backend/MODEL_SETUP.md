# Adding Your Trained Random Forest Model

Signify runs in **demo mode** until you place a real trained model file here.
In demo mode, `/api/predict` still works and returns believable-looking
results (clearly flagged `"is_demo": true`) so you can build/test the entire
app before your model is ready.

## 1. Where to place the model

Put your trained model file at:

```
backend/ml/model/sign_model.pkl
```

It must be saved with `joblib.dump(model, "sign_model.pkl")`, where `model`
is a fitted `sklearn.ensemble.RandomForestClassifier` (or any estimator with
`.predict()` and, ideally, `.predict_proba()`).

Optionally also add:

```
backend/ml/model/labels.json
```

A JSON array of your class labels in the exact order used during training,
e.g.:

```json
["HELLO", "THANK YOU", "YES", "NO", "PLEASE"]
```

If you omit `labels.json`, Signify will fall back to `model.classes_`.

## 2. Expected input format

Your model must accept a flattened feature vector of length **63**:

```
[x1, y1, z1, x2, y2, z2, ..., x21, y21, z21]
```

produced by normalizing MediaPipe's 21 hand landmarks relative to the wrist
(landmark 0), then scaling by the max absolute coordinate. This exact logic
lives in `backend/ml/preprocessing.py`.

**Critical:** the preprocessing used here must be IDENTICAL to whatever you
used when building your training CSV / fitting the model. If you trained on
raw (non-normalized) landmarks, or normalized differently, update
`ml/preprocessing.py` to match — otherwise the model will silently
mis-predict on live camera input while looking fine on your test set.

## 3. Expected output format

`POST /api/predict` returns:

```json
{
  "success": true,
  "prediction": "HELLO",
  "label": "HELLO",
  "confidence": 0.946,
  "is_demo": false
}
```

`confidence` comes from `model.predict_proba()` when available (max
probability across classes). If your estimator has no `predict_proba`,
confidence defaults to `1.0`.

## 4. How to test prediction

With the backend running (`python app.py`), send a request:

```bash
curl -X POST http://localhost:5000/api/predict \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <your-jwt-token>" \
  -d '{
    "landmarks": [
      {"x": 0.5, "y": 0.5, "z": 0.0},
      {"x": 0.52, "y": 0.48, "z": -0.01}
      /* ... 21 total points ... */
    ]
  }'
```

Get a token first via `POST /api/auth/login` or `/api/auth/register`.

You can also check `GET /api/model-status` (while logged in) to confirm
whether Signify picked up your real model or is still in demo mode.

## 5. Training your own model (optional path)

If you don't have training data yet, use the built-in **Data Collection**
page in the app (Admin → Dataset, or the standalone collector component). It
calls `POST /api/dataset/collect` and appends rows to
`backend/database/dataset.csv` in the format:

```
label,x1,y1,z1,x2,y2,z2,...,x21,y21,z21
```

Then train separately, e.g.:

```python
import pandas as pd
import joblib
import json
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split

df = pd.read_csv("backend/database/dataset.csv")
X = df.drop(columns=["label"])
y = df["label"]

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

model = RandomForestClassifier(n_estimators=200, random_state=42)
model.fit(X_train, y_train)
print("Test accuracy:", model.score(X_test, y_test))

joblib.dump(model, "backend/ml/model/sign_model.pkl")
with open("backend/ml/model/labels.json", "w") as f:
    json.dump(sorted(y.unique().tolist()), f)
```

Restart the backend afterwards — the model is loaded once at startup.
