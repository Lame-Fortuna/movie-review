"use client";

import type { ReactNode } from "react";

type MovieActionButtonProps = {
  icon: ReactNode;
  label: string;
  active?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  className?: string;
};

export default function MovieActionButton({
  icon,
  label,
  active = false,
  disabled = false,
  onClick,
  className = "",
}: MovieActionButtonProps) {
  return (
    <button
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      title={label}
      className={`group relative flex min-w-0 flex-1 items-center justify-center gap-0 overflow-visible border p-2 text-left transition-all duration-500 lg:justify-start lg:gap-3 lg:overflow-hidden lg:px-3 lg:py-3 ${
        disabled
          ? "cursor-not-allowed border-white/8 bg-white/[0.02] text-neutral-600"
          : active
            ? "border-white/30 bg-white/[0.08] text-white shadow-[0_0_30px_rgba(255,255,255,0.08)]"
            : "border-white/10 bg-white/[0.03] text-neutral-300 hover:border-white/25 hover:bg-white/[0.06] hover:text-white"
      } ${className}`}
      aria-label={label}
    >
      <div
        className={`absolute inset-0 bg-linear-to-r from-transparent via-white/[0.04] to-transparent opacity-0 transition-opacity duration-500 ${
          disabled ? "" : active ? "opacity-100" : "group-hover:opacity-100"
        }`}
      />

      <div className="pointer-events-none absolute -top-10 left-1/2 z-50 -translate-x-1/2 scale-75 whitespace-nowrap rounded border border-white/10 bg-neutral-900 px-3 py-1.5 font-label text-[9px] uppercase tracking-[0.3em] text-white opacity-0 shadow-xl transition-all duration-300 group-hover:scale-100 group-hover:opacity-100 group-active:scale-100 group-active:opacity-100 lg:hidden">
        {label}
      </div>

      <div
        className={`relative flex h-9 w-9 shrink-0 items-center justify-center rounded-full border transition-all duration-500 lg:h-11 lg:w-11 ${
          disabled
            ? "border-white/8 bg-black/30 text-neutral-600"
            : active
              ? "border-amber-300/50 bg-amber-300/12 text-amber-200"
              : "border-white/10 bg-black/40 text-neutral-400 group-hover:border-amber-300/45 group-hover:bg-amber-300/10 group-hover:text-amber-200"
        }`}
      >
        {icon}
      </div>

      <div className="relative hidden min-w-0 lg:block">
        <span
          className={`block font-label text-[9px] uppercase tracking-[0.34em] transition-colors duration-500 ${
            disabled ? "text-neutral-600" : active ? "text-neutral-100" : "text-neutral-500 group-hover:text-neutral-200"
          }`}
        >
          {label}
        </span>
        <span
          className={`mt-1 block h-px w-8 transition-all duration-500 ${
            disabled ? "bg-white/8" : active ? "bg-amber-300/70" : "bg-white/10 group-hover:w-12 group-hover:bg-amber-300/60"
          }`}
        />
      </div>
    </button>
  );
}
