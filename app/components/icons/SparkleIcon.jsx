/**
 * SparkleIcon Component
 * Decorative sparkle/star icon used in roadmap cards
 */

export default function SparkleIcon({ className = '' }) {
  return (
    <svg
      className={`w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 ${className}`}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
      />
    </svg>
  );
}
