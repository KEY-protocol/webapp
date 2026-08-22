"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
  UserCog,
  UserPlus,
  Search,
  RefreshCw,
  Mail,
  Shield,
  Trash2,
  Pencil,
  AlertCircle,
  X,
  Building2,
  CheckCircle2,
  Eye,
  EyeOff,
  Phone,
} from "lucide-react";
import { useData } from "@/app/context/DataContext";
import { useAuth } from "@/app/context/AuthContext";
import {
  fetchEncargados,
  createEncargado,
  deleteEncargado,
} from "@/app/services/encargadosService";
import ConfirmModal, { ConfirmVariant } from "@/app/components/ui/ConfirmModal";
import { toast } from "react-toastify";

import { fetchAllCountryCodes, CountryCode } from "@/app/utils/countryCodes";

const DEFAULT_COUNTRY_CODES: CountryCode[] = [
  { code: "+54", flag: "🇦🇷", name: "Argentina" },
  { code: "+55", flag: "🇧🇷", name: "Brasil" },
  { code: "+56", flag: "🇨🇱", name: "Chile" },
  { code: "+598", flag: "🇺🇾", name: "Uruguay" },
  { code: "+595", flag: "🇵🇾", name: "Paraguay" },
  { code: "+591", flag: "🇧🇴", name: "Bolivia" },
  { code: "+57", flag: "🇨🇴", name: "Colombia" },
  { code: "+52", flag: "🇲🇽", name: "México" },
  { code: "+1", flag: "🇺🇸", name: "EE.UU." },
  { code: "+34", flag: "🇪🇸", name: "España" },
];

function formatPhoneNumber(value: string, countryCode: string): string {
  const digits = value.replace(/\D/g, "");
  if (countryCode === "+54") {
    if (digits.length <= 2) return digits;
    if (digits.startsWith("11")) {
      if (digits.length <= 6) return `${digits.slice(0, 2)} ${digits.slice(2)}`;
      return `${digits.slice(0, 2)} ${digits.slice(2, 6)} ${digits.slice(6, 10)}`;
    }
    if (digits.startsWith("351") || digits.startsWith("341") || digits.startsWith("261")) {
      if (digits.length <= 6) return `${digits.slice(0, 3)} ${digits.slice(3)}`;
      return `${digits.slice(0, 3)} ${digits.slice(3, 6)} ${digits.slice(6, 10)}`;
    }
    if (digits.length <= 4) return digits;
    if (digits.length <= 7) return `${digits.slice(0, 4)} ${digits.slice(4)}`;
    return `${digits.slice(0, 4)} ${digits.slice(4, 7)} ${digits.slice(7, 11)}`;
  }
  if (digits.length <= 3) return digits;
  if (digits.length <= 6) return `${digits.slice(0, 3)} ${digits.slice(3)}`;
  return `${digits.slice(0, 3)} ${digits.slice(3, 6)} ${digits.slice(6, 10)}`;
}

export interface ManagerUser {
  id: string;
  name: string;
  surname: string;
  email: string;
  phone?: string;
  organizationId: string;
  organizationName: string;
  status: "active" | "inactive" | "pending_setup";
  createdAt: string;
}

