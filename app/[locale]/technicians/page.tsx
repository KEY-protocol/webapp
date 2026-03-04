"use client";

import React from "react";
import { useData } from "@/app/context/DataContext";
import TechnicianCard from "@/app/components/technicians/TechnicianCard";
import { UserPlus } from "lucide-react";

export default function TechniciansPage() {
  const { data } = useData();
  const currentUser = data.currentUser;

  // Filter users that are Admins and belong to the same organization as the current user (if current user is Encargado)
  const organizationAdmins = data.users.filter(
    (u) =>
      u.role === "admin" &&
      (currentUser.role === "superadmin" ||
        u.organizationId === currentUser.organizationId),
  );

  return (
    <div className="flex-1 p-6 md:p-10 bg-primary min-h-screen">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-montserrat font-bold text-white">
              Gestion de Admins
            </h1>
            <p className="text-white/60 font-poppins">
              Administra los usuarios que operan la plataforma en tu
              organización.
            </p>
          </div>

          <button className="flex items-center gap-2 bg-white text-primary px-6 py-3 rounded-xl font-bold font-poppins hover:bg-white/90 transition-all">
            <UserPlus size={20} />
            Nuevo Admin
          </button>
        </div>

        <div className="flex flex-col gap-6">
          {organizationAdmins.length > 0 ? (
            organizationAdmins.map((admin) => (
              <TechnicianCard
                key={admin.id}
                name={admin.name}
                role="Administrador de Organización"
                id={admin.id.split("_")[1] || admin.id}
                birthDate="N/A"
                project="Varios"
                expertise="Gestión Org"
                zone="Sede Central"
                wallet="0x..."
                did="did:key:..."
              />
            ))
          ) : (
            <div className="bg-white/5 border border-dashed border-white/20 rounded-3xl p-20 text-center">
              <p className="text-white/40 font-poppins text-lg">
                No hay administradores asignados a esta organización todavía.
              </p>
            </div>
          )}
        </div>

        {/* TODO: Implement pagination or infinite scroll when integrated with backend */}
        {/* TODO: Fetch data from server once API is ready */}
      </div>
    </div>
  );
}
