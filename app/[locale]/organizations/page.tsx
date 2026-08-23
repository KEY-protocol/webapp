"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  Building2,
  Search,
  Plus,
  RefreshCw,
  Database,
  UserPlus,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  X,
  Server,
  Loader2,
  Filter,
} from "lucide-react";
import {
  OrganizationRecord,
  organizationsService,
  CreateOrgPayload,
} from "@/app/services/organizationsService";
import CredentialsModal from "@/app/components/organizations/CredentialsModal";
import OrgAdminsModal from "@/app/components/organizations/OrgAdminsModal";
import { toast } from "react-toastify";

export default function OrganizationsPage() {
  const [organizations, setOrganizations] = useState<OrganizationRecord[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // Modals state
  const [selectedOrgForCredentials, setSelectedOrgForCredentials] =
    useState<OrganizationRecord | null>(null);
  const [selectedOrgForAdmins, setSelectedOrgForAdmins] =
    useState<OrganizationRecord | null>(null);

  // New Org Modal
  const [isNewOrgModalOpen, setIsNewOrgModalOpen] = useState(false);
  const [newOrgName, setNewOrgName] = useState("");
  const [newOrgSlug, setNewOrgSlug] = useState("");
  const [newOrgEmail, setNewOrgEmail] = useState("");
  const [newOrgDesc, setNewOrgDesc] = useState("");
  const [newOrgDbString, setNewOrgDbString] = useState("");
  const [newOrgServerUrl, setNewOrgServerUrl] = useState("");
  const [isSubmittingNew, setIsSubmittingNew] = useState(false);

  const fetchOrganizations = async () => {
    setIsLoading(true);
    try {
      const data = await organizationsService.getOrganizations();
      setOrganizations(data);
    } catch {
      toast.error("Error al cargar la lista de organizaciones");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrganizations();
  }, []);

  const filteredOrgs = useMemo(() => {
    return organizations.filter((org) => {
      if (search.trim()) {
        const q = search.toLowerCase();
        const matchName = org.name.toLowerCase().includes(q);
        const matchSlug = org.slug.toLowerCase().includes(q);
        if (!matchName && !matchSlug) return false;
      }
      if (statusFilter !== "all" && org.status !== statusFilter) {
        return false;
      }
      return true;
    });
  }, [organizations, search, statusFilter]);

  const handleNameChange = (val: string) => {
    setNewOrgName(val);
    if (!newOrgSlug) {
      setNewOrgSlug(
        val
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/^-|-$/g, "")
      );
    }
  };

  const handleCreateNewOrg = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newOrgName.trim() || !newOrgSlug.trim()) {
      toast.error("Por favor ingresa el nombre y slug de la organización");
      return;
    }

    setIsSubmittingNew(true);
    try {
      const payload: CreateOrgPayload = {
        name: newOrgName.trim(),
        slug: newOrgSlug.trim(),
        description: newOrgDesc.trim() || undefined,
        contactEmail: newOrgEmail.trim() || undefined,
        dbConnectionString: newOrgDbString.trim() || undefined,
        apiBaseUrl: newOrgServerUrl.trim() || undefined,
      };

      await organizationsService.createOrganization(payload);
      toast.success(`Organización "${newOrgName}" creada exitosamente`);
      setIsNewOrgModalOpen(false);

      // Reset form
      setNewOrgName("");
      setNewOrgSlug("");
      setNewOrgEmail("");
      setNewOrgDesc("");
      setNewOrgDbString("");
      setNewOrgServerUrl("");

      fetchOrganizations();
    } catch (err: any) {
      toast.error(
        err.response?.data?.error ||
          err.response?.data?.message ||
          err.message ||
          "Error al crear la organización"
      );
    } finally {
      setIsSubmittingNew(false);
    }
  };

  const handleToggleStatus = async (org: OrganizationRecord) => {
    const nextStatus = org.status === "ACTIVE" ? "SUSPENDED" : "ACTIVE";
    try {
      await organizationsService.updateOrganization(org.id, { status: nextStatus });
      toast.success(
        `Organización ${org.name} ${nextStatus === "ACTIVE" ? "activada" : "suspendida"}`
      );
      fetchOrganizations();
    } catch {
      toast.error("Error al actualizar el estado de la organización");
    }
  };

  return (
    <div className="flex-1 p-6 md:p-10 bg-primary min-h-screen">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
          <div>
            <div className="flex items-center gap-3">
              <Building2 className="w-8 h-8 text-[#28a745]" />
              <h1 className="text-3xl font-montserrat font-bold text-white">
                Gestión de Organizaciones
              </h1>
            </div>
            <p className="text-white/50 font-poppins text-sm mt-1">
              Panel Superadmin: Administra las organizaciones que tienen acceso a la plataforma, configura sus bases de datos e infraestructuras independientes y asigna sus usuarios administradores.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => setIsNewOrgModalOpen(true)}
              className="flex items-center gap-2 bg-[#28a745] hover:bg-[#218838] text-white px-5 py-2.5 rounded-xl font-bold font-poppins transition-all text-sm cursor-pointer shadow-lg shadow-green-950/30"
            >
              <Plus className="w-4 h-4" />
              Nueva Organización
            </button>

            <button
              onClick={fetchOrganizations}
              className="p-2.5 bg-white/10 hover:bg-white/15 text-white rounded-xl transition-all cursor-pointer"
              title="Actualizar lista"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} />
            </button>
          </div>
        </div>

        {/* Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white/[0.04] border border-white/10 rounded-2xl p-5 space-y-2">
            <p className="text-white/40 text-xs font-poppins font-bold uppercase tracking-wider">
              Total Organizaciones
            </p>
            <p className="text-3xl font-montserrat font-bold text-white">
              {organizations.length}
            </p>
            <p className="text-white/50 text-xs font-poppins">
              Registradas en plataforma
            </p>
          </div>

          <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-5 space-y-2">
            <p className="text-emerald-400/80 text-xs font-poppins font-bold uppercase tracking-wider">
              ONGs Activas
            </p>
            <p className="text-3xl font-montserrat font-bold text-emerald-400">
              {organizations.filter((o) => o.status === "ACTIVE").length}
            </p>
            <p className="text-emerald-300/60 text-xs font-poppins">
              Operando con servicios activos
            </p>
          </div>

          <div className="bg-cyan-500/10 border border-cyan-500/20 rounded-2xl p-5 space-y-2">
            <p className="text-cyan-400/80 text-xs font-poppins font-bold uppercase tracking-wider">
              Administradores de ONG
            </p>
            <p className="text-3xl font-montserrat font-bold text-cyan-400">
              {organizations.reduce((acc, curr) => acc + (curr.adminCount || 0), 0)}
            </p>
            <p className="text-cyan-300/60 text-xs font-poppins">
              Usuarios Admin asignados
            </p>
          </div>

          <div className="bg-amber-500/10 border border-amber-500/20 rounded-2xl p-5 space-y-2">
            <p className="text-amber-400/80 text-xs font-poppins font-bold uppercase tracking-wider">
              Bases de Datos Dedicadas
            </p>
            <p className="text-3xl font-montserrat font-bold text-amber-400">
              {organizations.filter((o) => o.config?.dbConnectionString).length}
            </p>
            <p className="text-amber-300/60 text-xs font-poppins">
              DBs PostgreSQL independientes
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative md:col-span-2">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar organización por nombre o slug..."
              className="w-full bg-white/5 border border-white/10 rounded-xl pl-11 pr-4 py-3 text-white text-sm placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-[#28a745]/40 transition-all font-poppins"
            />
          </div>

          <div className="relative">
            <Filter className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full bg-[#162713] border border-white/10 rounded-xl pl-11 pr-4 py-3 text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#28a745]/40 transition-all font-poppins cursor-pointer"
            >
              <option value="all">Todos los estados</option>
              <option value="ACTIVE">Activas</option>
              <option value="SUSPENDED">Suspendidas</option>
              <option value="INACTIVE">Inactivas</option>
            </select>
          </div>
        </div>

        {/* List / Table */}
        {isLoading ? (
          <div className="bg-white/5 border border-white/10 rounded-2xl p-12 flex justify-center items-center">
            <Loader2 className="w-8 h-8 text-[#28a745] animate-spin" />
          </div>
        ) : filteredOrgs.length === 0 ? (
          <div className="bg-white/5 border border-dashed border-white/15 rounded-2xl p-16 text-center">
            <p className="text-white/40 font-poppins text-base">
              No se encontraron organizaciones para los criterios seleccionados.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {filteredOrgs.map((org) => (
              <div
                key={org.id}
                className="bg-white/[0.03] hover:bg-white/[0.06] border border-white/5 hover:border-white/10 rounded-2xl p-6 transition-all duration-200"
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                  {/* Info */}
                  <div className="flex items-start gap-4 flex-1 min-w-0">
                    <div className="w-12 h-12 rounded-2xl bg-[#28a745]/15 border border-[#28a745]/30 flex items-center justify-center shrink-0 text-[#28a745]">
                      <Building2 className="w-6 h-6" />
                    </div>
                    <div className="min-w-0 space-y-1">
                      <div className="flex items-center gap-3 flex-wrap">
                        <h3 className="text-white font-montserrat font-bold text-lg">
                          {org.name}
                        </h3>
                        <span className="text-white/40 text-xs font-mono bg-white/5 px-2 py-0.5 rounded">
                          slug: {org.slug}
                        </span>
                        {org.slug === "key-protocol" && (
                          <span className="text-[10px] bg-emerald-500/20 text-emerald-300 font-bold px-2 py-0.5 rounded border border-emerald-500/30">
                            Organización Raíz
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-white/50 font-poppins line-clamp-1">
                        {org.description || "Sin descripción asignada."}
                      </p>
                      <div className="flex items-center gap-4 text-xs text-white/40 font-poppins pt-1 flex-wrap">
                        <span>Contacto: {org.contactEmail || "Sin email"}</span>
                        <span>•</span>
                        <span>Alta: {new Date(org.createdAt).toLocaleDateString()}</span>
                        <span>•</span>
                        <span className="text-cyan-300">
                          {org.adminCount || 0} Admin(s) asignados
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Status & Actions */}
                  <div className="flex flex-wrap lg:flex-nowrap items-center gap-3 shrink-0">
                    <div>
                      <span
                        className={`inline-block px-3 py-1 text-[11px] font-bold rounded-full uppercase tracking-wider ${
                          org.status === "ACTIVE"
                            ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/25"
                            : "bg-red-500/15 text-red-400 border border-red-500/25"
                        }`}
                      >
                        {org.status}
                      </span>
                    </div>

                    <button
                      onClick={() => setSelectedOrgForCredentials(org)}
                      className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-semibold font-poppins transition-all cursor-pointer border border-white/10"
                      title="Configurar credenciales de DB e Infraestructura"
                    >
                      <Database className="w-3.5 h-3.5 text-emerald-400" />
                      Credenciales BD
                    </button>

                    <button
                      onClick={() => setSelectedOrgForAdmins(org)}
                      className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-semibold font-poppins transition-all cursor-pointer border border-white/10"
                      title="Crear o gestionar administradores de la ONG"
                    >
                      <UserPlus className="w-3.5 h-3.5 text-cyan-400" />
                      Crear Admins
                    </button>

                    {org.slug !== "key-protocol" && (
                      <button
                        onClick={() => handleToggleStatus(org)}
                        className={`px-3 py-2 rounded-xl text-xs font-bold font-poppins transition-all cursor-pointer border ${
                          org.status === "ACTIVE"
                            ? "border-red-500/30 text-red-400 hover:bg-red-500/10"
                            : "border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10"
                        }`}
                      >
                        {org.status === "ACTIVE" ? "Suspender" : "Activar"}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Credentials Modal */}
      {selectedOrgForCredentials && (
        <CredentialsModal
          isOpen={!!selectedOrgForCredentials}
          onClose={() => setSelectedOrgForCredentials(null)}
          organization={selectedOrgForCredentials}
          onSuccess={fetchOrganizations}
        />
      )}

      {/* Org Admins Modal */}
      {selectedOrgForAdmins && (
        <OrgAdminsModal
          isOpen={!!selectedOrgForAdmins}
          onClose={() => setSelectedOrgForAdmins(null)}
          organization={selectedOrgForAdmins}
          onSuccess={fetchOrganizations}
        />
      )}

      {/* New Organization Modal */}
      {isNewOrgModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/75 backdrop-blur-sm"
            onClick={() => setIsNewOrgModalOpen(false)}
          />

          <div className="relative w-full max-w-xl bg-[#142612] border border-white/15 rounded-3xl shadow-2xl overflow-hidden p-6 md:p-8 space-y-6">
            <div className="flex justify-between items-center pb-4 border-b border-white/10">
              <div className="flex items-center gap-3">
                <Building2 className="w-6 h-6 text-[#28a745]" />
                <h2 className="font-montserrat text-xl font-bold text-white">
                  Dar de Alta Nueva Organización
                </h2>
              </div>
              <button
                onClick={() => setIsNewOrgModalOpen(false)}
                className="p-2 rounded-full hover:bg-white/10 text-white/60 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateNewOrg} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-white/80">Nombre de la Organización *</label>
                  <input
                    type="text"
                    value={newOrgName}
                    onChange={(e) => handleNameChange(e.target.value)}
                    placeholder="Ej. Fundación Gran Chaco"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-[#28a745]"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-white/80">Slug Identificador *</label>
                  <input
                    type="text"
                    value={newOrgSlug}
                    onChange={(e) => setNewOrgSlug(e.target.value)}
                    placeholder="fundacion-gran-chaco"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-[#28a745] font-mono"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-white/80">Email de Contacto</label>
                <input
                  type="email"
                  value={newOrgEmail}
                  onChange={(e) => setNewOrgEmail(e.target.value)}
                  placeholder="contacto@granchaco.org"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-[#28a745]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-white/80">Descripción Corta</label>
                <textarea
                  value={newOrgDesc}
                  onChange={(e) => setNewOrgDesc(e.target.value)}
                  placeholder="Descripción de la ONG y sus proyectos..."
                  rows={2}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-xs text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-[#28a745]"
                />
              </div>

              {/* Initial DB & Server Config Optional */}
              <div className="space-y-1 pt-2 border-t border-white/10">
                <label className="text-xs font-semibold text-white/80 flex items-center gap-2">
                  <Database className="w-3.5 h-3.5 text-emerald-400" />
                  Cadena de Conexión BD PostgreSQL (Opcional)
                </label>
                <input
                  type="text"
                  value={newOrgDbString}
                  onChange={(e) => setNewOrgDbString(e.target.value)}
                  placeholder="postgresql://user:pass@host:5432/db_ong"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-[#28a745] font-mono"
                />
              </div>

              <div className="flex justify-end items-center gap-3 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setIsNewOrgModalOpen(false)}
                  className="px-5 py-2 rounded-xl border border-white/10 text-white text-xs font-bold hover:bg-white/5 transition-colors cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingNew}
                  className="flex items-center gap-2 px-6 py-2 rounded-xl bg-[#28a745] hover:bg-[#218838] text-white text-xs font-bold transition-all cursor-pointer shadow-lg shadow-green-950/30 disabled:opacity-50"
                >
                  {isSubmittingNew && <Loader2 className="w-4 h-4 animate-spin" />}
                  Crear Organización
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
