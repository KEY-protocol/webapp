"use client";

interface StatCardProps {
  title: string;
  value: string | number;
  className?: string;
  variant?: "large" | "small";
}

export const StatCard = ({
  title,
  value,
  className = "",
  variant = "large",
}: StatCardProps) => {
  return (
    <div
      className={`bg-[#1a1a1a] p-5 rounded-sm shadow-lg border-l-4 border-primary/20 ${className}`}
    >
      <p
        className={`text-white/70 font-montserrat mb-1 truncate ${variant === "large" ? "text-lg" : "text-[10px] uppercase tracking-wider"}`}
      >
        {title}
      </p>
      <h3
        className={`font-montserrat font-bold text-white ${variant === "large" ? "text-4xl" : "text-2xl"}`}
      >
        {value}
      </h3>
    </div>
  );
};
