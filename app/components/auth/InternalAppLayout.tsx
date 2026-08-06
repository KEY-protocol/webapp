"use client";

import { ProtectedRoute } from "@/app/components/auth/ProtectedRoute";
import { Sidebar } from "@/app/components/sidebar";
import { PageHeader } from "@/app/components/header";

interface InternalAppLayoutProps {
  children: React.ReactNode;
  namespace: string;
}

export function InternalAppLayout({ children, namespace }: InternalAppLayoutProps) {
  return (
    <ProtectedRoute>
      <div className="flex bg-primary min-h-screen">
        <Sidebar />
        <div className="flex-1 flex flex-col min-h-screen">
          <PageHeader namespace={namespace} />
          <main className="flex-1 overflow-x-hidden">{children}</main>
        </div>
      </div>
    </ProtectedRoute>
  );
}
