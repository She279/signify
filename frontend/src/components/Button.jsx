import React from "react";
import { Loader2 } from "lucide-react";

const VARIANTS = {
  primary:
    "bg-brand-600 text-white hover:bg-brand-700 shadow-sm shadow-brand-600/20 disabled:bg-brand-400",
  secondary:
    "surface text-ink hover:bg-brand-50 dark:hover:bg-white/5",
  ghost: "text-ink hover:bg-black/5 dark:hover:bg-white/5",
  danger: "bg-rose-600 text-white hover:bg-rose-700",
  outline: "border border-brand-300 text-brand-700 dark:text-brand-300 hover:bg-brand-50 dark:hover:bg-brand-500/10",
};

const SIZES = {
  sm: "px-3 py-1.5 text-sm rounded-lg gap-1.5",
  md: "px-4 py-2.5 text-sm rounded-xl gap-2",
  lg: "px-6 py-3 text-base rounded-xl gap-2",
};

export default function Button({
  as: Comp = "button",
  variant = "primary",
  size = "md",
  loading = false,
  icon: Icon,
  className = "",
  children,
  disabled,
  ...props
}) {
  return (
    <Comp
      className={`inline-flex items-center justify-center font-medium transition-colors duration-150 disabled:cursor-not-allowed disabled:opacity-60 ${VARIANTS[variant]} ${SIZES[size]} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <Loader2 size={16} className="animate-spin" />
      ) : (
        Icon && <Icon size={16} />
      )}
      {children}
    </Comp>
  );
}
