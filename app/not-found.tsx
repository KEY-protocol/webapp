import Link from "next/link";
import "@/app/styles/globals.css";

// Global not-found page for routes outside the [locale] layout.
// This page does not have access to next-intl, so translations are hardcoded.
export default function GlobalNotFound() {
  return (
    <html lang="en">
      <body>
        <div className="relative min-h-screen flex items-center justify-center bg-primary overflow-hidden px-4">
          {/* Background decorative elements */}
          <div className="absolute top-1/4 -left-20 w-72 h-72 rounded-full bg-tertiary/5 blur-3xl animate-pulse" />
          <div
            className="absolute bottom-1/4 -right-20 w-96 h-96 rounded-full bg-accent/5 blur-3xl animate-pulse"
            style={{ animationDelay: "1s" }}
          />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-150 h-150 rounded-full bg-secondary/3 blur-3xl" />

          {/* Grid pattern overlay */}
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage:
                "linear-gradient(hsl(113, 50%, 90%) 1px, transparent 1px), linear-gradient(90deg, hsl(113, 50%, 90%) 1px, transparent 1px)",
              backgroundSize: "60px 60px",
            }}
          />

          <div className="relative z-10 flex flex-col items-center text-center max-w-lg">
            {/* 404 Number */}
            <h1
              className="text-[8rem] sm:text-[10rem] md:text-[12rem] font-montserrat font-bold leading-none select-none"
              style={{
                background:
                  "linear-gradient(135deg, hsl(173, 80%, 80%), hsl(113, 50%, 90%), hsl(53, 80%, 80%))",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              404
            </h1>

            {/* Decorative line */}
            <div className="w-24 h-0.5 bg-linear-to-r from-transparent via-tertiary/60 to-transparent mb-6" />

            {/* Title */}
            <h2 className="text-2xl sm:text-3xl font-montserrat font-semibold text-secondary mb-3">
              Page not found
            </h2>

            {/* Description */}
            <p className="text-base sm:text-lg font-poppins text-secondary/60 mb-10 leading-relaxed max-w-md">
              The page you are looking for doesn&apos;t exist or has been moved.
            </p>

            {/* CTA Button */}
            <Link
              href="/"
              className="group relative inline-flex items-center gap-2 px-8 py-3.5 rounded-full font-poppins font-medium text-sm tracking-wide text-primary transition-all duration-300 overflow-hidden"
              style={{
                background:
                  "linear-gradient(135deg, hsl(173, 80%, 80%), hsl(113, 50%, 90%))",
              }}
            >
              {/* Hover shine effect */}
              <span className="absolute inset-0 bg-linear-to-r from-transparent via-white/25 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />

              {/* Arrow icon */}
              <svg
                className="w-4 h-4 transition-transform duration-300 group-hover:-translate-x-0.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>

              <span className="relative">Back to home</span>
            </Link>

            {/* Bottom subtle branding */}
            <p className="mt-16 text-xs font-poppins text-secondary/20 tracking-[0.2em] uppercase">
              Key Protocol
            </p>
          </div>
        </div>
      </body>
    </html>
  );
}
