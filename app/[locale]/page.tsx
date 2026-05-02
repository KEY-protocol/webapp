"use client";

import { LanguageSwitcher } from "@/app/components/header/LanguageSwitcher";
import { AuthHeader } from "@/app/components/auth/AuthHeader";
import { LoginForm } from "@/app/components/auth/LoginForm";

export default function Home() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center py-8 px-6 relative">
      <div className="absolute top-6 right-6">
        <LanguageSwitcher />
      </div>
      <div className="w-full max-w-110 flex flex-col items-center">
        <AuthHeader />
        <LoginForm />
      </div>
    </div>
  );
}
