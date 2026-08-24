"use client";

import React from "react";
import { Check, Layers } from "lucide-react";
import { FormSchemaDto, FormVersionDto } from "@/app/types/api";

interface FormVersionSelectorProps {
  formSchema: FormSchemaDto;
  onSelectVersion: (versionId: string) => Promise<void>;
  isUpdating?: boolean;
}

export function FormVersionSelector({
  formSchema,
  onSelectVersion,
  isUpdating = false,
}: FormVersionSelectorProps) {
  const versions: FormVersionDto[] = formSchema.versions || [];
  const activeVersionId = formSchema.activeVersionId || formSchema.activeVersion?.id;

  return (
    <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-5 space-y-4">
      <div className="flex items-center justify-between border-b border-white/10 pb-3">
        <div className="flex items-center gap-2.5">
          <Layers className="w-5 h-5 text-[#28a745]" />
          <div>
            <h4 className="text-white font-montserrat font-bold text-sm">
              Versión Activa del Formulario
            </h4>
            <p className="text-white/50 text-xs font-poppins">
              Selecciona cuál versión publicada utilizarán los técnicos en territorio.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {versions.map((ver) => {
          const isActive = ver.id === activeVersionId;
          return (
            <div
              key={ver.id}
              onClick={() => !isActive && !isUpdating && onSelectVersion(ver.id)}
              className={`p-4 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                isActive
                  ? "bg-[#28a745]/15 border-[#28a745] shadow-lg shadow-green-950/20"
                  : "bg-white/5 border-white/10 hover:border-white/20"
              }`}
            >
              <div className="flex justify-between items-start">
                <div>
                  <span className="font-mono text-sm font-bold text-emerald-400">
                    Versión v{ver.version}
                  </span>
                  {ver.description && (
                    <p className="text-xs text-white/70 mt-1 font-poppins">{ver.description}</p>
                  )}
                </div>
                {isActive && (
                  <span className="flex items-center gap-1 bg-[#28a745] text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                    <Check className="w-3 h-3" /> ACTIVA
                  </span>
                )}
              </div>

              <div className="mt-3 pt-2 border-t border-white/5 flex justify-between items-center text-[10px] text-white/40">
                <span>Campos: {ver.fields?.length || 0}</span>
                <span>{new Date(ver.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
