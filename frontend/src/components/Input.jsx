import React, { forwardRef, useId } from "react";

const Input = forwardRef(function Input(
  { label, error, hint, className = "", type = "text", ...props },
  ref
) {
  const generatedId = useId();
  const id = props.id || generatedId;

  return (
    <div className="w-full">
      {label && (
        <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-ink">
          {label}
        </label>
      )}
      <input
        id={id}
        ref={ref}
        type={type}
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-error` : hint ? `${id}-hint` : undefined}
        className={`w-full rounded-xl border bg-transparent px-3.5 py-2.5 text-sm text-ink placeholder:text-ink-soft/70 transition-colors focus:border-brand-500 ${
          error ? "border-rose-400" : "border-[rgb(var(--border))]"
        } ${className}`}
        {...props}
      />
      {error && (
        <p id={`${id}-error`} className="mt-1.5 text-xs text-rose-500">
          {error}
        </p>
      )}
      {!error && hint && (
        <p id={`${id}-hint`} className="mt-1.5 text-xs text-ink-soft">
          {hint}
        </p>
      )}
    </div>
  );
});

export default Input;
