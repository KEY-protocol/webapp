"use client";

import { useState, useRef } from "react";
import { useTranslations } from "next-intl";
import { Send, FolderPlus, FileText, X } from "lucide-react";

export default function AiAgentsDashboard() {
  const t = useTranslations("ai_agents_page");
  const [question, setQuestion] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // TODO: Implement actual state management for projects, chains, modules
  // TODO: Add integration with AI backend

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setFiles((prev) => [...prev, ...newFiles]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files) {
      const droppedFiles = Array.from(e.dataTransfer.files);
      setFiles((prev) => [...prev, ...droppedFiles]);
    }
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="flex flex-col gap-6 font-poppins">
      {/* Hidden File Input */}
      <input
        type="file"
        multiple
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
      />

      {/* Top Selectors Cast as grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
          { label: t("project_label"), value: "Proyecto uno" },
          { label: t("chain_label"), value: "Proyecto uno" },
          { label: t("module_label"), value: "Proyecto uno" },
        ].map((item, idx) => (
          <div key={idx} className="flex flex-col gap-2">
            <label className="font-montserrat text-lg font-medium text-white/90">
              {item.label}
            </label>
            <div className="relative">
              <select
                className="w-full bg-[#1e2e1a]/80 border border-white/10 rounded-lg px-4 py-2.5 text-white/70 appearance-none focus:outline-none focus:ring-1 focus:ring-[#4ade80]/50 transition-all font-poppins"
                defaultValue={item.value}
              >
                <option>{item.value}</option>
                {/* TODO: Populate with real options from server */}
              </select>
              <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                <svg
                  className="w-4 h-4 text-white/40"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-137.5">
        {/* Left: Agent Response */}
        <div className="flex flex-col h-full bg-[#1e2e1a]/40 border border-white/10 rounded-xl p-6">
          <h3 className="text-white/60 text-sm mb-4 font-montserrat">
            {t("agent_response_label")}
          </h3>
          <div className="flex-1 text-white/40 italic">
            {/* TODO: Stream response from AI Agent */}
          </div>
        </div>

        {/* Right Columns */}
        <div className="flex flex-col gap-4 overflow-y-auto pr-2 no-scrollbar">
          {/* Agent Prompt */}
          <div className="bg-[#1e2e1a]/40 border border-white/10 rounded-xl p-4 min-h-35 relative">
            <h3 className="text-white/60 text-sm mb-2 font-montserrat">
              {t("agent_prompt_label")}
            </h3>
            {/* TODO: Implement prompt editable field */}
          </div>

          {/* Repositories (Drag & Drop Area) */}
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`bg-[#1e2e1a]/40 border rounded-xl p-4 min-h-35 relative group transition-all duration-300 flex flex-col ${
              isDragging
                ? "border-[#4ade80] bg-[#1e2e1a]/60 shadow-lg shadow-[#4ade80]/5"
                : "border-white/10"
            }`}
          >
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-white/60 text-sm font-montserrat">
                {t("agent_repos_label")}
              </h3>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="text-white/30 hover:text-[#4ade80] transition-colors p-1"
                title="Cargar archivos"
              >
                <FolderPlus size={18} />
              </button>
            </div>

            <div className="flex-1 flex flex-col gap-2 overflow-y-auto no-scrollbar pt-1">
              {files.length === 0 ? (
                <div className="flex-1 flex items-center justify-center border border-dashed border-white/5 rounded-lg">
                  <span className="text-white/20 text-xs italic">
                    {isDragging
                      ? "Suelta aquí"
                      : "Arrastra o selecciona archivos"}
                  </span>
                </div>
              ) : (
                files.map((file, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between bg-white/5 rounded-lg px-3 py-2 border border-white/5 animate-in fade-in slide-in-from-top-1 duration-200"
                  >
                    <div className="flex items-center gap-2 overflow-hidden">
                      <FileText
                        size={14}
                        className="text-[#4ade80]/60 shrink-0"
                      />
                      <span className="text-white/60 text-xs truncate">
                        {file.name}
                      </span>
                    </div>
                    <button
                      onClick={() => removeFile(idx)}
                      className="text-white/20 hover:text-red-400 transition-colors"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Processed Documents */}
          <div className="bg-[#1e2e1a]/40 border border-white/10 rounded-xl p-4 min-h-35">
            <h3 className="text-white/60 text-sm mb-2 font-montserrat">
              {t("processed_docs_label")}
            </h3>
            {/* TODO: List documents being processed */}
          </div>

          {/* Reports */}
          <div className="bg-[#1e2e1a]/40 border border-white/10 rounded-xl p-4 min-h-35">
            <h3 className="text-white/60 text-sm mb-2 font-montserrat">
              {t("reports_label")}
            </h3>
            {/* TODO: Display generated reports */}
          </div>
        </div>
      </div>

      {/* Question Input */}
      <div className="flex flex-col gap-4">
        <textarea
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder={t("question_placeholder")}
          className="w-full bg-[#1e2e1a]/60 border border-white/10 rounded-xl p-4 text-white/70 placeholder:text-white/30 h-24 focus:outline-none focus:ring-1 focus:ring-[#4ade80]/30 resize-none transition-all font-poppins"
        />

        <div className="flex justify-center mt-2">
          <button
            className="flex items-center gap-2 bg-[#22c55e] hover:bg-[#16a34a] text-white px-12 py-2.5 rounded-lg font-medium transition-all shadow-lg shadow-[#22c55e]/10 group active:scale-95 font-poppins"
            onClick={() => {
              // TODO: Send question and files to AI Agent
              console.log("Sending question:", question);
              console.log("Files:", files);
            }}
          >
            {t("send_button")}
            <Send
              size={18}
              className="rotate-0 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform"
            />
          </button>
        </div>
      </div>
    </div>
  );
}
