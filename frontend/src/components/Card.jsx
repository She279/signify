import React from "react";

export default function Card({ className = "", children, as: Comp = "div", ...props }) {
  return (
    <Comp
      className={`surface rounded-2xl ${className}`}
      {...props}
    >
      {children}
    </Comp>
  );
}
