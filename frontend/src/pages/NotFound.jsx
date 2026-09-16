import React from "react";
import { Link } from "react-router-dom";
import { Hand, ArrowLeft } from "lucide-react";
import Button from "../components/Button.jsx";

export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-6 text-center">
      <span className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-600 text-white">
        <Hand size={26} />
      </span>
      <p className="font-display text-5xl font-bold text-ink">404</p>
      <h1 className="mt-2 font-display text-xl font-semibold text-ink">Page not found</h1>
      <p className="mt-2 max-w-sm text-sm text-ink-soft">
        The page you're looking for doesn't exist or may have moved.
      </p>
      <Button as={Link} to="/" className="mt-6" icon={ArrowLeft}>
        Back to home
      </Button>
    </div>
  );
}
