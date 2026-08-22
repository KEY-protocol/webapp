"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Users, UserPlus, Shield, Trash2, Mail, Eye, EyeOff, Phone } from "lucide-react";
import { useAuth } from "@/app/context/AuthContext";
import {
  fetchEncargados,
  createEncargado,
  deleteEncargado,
  EncargadoDto,
} from "@/app/services/encargadosService";

const COUNTRY_CODES = [
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
  // Limpiar caracteres no numéricos
  const digits = value.replace(/\D/g, "");

  if (countryCode === "+54") {
    // Formateo dinámico para Argentina
    if (digits.length <= 2) return digits;
    // AMBA (ej: 11 5596 3637)
    if (digits.startsWith("11")) {
      if (digits.length <= 6) {
        return `${digits.slice(0, 2)} ${digits.slice(2)}`;
      }
      return `${digits.slice(0, 2)} ${digits.slice(2, 6)} ${digits.slice(6, 10)}`;
    }
    // Córdoba / Rosario / Mendoza (ej: 351 559 3637)
    if (
      digits.startsWith("351") ||
      digits.startsWith("341") ||
      digits.startsWith("261")
    ) {
      if (digits.length <= 6) {
        return `${digits.slice(0, 3)} ${digits.slice(3)}`;
      }
      return `${digits.slice(0, 3)} ${digits.slice(3, 6)} ${digits.slice(6, 10)}`;
    }
    // General 4 dígitos de código de área (ej: 221 559 3637 o 3874 55 3637)
    if (digits.length <= 4) return digits;
    if (digits.length <= 7) {
      return `${digits.slice(0, 4)} ${digits.slice(4)}`;
    }
    return `${digits.slice(0, 4)} ${digits.slice(4, 7)} ${digits.slice(7, 11)}`;
  }

  // Formateo genérico para otros países (ej: 333 444 5555)
  if (digits.length <= 3) return digits;
  if (digits.length <= 6) {
    return `${digits.slice(0, 3)} ${digits.slice(3)}`;
  }
  return `${digits.slice(0, 3)} ${digits.slice(3, 6)} ${digits.slice(6, 10)}`;
}

export default function EncargadosPage() {
  const { token, ongUrl } = useAuth();
  const [encargados, setEncargados] = useState<EncargadoDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState("+54");
  const [phoneInput, setPhoneInput] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const loadEncargados = useCallback(async () => {
    if (!token || !ongUrl) return;
    setLoading(true);
    const data = await fetchEncargados(ongUrl, token);
    setEncargados(data);
    setLoading(false);
  }, [token, ongUrl]);

  useEffect(() => {
    loadEncargados();
  }, [loadEncargados]);

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    const formatted = formatPhoneNumber(raw, selectedCountry);
    setPhoneInput(formatted);
  };

  const handleCountryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newCode = e.target.value;
    setSelectedCountry(newCode);
    setPhoneInput(formatPhoneNumber(phoneInput, newCode));
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmail || !newPassword || !token || !ongUrl) return;
    setErrorMsg("");

    try {
      await createEncargado(ongUrl, token, {
        email: newEmail,
        password: newPassword,
      });
      setNewEmail("");
      setNewPassword("");
      setShowPassword(false);
      setPhoneInput("");
      setShowModal(false);
      loadEncargados();
    } catch (err: any) {
      setErrorMsg(
        err.response?.data?.message || "No se pudo crear el encargado",
      );
    }
  };

  const handleDelete = async (id: string) => {
    if (!token || !ongUrl) return;
    if (!confirm("¿Está seguro de eliminar este encargado?")) return;
    const ok = await deleteEncargado(ongUrl, token, id);
    if (ok) {
      setEncargados((prev) => prev.filter((e) => e.id !== id));
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 text-white">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold font-montserrat flex items-center gap-3">
            <Users className="w-8 h-8 text-accent" /> Gestor de Encargados
          </h1>
          <p className="text-white/60 text-sm mt-1">
            Administra las cuentas de encargados asignados a tu organización.
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-accent text-primary font-bold px-6 py-3 rounded-2xl hover:bg-accent/90 transition-all shadow-lg shadow-accent/20"
        >
          <UserPlus size={18} /> Nuevo Encargado
        </button>
      </div>

      {/* Table */}
      <div className="bg-primary/50 border border-white/10 rounded-3xl overflow-hidden shadow-xl">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-white/10 bg-white/5 text-white/50 text-xs font-bold uppercase tracking-wider">
              <th className="p-4 pl-6">Email / Usuario</th>
              <th className="p-4">Rol</th>
              <th className="p-4">Fecha Alta</th>
              <th className="p-4 text-right pr-6">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5 text-sm">
            {encargados.map((enc) => (
              <tr key={enc.id} className="hover:bg-white/5 transition-colors">
                <td className="p-4 pl-6 font-medium flex items-center gap-3">
                  <div className="p-2 bg-white/10 rounded-xl">
                    <Mail className="w-4 h-4 text-accent" />
                  </div>
                  {enc.email}
                </td>
                <td className="p-4">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-accent/10 text-accent border border-accent/20">
                    <Shield size={12} /> {enc.role}
                  </span>
                </td>
                <td className="p-4 text-white/60">
                  {new Date(enc.createdAt).toLocaleDateString()}
                </td>
                <td className="p-4 text-right pr-6 space-x-2">
                  <button
                    onClick={() => handleDelete(enc.id)}
                    className="p-2 rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors"
                    title="Eliminar encargado"
                  >
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal Nuevo Encargado */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-primary border border-white/10 rounded-3xl p-8 max-w-md w-full space-y-6 shadow-2xl animate-in fade-in zoom-in duration-200">
            <h3 className="text-xl font-bold flex items-center gap-2">
              <UserPlus className="text-accent" /> Registrar Encargado
            </h3>
            {errorMsg && (
              <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 text-xs rounded-xl font-medium">
                {errorMsg}
              </div>
            )}
            <form onSubmit={handleCreate} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-white/60">Email Institucional</label>
                <div className="relative">
                  <input
                    type="email"
                    required
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    placeholder="encargado@organizacion.org"
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-accent/50 font-poppins"
                  />
                </div>
              </div>

              {/* Teléfono con Dropdown de País y Formato Dinámico */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-white/60 flex items-center gap-1.5">
                  <Phone size={12} /> Teléfono de Contacto
                </label>
                <div className="flex gap-2">
                  <select
                    value={selectedCountry}
                    onChange={handleCountryChange}
                    className="bg-white/5 border border-white/10 rounded-2xl px-3 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-accent/50 font-poppins cursor-pointer"
                  >
                    {COUNTRY_CODES.map((c) => (
                      <option key={c.code} value={c.code} className="bg-primary text-white">
                        {c.flag} {c.code}
                      </option>
                    ))}
                  </select>
                  <input
                    type="text"
                    value={phoneInput}
                    onChange={handlePhoneChange}
                    placeholder="11 5596 3637"
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-accent/50 font-poppins"
                  />
                </div>
              </div>

              {/* Contraseña con Toggle Ojo */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-white/60">Contraseña</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 pr-11 text-sm text-white focus:outline-none focus:ring-2 focus:ring-accent/50 font-poppins"
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

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-5 py-2.5 rounded-xl border border-white/10 text-sm font-bold hover:bg-white/5"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-accent text-primary text-sm font-bold hover:bg-accent/90"
                >
                  Crear Encargado
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

