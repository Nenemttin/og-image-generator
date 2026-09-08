import { ReactNode } from "react";

interface BadgeProps {
  children: ReactNode;
  variant?: "default" | "success" | "outline" | "dot";
  className?: string;
}

export function Badge({
  children,
  variant = "default",
  className = "",
}: BadgeProps) {
  const baseStyles =
    "inline-flex items-center text-[11px] font-mono tracking-wider transition-colors";

  const variantStyles = {
    default: "px-2.5 py-0.5 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-400 uppercase",
    success:
      "px-2.5 py-0.5 rounded-full bg-zinc-900 border border-emerald-500/50 text-emerald-400 uppercase",
    outline: "px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-400 font-medium",
    dot: "gap-1.5 px-2.5 py-0.5 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-400 uppercase",
  };

  return (
    <span className={`${baseStyles} ${variantStyles[variant]} ${className}`}>
      {children}
    </span>
  );
}
