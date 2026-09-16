import React from "react";
import { Hand, Sparkles, Cpu, Layers, Compass, Heart } from "lucide-react";
import Card from "../components/Card.jsx";

const SECTIONS = [
  {
    icon: Hand,
    title: "What is Signify?",
    body: "Signify is a real-time sign language translator. It watches a hand through a webcam, tracks its shape and position, and turns recognized gestures into written text and spoken audio — all in the browser, without any special hardware.",
  },
  {
    icon: Heart,
    title: "Why Sign Language Translation?",
    body: "Millions of people communicate primarily through sign language, yet most everyday tools assume spoken or typed input. Signify is an exploration of how accessible, on-device AI can help close that gap in everyday conversations.",
  },
  {
    icon: Cpu,
    title: "How AI Helps",
    body: "Signify combines computer vision and machine learning: MediaPipe Hands locates 21 points on the hand in real time, and a Random Forest classifier learns to recognize gesture patterns from those points, without needing raw video sent anywhere.",
  },
  {
    icon: Layers,
    title: "Technology Stack",
    body: "React, Vite, and Tailwind CSS power the interface. MediaPipe Hands runs hand tracking in the browser. A Flask API handles authentication, prediction requests, and history, backed by SQLite through SQLAlchemy.",
  },
  {
    icon: Compass,
    title: "Future Scope",
    body: "Planned directions include expanding the recognized sign vocabulary, supporting two-handed and dynamic (motion-based) signs, multi-language speech output, and collaborative dataset collection to keep improving accuracy.",
  },
];

export default function About() {
  return (
    <div className="mx-auto max-w-5xl px-5 py-16 lg:px-8">
      <div className="max-w-2xl">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-50 px-3 py-1 text-xs font-medium text-brand-700 dark:bg-brand-500/10 dark:text-brand-300">
          <Sparkles size={12} /> About the project
        </span>
        <h1 className="mt-4 font-display text-3xl font-bold text-ink sm:text-4xl">
          About Signify
        </h1>
        <p className="mt-4 text-lg text-ink-soft">
          Signify aims to make communication more accessible by translating
          hand gestures into text and speech using AI.
        </p>
      </div>

      <div className="mt-12 space-y-5">
        {SECTIONS.map((s) => (
          <Card key={s.title} className="p-6 sm:p-8">
            <div className="flex gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-600 dark:bg-brand-500/10">
                <s.icon size={20} />
              </div>
              <div>
                <h2 className="font-display text-lg font-semibold text-ink">{s.title}</h2>
                <p className="mt-1.5 text-sm leading-relaxed text-ink-soft">{s.body}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Card className="mt-8 p-8 text-center sm:p-10">
        <h2 className="font-display text-xl font-semibold text-ink">Our Mission</h2>
        <p className="mx-auto mt-2 max-w-xl text-sm text-ink-soft">
          To build assistive technology that feels like a natural extension of
          how people already communicate — private, real-time, and usable with
          the hardware people already have.
        </p>
      </Card>
    </div>
  );
}
