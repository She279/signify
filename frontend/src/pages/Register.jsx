import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Hand } from "lucide-react";
import Input from "../components/Input.jsx";
import Button from "../components/Button.jsx";
import { useAuth } from "../hooks/useAuth.jsx";
import { useToast } from "../components/Toast.jsx";

export default function Register() {
  const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "" });
  const [agreed, setAgreed] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  function update(field) {
    return (e) => setForm((f) => ({ ...f, [field]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const nextErrors = {};
    if (form.name.trim().length < 2) nextErrors.name = "Enter your full name.";
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.email)) nextErrors.email = "Enter a valid email address.";
    if (form.password.length < 6) nextErrors.password = "Use at least 6 characters.";
    if (form.confirm !== form.password) nextErrors.confirm = "Passwords don't match.";
    if (!agreed) nextErrors.agreed = "Please agree to the terms to continue.";
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;

    setLoading(true);
    try {
      await register(form.name.trim(), form.email.trim(), form.password);
      toast("Account created. Welcome to Signify!", "success");
      navigate("/dashboard", { replace: true });
    } catch (err) {
      toast(err.message, "error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="grid min-h-[calc(100vh-4.5rem)] lg:grid-cols-2">
      <div className="relative hidden items-center justify-center overflow-hidden bg-brand-950 lg:flex">
        <div className="absolute inset-0 bg-aurora opacity-70" />
        <motion.div
          animate={{ y: [0, -16, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          className="relative flex h-56 w-56 items-center justify-center rounded-[2.5rem] bg-white/5 text-brand-200 backdrop-blur"
        >
          <Hand size={96} strokeWidth={1.2} />
        </motion.div>
      </div>

      <div className="flex items-center justify-center px-6 py-16">
        <div className="w-full max-w-sm">
          <Link to="/" className="mb-8 flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-600 text-white">
              <Hand size={18} />
            </span>
            <span className="font-display text-lg font-bold text-ink">Signify</span>
          </Link>

          <h1 className="font-display text-2xl font-bold text-ink">Create your account</h1>
          <p className="mt-1.5 text-sm text-ink-soft">Start translating signs in minutes.</p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-4" noValidate>
            <Input label="Full Name" value={form.name} onChange={update("name")} error={errors.name} />
            <Input label="Email" type="email" value={form.email} onChange={update("email")} error={errors.email} />
            <Input
              label="Password"
              type="password"
              value={form.password}
              onChange={update("password")}
              error={errors.password}
              hint="At least 6 characters."
            />
            <Input
              label="Confirm Password"
              type="password"
              value={form.confirm}
              onChange={update("confirm")}
              error={errors.confirm}
            />

            <label className="flex items-start gap-2.5 text-sm text-ink-soft">
              <input
                type="checkbox"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                className="mt-0.5 h-4 w-4 rounded border-[rgb(var(--border))] text-brand-600 focus:ring-brand-500"
              />
              <span>
                I agree to the{" "}
                <Link to="/terms" className="font-medium text-brand-600 hover:underline">
                  Terms
                </Link>{" "}
                and{" "}
                <Link to="/privacy" className="font-medium text-brand-600 hover:underline">
                  Privacy Policy
                </Link>
                .
              </span>
            </label>
            {errors.agreed && <p className="text-xs text-rose-500">{errors.agreed}</p>}

            <Button type="submit" className="w-full" loading={loading}>
              Create Account
            </Button>

            <p className="text-center text-sm text-ink-soft">
              Already have an account?{" "}
              <Link to="/login" className="font-medium text-brand-600 hover:underline">
                Log in
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
