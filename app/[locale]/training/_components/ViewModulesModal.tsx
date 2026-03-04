"use client";

import { useTranslations } from "next-intl";
import { X, BookOpen } from "lucide-react";

interface ViewModulesModalProps {
  isOpen: boolean;
  onClose: () => void;
  training: {
    id: number;
    title: string;
    modules: number;
  } | null;
}

export default function ViewModulesModal({
  isOpen,
  onClose,
  training,
}: ViewModulesModalProps) {
  const t = useTranslations("training_page.view_modal");

  if (!isOpen || !training) return null;

  // Fictitious content for testing
  const fictitiousContent = `Este es un contenido ficticio para los módulos de ${training.title}. 
  
  Módulo 1: Introducción a las técnicas aplicadas.
  Módulo 2: Desarrollo de procesos básicos.
  Módulo 3: Optimización y herramientas avanzadas.
  Módulo 4: Evaluación de impacto y resultados.
  Módulo 5: Conclusiones y próximos pasos.
  
  Este contenido será reemplazado por datos reales del servidor en el futuro.`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-md transition-opacity duration-300"
        onClick={onClose}
      ></div>

      {/* Modal Content */}
      <div className="relative w-full max-w-2xl bg-[#14260f] border border-white/10 rounded-[2.5rem] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
        <div className="p-10">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center space-x-4">
              <div className="bg-white/10 p-3 rounded-full">
                <BookOpen className="w-8 h-8 text-white" />
              </div>
              <div>
                <h2 className="font-montserrat text-3xl font-bold text-white mb-1">
                  {t("title")}
                </h2>
                <p className="text-white/50 font-poppins text-sm italic">
                  {training.title}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-white/10 text-white/40 hover:text-white transition-all transform hover:rotate-90 duration-300"
            >
              <X className="w-8 h-8" />
            </button>
          </div>

          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-white/70 ml-1 uppercase tracking-wider font-montserrat">
                {t("content_label")}
              </label>
              {/* TODO: In the future, this will be replaced by a structured list of modules from the server */}
              <textarea
                readOnly
                rows={10}
                defaultValue={fictitiousContent}
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white/80 focus:outline-none transition-all font-poppins shadow-inner resize-none"
              />
            </div>

            <div className="flex justify-end pt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-10 py-4 rounded-2xl bg-white/10 text-white font-bold hover:bg-white/20 transition-all font-montserrat tracking-wide active:scale-95"
              >
                {t("close")}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
