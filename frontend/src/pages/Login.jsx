import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { Hand } from "lucide-react";
import Input from "../components/Input.jsx";
import Button from "../components/Button.jsx";
import Card from "../components/Card.jsx";
import { useAuth } from "../hooks/useAuth.jsx";
import { useToast } from "../components/Toast.jsx";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  async function handleSubmit(e) {
    e.preventDefault();
    const nextErrors = {};
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) nextErrors.email = "Enter a valid email address.";
    if (!password) nextErrors.password = "Enter your password.";
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;

    setLoading(true);
    try {
      await login(email, password);
      toast("Welcome back!", "success");
      navigate(location.state?.from || "/dashboard", { replace: true });
    } catch (err) {
      toast(err.message, "error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="grid min-h-[calc(100vh-4.5rem)] lg:grid-cols-2">
      <div className="flex items-center justify-center px-6 py-16">
        <div className="w-full max-w-sm">
          <Link to="/" className="mb-8 flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-600 text-white">
              <Hand size={18} />
            </span>
            <span className="font-display text-lg font-bold text-ink">Signify</span>
          </Link>

          <h1 className="font-display text-2xl font-bold text-ink">Welcome back</h1>
          <p className="mt-1.5 text-sm text-ink-soft">Log in to continue translating.</p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-4" noValidate>
            <Input
              label="Email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={errors.email}
            />
            <Input
              label="Password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={errors.password}
            />

            <div className="flex justify-end">
              <Link to="/forgot-password" className="text-xs font-medium text-brand-600 hover:underline">
                Forgot password?
              </Link>
            </div>

            <Button type="submit" className="w-full" loading={loading}>
              Login
            </Button>

            <button
              type="button"
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-[rgb(var(--border))] py-2.5 text-sm font-medium text-ink-soft"
              disabled
              title="Google OAuth is not configured in this build"
            >
              Continue with Google
            </button>

            <p className="text-center text-sm text-ink-soft">
              Don't have an account?{" "}
              <Link to="/register" className="font-medium text-brand-600 hover:underline">
                Create account
              </Link>
            </p>
          </form>
        </div>
      </div>

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
    </div>
  );
}
