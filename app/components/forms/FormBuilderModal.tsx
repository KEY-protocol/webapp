"use client";

import React, { useState, useEffect } from "react";
import { X, Plus, Trash2, ArrowUp, ArrowDown, Save, Sparkles, Layers, Building2 } from "lucide-react";
import { FormFieldDef } from "@/app/types/api";
import { organizationsService, OrganizationRecord } from "@/app/services/organizationsService";

interface FormBuilderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: {
    title: string;
    description: string;
    version: string;
    ongId: string;
    category: string;
    fields: FormFieldDef[];
  }) => Promise<void>;
  initialFields?: FormFieldDef[];
  existingTitle?: string;
  existingVersion?: string;
  defaultOngId?: string;
}

export function FormBuilderModal({
  isOpen,
  onClose,
  onSave,
  initialFields = [],
  existingTitle = "",
  existingVersion = "1.0.0",
  defaultOngId = "GLOBAL",
}: FormBuilderModalProps) {
  const [title, setTitle] = useState(existingTitle || "Formulario de Captación");
  const [description, setDescription] = useState("Formulario dinámico de captación");
  const [version, setVersion] = useState(() => {
    const parts = existingVersion.split(".");
    if (parts.length === 3) {
      return `${parts[0]}.${parts[1]}.${parseInt(parts[2], 10) + 1}`;
    }
    return "1.1.0";
  });
  const [ongId, setOngId] = useState(defaultOngId);
  const [category, setCategory] = useState("IDENTITY");
  const [orgList, setOrgList] = useState<OrganizationRecord[]>([]);

  useEffect(() => {
    if (isOpen) {
      organizationsService.getOrganizations().then((orgs) => {
        if (orgs && orgs.length > 0) {
          setOrgList(orgs);
        }
      });
    }
  }, [isOpen]);

  const [fields, setFields] = useState<FormFieldDef[]>(initialFields);

  const [saving, setSaving] = useState(false);

  if (!isOpen) return null;

  const handleAddField = () => {
    const newField: FormFieldDef = {
      name: `campo_${Date.now().toString().slice(-4)}`,
      label: "Nuevo Campo Personalizado",
      type: "text",
      required: false,
      step: 1,
    };
    setFields((prev) => [...prev, newField]);
  };

  const handleUpdateField = (index: number, key: keyof FormFieldDef, val: any) => {
    setFields((prev) =>
      prev.map((f, i) => (i === index ? { ...f, [key]: val } : f)),
    );
  };

  const handleDeleteField = (index: number) => {
    setFields((prev) => prev.filter((_, i) => i !== index));
  };

  const handleMoveField = (index: number, direction: "up" | "down") => {
    if (
      (direction === "up" && index === 0) ||
      (direction === "down" && index === fields.length - 1)
    )
      return;

    const newFields = [...fields];
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    const temp = newFields[index];
    newFields[index] = newFields[targetIndex];
    newFields[targetIndex] = temp;
    setFields(newFields);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await onSave({
        title,
        description,
        version,
        ongId,
        category,
        fields,
      });
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl bg-[#142612] border border-white/10 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-6 border-b border-white/10 flex justify-between items-center bg-white/5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#28a745]/20 border border-[#28a745]/30 flex items-center justify-center text-[#28a745]">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-montserrat font-bold text-white">
                Creador de Versiones de Formulario (Superadmin)
              </h2>
              <p className="text-white/50 font-poppins text-xs">
                Diseña, modifica tipos de campos y publica una nueva versión para las organizaciones.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-white/10 text-white/60 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body Form */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Metadata Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-white/5 p-4 rounded-2xl border border-white/5">
            <div>
              <label className="block text-xs font-bold text-white/60 mb-1">
                Título del Formulario
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white text-xs font-poppins focus:outline-none focus:ring-2 focus:ring-[#28a745]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-white/60 mb-1">
                Nueva Versión (SemVer)
              </label>
              <input
                type="text"
                required
                value={version}
                onChange={(e) => setVersion(e.target.value)}
                placeholder="1.1.0"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white text-xs font-mono font-bold text-emerald-400 focus:outline-none focus:ring-2 focus:ring-[#28a745]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-white/60 mb-1">
                Organización Destino
              </label>
              <select
                value={ongId}
                onChange={(e) => setOngId(e.target.value)}
                className="w-full bg-[#142612] border border-white/10 rounded-xl px-3 py-2 text-white text-xs font-poppins focus:outline-none focus:ring-2 focus:ring-[#28a745]"
              >
                <option value="GLOBAL">Todas las Organizaciones (GLOBAL)</option>
                {orgList.map((org) => (
                  <option key={org.id} value={org.slug || org.id}>
                    {org.name} ({org.slug})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Fields Editor List */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-bold text-white font-montserrat flex items-center gap-2">
                <Layers className="w-4 h-4 text-[#28a745]" />
                Definición de Campos ({fields.length} campos)
              </h3>
              <button
                type="button"
                onClick={handleAddField}
                className="flex items-center gap-1.5 bg-[#28a745] hover:bg-[#218838] text-white px-3 py-1.5 rounded-xl text-xs font-bold transition-all"
              >
                <Plus className="w-3.5 h-3.5" /> Añadir Campo
              </button>
            </div>

            <div className="space-y-2.5 max-h-[360px] overflow-y-auto pr-1">
              {fields.map((field, idx) => (
                <div
                  key={idx}
                  className="bg-white/[0.04] hover:bg-white/[0.07] border border-white/10 rounded-2xl p-4 transition-all flex flex-col md:flex-row items-start md:items-center gap-3"
                >
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      type="button"
                      disabled={idx === 0}
                      onClick={() => handleMoveField(idx, "up")}
                      className="p-1 rounded hover:bg-white/10 text-white/50 disabled:opacity-20"
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      disabled={idx === fields.length - 1}
                      onClick={() => handleMoveField(idx, "down")}
                      className="p-1 rounded hover:bg-white/10 text-white/50 disabled:opacity-20"
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 flex-1 w-full">
                    {/* Name */}
                    <div>
                      <label className="text-[10px] text-white/40 block font-mono">
                        Key Interno
                      </label>
                      <input
                        type="text"
                        value={field.name}
                        onChange={(e) => handleUpdateField(idx, "name", e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white font-mono focus:outline-none focus:border-[#28a745]"
                      />
                    </div>

                    {/* Label */}
                    <div>
                      <label className="text-[10px] text-white/40 block">Etiqueta Visible</label>
                      <input
                        type="text"
                        value={field.label}
                        onChange={(e) => handleUpdateField(idx, "label", e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-[#28a745]"
                      />
                    </div>

                    {/* Type */}
                    <div>
                      <label className="text-[10px] text-white/40 block">Tipo de Entrada</label>
                      <select
                        value={field.type}
                        onChange={(e) => handleUpdateField(idx, "type", e.target.value)}
                        className="w-full bg-[#142612] border border-white/10 rounded-lg px-2 py-1.5 text-xs text-white focus:outline-none focus:border-[#28a745]"
                      >
                        <option value="text">Texto</option>
                        <option value="number">Número</option>
                        <option value="date">Fecha</option>
                        <option value="select_one">Selección Única</option>
                        <option value="select_multiple">Selección Múltiple</option>
                        <option value="photo_selfie">Fotografía Facial (Selfie)</option>
                        <option value="photo_dni">Fotografía DNI (Frente/Dorso)</option>
                      </select>
                    </div>

                    {/* Required & Step */}
                    <div className="flex items-center gap-4 pt-4 sm:pt-0">
                      <label className="flex items-center gap-1.5 text-xs text-white/80 cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={field.required}
                          onChange={(e) => handleUpdateField(idx, "required", e.target.checked)}
                          className="accent-[#28a745] w-4 h-4"
                        />
                        <span>Requerido</span>
                      </label>

                      <select
                        value={field.step || 1}
                        onChange={(e) =>
                          handleUpdateField(idx, "step", parseInt(e.target.value, 10))
                        }
                        className="bg-[#142612] border border-white/10 rounded-lg px-2 py-1 text-[11px] text-white/70"
                      >
                        <option value={1}>Paso 1</option>
                        <option value={2}>Paso 2</option>
                      </select>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleDeleteField(idx)}
                    className="p-2 rounded-xl text-red-400/60 hover:text-red-400 hover:bg-red-500/10 transition-colors self-center"
                    title="Eliminar campo"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Footer controls */}
          <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl border border-white/10 text-white/70 hover:text-white text-xs font-semibold"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#28a745] hover:bg-[#218838] text-white text-xs font-bold transition-all shadow-lg shadow-green-950/20 cursor-pointer"
            >
              <Save className="w-4 h-4" />
              {saving ? "Guardando Versión..." : `Publicar Versión v${version}`}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
