import React from "react";

interface TextDividerProps {
  label: string;
  className?: string;
}

/**
 * A horizontal divider with a text label in the middle.
 */
export function TextDivider({ label, className = "" }: TextDividerProps) {
  return (
    <div className={`flex items-center gap-4 w-full ${className}`}>
      <div className="flex-1 h-px bg-white/15" />
      <span className="text-sm font-poppins text-white/40 whitespace-nowrap">
        {label}
      </span>
      <div className="flex-1 h-px bg-white/15" />
    </div>
  );
}
