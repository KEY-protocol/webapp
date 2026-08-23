"use client";

import React, { useState } from "react";
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

// Def de campos de Encuesta Inicial
export interface FormFieldDef {
  name: string;
  label: string;
  type: string;
  required: boolean;
  options?: { value: string; label: string }[];
  hint?: string;
  step: 1 | 2;
}

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
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [formData, setFormData] = useState<Record<string, any>>({});

  const [activeTabDocument, setActiveTabDocument] = useState<"front" | "back">("front");
  const [frontCaptured, setFrontCaptured] = useState<boolean>(true);
  const [backCaptured, setBackCaptured] = useState<boolean>(true);
  const [faceCaptured, setFaceCaptured] = useState<boolean>(true);

  const [activeViewMode, setActiveViewMode] = useState<"simulator" | "json">("simulator");
  const [copiedJson, setCopiedJson] = useState(false);

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

  const step1Fields = MOCK_FORM_FIELDS.filter((f) => f.step === 1);
  const step2Fields = MOCK_FORM_FIELDS.filter((f) => f.step === 2);

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
            <h3 className="text-white font-montserrat font-bold text-base">
              Simulador del Formulario Móvil (FieldApp)
            </h3>
            <p className="text-white/50 text-xs font-poppins">
              Visualiza paso a paso la Encuesta Inicial y Captura de Evidencias de Identidades en Territorio.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={fillSampleData}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-semibold font-poppins transition-all cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Cargar Datos de Muestra
          </button>

          <div className="bg-black/30 p-1 rounded-xl border border-white/10 flex items-center">
            <button
              onClick={() => setActiveViewMode("simulator")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${activeViewMode === "simulator"
                  ? "bg-[#28a745] text-white shadow-md"
                  : "text-white/60 hover:text-white"
                }`}
            >
              Vista Dispositivo
            </button>
            <button
              onClick={() => setActiveViewMode("json")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${activeViewMode === "json"
                  ? "bg-[#28a745] text-white shadow-md"
                  : "text-white/60 hover:text-white"
                }`}
            >
              Esquema JSON
            </button>
          </div>
        </div>
      </div>

      {activeViewMode === "simulator" ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Smartphone Container (Left Column) */}
          <div className="lg:col-span-6 flex justify-center">
            <div className="relative w-full max-w-[380px] bg-[#0c180a] border-[8px] border-[#22361d] rounded-[48px] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col min-h-[720px]">
              {/* Phone Top Speaker/Notch */}
              <div className="w-full bg-[#142612] pt-3 pb-2 px-6 flex justify-between items-center text-[10px] text-white/50 border-b border-white/5 select-none">
                <span className="font-mono font-bold text-white/80">09:41</span>
                <div className="w-20 h-4 bg-black/60 rounded-full flex items-center justify-center">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80 animate-pulse" />
                </div>
                <div className="flex items-center gap-1.5">
                  <span>5G</span>
                  <div className="w-4 h-2 bg-emerald-400 rounded-sm" />
                </div>
              </div>

              {/* Mobile App Header */}
              <div className="bg-[#162a14] px-5 py-3 border-b border-white/10 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#28a745]">
                    FieldApp Mobile v1.0
                  </span>
                  <h4 className="text-white font-montserrat font-bold text-sm">
                    Registro de Identidad
                  </h4>
                </div>
                <span className="text-xs bg-[#28a745]/20 text-[#28a745] font-mono px-2 py-0.5 rounded-full font-semibold">
                  Paso {currentStep}/4
                </span>
              </div>

              {/* Step indicator bar inside phone */}
              <div className="w-full bg-[#122110] px-4 py-2 flex items-center justify-between border-b border-white/5">
                {[1, 2, 3, 4].map((s) => (
                  <button
                    key={s}
                    onClick={() => setCurrentStep(s)}
                    className={`flex-1 h-1.5 mx-0.5 rounded-full transition-all ${s === currentStep
                        ? "bg-[#28a745]"
                        : s < currentStep
                          ? "bg-emerald-500/40"
                          : "bg-white/10"
                      }`}
                  />
                ))}
              </div>

              {/* Screen Body */}
              <div className="flex-1 p-4 overflow-y-auto max-h-[520px] space-y-4 no-scrollbar">
                {/* STEP 1: Personal Data */}
                {currentStep === 1 && (
                  <div className="space-y-4">
                    <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-3 flex items-start gap-2.5">
                      <User className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                      <div>
                        <p className="text-xs font-bold text-white">Datos Personales (Parte 1)</p>
                        <p className="text-[11px] text-white/50 leading-tight">
                          Información básica de identificación del beneficiario.
                        </p>
                      </div>
                    </div>

                    {step1Fields.map((field) => (
                      <div key={field.name} className="space-y-1">
                        <label className="text-xs font-medium text-white/80 flex items-center justify-between">
                          <span>
                            {field.label}{" "}
                            {field.required && <span className="text-red-400">*</span>}
                          </span>
                        </label>

                        {field.type === "text" || field.type === "number" || field.type === "date" ? (
                          <input
                            type={field.type === "number" ? "number" : field.type === "date" ? "date" : "text"}
                            value={formData[field.name] || ""}
                            onChange={(e) => handleInputChange(field.name, e.target.value)}
                            className="w-full bg-[#1b3218] border border-white/15 rounded-xl px-3 py-2 text-xs text-white placeholder:text-white/30 focus:outline-none focus:border-[#28a745]"
                          />
                        ) : field.type === "select_one" ? (
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
                        ) : null}
                      </div>
                    ))}
                  </div>
                )}

                {/* STEP 2: Territorial & Productive Data */}
                {currentStep === 2 && (
                  <div className="space-y-4">
                    <div className="bg-cyan-500/10 border border-cyan-500/20 rounded-xl p-3 flex items-start gap-2.5">
                      <MapPin className="w-4 h-4 text-cyan-400 mt-0.5 shrink-0" />
                      <div>
                        <p className="text-xs font-bold text-white">Datos Territoriales (Parte 2)</p>
                        <p className="text-[11px] text-white/50 leading-tight">
                          Ubicación geográfica y caracterización de la cadena productiva.
                        </p>
                      </div>
                    </div>

                    {step2Fields.map((field) => (
                      <div key={field.name} className="space-y-1">
                        <label className="text-xs font-medium text-white/80 flex items-center justify-between">
                          <span>
                            {field.label}{" "}
                            {field.required && <span className="text-red-400">*</span>}
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
                                  className={`px-2.5 py-1.5 rounded-lg text-[11px] font-medium text-left border transition-all cursor-pointer ${isChecked
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

                {/* STEP 3: Biometric Evidences */}
                {currentStep === 3 && (
                  <div className="space-y-4">
                    <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-3 flex items-start gap-2.5">
                      <Camera className="w-4 h-4 text-amber-400 mt-0.5 shrink-0" />
                      <div>
                        <p className="text-xs font-bold text-white">Evidencias Fotográficas</p>
                        <p className="text-[11px] text-white/50 leading-tight">
                          Captura facial (selfie) y foto de documento DNI (Frente / Dorso).
                        </p>
                      </div>
                    </div>

                    {/* Facial Selfie Capture Box */}
                    <div className="bg-[#162713] border border-white/10 rounded-2xl p-4 space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-bold text-white">Selfie Facial Beneficiario</span>
                        <span className="text-[10px] text-emerald-400 font-mono bg-emerald-500/20 px-2 py-0.5 rounded">
                          Requerido para TEE
                        </span>
                      </div>
                      <div className="relative h-32 rounded-xl bg-black/40 border border-dashed border-white/20 flex flex-col items-center justify-center text-center p-3">
                        {faceCaptured ? (
                          <div className="flex flex-col items-center gap-1">
                            <CheckCircle2 className="w-8 h-8 text-emerald-400" />
                            <span className="text-xs text-emerald-300 font-bold">Selfie Capturada</span>
                            <span className="text-[10px] text-white/40 font-mono">selfie_biometric_v1.jpg</span>
                          </div>
                        ) : (
                          <div className="flex flex-col items-center gap-1 text-white/40">
                            <Camera className="w-6 h-6" />
                            <span className="text-xs">Tocar para tomar foto</span>
                          </div>
                        )}
                      </div>
                      <button
                        onClick={() => setFaceCaptured(!faceCaptured)}
                        className="w-full py-2 bg-white/10 hover:bg-white/15 rounded-xl text-xs font-semibold text-white transition-all cursor-pointer"
                      >
                        {faceCaptured ? "Re-tomar Selfie" : "Simular Captura Facial"}
                      </button>
                    </div>

                    {/* DNI Document Capture Box */}
                    <div className="bg-[#162713] border border-white/10 rounded-2xl p-4 space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-bold text-white">Documento de Identidad (DNI)</span>
                      </div>

                      {/* Tabs */}
                      <div className="flex bg-black/40 p-1 rounded-xl">
                        <button
                          onClick={() => setActiveTabDocument("front")}
                          className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${activeTabDocument === "front" ? "bg-[#28a745] text-white" : "text-white/60"
                            }`}
                        >
                          Frente {frontCaptured && "✓"}
                        </button>
                        <button
                          onClick={() => setActiveTabDocument("back")}
                          className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${activeTabDocument === "back" ? "bg-[#28a745] text-white" : "text-white/60"
                            }`}
                        >
                          Dorso {backCaptured && "✓"}
                        </button>
                      </div>

                      <div className="relative h-28 rounded-xl bg-black/40 border border-dashed border-white/20 flex flex-col items-center justify-center text-center p-3">
                        {activeTabDocument === "front" ? (
                          frontCaptured ? (
                            <div className="flex flex-col items-center gap-1">
                              <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                              <span className="text-xs text-emerald-300 font-bold">DNI Frente Capturado</span>
                            </div>
                          ) : (
                            <span className="text-xs text-white/40">Sin capturar frente</span>
                          )
                        ) : backCaptured ? (
                          <div className="flex flex-col items-center gap-1">
                            <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                            <span className="text-xs text-emerald-300 font-bold">DNI Dorso Capturado</span>
                          </div>
                        ) : (
                          <span className="text-xs text-white/40">Sin capturar dorso</span>
                        )}
                      </div>

                      <button
                        onClick={() =>
                          activeTabDocument === "front"
                            ? setFrontCaptured(!frontCaptured)
                            : setBackCaptured(!backCaptured)
                        }
                        className="w-full py-2 bg-white/10 hover:bg-white/15 rounded-xl text-xs font-semibold text-white transition-all cursor-pointer"
                      >
                        Simular Captura ({activeTabDocument === "front" ? "Frente" : "Dorso"})
                      </button>
                    </div>
                  </div>
                )}

                {/* STEP 4: Submit to Phala TEE & Blockchain */}
                {currentStep === 4 && (
                  <div className="space-y-4">
                    <div className="bg-emerald-500/15 border border-emerald-500/30 rounded-2xl p-4 space-y-3 text-center">
                      <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/40">
                        <ShieldCheck className="w-6 h-6" />
                      </div>
                      <h5 className="text-white font-montserrat font-bold text-sm">
                        Listo para Enviar a Phala TEE
                      </h5>
                      <p className="text-xs text-white/60 font-poppins">
                        Se generará el payload codificado en multipart/form-data con el paquete RAW de datos personales y las evidencias binarias de la selfie y DNI.
                      </p>
                    </div>

                    <div className="bg-black/40 border border-white/10 rounded-xl p-3 space-y-2 text-left">
                      <p className="text-[11px] text-white/40 font-bold uppercase tracking-wider">
                        Resumen de Evidencias Preparadas
                      </p>
                      <div className="text-xs space-y-1 text-white/80 font-mono">
                        <div className="flex justify-between">
                          <span>Beneficiario:</span>
                          <span className="text-white font-bold">{formData.nombre} {formData.apellido}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Documento:</span>
                          <span className="text-white">{formData.documentoIdentidad}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Provincia/Localidad:</span>
                          <span className="text-white">{formData.provincia} / {formData.localidad}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Fotos Adjuntas:</span>
                          <span className="text-emerald-400 font-bold">Selfie + DNI (Frente/Dorso)</span>
                        </div>
                      </div>
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

          {/* Right Column: Detailed Field Inspector & JSON */}
          <div className="lg:col-span-6 space-y-6">
            {/* Cards of current step fields */}
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
                  )
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
        </div>
      ) : (
        /* JSON View Mode */
        <div className="bg-black/50 border border-white/10 rounded-2xl p-6 space-y-4">
          <div className="flex justify-between items-center border-b border-white/10 pb-3">
            <div>
              <h4 className="text-white font-montserrat font-bold text-base">
                Payload JSON del Formulario (Encuesta Inicial v1.0)
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
                formId: "encuesta-inicial-v1",
                metadata: {
                  assetUid: "encuesta-inicial-hardcoded",
                  version: "1.0.0",
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
              2
            )}
          </pre>
        </div>
      )}
    </div>
  );
}
