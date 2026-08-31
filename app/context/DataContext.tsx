"use client";

import React, { createContext, useContext, useState, useEffect, useMemo } from "react";
import {
  ServerData,
  IdentityStatus,
  UserProfile,
  Organization,
} from "../types/api";
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

const EMPTY_SERVER_DATA: ServerData = {
  currentUser: {
    id: "",
    name: "Usuario",
    email: "",
    role: "admin",
  },
  users: [],
  organizations: [],
  evidences: [],
  identities: [],
  stats: {
    totalPending: 0,
    totalApproved: 0,
    totalRejected: 0,
  },
  notifications: [],
};

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [data, setData] = useState<ServerData>(EMPTY_SERVER_DATA);
  const [isLoading, setIsLoading] = useState(false);
  const { user: authUser } = useAuth();

  const resolvedCurrentUser: UserProfile = useMemo(() => {
    if (!authUser) return data.currentUser;

    const matchedUser = data.users.find(
      (u) => u.email.toLowerCase() === authUser.email.toLowerCase(),
    );

    if (matchedUser) return matchedUser;

    return {
      id: authUser.id,
      name: authUser.email ? authUser.email.split("@")[0] : "Usuario",
      email: authUser.email,
      role: authUser.role.toLowerCase() as UserProfile["role"],
      ongId: authUser.ongId || undefined,
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
    await new Promise((resolve) => setTimeout(resolve, 300));
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
