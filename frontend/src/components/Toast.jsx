import React, { createContext, useCallback, useContext, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, AlertCircle, Info, X } from "lucide-react";

const ToastContext = createContext(null);

const ICONS = {
  success: CheckCircle2,
  error: AlertCircle,
  info: Info,
};

const TONES = {
  success: "border-emerald-300/50 text-emerald-700 dark:text-emerald-300",
  error: "border-rose-300/50 text-rose-700 dark:text-rose-300",
  info: "border-brand-300/50 text-brand-700 dark:text-brand-300",
};

function displayMessage(message) {
  if (typeof message === "string") return message;
  if (message && typeof message === "object") {
    return (
      displayMessage(message.message) ||
      displayMessage(message.error) ||
      displayMessage(message.detail) ||
      "Something went wrong. Please try again."
    );
  }
  return "";
}

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const dismiss = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toast = useCallback(
    (message, type = "info", duration = 3500) => {
      const id = Math.random().toString(36).slice(2);
      setToasts((prev) => [...prev, { id, message, type }]);
      if (duration) setTimeout(() => dismiss(id), duration);
      return id;
    },
    [dismiss]
  );

  return (
    <ToastContext.Provider value={{ toast, dismiss }}>
      {children}
      <div
        aria-live="polite"
        className="fixed bottom-5 right-5 z-[100] flex w-[min(360px,90vw)] flex-col gap-2"
      >
        <AnimatePresence>
          {toasts.map((t) => {
            const Icon = ICONS[t.type] || Info;
            return (
              <motion.div
                key={t.id}
                initial={{ opacity: 0, y: 16, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className={`glass flex items-start gap-3 rounded-xl border px-4 py-3 shadow-lg ${TONES[t.type] || TONES.info}`}
                role="status"
              >
                <Icon size={18} className="mt-0.5 shrink-0" />
                <p className="flex-1 text-sm text-ink">{displayMessage(t.message)}</p>
                <button
                  onClick={() => dismiss(t.id)}
                  aria-label="Dismiss notification"
                  className="text-ink-soft hover:text-ink"
                >
                  <X size={16} />
                </button>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}
