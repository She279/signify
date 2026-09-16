import React from "react";
import { Link } from "react-router-dom";
import { Hand, Github, Twitter, Linkedin } from "lucide-react";

const LINKS = [
  { to: "/", label: "Home" },
  { to: "/translator", label: "Translator" },
  { to: "/#features", label: "Features" },
  { to: "/about", label: "About" },
  { to: "/privacy", label: "Privacy" },
  { to: "/contact", label: "Contact" },
];

export default function Footer() {
  return (
    <footer className="border-t border-[rgb(var(--border))]">
      <div className="mx-auto max-w-7xl px-5 py-12 lg:px-8">
        <div className="flex flex-col gap-10 md:flex-row md:justify-between">
          <div className="max-w-xs">
            <div className="flex items-center gap-2.5">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-600 text-white">
                <Hand size={18} />
              </span>
              <span className="font-display text-lg font-bold text-ink">Signify</span>
            </div>
            <p className="mt-3 text-sm text-ink-soft">
              Bridging communication through AI.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
            <div>
              <p className="mb-3 text-sm font-semibold text-ink">Product</p>
              <ul className="space-y-2">
                {LINKS.slice(0, 3).map((l) => (
                  <li key={l.to}>
                    <Link to={l.to} className="text-sm text-ink-soft hover:text-ink">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="mb-3 text-sm font-semibold text-ink">Company</p>
              <ul className="space-y-2">
                {LINKS.slice(3).map((l) => (
                  <li key={l.to}>
                    <Link to={l.to} className="text-sm text-ink-soft hover:text-ink">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="mb-3 text-sm font-semibold text-ink">Connect</p>
              <div className="flex gap-3">
                {[Github, Twitter, Linkedin].map((Icon, i) => (
                  <span
                    key={i}
                    className="flex h-8 w-8 items-center justify-center rounded-lg text-ink-soft"
                    aria-hidden="true"
                  >
                    <Icon size={16} />
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10 border-t border-[rgb(var(--border))] pt-6 text-xs text-ink-soft">
          © 2026 Signify. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
