import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  Camera,
  History,
  GraduationCap,
  User,
  Settings,
  Hand,
  Menu,
  X,
  LogOut,
  ShieldCheck,
} from "lucide-react";
import { useAuth } from "../hooks/useAuth.jsx";

const LINKS = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/translator", label: "Translator", icon: Camera },
  { to: "/history", label: "History", icon: History },
  { to: "/learn", label: "Learn Signs", icon: GraduationCap },
  { to: "/profile", label: "Profile", icon: User },
  { to: "/settings", label: "Settings", icon: Settings },
];

export default function Sidebar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const content = (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-2.5 px-5 py-5">
        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-600 text-white">
          <Hand size={18} />
        </span>
        <span className="font-display text-lg font-bold text-ink">Signify</span>
      </div>

      <nav className="flex-1 space-y-1 px-3">
        {LINKS.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            onClick={() => setMobileOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
                isActive
                  ? "bg-brand-600 text-white shadow-sm shadow-brand-600/25"
                  : "text-ink-soft hover:bg-black/5 hover:text-ink dark:hover:bg-white/10"
              }`
            }
          >
            <link.icon size={18} />
            {link.label}
          </NavLink>
        ))}

        {user?.is_admin && (
          <NavLink
            to="/admin"
            onClick={() => setMobileOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
                isActive
                  ? "bg-brand-600 text-white shadow-sm shadow-brand-600/25"
                  : "text-ink-soft hover:bg-black/5 hover:text-ink dark:hover:bg-white/10"
              }`
            }
          >
            <ShieldCheck size={18} />
            Admin
          </NavLink>
        )}
      </nav>

      <div className="border-t border-[rgb(var(--border))] p-3">
        <div className="mb-2 flex items-center gap-3 rounded-xl px-2 py-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-100 text-sm font-semibold text-brand-700 dark:bg-brand-500/20 dark:text-brand-300">
            {user?.name?.[0]?.toUpperCase() || "U"}
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-ink">{user?.name}</p>
            <p className="truncate text-xs text-ink-soft">{user?.email}</p>
          </div>
        </div>
        <button
          onClick={async () => {
            await logout();
            navigate("/");
          }}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-ink-soft hover:bg-black/5 hover:text-ink dark:hover:bg-white/10"
        >
          <LogOut size={18} />
          Log out
        </button>
      </div>
    </div>
  );

  return (
    <>
      <aside className="sticky top-0 hidden h-screen w-64 shrink-0 border-r border-[rgb(var(--border))] lg:block">
        {content}
      </aside>

      <div className="flex items-center justify-between border-b border-[rgb(var(--border))] px-4 py-3 lg:hidden">
        <span className="font-display text-lg font-bold text-ink">Signify</span>
        <button
          onClick={() => setMobileOpen(true)}
          aria-label="Open menu"
          className="rounded-lg p-2 text-ink"
        >
          <Menu size={22} />
        </button>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            className="fixed inset-0 z-[80] bg-black/40 lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onMouseDown={(e) => e.target === e.currentTarget && setMobileOpen(false)}
          >
            <motion.div
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: "tween", duration: 0.2 }}
              className="surface h-full w-64"
            >
              <button
                onClick={() => setMobileOpen(false)}
                aria-label="Close menu"
                className="absolute right-3 top-4 rounded-lg p-2 text-ink-soft"
              >
                <X size={20} />
              </button>
              {content}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
