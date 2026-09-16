import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Hand,
  Sparkles,
  Mic,
  History,
  MonitorSmartphone,
  Cpu,
  ArrowRight,
  ScanEye,
  Waves,
} from "lucide-react";
import Card from "../components/Card.jsx";
import Button from "../components/Button.jsx";

const STATS = [
  { value: "21", label: "Hand Landmarks" },
  { value: "Real-time", label: "Recognition" },
  { value: "AI", label: "Powered" },
  { value: "0", label: "Special Hardware" },
];

const FEATURES = [
  {
    icon: ScanEye,
    title: "Real-Time Translation",
    desc: "Translate hand signs captured through your webcam instantly.",
  },
  {
    icon: Hand,
    title: "AI Hand Detection",
    desc: "MediaPipe detects and tracks 21 hand landmarks.",
  },
  {
    icon: Cpu,
    title: "Machine Learning",
    desc: "Random Forest classification identifies recognized signs.",
  },
  {
    icon: Mic,
    title: "Text-to-Speech",
    desc: "Convert recognized signs into spoken language.",
  },
  {
    icon: History,
    title: "Recognition History",
    desc: "Review previously recognized signs.",
  },
  {
    icon: MonitorSmartphone,
    title: "No Special Hardware",
    desc: "Works with a standard webcam.",
  },
];

const STEPS = [
  { n: "01", title: "Camera Input", desc: "User shows a sign in front of the webcam." },
  { n: "02", title: "Hand Detection", desc: "MediaPipe Hands detects the hand." },
  { n: "03", title: "Landmark Extraction", desc: "The system extracts 21 x, y, z hand landmarks." },
  { n: "04", title: "Normalization", desc: "Landmark coordinates are normalized before classification." },
  { n: "05", title: "ML Classification", desc: "A Random Forest model predicts the sign." },
  { n: "06", title: "Text & Speech", desc: "The prediction becomes text and can be spoken aloud." },
];

const FLOAT_LABELS = ["Hand Detected", "21 Landmarks", "AI Processing", "Speech Ready"];

