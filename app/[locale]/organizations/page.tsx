"use client";

import React, { useState } from "react";
import { useTranslations } from "next-intl";
import { useData } from "@/app/context/DataContext";
import { OrganizationsHeader } from "./_components/OrganizationsHeader";
import { AddOrganizationForm } from "./_components/AddOrganizationForm";
import { OrganizationCard } from "./_components/OrganizationCard";
import { RoleListModal } from "./_components/RoleListModal";
import { Organization, UserProfile } from "@/app/types/api";

export default function OrganizationsPage() {
  const t = useTranslations("organizations_page");
  const tr = useTranslations("roles");
  const { data, addOrganization } = useData();
  const [isAdding, setIsAdding] = useState(false);
  
  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedOrg, setSelectedOrg] = useState<Organization | null>(null);
  const [selectedRole, setSelectedRole] = useState<string>("");
  const [filteredUsers, setFilteredUsers] = useState<UserProfile[]>([]);

  const handleAddOrg = (name: string) => {
    // TODO: Connect with backend (POST /organizations)
    // This should send the new organization name and wait for server confirmation
    addOrganization(name);
    setIsAdding(false);
  };

  const handleViewRole = (org: Organization, role: string) => {
    // TODO: Connect with backend (GET /organizations/:id/users?role=:role)
    // In a real scenario, we would fetch users by orgId and role from the server
    // For now, we simulate filtering the mock data
    const users = data.users.filter((u) => u.role === role);
    
    setSelectedOrg(org);
    setSelectedRole(role);
    setFilteredUsers(users);
    setModalOpen(true);
  };

  /**
   * TODO: Implement server-side calls for adding new users.
   * These functions will eventually open a modal and send data to the backend.
   * Endpoints: 
   * - POST /users (with organizationId and role)
   */
  const handleAddAdmin = (orgId: string) => {
    console.log(`TODO: Implement Add Admin for org ${orgId}`);
    alert(t("pendingFeature", { feature: "Admin" }));
  };

  const handleAddEncargado = (orgId: string) => {
    console.log(`TODO: Implement Add Encargado for org ${orgId}`);
    alert(t("pendingFeature", { feature: "Encargado" }));
  };

  const handleAddTecnico = (orgId: string) => {
    console.log(`TODO: Implement Add Técnico for org ${orgId}`);
    alert(t("pendingFeature", { feature: "Técnico" }));
  };

  return (
    <div className="p-8 space-y-8 animate-in fade-in duration-700">
      <OrganizationsHeader 
        onAddNewClick={() => setIsAdding(true)} 
        t={t} 
      />

      {isAdding && (
        <AddOrganizationForm
          onAdd={handleAddOrg}
          onCancel={() => setIsAdding(false)}
          t={t}
        />
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {data.organizations.map((org) => (
          <OrganizationCard
            key={org.id}
            org={org}
            onAddAdmin={handleAddAdmin}
            onAddEncargado={handleAddEncargado}
            onAddTecnico={handleAddTecnico}
            onViewRole={handleViewRole}
            t={t}
          />
        ))}
      </div>

      <RoleListModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        users={filteredUsers}
        roleName={selectedRole ? tr(selectedRole) : ""}
        orgName={selectedOrg?.name || ""}
        t={t}
      />
    </div>
  );
}
