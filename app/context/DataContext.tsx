"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { ServerData, IdentityRecord, IdentityStatus } from "../types/api";
import { MOCK_DB } from "../data/mock-db";

interface DataContextType {
  data: ServerData;
  isLoading: boolean;
  updateIdentityStatus: (id: string, status: IdentityStatus) => void;
  refreshData: () => Promise<void>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [data, setData] = useState<ServerData>(MOCK_DB);
  const [isLoading, setIsLoading] = useState(true);

  // Simulating an initial fetch
  useEffect(() => {
    // Simulate API delay
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

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

  const refreshData = async () => {
    setIsLoading(true);
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setData({ ...MOCK_DB }); // Resets to mock data or would fetch from API
    setIsLoading(false);
  };

  return (
    <DataContext.Provider
      value={{ data, isLoading, updateIdentityStatus, refreshData }}
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
