export default function Loading() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-primary">
      {/* Ambient glow */}
      <div className="absolute w-80 h-80 rounded-full bg-tertiary/5 blur-3xl animate-pulse" />

      <div className="relative flex flex-col items-center gap-8">
        {/* Spinner container */}
        <div className="relative w-24 h-24">
          {/* Outer orbital ring */}
          <div className="absolute inset-0 rounded-full border-2 border-secondary/10" />
          <div
            className="absolute inset-0 rounded-full border-2 border-transparent animate-spin"
            style={{
              borderTopColor: "hsl(173, 80%, 80%)",
              borderRightColor: "hsl(113, 50%, 90%)",
              animationDuration: "1.2s",
              animationTimingFunction: "cubic-bezier(0.4, 0, 0.2, 1)",
            }}
          />

          {/* Inner orbital ring */}
          <div
            className="absolute inset-3 rounded-full border-2 border-transparent animate-spin"
            style={{
              borderBottomColor: "hsl(53, 80%, 80%)",
              borderLeftColor: "hsl(173, 80%, 80%)",
              animationDuration: "1.8s",
              animationDirection: "reverse",
              animationTimingFunction: "cubic-bezier(0.4, 0, 0.2, 1)",
            }}
          />

          {/* Center brand initial */}
          <div className="absolute inset-0 flex items-center justify-center">
            <span
              className="text-2xl font-bold font-montserrat text-secondary animate-pulse"
              style={{ animationDuration: "2s" }}
            >
              K
            </span>
          </div>
        </div>

        {/* Loading text */}
        <div className="flex flex-col items-center gap-2">
          <p
            className="text-sm font-poppins text-secondary/60 tracking-[0.3em] uppercase animate-pulse"
            style={{ animationDuration: "2s" }}
          >
            Loading
          </p>

          {/* Animated dots */}
          <div className="flex gap-1.5">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="w-1.5 h-1.5 rounded-full bg-tertiary/80 animate-bounce"
                style={{
                  animationDelay: `${i * 0.15}s`,
                  animationDuration: "0.8s",
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