export default function Landing() {
  return (
    <div>
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="mx-auto grid max-w-7xl gap-12 px-5 py-16 lg:grid-cols-2 lg:gap-8 lg:px-8 lg:py-24">
          <div className="flex flex-col justify-center">
            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="font-display text-4xl font-bold leading-[1.1] tracking-tight text-ink sm:text-5xl lg:text-6xl"
            >
              Turn Every Gesture Into a Voice.
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.08 }}
              className="mt-5 max-w-lg text-lg text-ink-soft"
            >
              Signify uses AI-powered hand tracking and machine learning to
              translate sign language into text and speech in real time.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.16 }}
              className="mt-8 flex flex-wrap gap-3"
            >
              <Button as={Link} to="/translator" size="lg" icon={ArrowRight}>
                Start Translating
              </Button>
              <Button as={Link} to="/#how-it-works" variant="secondary" size="lg">
                How It Works
              </Button>
            </motion.div>

            <div className="mt-14 grid grid-cols-2 gap-6 sm:grid-cols-4">
              {STATS.map((s) => (
                <div key={s.label}>
                  <p className="font-display text-2xl font-bold text-ink">{s.value}</p>
                  <p className="mt-1 text-xs text-ink-soft">{s.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Hero visual: hand -> AI -> text -> speech */}
          <div className="relative flex items-center justify-center">
            <div className="relative aspect-square w-full max-w-md">
              <div className="absolute inset-0 rounded-[2.5rem] bg-gradient-to-br from-brand-500/15 via-transparent to-violet-500/10" />
              <Card className="relative flex h-full flex-col justify-between overflow-hidden p-6">
                <div className="flex items-center justify-between text-xs text-ink-soft">
                  <span>Signify Translator</span>
                  <span className="flex items-center gap-1.5 text-emerald-500">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> live
                  </span>
                </div>

                <div className="relative flex flex-1 items-center justify-center">
                  <motion.div
                    animate={{ y: [0, -10, 0] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                    className="flex h-32 w-32 items-center justify-center rounded-3xl bg-brand-600 text-white shadow-glow"
                  >
                    <Hand size={56} />
                  </motion.div>

                  {FLOAT_LABELS.map((label, i) => {
                    const positions = [
                      "left-1 top-2",
                      "right-0 top-10",
                      "left-0 bottom-10",
                      "right-2 bottom-2",
                    ];
                    return (
                      <motion.span
                        key={label}
                        animate={{ y: [0, -6, 0] }}
                        transition={{ duration: 3 + i, repeat: Infinity, ease: "easeInOut" }}
                        className={`absolute ${positions[i]} rounded-full border border-[rgb(var(--border))] bg-[rgb(var(--surface))]/90 px-3 py-1.5 text-[11px] font-medium text-ink-soft shadow-sm backdrop-blur`}
                      >
                        {label}
                      </motion.span>
                    );
                  })}
                </div>

                <div className="flex items-center justify-between rounded-xl surface-2 px-4 py-3">
                  <div className="flex items-center gap-2">
                    <Waves size={16} className="text-brand-600" />
                    <span className="font-display text-sm font-semibold text-ink">"HELLO"</span>
                  </div>
                  <span className="text-xs text-ink-soft">94.6% confidence</span>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className="mx-auto max-w-7xl px-5 py-16 lg:px-8">
        <div className="max-w-xl">
          <h2 className="font-display text-3xl font-bold text-ink">
            Built for accessible, real-time communication.
          </h2>
          <p className="mt-3 text-ink-soft">
            Every part of Signify — from tracking to speech — runs the moment
            you show a sign.
          </p>
        </div>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f) => (
            <motion.div key={f.title} whileHover={{ y: -4 }} transition={{ duration: 0.15 }}>
              <Card className="h-full p-6">
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-brand-50 text-brand-600 dark:bg-brand-500/10">
                  <f.icon size={22} />
                </div>
                <h3 className="font-display text-base font-semibold text-ink">{f.title}</h3>
                <p className="mt-1.5 text-sm text-ink-soft">{f.desc}</p>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how-it-works" className="mx-auto max-w-7xl px-5 py-16 lg:px-8">
        <div className="max-w-xl">
          <h2 className="font-display text-3xl font-bold text-ink">How Signify works.</h2>
          <p className="mt-3 text-ink-soft">
            From camera input to spoken output in six connected steps.
          </p>
        </div>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {STEPS.map((step, i) => (
            <div key={step.n} className="relative">
              <Card className="h-full p-6">
                <span className="font-display text-sm font-semibold text-brand-600">
                  {step.n}
                </span>
                <h3 className="mt-2 font-display text-base font-semibold text-ink">
                  {step.title}
                </h3>
                <p className="mt-1.5 text-sm text-ink-soft">{step.desc}</p>
              </Card>
              {i < STEPS.length - 1 && (
                <ArrowRight
                  size={18}
                  className="absolute -right-3 top-1/2 hidden -translate-y-1/2 text-ink-soft/40 lg:block"
                  style={{ display: (i + 1) % 3 === 0 ? "none" : undefined }}
                />
              )}
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-5 pb-20 lg:px-8">
        <Card className="flex flex-col items-center gap-5 overflow-hidden p-10 text-center sm:p-14">
          <Sparkles className="text-brand-600" size={26} />
          <h2 className="font-display text-2xl font-bold text-ink sm:text-3xl">
            Ready to see it in action?
          </h2>
          <p className="max-w-md text-ink-soft">
            No install, no special hardware — just your webcam and a sign to show.
          </p>
          <Button as={Link} to="/translator" size="lg" icon={ArrowRight}>
            Start Translating
          </Button>
        </Card>
      </section>
    </div>
  );
}