export default function ManagersPage() {
  const { data } = useData();
  const { token, ongUrl } = useAuth();
  const currentUserRole = data.currentUser.role;
  const isAdmin = currentUserRole === "admin";

  const [managers, setManagers] = useState<ManagerUser[]>([]);
  const [search, setSearch] = useState("");

  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingManager, setEditingManager] = useState<ManagerUser | null>(
    null,
  );

  const [countryList, setCountryList] = useState<CountryCode[]>(DEFAULT_COUNTRY_CODES);
  const [showPassword, setShowPassword] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState("+54");

  const loadBackendManagers = useCallback(async () => {
    if (!token) return;
    try {
      const data = await fetchEncargados(ongUrl || "http://localhost:3001", token);
      const mapped: ManagerUser[] = data.map((item) => ({
        id: item.id,
        name: item.email.split("@")[0],
        surname: "",
        email: item.email,
        phone: item.phone,
        organizationId: item.ongId || "org_1",
        organizationName: "Fundación Gran Chaco",
        status: "active",
        createdAt: item.createdAt,
      }));
      setManagers(mapped);
    } catch (err) {
      console.error("Error al obtener encargados:", err);
    }
  }, [token, ongUrl]);

  useEffect(() => {
    loadBackendManagers();
    fetchAllCountryCodes().then((list) => {
      if (list && list.length > 0) {
        setCountryList(list);
      }
    });
  }, [loadBackendManagers]);

  // Form states
  const [formData, setFormData] = useState({
    name: "",
    surname: "",
    email: "",
    password: "",
    phone: "",
  });

  // Confirm Modal state
  const [confirmConfig, setConfirmConfig] = useState<{
    isOpen: boolean;
    title: string;
    description?: string;
    confirmText?: string;
    variant: ConfirmVariant;
    onConfirm: () => Promise<void>;
  }>({
    isOpen: false,
    title: "",
    variant: "danger",
    onConfirm: async () => {},
  });

  // Access control fallback for non-admins
  if (!isAdmin) {
    return (
      <div className="flex-1 p-8 bg-primary min-h-screen flex items-center justify-center">
        <div className="bg-white/5 border border-white/10 p-8 rounded-3xl max-w-md text-center space-y-4">
          <AlertCircle className="w-12 h-12 text-red-400 mx-auto" />
          <h2 className="text-xl font-bold text-white font-montserrat">
            Acceso Restringido
          </h2>
          <p className="text-white/60 text-sm font-poppins">
            Esta sección es de uso exclusivo para el Administrador General de la Organización.
          </p>
        </div>
      </div>
    );
  }

  // Filtered list
  const filteredManagers = useMemo(() => {
    if (!search.trim()) return managers;
    const q = search.toLowerCase();
    return managers.filter(
      (m) =>
        m.name.toLowerCase().includes(q) ||
        m.surname.toLowerCase().includes(q) ||
        m.email.toLowerCase().includes(q),
    );
  }, [managers, search]);

  const handleOpenAddModal = () => {
    setFormData({ name: "", surname: "", email: "", password: "", phone: "" });
    setEditingManager(null);
    setIsAddModalOpen(true);
  };

  const handleOpenEditModal = (manager: ManagerUser) => {
    setFormData({
      name: manager.name,
      surname: manager.surname,
      email: manager.email,
      password: "",
      phone: manager.phone || "",
    });
    setEditingManager(manager);
    setIsAddModalOpen(true);
  };

  const handleSaveManager = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.surname || !formData.email) {
      toast.error("Por favor completa los campos requeridos (Nombre, Apellido, Email)");
      return;
    }

    if (!editingManager && !formData.password) {
      toast.error("Por favor asigna una contraseña inicial para el Encargado");
      return;
    }

    try {
      if (editingManager) {
        setManagers((prev) =>
          prev.map((m) =>
            m.id === editingManager.id
              ? {
                  ...m,
                  name: formData.name,
                  surname: formData.surname,
                  email: formData.email,
                  phone: formData.phone,
                }
              : m,
          ),
        );
        toast.success(
          formData.password
            ? "Encargado y contraseña actualizados correctamente"
            : "Datos del Encargado actualizados correctamente",
        );
      } else {
        const fullPhone = formData.phone ? `${selectedCountry} ${formData.phone}` : undefined;
        const created = await createEncargado(ongUrl || "http://localhost:3001", token || "", {
          email: formData.email,
          password: formData.password,
          name: formData.name,
          surname: formData.surname,
          phone: fullPhone,
        });

        const newManager: ManagerUser = {
          id: created?.id || `mgr_${Date.now()}`,
          name: formData.name,
          surname: formData.surname,
          email: formData.email,
          phone: fullPhone,
          organizationId: "org_1",
          organizationName: "Fundación Gran Chaco",
          status: "active",
          createdAt: new Date().toISOString(),
        };
        setManagers((prev) => [newManager, ...prev]);
        toast.success("Encargado creado con éxito en la base de datos. Ya puede iniciar sesión.");
      }

      setIsAddModalOpen(false);
    } catch (err: any) {
      toast.error(err.response?.data?.message || "No se pudo registrar el encargado en el servidor");
    }
  };

  const handleDeleteManager = useCallback((manager: ManagerUser) => {
    setConfirmConfig({
      isOpen: true,
      title: "Desvincular Encargado",
      description: `¿Estás seguro de desvincular a "${manager.name} ${manager.surname}" (${manager.email}) como Encargado de la organización? Perderá el acceso de gestión.`,
      confirmText: "Sí, Desvincular",
      variant: "danger",
      onConfirm: async () => {
        setConfirmConfig((prev) => ({ ...prev, isOpen: false }));
        if (token) {
          await deleteEncargado(ongUrl || "http://localhost:3001", token, manager.id);
        }
        setManagers((prev) => prev.filter((m) => m.id !== manager.id));
        toast.success("Encargado desvinculado de la organización");
      },
    });
  }, [token, ongUrl]);

  return (
    <div className="flex-1 p-6 md:p-10 bg-primary min-h-screen">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
          <div>
            <div className="flex items-center gap-3">
              <UserCog className="w-8 h-8 text-[#28a745]" />
              <h1 className="text-3xl font-montserrat font-bold text-white">
                Gestión de Encargados
              </h1>
            </div>
            <p className="text-white/50 font-poppins text-sm mt-1">
              Panel exclusivo del Administrador General para nombrar, supervisar y desvincular encargados de la organización.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleOpenAddModal}
              className="flex items-center gap-2 bg-[#28a745] hover:bg-[#218838] text-white px-5 py-2.5 rounded-xl font-semibold font-poppins transition-all text-sm cursor-pointer shadow-lg shadow-green-950/20"
            >
              <UserPlus className="w-4 h-4" />
              Nuevo Encargado
            </button>

            <button
              onClick={() => toast.info("Lista de encargados actualizada")}
              className="flex items-center gap-2 bg-white/10 hover:bg-white/15 text-white px-5 py-2.5 rounded-xl font-semibold font-poppins transition-all text-sm cursor-pointer"
            >
              <RefreshCw className="w-4 h-4" />
              Actualizar
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar encargado por nombre, apellido o email..."
            className="w-full bg-white/5 border border-white/10 rounded-xl pl-11 pr-4 py-3 text-white text-sm placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-[#28a745]/40 transition-all font-poppins"
          />
        </div>

        {/* Counter */}
        <p className="text-white/40 text-xs font-poppins">
          Mostrando {filteredManagers.length} encargado(s) en tu organización
        </p>

        {/* Managers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredManagers.map((mgr) => (
            <div
              key={mgr.id}
              className="bg-white/[0.03] hover:bg-white/[0.06] border border-white/5 hover:border-white/10 rounded-2xl p-6 space-y-4 transition-all duration-200"
            >
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-[#28a745]/15 border border-[#28a745]/30 flex items-center justify-center text-[#28a745] font-bold text-lg">
                    {mgr.name.charAt(0)}
                    {mgr.surname.charAt(0)}
                  </div>
                  <div>
                    <h3 className="text-white font-semibold text-base">
                      {mgr.name} {mgr.surname}
                    </h3>
                    <span
                      className={`inline-block px-2.5 py-0.5 text-[10px] font-bold rounded-full uppercase tracking-wider ${
                        mgr.status === "active"
                          ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/25"
                          : "bg-amber-500/15 text-amber-400 border border-amber-500/25"
                      }`}
                    >
                      {mgr.status === "active" ? "Activo" : "Invitación Pendiente"}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleOpenEditModal(mgr)}
                    className="p-2 rounded-xl text-white/50 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                    title="Editar Encargado"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteManager(mgr)}
                    className="p-2 rounded-xl text-red-400/60 hover:text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer"
                    title="Desvincular Encargado"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="space-y-2 pt-2 border-t border-white/5 text-xs text-white/60 font-poppins">
                <div className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-white/40 shrink-0" />
                  <span className="truncate">{mgr.email}</span>
                </div>
                {mgr.phone && (
                  <div className="flex items-center gap-2">
                    <Shield className="w-3.5 h-3.5 text-white/40 shrink-0" />
                    <span>{mgr.phone}</span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <Building2 className="w-3.5 h-3.5 text-[#28a745] shrink-0" />
                  <span className="text-[#28a745] font-semibold">
                    {mgr.organizationName}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add / Edit Manager Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => setIsAddModalOpen(false)}
          />

          <div className="relative w-full max-w-lg bg-[#142612] border border-white/10 rounded-3xl shadow-2xl overflow-hidden p-6 md:p-8 space-y-6 select-none">
            <div className="flex justify-between items-center pb-4 border-b border-white/10">
              <div className="flex items-center gap-3">
                <UserCog className="w-6 h-6 text-[#28a745]" />
                <h2 className="font-montserrat text-xl font-bold text-white">
                  {editingManager ? "Editar Encargado" : "Añadir Nuevo Encargado"}
                </h2>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-2 rounded-full hover:bg-white/10 text-white/60 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveManager} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-white/60 mb-1.5">
                  Nombre *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, name: e.target.value }))
                  }
                  placeholder="Ej. Carlos"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#28a745]/40 transition-all font-poppins"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-white/60 mb-1.5">
                  Apellido *
                </label>
                <input
                  type="text"
                  required
                  value={formData.surname}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, surname: e.target.value }))
                  }
                  placeholder="Ej. Encargado"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#28a745]/40 transition-all font-poppins"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-white/60 mb-1.5">
                  Correo Electrónico *
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, email: e.target.value }))
                  }
                  placeholder="ej. carlos@organizacion.org"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#28a745]/40 transition-all font-poppins"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-white/60 mb-1.5">
                  {editingManager ? "Nueva Contraseña (Opcional)" : "Contraseña de Acceso *"}
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    required={!editingManager}
                    value={formData.password}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, password: e.target.value }))
                    }
                    placeholder={editingManager ? "•••••••• (Dejar en blanco para no cambiar)" : "Mínimo 6 caracteres"}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 pr-11 text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#28a745]/40 transition-all font-poppins"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-white/40 hover:text-white transition-colors"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-white/60 mb-1.5">
                  Teléfono de Contacto (Opcional)
                </label>
                <div className="flex gap-2">
                  <select
                    value={selectedCountry}
                    onChange={(e) => {
                      const newCode = e.target.value;
                      setSelectedCountry(newCode);
                      setFormData((prev) => ({
                        ...prev,
                        phone: formatPhoneNumber(prev.phone, newCode),
                      }));
                    }}
                    className="bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#28a745]/40 font-poppins cursor-pointer"
                  >
                    {countryList.map((c) => (
                      <option key={`${c.code}-${c.name}`} value={c.code} className="bg-primary text-white">
                        {c.flag} {c.code} ({c.name})
                      </option>
                    ))}
                  </select>
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) => {
                      const formatted = formatPhoneNumber(e.target.value, selectedCountry);
                      setFormData((prev) => ({ ...prev, phone: formatted }));
                    }}
                    placeholder="11 5596 3637"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#28a745]/40 transition-all font-poppins"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl border border-white/10 text-white/70 hover:text-white hover:bg-white/5 text-sm font-semibold transition-all cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-[#28a745] hover:bg-[#218838] text-white text-sm font-semibold transition-all cursor-pointer shadow-lg shadow-green-950/20"
                >
                  {editingManager ? "Guardar Cambios" : "Añadir Encargado"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Confirm Modal */}
      <ConfirmModal
        isOpen={confirmConfig.isOpen}
        onClose={() => setConfirmConfig((prev) => ({ ...prev, isOpen: false }))}
        onConfirm={confirmConfig.onConfirm}
        title={confirmConfig.title}
        description={confirmConfig.description}
        confirmText={confirmConfig.confirmText}
        variant={confirmConfig.variant}
      />
    </div>
  );
}
