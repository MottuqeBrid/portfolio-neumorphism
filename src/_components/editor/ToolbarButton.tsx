"use client";

import { type ReactNode } from "react";

interface ToolbarButtonProps {
  isActive?: boolean;
  disabled?: boolean;
  onClick: () => void;
  title?: string;
  className?: string;
  children: ReactNode;
}

export default function ToolbarButton({
  isActive = false,
  disabled = false,
  onClick,
  title,
  className = "",
  children,
}: ToolbarButtonProps) {
  return (
    <button
      type="button"
      title={title}
      disabled={disabled}
      onClick={onClick}
      className={`inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-sm transition-all duration-150 ${
        isActive
          ? "bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-300"
          : "text-slate-600 hover:bg-slate-100 hover:text-slate-800 dark:text-slate-400 dark:hover:bg-slate-700 dark:hover:text-slate-200"
      } disabled:cursor-not-allowed disabled:opacity-40 ${className}`}
      onMouseDown={(e) => e.preventDefault()}
    >
      {children}
    </button>
  );
}
