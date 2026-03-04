"use client";

import React, { useState } from "react";
import { useData } from "@/app/context/DataContext";
import { Building2, UserCircle2, Plus, ArrowRight } from "lucide-react";

export default function OrganizationsPage() {
  const { data, addOrganization, assignEncargado } = useData();
  const [newOrgName, setNewOrgName] = useState("");
  const [isAdding, setIsAdding] = useState(false);

  // Filter users that could be encargados (all except superadmins)
  const potentialEncargados = data.users.filter((u) => u.role === "encargado");

  const handleAddOrg = (e: React.FormEvent) => {
    e.preventDefault();
    if (newOrgName.trim()) {
      addOrganization(newOrgName);
      setNewOrgName("");
      setIsAdding(false);
    }
  };

  return (
    <div className="p-8 space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-montserrat font-bold text-white">
            Gestión de Organizaciones
          </h1>
          <p className="text-white/60 font-poppins">
            Administra las organizaciones y asigna encargados.
          </p>
        </div>

        <button
          onClick={() => setIsAdding(true)}
          className="flex items-center gap-2 bg-white text-primary px-6 py-3 rounded-xl font-bold font-poppins hover:bg-white/90 transition-all"
        >
          <Plus size={20} />
          Nueva Organización
        </button>
      </div>

      {isAdding && (
        <form
          onSubmit={handleAddOrg}
          className="bg-white/5 border border-white/10 p-6 rounded-2xl animate-in fade-in slide-in-from-top-4 duration-300"
        >
          <div className="flex gap-4">
            <input
              type="text"
              value={newOrgName}
              onChange={(e) => setNewOrgName(e.target.value)}
              placeholder="Nombre de la organización"
              className="flex-1 bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-white/40 font-poppins"
              autoFocus
            />
            <button
              type="submit"
              className="bg-white text-primary px-8 rounded-xl font-bold font-poppins"
            >
              Crear
            </button>
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="text-white/60 px-4"
            >
              Cancelar
            </button>
          </div>
        </form>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {data.organizations.map((org) => {
          const encargado = data.users.find((u) => u.id === org.encargadoId);

          return (
            <div
              key={org.id}
              className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:border-white/20 transition-all group"
            >
              <div className="flex justify-between items-start mb-6">
                <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center text-white group-hover:scale-110 transition-transform">
                  <Building2 size={24} />
                </div>
                <span className="text-[10px] text-white/40 uppercase tracking-widest font-bold">
                  ID: {org.id.split("_")[1]}
                </span>
              </div>

              <h3 className="text-xl font-bold text-white mb-2 font-montserrat">
                {org.name}
              </h3>

              <div className="space-y-4">
                <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/5">
                  <UserCircle2 size={18} className="text-white/40" />
                  <div className="flex-1">
                    <p className="text-[10px] text-white/40 uppercase font-bold">
                      Encargado
                    </p>
                    <p className="text-sm text-white font-poppins">
                      {encargado ? encargado.name : "Sin asignar"}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-[10px] text-white/40 uppercase font-bold">
                    Asignar Encargado
                  </label>
                  <select
                    onChange={(e) => assignEncargado(org.id, e.target.value)}
                    value={org.encargadoId || ""}
                    className="bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-xs text-white focus:outline-none font-poppins w-full"
                  >
                    <option value="" className="bg-primary">
                      Seleccionar usuario...
                    </option>
                    {potentialEncargados.map((u) => (
                      <option key={u.id} value={u.id} className="bg-primary">
                        {u.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
