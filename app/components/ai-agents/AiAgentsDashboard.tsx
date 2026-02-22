"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Send, FolderPlus } from "lucide-react";

export default function AiAgentsDashboard() {
  const t = useTranslations("ai_agents_page");
  const [question, setQuestion] = useState("");

  // TODO: Implement actual state management for projects, chains, modules
  // TODO: Add integration with AI backend

  return (
    <div className="flex flex-col gap-6 font-poppins">
      {/* Top Selectors */}
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
                className="w-full bg-[#1e2e1a]/80 border border-white/10 rounded-lg px-4 py-2.5 text-white/70 appearance-none focus:outline-none focus:ring-1 focus:ring-[#4ade80]/50 transition-all"
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
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[550px]">
        {/* Left: Agent Response */}
        <div className="flex flex-col h-full bg-[#1e2e1a]/40 border border-white/10 rounded-xl p-6">
          <h3 className="text-white/60 text-sm mb-4">
            {t("agent_response_label")}
          </h3>
          <div className="flex-1 text-white/40 italic">
            {/* TODO: Stream response from AI Agent */}
          </div>
        </div>

        {/* Right Columns */}
        <div className="flex flex-col gap-4 overflow-y-auto pr-2 no-scrollbar">
          {/* Agent Prompt */}
          <div className="bg-[#1e2e1a]/40 border border-white/10 rounded-xl p-4 min-h-[140px] relative">
            <h3 className="text-white/60 text-sm mb-2">
              {t("agent_prompt_label")}
            </h3>
            <div className="absolute top-4 right-4 text-white/20">
              <div className="w-1 h-32 bg-white/5 rounded-full" />
            </div>
          </div>

          {/* Repositories */}
          <div className="bg-[#1e2e1a]/40 border border-white/10 rounded-xl p-4 min-h-[140px] relative group">
            <div className="flex justify-between items-start">
              <h3 className="text-white/60 text-sm mb-2">
                {t("agent_repos_label")}
              </h3>
              <button className="text-white/30 hover:text-white/60 transition-colors">
                <FolderPlus size={18} />
              </button>
            </div>
            <div className="absolute top-4 right-4 text-white/20">
              <div className="w-1 h-24 bg-white/5 rounded-full" />
            </div>
          </div>

          {/* Processed Documents */}
          <div className="bg-[#1e2e1a]/40 border border-white/10 rounded-xl p-4 min-h-[140px] relative">
            <h3 className="text-white/60 text-sm mb-2">
              {t("processed_docs_label")}
            </h3>
            <div className="absolute top-4 right-4 text-white/20">
              <div className="w-1 h-24 bg-white/5 rounded-full" />
            </div>
          </div>

          {/* Reports */}
          <div className="bg-[#1e2e1a]/40 border border-white/10 rounded-xl p-4 min-h-[140px] relative">
            <h3 className="text-white/60 text-sm mb-2">{t("reports_label")}</h3>
            <div className="absolute top-4 right-4 text-white/20">
              <div className="w-1 h-24 bg-white/5 rounded-full" />
            </div>
          </div>
        </div>
      </div>

      {/* Question Input */}
      <div className="flex flex-col gap-4">
        <textarea
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder={t("question_placeholder")}
          className="w-full bg-[#1e2e1a]/60 border border-white/10 rounded-xl p-4 text-white/70 placeholder:text-white/30 h-24 focus:outline-none focus:ring-1 focus:ring-[#4ade80]/30 resize-none transition-all"
        />

        <div className="flex justify-center mt-2">
          <button
            className="flex items-center gap-2 bg-[#22c55e] hover:bg-[#16a34a] text-white px-12 py-2.5 rounded-lg font-medium transition-all shadow-lg shadow-[#22c55e]/10 group active:scale-95"
            onClick={() => {
              // TODO: Send question to AI Agent
              console.log("Sending question:", question);
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
