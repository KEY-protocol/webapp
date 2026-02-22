"use client";

import { useTranslations } from "next-intl";
import { X, Upload, FileText, CheckCircle2 } from "lucide-react";
import { useState, useRef } from "react";

interface EditTrainingModalProps {
  isOpen: boolean;
  onClose: () => void;
  training: {
    id: number;
    title: string;
    modules: number;
    objective: string;
    zone: string;
  } | null;
}

export default function EditTrainingModal({
  isOpen,
  onClose,
  training,
}: EditTrainingModalProps) {
  const t = useTranslations("training_page.edit_modal");
  const [isDragging, setIsDragging] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen || !training) return null;

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      setUploadedFile(files[0]);
      // TODO: In the future, send this file to the AI analysis service
      console.log("File dropped for AI analysis:", files[0].name);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setUploadedFile(files[0]);
      // TODO: In the future, send this file to the AI analysis service
      console.log("File selected for AI analysis:", files[0].name);
    }
  };

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
            <div>
              <h2 className="font-montserrat text-3xl font-bold text-white mb-1">
                {t("title")}
              </h2>
              <p className="text-white/50 font-poppins text-sm italic">
                {training.title}
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-white/10 text-white/40 hover:text-white transition-all transform hover:rotate-90 duration-300"
            >
              <X className="w-8 h-8" />
            </button>
          </div>

          <form className="space-y-8" onSubmit={(e) => e.preventDefault()}>
            {/* Modules File Dropzone */}
            <div className="space-y-3">
              <label className="text-sm font-bold text-white/70 ml-1 uppercase tracking-wider font-montserrat">
                {t("modules_label")}
              </label>
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`relative group cursor-pointer border-2 border-dashed rounded-3xl p-10 transition-all duration-300 flex flex-col items-center justify-center space-y-4 ${
                  isDragging
                    ? "border-green-400 bg-green-400/10"
                    : uploadedFile
                      ? "border-green-500/50 bg-green-500/5"
                      : "border-white/10 bg-white/5 hover:border-white/30 hover:bg-white/10"
                }`}
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  className="hidden"
                  accept=".pdf,.doc,.docx"
                />

                {uploadedFile ? (
                  <>
                    <div className="bg-green-500/20 p-4 rounded-full">
                      <CheckCircle2 className="w-10 h-10 text-green-400" />
                    </div>
                    <div className="text-center">
                      <p className="text-white font-bold font-poppins">
                        {uploadedFile.name}
                      </p>
                      <p className="text-white/40 text-xs mt-1">
                        Ready for AI processing
                      </p>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="bg-white/10 p-4 rounded-full group-hover:scale-110 transition-transform">
                      <Upload className="w-10 h-10 text-white/70" />
                    </div>
                    <div className="text-center space-y-1">
                      <p className="text-white/80 font-medium font-poppins">
                        {t("modules_hint")}
                      </p>
                      <p className="text-white/30 text-xs">
                        PDF or Word documents only
                      </p>
                    </div>
                  </>
                )}

                {/* AI Analysis Overlay (Visible only in TODO/Future) */}
                {/* TODO: Implement AI analysis progress bar/indicator */}
              </div>
            </div>

            {/* Other Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Objective */}
              <div className="space-y-2">
                <label className="text-sm font-bold text-white/70 ml-1 uppercase tracking-wider font-montserrat">
                  {t("objective_label")}
                </label>
                <input
                  type="text"
                  defaultValue={training.objective}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:outline-none focus:ring-2 focus:ring-green-500/50 hover:bg-white/10 transition-all font-poppins placeholder:text-white/20 shadow-inner"
                />
              </div>

              {/* Zone */}
              <div className="space-y-2">
                <label className="text-sm font-bold text-white/70 ml-1 uppercase tracking-wider font-montserrat">
                  {t("zone_label")}
                </label>
                <input
                  type="text"
                  defaultValue={training.zone}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:outline-none focus:ring-2 focus:ring-green-500/50 hover:bg-white/10 transition-all font-poppins placeholder:text-white/20 shadow-inner"
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-5 pt-6">
              <button
                type="button"
                onClick={onClose}
                className="px-10 py-4 rounded-2xl border border-white/10 text-white/70 font-bold hover:bg-white/5 hover:text-white transition-all font-montserrat tracking-wide active:scale-95"
              >
                {t("cancel")}
              </button>
              <button
                type="button"
                className="px-12 py-4 rounded-2xl bg-green-600 text-white font-bold hover:bg-green-500 transition-all font-montserrat tracking-wide shadow-xl shadow-green-900/20 active:scale-95"
              >
                {t("save")}
              </button>
              {/* TODO: Implement save logic to persist changes */}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
