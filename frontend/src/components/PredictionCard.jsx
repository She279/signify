import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Volume2, Copy, X, Plus } from "lucide-react";
import ConfidenceBar from "./ConfidenceBar.jsx";
import Button from "./Button.jsx";

export default function PredictionCard({ prediction, onSpeak, onCopy, onClear, onAddToSentence }) {
  return (
    <div>
      <p className="text-sm font-medium text-ink-soft">Recognized Sign</p>

      <div className="mt-3 min-h-[88px]">
        <AnimatePresence mode="wait">
          {prediction ? (
            <motion.p
              key={prediction.prediction + prediction.confidence}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="font-display text-4xl font-bold tracking-tight text-ink"
            >
              {prediction.prediction}
              {prediction.is_demo && (
                <span className="ml-3 rounded-full bg-amber-100 px-2 py-0.5 align-middle text-xs font-medium text-amber-700 dark:bg-amber-500/15 dark:text-amber-300">
                  Demo model
                </span>
              )}
            </motion.p>
          ) : (
            <p className="font-display text-2xl font-semibold text-ink-soft/60">
              Ready when you are.
            </p>
          )}
        </AnimatePresence>
      </div>

      {prediction && (
        <div className="mt-4">
          <ConfidenceBar value={prediction.confidence} />
        </div>
      )}

      <div className="mt-5 flex flex-wrap gap-2">
        <Button size="sm" variant="secondary" icon={Volume2} disabled={!prediction} onClick={onSpeak}>
          Speak
        </Button>
        <Button size="sm" variant="secondary" icon={Copy} disabled={!prediction} onClick={onCopy}>
          Copy
        </Button>
        <Button size="sm" variant="ghost" icon={X} disabled={!prediction} onClick={onClear}>
          Clear
        </Button>
        <Button size="sm" variant="outline" icon={Plus} disabled={!prediction} onClick={onAddToSentence}>
          Add to Sentence
        </Button>
      </div>
    </div>
  );
}
