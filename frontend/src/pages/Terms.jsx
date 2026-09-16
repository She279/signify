import React from "react";
import Card from "../components/Card.jsx";

export default function Terms() {
  return (
    <div className="mx-auto max-w-3xl px-5 py-16 lg:px-8">
      <h1 className="font-display text-3xl font-bold text-ink">Terms of Service</h1>
      <p className="mt-2 text-sm text-ink-soft">Last updated: 2026</p>

      <Card className="mt-8 space-y-6 p-8 text-sm leading-relaxed text-ink-soft">
        <p>
          Signify is an academic final-year project built to demonstrate
          real-time sign language translation using on-device hand tracking
          and a machine learning classifier. It is not a commercial product.
        </p>
        <div>
          <h2 className="mb-1.5 font-display text-base font-semibold text-ink">Use of the service</h2>
          <p>
            By creating an account you agree to use Signify for its intended
            purpose — reviewing and testing sign language translation — and
            not to misuse the API, attempt unauthorized access, or interfere
            with other users' accounts.
          </p>
        </div>
        <div>
          <h2 className="mb-1.5 font-display text-base font-semibold text-ink">Camera access</h2>
          <p>
            Video from your webcam is processed locally in your browser for
            hand tracking. Only extracted numeric hand-landmark coordinates —
            not video or images — are sent to the backend for prediction.
          </p>
        </div>
        <div>
          <h2 className="mb-1.5 font-display text-base font-semibold text-ink">No warranty</h2>
          <p>
            Signify is provided "as is" for educational purposes, without
            warranty of accuracy, availability, or fitness for any particular
            purpose. Recognition results — especially in demo mode — should
            not be relied upon for safety-critical communication.
          </p>
        </div>
      </Card>
    </div>
  );
}
