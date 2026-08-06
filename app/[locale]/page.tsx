"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";
import { LanguageSwitcher } from "@/app/components/header/LanguageSwitcher";
import { AuthHeader } from "@/app/components/auth/AuthHeader";
import { LoginForm } from "@/app/components/auth/LoginForm";

export default function Home() {
  const { isAuthenticated, isInitializing } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isInitializing && isAuthenticated) {
      router.replace("/home");
    }
  }, [isAuthenticated, isInitializing, router]);

  if (isInitializing) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (isAuthenticated) {
    return null;
  }

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

