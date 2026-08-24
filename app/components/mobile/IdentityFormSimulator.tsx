"use client";

import React, { useState, useEffect } from "react";
import {
  Smartphone,
  ChevronRight,
  ChevronLeft,
  Camera,
  FileText,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  Info,
  User,
  MapPin,
  ListFilter,
  RefreshCw,
  Copy,
  Check,
} from "lucide-react";
import { useData } from "@/app/context/DataContext";
import { useAuth } from "@/app/context/AuthContext";
import { toast } from "react-toastify";
import { FormBuilderModal } from "@/app/components/forms/FormBuilderModal";
import { FormVersionSelector } from "@/app/components/forms/FormVersionSelector";
import {
  fetchActiveForm,
  createFormVersion,
  createFormSchema,
  setActiveFormVersion,
} from "@/app/services/formsService";
import { FormSchemaDto, FormFieldDef } from "@/app/types/api";

export const MOCK_FORM_FIELDS: FormFieldDef[] = [
  // Paso 1: Datos Personales
  { name: "nombre", label: "Nombre", type: "text", required: true, step: 1 },
  { name: "apellido", label: "Apellido", type: "text", required: true, step: 1 },
  { name: "fechaNacimiento", label: "Fecha de Nacimiento", type: "date", required: true, step: 1 },
  { name: "documentoIdentidad", label: "Documento de Identidad", type: "text", required: true, step: 1 },
  {
    name: "sexo",
    label: "Sexo",
    type: "select_one",
    required: true,
    step: 1,
    options: [
      { value: "masculino", label: "Masculino" },
      { value: "femenino", label: "Femenino" },
      { value: "no_especifica", label: "No Especifica" },
    ],
  },
  {
    name: "genero",
    label: "Género",
    type: "select_one",
    required: false,
    step: 1,
    options: [
      { value: "cisgenero", label: "Cisgénero" },
      { value: "transgenero", label: "Transgénero" },
      { value: "no_binario", label: "No Binario" },
      { value: "no_especifica", label: "No Especifica" },
    ],
  },
  {
    name: "etnia",
    label: "Etnia / Comunidad Originaria",
    type: "select_one",
    required: false,
    step: 1,
    options: [
      { value: "wichi", label: "Wichí" },
      { value: "qom", label: "Qom" },
      { value: "chorote", label: "Chorote" },
      { value: "chulupi", label: "Chulupí" },
      { value: "mocovi", label: "Mocoví" },
      { value: "ava_guarani", label: "Ava Guaraní" },
    ],
  },
  { name: "cantidadIntegrantesFamilia", label: "Integrantes Familia", type: "number", required: false, step: 1 },
  { name: "correoElectronico", label: "Correo Electrónico", type: "text", required: false, step: 1 },

  // Paso 2: Datos Territoriales y Cadenas Productivas
  {
    name: "pais",
    label: "País",
    type: "select_one",
    required: true,
    step: 2,
    options: [
      { value: "argentina", label: "Argentina" },
      { value: "paraguay", label: "Paraguay" },
      { value: "bolivia", label: "Bolivia" },
    ],
  },
  {
    name: "provincia",
    label: "Provincia",
    type: "select_one",
    required: true,
    step: 2,
    options: [
      { value: "chaco", label: "Chaco" },
      { value: "formosa", label: "Formosa" },
      { value: "salta", label: "Salta" },
      { value: "santiago_del_estero", label: "Santiago del Estero" },
    ],
  },
  {
    name: "localidad",
    label: "Localidad",
    type: "select_one",
    required: true,
    step: 2,
    options: [
      { value: "almirante_brown", label: "Almirante Brown" },
      { value: "general_guemes", label: "General Güemes" },
      { value: "las_lomitas", label: "Las Lomitas" },
      { value: "oran", label: "Orán" },
      { value: "rivadavia_salta", label: "Rivadavia" },
    ],
  },
  {
    name: "zona",
    label: "Zona / Paraje",
    type: "select_one",
    required: false,
    step: 2,
    options: [
      { value: "campo_del_cielo", label: "Campo del Cielo" },
      { value: "jj_castelli", label: "JJ Castelli" },
      { value: "el_sauzal", label: "El Sauzal" },
      { value: "nueva_pompeya", label: "Nueva Pompeya" },
      { value: "pampa_del_indio", label: "Pampa del Indio" },
    ],
  },
  {
    name: "actividadesPrincipales",
    label: "Actividades Productivas Principales",
    type: "select_multiple",
    required: false,
    step: 2,
    options: [
      { value: "apicultura", label: "Apicultura" },
      { value: "artesania", label: "Artesanía" },
      { value: "ganaderia_mayor", label: "Ganadería Mayor" },
      { value: "ganaderia_menor", label: "Ganadería Menor" },
      { value: "algarroba", label: "Algarroba" },
      { value: "avicola", label: "Avícola" },
    ],
  },
  {
    name: "nivelConocimiento",
    label: "Nivel de Conocimiento Productivo",
    type: "select_one",
    required: false,
    step: 2,
    options: [
      { value: "principiante", label: "Principiante (está empezando)" },
      { value: "entendido", label: "Entendido (prácticas básicas)" },
      { value: "conocedor", label: "Conocedor (procesos completos)" },
      { value: "vendedor", label: "Vendedor / Comercializador" },
    ],
  },
  { name: "superficiePredio", label: "Superficie del Predio (ha)", type: "number", required: false, step: 2 },
  { name: "superficieProductiva", label: "Superficie Productiva (ha)", type: "number", required: false, step: 2 },
];

