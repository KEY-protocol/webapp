"use client";

import React, { useState, useEffect } from "react";
import { Sparkles, Plus, RefreshCw, AlertCircle } from "lucide-react";
import { useData } from "@/app/context/DataContext";
import { useAuth } from "@/app/context/AuthContext";
import IdentityFormSimulator from "@/app/components/mobile/IdentityFormSimulator";
import { FormBuilderModal } from "@/app/components/forms/FormBuilderModal";
import { fetchForms, createFormSchema } from "@/app/services/formsService";
import { FormSchemaDto, FormFieldDef } from "@/app/types/api";
import { toast } from "react-toastify";

export default function SuperadminFormsPage() {
  const { data } = useData();
  const { user, token, ongUrl } = useAuth();
  const userRole = (data?.currentUser?.role || user?.role || "").toLowerCase();
  const isSuperadmin = userRole === "superadmin";

  const [forms, setForms] = useState<FormSchemaDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [isBuilderOpen, setIsBuilderOpen] = useState(false);

  const loadAllForms = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const list = await fetchForms(ongUrl || "", token);
      setForms(list);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAllForms();
  }, [token, ongUrl]);

  if (!isSuperadmin) {
    return (
      <div className="flex-1 p-8 bg-primary min-h-screen flex items-center justify-center">
        <div className="bg-white/5 border border-white/10 p-8 rounded-3xl max-w-md text-center space-y-4">
          <AlertCircle className="w-12 h-12 text-amber-400 mx-auto" />
          <h2 className="text-xl font-bold text-white font-montserrat">
            Acceso Restringido
          </h2>
          <p className="text-white/60 text-sm font-poppins">
            Esta sección de gestión central de formularios es de uso exclusivo para el Superadministrador.
          </p>
        </div>
      </div>
    );
  }

  const handleSaveForm = async (formData: {
    title: string;
    description: string;
    version: string;
    ongId: string;
    category: string;
    fields: FormFieldDef[];
  }) => {
    if (!token) return;
    try {
      const created = await createFormSchema(
        ongUrl || "",
        token,
        formData,
      );
      if (created) {
        toast.success(`Formulario "${formData.title}" v${formData.version} publicado con éxito`);
        loadAllForms();
      }
    } catch {
      toast.error("Error al crear la versión del formulario");
    }
  };

  return (
    <div className="flex-1 p-6 md:p-10 bg-primary min-h-screen">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col space-y-1">
          <div className="flex items-center gap-3">
            <Sparkles className="w-8 h-8 text-[#28a745]" />
            <h1 className="text-3xl font-montserrat font-bold text-white">
              Gestión Global de Formularios Móviles
            </h1>
          </div>
          <p className="text-white/50 font-poppins text-sm pl-11">
            Panel exclusivo del Superadmin para crear, versionar y configurar la estructura de campos requeridos y opcionales para la captación móvil en territorio.
          </p>
        </div>

        {/* Dynamic Interactive Simulator & Inspector */}
        <IdentityFormSimulator />

        {/* Modal for Superadmin Form Builder */}
        <FormBuilderModal
          isOpen={isBuilderOpen}
          onClose={() => setIsBuilderOpen(false)}
          onSave={handleSaveForm}
        />
      </div>
    </div>
  );
}
