"use client";

import React, { createContext, useContext, useState, useEffect, useMemo } from "react";
import {
  ServerData,
  IdentityStatus,
  UserProfile,
  Organization,
} from "../types/api";
import { MOCK_DB } from "../data/mock-db";
import { useAuth } from "./AuthContext";

interface DataContextType {
  data: ServerData;
  isLoading: boolean;
  updateIdentityStatus: (id: string, status: IdentityStatus) => void;
  refreshData: () => Promise<void>;
  addOrganization: (name: string) => void;
  assignEncargado: (orgId: string, userId: string) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [data, setData] = useState<ServerData>(MOCK_DB);
  const [isLoading, setIsLoading] = useState(true);
  const { user: authUser } = useAuth();

  // Simulating an initial fetch
  useEffect(() => {
    // Simulate API delay
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  /**
   * Derive currentUser from the authenticated session.
   * When a user logs in, we match them by email against the mock users list,
   * or build a UserProfile from the AuthContext data.
   * This avoids calling setState inside useEffect (cascading renders).
   * TODO: Replace with real API call once the backend is ready.
   */
  const resolvedCurrentUser: UserProfile = useMemo(() => {
    if (!authUser) return data.currentUser;

    // Try to find the user in the mock DB by email
    const matchedUser = data.users.find(
      (u) => u.email.toLowerCase() === authUser.email.toLowerCase(),
    );

    if (matchedUser) return matchedUser;

    // Build a UserProfile from the authenticated session
    return {
      id: authUser.id,
      name: authUser.email.split("@")[0],
      email: authUser.email,
      role: authUser.role.toLowerCase() as UserProfile["role"],
      organizationId: authUser.ongId || undefined,
    };
  }, [authUser, data.currentUser, data.users]);

  /** The data object exposed to consumers, with the resolved currentUser. */
  const resolvedData: ServerData = useMemo(
    () => ({ ...data, currentUser: resolvedCurrentUser }),
    [data, resolvedCurrentUser],
  );

  const updateIdentityStatus = (id: string, status: IdentityStatus) => {
    setData((prev) => {
      const newIdentities = prev.identities.map((item) =>
        item.id === id
          ? { ...item, updatedAt: new Date().toISOString(), status }
          : item,
      );

      // Recalculate stats
      const stats = {
        totalPending: newIdentities.filter(
          (i) => i.status === "pending" || i.status === "in_review",
        ).length,
        totalApproved: newIdentities.filter((i) => i.status === "approved")
          .length,
        totalRejected: newIdentities.filter((i) => i.status === "rejected")
          .length,
      };

      return { ...prev, identities: newIdentities, stats };
    });
  };

  const addOrganization = (name: string) => {
    const newOrg: Organization = {
      id: `org_${Date.now()}`,
      name,
      createdAt: new Date().toISOString(),
    };
    setData((prev) => ({
      ...prev,
      organizations: [...prev.organizations, newOrg],
    }));
  };

  const assignEncargado = (orgId: string, userId: string) => {
    setData((prev) => {
      const newOrgs = prev.organizations.map((org) =>
        org.id === orgId ? { ...org, encargadoId: userId } : org,
      );
      const newUsers = prev.users.map((user) =>
        user.id === userId ? { ...user, organizationId: orgId } : user,
      );
      return { ...prev, organizations: newOrgs, users: newUsers };
    });
  };

  const refreshData = async () => {
    setIsLoading(true);
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setData({ ...MOCK_DB }); // Resets to mock data or would fetch from API
    setIsLoading(false);
  };

  return (
    <DataContext.Provider
      value={{
        data: resolvedData,
        isLoading,
        updateIdentityStatus,
        refreshData,
        addOrganization,
        assignEncargado,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error("useData must be used within a DataProvider");
  }
  return context;
};