export default function IdentityFormSimulator() {
  const { data } = useData();
  const { token, ongUrl, user } = useAuth();

  const userRole = (data?.currentUser?.role || user?.role || "").toLowerCase();
  const isSuperadmin = userRole === "superadmin";
  const isAdmin = userRole === "admin";

  const [formSchema, setFormSchema] = useState<FormSchemaDto | null>(null);
  const [activeFields, setActiveFields] = useState<FormFieldDef[]>(MOCK_FORM_FIELDS);
  const [isBuilderOpen, setIsBuilderOpen] = useState(false);
  const [isUpdatingVersion, setIsUpdatingVersion] = useState(false);

  const [currentStep, setCurrentStep] = useState<number>(1);
  const [formData, setFormData] = useState<Record<string, any>>({});

  const [activeTabDocument, setActiveTabDocument] = useState<"front" | "back">("front");
  const [frontCaptured, setFrontCaptured] = useState<boolean>(true);
  const [backCaptured, setBackCaptured] = useState<boolean>(true);
  const [faceCaptured, setFaceCaptured] = useState<boolean>(true);

  const [activeViewMode, setActiveViewMode] = useState<"simulator" | "json">("simulator");
  const [copiedJson, setCopiedJson] = useState(false);

  useEffect(() => {
    async function loadForm() {
      if (!token) return;
      try {
        const active = await fetchActiveForm(ongUrl || "http://localhost:3001", token, "IDENTITY");
        if (active) {
          setFormSchema(active);
          if (active.activeVersion?.fields && active.activeVersion.fields.length > 0) {
            setActiveFields(active.activeVersion.fields);
          }
        }
      } catch (err) {
        console.error("Error cargando formulario dinámico:", err);
      }
    }
    loadForm();
  }, [token, ongUrl]);

  const handleInputChange = (field: string, val: any) => {
    setFormData((prev) => ({ ...prev, [field]: val }));
  };

  const handleMultiSelectToggle = (field: string, val: string) => {
    const current: string[] = formData[field] || [];
    if (current.includes(val)) {
      setFormData((prev) => ({ ...prev, [field]: current.filter((v) => v !== val) }));
    } else {
      setFormData((prev) => ({ ...prev, [field]: [...current, val] }));
    }
  };

  const fillSampleData = () => {
    setFormData({
      nombre: "María Belén",
      apellido: "Maidana",
      fechaNacimiento: "1998-11-24",
      documentoIdentidad: "42111222",
      sexo: "femenino",
      genero: "cisgenero",
      etnia: "qom",
      cantidadIntegrantesFamilia: 4,
      correoElectronico: "m.maidana@granchaco.org",
      pais: "argentina",
      provincia: "formosa",
      localidad: "las_lomitas",
      zona: "campo_del_cielo",
      actividadesPrincipales: ["artesania", "algarroba"],
      nivelConocimiento: "vendedor",
      superficiePredio: 15,
      superficieProductiva: 10,
    });
    setFaceCaptured(true);
    setFrontCaptured(true);
    setBackCaptured(true);
  };

  const handleSaveFormVersion = async (formDataSaved: {
    title: string;
    description: string;
    version: string;
    ongId: string;
    category: string;
    fields: FormFieldDef[];
  }) => {
    if (!token) return;
    try {
      if (formSchema?.id) {
        const newVer = await createFormVersion(
          ongUrl || "http://localhost:3001",
          token,
          formSchema.id,
          {
            version: formDataSaved.version,
            description: formDataSaved.description,
            fields: formDataSaved.fields,
          },
        );
        if (newVer) {
          setActiveFields(formDataSaved.fields);
          toast.success(`Nueva versión v${formDataSaved.version} publicada con éxito`);
        }
      } else {
        const created = await createFormSchema(
          ongUrl || "http://localhost:3001",
          token,
          formDataSaved,
        );
        if (created) {
          setFormSchema(created);
          setActiveFields(formDataSaved.fields);
          toast.success(`Formulario y versión v${formDataSaved.version} creados con éxito`);
        }
      }
    } catch (err) {
      toast.error("Error al guardar la versión del formulario");
    }
  };

  const handleSelectActiveVersion = async (versionId: string) => {
    if (!token || !formSchema?.id) return;
    setIsUpdatingVersion(true);
    try {
      const ok = await setActiveFormVersion(
        ongUrl || "http://localhost:3001",
        token,
        formSchema.id,
        versionId,
      );
      if (ok) {
        const targetVer = formSchema.versions?.find((v) => v.id === versionId);
        if (targetVer) {
          setActiveFields(targetVer.fields);
          setFormSchema((prev) => (prev ? { ...prev, activeVersionId: versionId } : prev));
          toast.success(`Versión v${targetVer.version} activada para tu organización`);
        }
      }
    } catch (err) {
      toast.error("Error al cambiar la versión activa");
    } finally {
      setIsUpdatingVersion(false);
    }
  };

  const step1Fields = activeFields.filter((f) => (f.step || 1) === 1);
  const step2Fields = activeFields.filter((f) => f.step === 2);

  const copyJsonToClipboard = () => {
    navigator.clipboard.writeText(JSON.stringify(formData, null, 2));
    setCopiedJson(true);
    setTimeout(() => setCopiedJson(false), 2000);
  };

  return (
    <div className="w-full space-y-6">
      {/* Control bar / Mode switcher */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#28a745]/15 border border-[#28a745]/30 flex items-center justify-center text-[#28a745]">
            <Smartphone className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-white font-montserrat font-bold text-base flex items-center gap-2">
              Simulador del Formulario Móvil (FieldApp)
              {formSchema?.activeVersion?.version && (
                <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
                  v{formSchema.activeVersion.version}
                </span>
              )}
            </h3>
            <p className="text-white/50 text-xs font-poppins">
              Visualiza paso a paso la Encuesta Inicial y Captura de Evidencias de Identidades en Territorio.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0 flex-wrap">
          {isSuperadmin && (
            <button
              onClick={() => setIsBuilderOpen(true)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#28a745] hover:bg-[#218838] text-white text-xs font-bold font-poppins transition-all cursor-pointer shadow-lg shadow-green-950/30"
            >
              <Sparkles className="w-3.5 h-3.5" />
              Crear Nueva Versión
            </button>
          )}

          <button
            onClick={fillSampleData}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-semibold font-poppins transition-all cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Cargar Datos de Muestra
          </button>

          {isSuperadmin && (
            <div className="bg-black/30 p-1 rounded-xl border border-white/10 flex items-center">
              <button
                onClick={() => setActiveViewMode("simulator")}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  activeViewMode === "simulator"
                    ? "bg-[#28a745] text-white shadow-md"
                    : "text-white/60 hover:text-white"
                }`}
              >
                Vista Dispositivo
              </button>
              <button
                onClick={() => setActiveViewMode("json")}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  activeViewMode === "json"
                    ? "bg-[#28a745] text-white shadow-md"
                    : "text-white/60 hover:text-white"
                }`}
              >
                Esquema JSON
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Org Admin Version Selector */}
      {isAdmin && formSchema && formSchema.versions && formSchema.versions.length > 0 && (
        <FormVersionSelector
          formSchema={formSchema}
          onSelectVersion={handleSelectActiveVersion}
          isUpdating={isUpdatingVersion}
        />
      )}

      {activeViewMode === "simulator" ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Smartphone Container */}
          <div className={`${isSuperadmin ? "lg:col-span-6" : "lg:col-span-12 max-w-md mx-auto"} flex justify-center w-full`}>
            <div className="w-full max-w-[380px] bg-[#0c170b] border-[10px] border-[#1e381b] rounded-[48px] shadow-2xl overflow-hidden flex flex-col min-h-[640px] relative">
              {/* Top Speaker Bar & Camera Notch */}
              <div className="bg-[#142612] pt-3 pb-2 px-6 flex justify-between items-center border-b border-white/10">
                <span className="text-[10px] text-white/50 font-mono">09:41 AM</span>
                <div className="w-16 h-4 bg-black/60 rounded-full flex items-center justify-center">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/60 animate-pulse" />
                </div>
                <span className="text-[10px] text-emerald-400 font-mono font-bold">LTE 100%</span>
              </div>

              {/* Header App Bar inside phone */}
              <div className="p-4 bg-[#142612] border-b border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-[#28a745]" />
                  <div>
                    <h4 className="text-white font-montserrat font-bold text-xs">
                      FieldApp Mobile
                    </h4>
                    <p className="text-[10px] text-white/50 font-poppins">
                      Paso {currentStep} de 4
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-[#28a745]" />
                  <span className="text-[10px] text-emerald-400 font-bold font-mono">
                    Offline Sync
                  </span>
                </div>
              </div>

              {/* Progress Steps Indicator */}
              <div className="px-4 py-2 bg-[#0e1d0d] flex justify-between border-b border-white/5">
                {[1, 2, 3, 4].map((stepNum) => (
                  <div key={stepNum} className="flex items-center gap-1">
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${
                        currentStep === stepNum
                          ? "bg-[#28a745] text-white"
                          : currentStep > stepNum
                            ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40"
                            : "bg-white/5 text-white/30"
                      }`}
                    >
                      {currentStep > stepNum ? <CheckCircle2 className="w-3.5 h-3.5" /> : stepNum}
                    </div>
                    {stepNum < 4 && <div className="w-3 sm:w-6 h-[1px] bg-white/10" />}
                  </div>
                ))}
              </div>

              {/* Content Form Scroll Container */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {currentStep === 1 && (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 pb-1 border-b border-white/10">
                      <User className="w-4 h-4 text-[#28a745]" />
                      <h5 className="text-white font-montserrat font-bold text-xs">
                        Paso 1: Datos Personales
                      </h5>
                    </div>

                    {step1Fields.map((field) => (
                      <div key={field.name} className="space-y-1">
                        <label className="text-[11px] text-white/70 font-poppins flex justify-between">
                          <span>
                            {field.label} {field.required && <span className="text-red-400">*</span>}
                          </span>
                        </label>

                        {field.type === "select_one" ? (
                          <select
                            value={formData[field.name] || ""}
                            onChange={(e) => handleInputChange(field.name, e.target.value)}
                            className="w-full bg-[#1b3218] border border-white/15 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#28a745]"
                          >
                            <option value="">Seleccionar...</option>
                            {field.options?.map((opt) => (
                              <option key={opt.value} value={opt.value}>
                                {opt.label}
                              </option>
                            ))}
                          </select>
                        ) : (
                          <input
                            type={field.type === "number" ? "number" : field.type === "date" ? "date" : "text"}
                            value={formData[field.name] || ""}
                            onChange={(e) => handleInputChange(field.name, e.target.value)}
                            className="w-full bg-[#1b3218] border border-white/15 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#28a745]"
                          />
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {currentStep === 2 && (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 pb-1 border-b border-white/10">
                      <MapPin className="w-4 h-4 text-[#28a745]" />
                      <h5 className="text-white font-montserrat font-bold text-xs">
                        Paso 2: Datos Territoriales
                      </h5>
                    </div>

                    {step2Fields.map((field) => (
                      <div key={field.name} className="space-y-1">
                        <label className="text-[11px] text-white/70 font-poppins flex justify-between">
                          <span>
                            {field.label} {field.required && <span className="text-red-400">*</span>}
                          </span>
                        </label>

                        {field.type === "select_one" ? (
                          <select
                            value={formData[field.name] || ""}
                            onChange={(e) => handleInputChange(field.name, e.target.value)}
                            className="w-full bg-[#1b3218] border border-white/15 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#28a745]"
                          >
                            <option value="">Seleccionar...</option>
                            {field.options?.map((opt) => (
                              <option key={opt.value} value={opt.value}>
                                {opt.label}
                              </option>
                            ))}
                          </select>
                        ) : field.type === "select_multiple" ? (
                          <div className="grid grid-cols-2 gap-1.5 pt-1">
                            {field.options?.map((opt) => {
                              const isChecked = (formData[field.name] || []).includes(opt.value);
                              return (
                                <button
                                  type="button"
                                  key={opt.value}
                                  onClick={() => handleMultiSelectToggle(field.name, opt.value)}
                                  className={`px-2.5 py-1.5 rounded-lg text-[11px] font-medium text-left border transition-all cursor-pointer ${
                                    isChecked
                                      ? "bg-[#28a745]/20 border-[#28a745] text-emerald-300 font-bold"
                                      : "bg-[#1b3218] border-white/10 text-white/60 hover:text-white"
                                  }`}
                                >
                                  {opt.label}
                                </button>
                              );
                            })}
                          </div>
                        ) : (
                          <input
                            type={field.type === "number" ? "number" : "text"}
                            value={formData[field.name] || ""}
                            onChange={(e) => handleInputChange(field.name, e.target.value)}
                            className="w-full bg-[#1b3218] border border-white/15 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#28a745]"
                          />
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {currentStep === 3 && (
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 pb-1 border-b border-white/10">
                      <Camera className="w-4 h-4 text-[#28a745]" />
                      <h5 className="text-white font-montserrat font-bold text-xs">
                        Paso 3: Captura de Fotos (Selfie & DNI)
                      </h5>
                    </div>

                    <div className="bg-[#1b3218] p-3.5 rounded-2xl border border-white/10 space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-bold text-white font-montserrat">
                          1. Fotografía Facial (Selfie)
                        </span>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                            faceCaptured
                              ? "bg-emerald-500/20 text-emerald-400"
                              : "bg-amber-500/20 text-amber-400"
                          }`}
                        >
                          {faceCaptured ? "Capturada" : "Pendiente"}
                        </span>
                      </div>
                      <p className="text-[11px] text-white/60">
                        Foto tomada por el técnico en territorio para coincidencia biométrica en enclave Phala TEE.
                      </p>
                      <button
                        type="button"
                        onClick={() => setFaceCaptured(!faceCaptured)}
                        className="w-full py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer"
                      >
                        <Camera className="w-3.5 h-3.5" />
                        {faceCaptured ? "Recapturar Selfie" : "Tomar Selfie"}
                      </button>
                    </div>

                    <div className="bg-[#1b3218] p-3.5 rounded-2xl border border-white/10 space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-bold text-white font-montserrat">
                          2. Documento Físico (DNI)
                        </span>
                        <div className="flex gap-1">
                          <button
                            type="button"
                            onClick={() => setActiveTabDocument("front")}
                            className={`px-2 py-0.5 text-[10px] font-bold rounded ${
                              activeTabDocument === "front"
                                ? "bg-[#28a745] text-white"
                                : "bg-white/10 text-white/60"
                            }`}
                          >
                            Frente
                          </button>
                          <button
                            type="button"
                            onClick={() => setActiveTabDocument("back")}
                            className={`px-2 py-0.5 text-[10px] font-bold rounded ${
                              activeTabDocument === "back"
                                ? "bg-[#28a745] text-white"
                                : "bg-white/10 text-white/60"
                            }`}
                          >
                            Dorso
                          </button>
                        </div>
                      </div>

                      {activeTabDocument === "front" ? (
                        <div className="space-y-2">
                          <p className="text-[11px] text-white/60">
                            Captura del frente del DNI (OCR y análisis biométrico TEE).
                          </p>
                          <button
                            type="button"
                            onClick={() => setFrontCaptured(!frontCaptured)}
                            className="w-full py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer"
                          >
                            <Camera className="w-3.5 h-3.5" />
                            {frontCaptured ? "Recapturar DNI Frente" : "Capturar Frente"}
                          </button>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <p className="text-[11px] text-white/60">
                            Captura del dorso del DNI (Código PDF417).
                          </p>
                          <button
                            type="button"
                            onClick={() => setBackCaptured(!backCaptured)}
                            className="w-full py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer"
                          >
                            <Camera className="w-3.5 h-3.5" />
                            {backCaptured ? "Recapturar DNI Dorso" : "Capturar Dorso"}
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {currentStep === 4 && (
                  <div className="space-y-4 text-center py-4">
                    <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto">
                      <ShieldCheck className="w-8 h-8" />
                    </div>
                    <div className="space-y-1">
                      <h5 className="text-white font-montserrat font-bold text-sm">
                        Registro Completo Listo para Envío
                      </h5>
                      <p className="text-xs text-white/60 font-poppins">
                        Las 17 respuestas de la encuesta y los binarios de fotos están empaquetados para cifrado en Phala TEE.
                      </p>
                    </div>
                    <div className="bg-[#162d14] p-3 rounded-xl border border-emerald-500/30 text-left space-y-1 text-xs">
                      <span className="font-bold text-emerald-400">Resumen de Envíos:</span>
                      <p className="text-white/70">• Titular: {formData.nombre || "María Belén"} {formData.apellido || "Maidana"}</p>
                      <p className="text-white/70">• DNI: {formData.documentoIdentidad || "42111222"}</p>
                      <p className="text-white/70">• Fotos: Selfie ✓ | DNI Frente ✓ | DNI Dorso ✓</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Mobile Bottom Navigation Buttons */}
              <div className="p-4 bg-[#142612] border-t border-white/10 flex items-center justify-between gap-3">
                <button
                  disabled={currentStep === 1}
                  onClick={() => setCurrentStep((prev) => Math.max(1, prev - 1))}
                  className="flex items-center gap-1 px-3 py-2 rounded-xl bg-white/10 disabled:opacity-30 text-white text-xs font-semibold cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" /> Anterior
                </button>

                <button
                  onClick={() => setCurrentStep((prev) => Math.min(4, prev + 1))}
                  className="flex-1 flex items-center justify-center gap-1 py-2.5 rounded-xl bg-[#28a745] hover:bg-[#218838] text-white text-xs font-bold transition-all cursor-pointer shadow-lg shadow-green-950/40"
                >
                  {currentStep === 4 ? "Finalizar / Enviar" : "Continuar"}{" "}
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: Detailed Field Inspector & JSON (Superadmin Only) */}
          {isSuperadmin && (
            <div className="lg:col-span-6 space-y-6">
              <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-6 space-y-4">
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <div className="flex items-center gap-2">
                    <ListFilter className="w-5 h-5 text-[#28a745]" />
                    <h4 className="text-white font-montserrat font-bold text-base">
                      Estructura del Formulario (Paso {currentStep})
                    </h4>
                  </div>
                  <span className="text-xs font-poppins text-white/50">
                    {currentStep === 1
                      ? `${step1Fields.length} campos personales`
                      : currentStep === 2
                        ? `${step2Fields.length} campos territoriales`
                        : currentStep === 3
                          ? "Módulo de captura de fotos"
                          : "Payload de envío TEE"}
                  </span>
                </div>

                <div className="space-y-3 max-h-[420px] overflow-y-auto pr-2">
                  {(currentStep === 1 ? step1Fields : currentStep === 2 ? step2Fields : []).map(
                    (field) => (
                      <div
                        key={field.name}
                        className="bg-white/5 border border-white/5 rounded-xl p-3 space-y-1.5"
                      >
                        <div className="flex justify-between items-center">
                          <span className="text-white font-semibold text-xs font-mono">
                            {field.name}
                          </span>
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] uppercase font-bold text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded">
                              {field.type}
                            </span>
                            {field.required ? (
                              <span className="text-[10px] font-bold text-red-400 bg-red-500/10 px-1.5 py-0.5 rounded">
                                Requerido
                              </span>
                            ) : (
                              <span className="text-[10px] text-white/40">Opcional</span>
                            )}
                          </div>
                        </div>
                        <p className="text-xs text-white/70">{field.label}</p>
                        {field.options && (
                          <p className="text-[11px] text-white/40 truncate">
                            Opciones: {field.options.map((o) => o.label).join(", ")}
                          </p>
                        )}
                      </div>
                    ),
                  )}

                  {currentStep === 3 && (
                    <div className="space-y-3">
                      <div className="bg-white/5 p-4 rounded-xl border border-white/5 space-y-2">
                        <span className="text-xs font-mono text-emerald-400 font-bold">
                          field: selfieUri (Binary JPEG)
                        </span>
                        <p className="text-xs text-white/70">
                          Fotografía facial tomada en territorio por el técnico para coincidencia biométrica en enclave Phala TEE.
                        </p>
                      </div>
                      <div className="bg-white/5 p-4 rounded-xl border border-white/5 space-y-2">
                        <span className="text-xs font-mono text-emerald-400 font-bold">
                          field: dniUri (Binary JPEG - Frente y Dorso)
                        </span>
                        <p className="text-xs text-white/70">
                          Captura del documento de identidad físico para OCR y comprobación de autenticidad.
                        </p>
                      </div>
                    </div>
                  )}

                  {currentStep === 4 && (
                    <div className="bg-[#122310] p-4 rounded-xl border border-emerald-500/30 space-y-3 text-xs">
                      <p className="text-emerald-400 font-bold uppercase tracking-wider">
                        Endpoint de Servidor TEE: POST /blockchain/crearIdentity
                      </p>
                      <p className="text-white/70">
                        Envía un FormData con las imágenes binarias y el objeto `paqueteRaw` serializado en JSON conteniendo las 17 respuestas de la encuesta inicial.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* JSON View Mode (Superadmin Only) */
        <div className="bg-black/50 border border-white/10 rounded-2xl p-6 space-y-4">
          <div className="flex justify-between items-center border-b border-white/10 pb-3">
            <div>
              <h4 className="text-white font-montserrat font-bold text-base">
                Payload JSON del Formulario
              </h4>
              <p className="text-white/50 text-xs font-poppins">
                Formato exacto enviado al servidor central y procesado en Phala Enclave.
              </p>
            </div>
            <button
              onClick={copyJsonToClipboard}
              className="flex items-center gap-1.5 bg-[#28a745] hover:bg-[#218838] text-white px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer"
            >
              {copiedJson ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              {copiedJson ? "Copiado!" : "Copiar JSON"}
            </button>
          </div>

          <pre className="bg-[#0b140a] p-4 rounded-xl font-mono text-xs text-emerald-400 overflow-x-auto border border-white/5 leading-relaxed max-h-[500px]">
            {JSON.stringify(
              {
                formId: formSchema?.id || "encuesta-inicial-v1",
                metadata: {
                  version: formSchema?.activeVersion?.version || "1.0.0",
                  language: "es",
                },
                capturedData: formData,
                evidences: {
                  hasSelfie: faceCaptured,
                  hasDniFront: frontCaptured,
                  hasDniBack: backCaptured,
                },
              },
              null,
              2,
            )}
          </pre>
        </div>
      )}

      {/* Superadmin Form Builder Modal */}
      {isSuperadmin && (
        <FormBuilderModal
          isOpen={isBuilderOpen}
          onClose={() => setIsBuilderOpen(false)}
          onSave={handleSaveFormVersion}
          initialFields={activeFields}
          existingTitle={formSchema?.title || "Encuesta Inicial de Identidad"}
          existingVersion={formSchema?.activeVersion?.version || "1.0.0"}
        />
      )}
    </div>
  );
}
