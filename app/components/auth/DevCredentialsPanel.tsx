"use client";

/**
 * TODO: REMOVE THIS ENTIRE COMPONENT BEFORE DEPLOYING TO PRODUCTION.
 * This component displays test credentials on the login screen for quick testing.
 * It should NEVER be visible in a production environment.
 */

import { useState } from "react";

interface TestCredential {
  label: string;
  email: string;
  password: string;
  role: string;
  color: string;
}

/**
 * TODO: Remove these test credentials before production deployment.
 * They correspond to the demo seed data in ORGServer.
 */
const TEST_CREDENTIALS: TestCredential[] = [
  {
    label: "Super Admin",
    email: "superadmin@test.com",
    password: "test123",
    role: "SUPERADMIN",
    color: "#a855f7",
  },
  {
    label: "Encargado",
    email: "encargado@test.com",
    password: "test123",
    role: "ENCARGADO",
    color: "#3b82f6",
  },
  {
    label: "Admin",
    email: "admin@test.com",
    password: "test123",
    role: "ADMIN",
    color: "#10b981",
  },
];

interface DevCredentialsPanelProps {
  onSelectCredential: (email: string, password: string) => void;
}

/**
 * Development-only panel that displays test credentials
 * and allows one-click auto-fill into the login form.
 *
 * TODO: Remove this component entirely before production release.
 */
export function DevCredentialsPanel({
  onSelectCredential,
}: DevCredentialsPanelProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Double-check: never render in production
  if (process.env.NODE_ENV === "production") {
    return null;
  }

  if (isCollapsed) {
    return (
      <button
        onClick={() => setIsCollapsed(false)}
        className="fixed bottom-4 right-4 z-50 bg-amber-500/90 hover:bg-amber-500 text-black text-xs font-bold px-3 py-2 rounded-lg shadow-lg transition-all flex items-center gap-1.5"
        title="Show test credentials"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
          <path d="M7 11V7a5 5 0 0 1 10 0v4" />
        </svg>
        DEV
      </button>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 w-72 bg-[#0d1a0a]/95 backdrop-blur-md border border-amber-500/30 rounded-xl shadow-2xl overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between bg-amber-500/10 border-b border-amber-500/20 px-4 py-2.5">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500" />
          </span>
          <span className="text-amber-400 text-xs font-bold font-poppins uppercase tracking-wider">
            Dev Credentials
          </span>
        </div>
        <button
          onClick={() => setIsCollapsed(true)}
          className="text-white/40 hover:text-white/80 transition-colors text-lg leading-none"
          title="Collapse"
        >
          ×
        </button>
      </div>

      {/* Credential Buttons */}
      <div className="p-3 space-y-2">
        {TEST_CREDENTIALS.map((cred) => (
          <button
            key={cred.role}
            onClick={() => onSelectCredential(cred.email, cred.password)}
            className="w-full flex items-center gap-3 bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/15 rounded-lg px-3 py-2.5 transition-all group text-left"
          >
            {/* Role badge */}
            <span
              className="shrink-0 text-[10px] font-bold font-poppins px-2 py-0.5 rounded-md uppercase tracking-wide"
              style={{
                backgroundColor: `${cred.color}20`,
                color: cred.color,
                border: `1px solid ${cred.color}40`,
              }}
            >
              {cred.role}
            </span>

            {/* Credential info */}
            <div className="flex flex-col min-w-0">
              <span className="text-white/90 text-xs font-poppins font-medium truncate">
                {cred.email}
              </span>
              <span className="text-white/40 text-[10px] font-poppins">
                {cred.password}
              </span>
            </div>

            {/* Arrow icon */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="ml-auto shrink-0 text-white/20 group-hover:text-white/60 transition-colors"
            >
              <path d="M5 12h14" />
              <path d="m12 5 7 7-7 7" />
            </svg>
          </button>
        ))}
      </div>

      {/* Footer note */}
      <div className="px-4 pb-3">
        <p className="text-white/25 text-[10px] font-poppins text-center">
          Click to auto-fill • Only visible in development
        </p>
      </div>
    </div>
  );
}
