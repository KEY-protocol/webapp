interface SpinnerProps {
  /** Tailwind size class applied to both width and height. @default "h-5 w-5" */
  size?: string;
  /** Tailwind text-color class. @default "text-white" */
  color?: string;
  /** Additional CSS classes. */
  className?: string;
}

/**
 * Reusable animated spinner (circular indeterminate loader).
 *
 * @example
 * <Spinner />
 * <Spinner size="h-8 w-8" color="text-green-400" />
 */
export function Spinner({
  size = "h-5 w-5",
  color = "text-white",
  className = "",
}: SpinnerProps) {
  return (
    <svg
      className={`animate-spin ${size} ${color} ${className}`.trim()}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );
}
