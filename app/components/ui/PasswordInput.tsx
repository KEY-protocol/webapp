"use client";

import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

interface PasswordInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: React.ReactNode;
}

export function PasswordInput({
  className = "",
  icon,
  ...props
}: PasswordInputProps) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="relative w-full">
      {icon && (
        <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30 pointer-events-none">
          {icon}
        </div>
      )}
      <input
        {...props}
        type={showPassword ? "text" : "password"}
        className={`${className} ${icon ? "pl-10" : "pl-4"} pr-11`}
      />
      <button
        type="button"
        onClick={() => setShowPassword(!showPassword)}
        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/80 transition-colors p-1 rounded-lg cursor-pointer focus:outline-none"
        tabIndex={-1}
        title={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
      >
        {showPassword ? (
          <EyeOff className="w-4 h-4" />
        ) : (
          <Eye className="w-4 h-4" />
        )}
      </button>
    </div>
  );
}
