import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Hand, Mail, ArrowLeft } from "lucide-react";
import Input from "../components/Input.jsx";
import Button from "../components/Button.jsx";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    // DEMO: no backend password-reset endpoint exists yet. Add
    // POST /api/auth/forgot-password (generate + email a reset token) to
    // make this functional, then call it here instead of the timeout below.
    setTimeout(() => {
      setLoading(false);
      setSent(true);
    }, 700);
  }

  return (
    <div className="flex min-h-[calc(100vh-4.5rem)] items-center justify-center px-6 py-16">
      <div className="w-full max-w-sm">
        <Link to="/login" className="mb-8 inline-flex items-center gap-1.5 text-sm font-medium text-ink-soft hover:text-ink">
          <ArrowLeft size={14} /> Back to login
        </Link>

        <div className="mb-6 flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-600 text-white">
            <Hand size={18} />
          </span>
          <span className="font-display text-lg font-bold text-ink">Signify</span>
        </div>

        {sent ? (
          <div>
            <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10">
              <Mail size={20} />
            </div>
            <h1 className="font-display text-xl font-semibold text-ink">Check your email (demo)</h1>
            <p className="mt-2 text-sm text-ink-soft">
              This build doesn't send real reset emails yet — connect a
              backend password-reset endpoint to make this functional. In a
              live deployment, a reset link would now be on its way to{" "}
              <span className="font-medium text-ink">{email}</span>.
            </p>
          </div>
        ) : (
          <>
            <h1 className="font-display text-xl font-semibold text-ink">Reset your password</h1>
            <p className="mt-1.5 text-sm text-ink-soft">
              Enter your email and we'll send you a reset link.
            </p>
            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <Input
                label="Email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Button type="submit" className="w-full" loading={loading}>
                Send Reset Link
              </Button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
