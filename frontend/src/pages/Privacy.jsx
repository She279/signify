import React from "react";
import Card from "../components/Card.jsx";

export default function Privacy() {
  return (
    <div className="mx-auto max-w-3xl px-5 py-16 lg:px-8">
      <h1 className="font-display text-3xl font-bold text-ink">Privacy Policy</h1>
      <p className="mt-2 text-sm text-ink-soft">Last updated: 2026</p>

      <Card className="mt-8 space-y-6 p-8 text-sm leading-relaxed text-ink-soft">
        <div>
          <h2 className="mb-1.5 font-display text-base font-semibold text-ink">What we store</h2>
          <p>
            Signify stores your name, email address, a securely hashed
            password (never the plain-text password), and a history of your
            recognized signs with their confidence scores and timestamps.
          </p>
        </div>
        <div>
          <h2 className="mb-1.5 font-display text-base font-semibold text-ink">What we don't store</h2>
          <p>
            Signify does not record, upload, or store webcam video or images.
            Hand tracking runs entirely in your browser; only numeric
            landmark coordinates for the current gesture are sent to the
            backend to generate a prediction.
          </p>
        </div>
        <div>
          <h2 className="mb-1.5 font-display text-base font-semibold text-ink">How data is used</h2>
          <p>
            Your recognition history is used only to power your personal
            dashboard, history page, and profile statistics. It is not sold
            or shared with third parties.
          </p>
        </div>
        <div>
          <h2 className="mb-1.5 font-display text-base font-semibold text-ink">Your controls</h2>
          <p>
            You can delete individual history entries or clear your entire
            history at any time from the History page.
          </p>
        </div>
      </Card>
    </div>
  );
}
