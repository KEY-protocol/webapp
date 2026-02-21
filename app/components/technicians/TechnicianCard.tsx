"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { User, FileText } from "lucide-react";
import EditTechnicianModal from "./EditTechnicianModal";

interface TechnicianCardProps {
  name: string;
  role: string;
  id: string;
  birthDate: string;
  project: string;
  expertise: string;
  zone: string;
  wallet: string;
  did: string;
}

export default function TechnicianCard(props: TechnicianCardProps) {
  const { name, role, id, birthDate, project, expertise, zone, wallet, did } =
    props;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const t = useTranslations("technicians_page");

  const detailLines = [
    { label: t("role"), value: role },
    { label: t("id"), value: id },
    { label: t("birthdate"), value: birthDate },
    { label: t("project"), value: project },
    { label: t("expertise"), value: expertise },
    { label: t("zone"), value: zone },
    { label: t("wallet"), value: wallet },
    { label: t("did"), value: did },
  ];

  return (
    <>
      <div className="bg-[#2d4a1e] rounded-4xl p-7 mb-6 border border-white/5 transition-all duration-300 group shadow-2xl flex flex-col lg:flex-row gap-8 lg:items-center">
        {/* Left side: Profile and Details */}
        <div className="flex-1">
          <div className="flex justify-between items-start mb-4 lg:mb-6">
            <div className="flex items-center gap-5">
              <div className="w-14 h-14 rounded-full bg-white/10 flex items-center justify-center border border-white/20 shadow-inner">
                <User className="text-white w-8 h-8" />
              </div>
              <h2 className="font-montserrat text-3xl md:text-[2.5rem] font-bold text-white leading-tight tracking-tight">
                {name}
              </h2>
            </div>
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-5 py-1.5 rounded-full border border-white/40 text-white text-[10px] font-bold hover:bg-white/10 transition-colors uppercase tracking-widest font-poppins cursor-pointer"
            >
              {t("edit")}
            </button>
          </div>

          <div className="space-y-1.5 mt-8 ml-1">
            {detailLines.map((line, idx) => (
              <div
                key={idx}
                className="flex gap-2 text-base md:text-[1.1rem] font-poppins leading-relaxed"
              >
                <span className="font-bold text-white min-w-25 md:min-w-30">
                  {line.label}:
                </span>
                <span className="text-white font-normal opacity-90">
                  {line.value}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Right side: Document Placeholder */}
        <div className="shrink-0 flex items-center justify-center lg:pt-0">
          <div className="w-full sm:w-95 h-55 bg-[#d1e7dd] rounded-3xl flex flex-col items-center justify-center gap-4 shadow-xl border border-white/10 relative group-hover:scale-[1.02] transition-transform duration-300 overflow-hidden">
            {/* Document Content Icon */}
            <div className="w-20 h-20 rounded-2xl bg-[#d1e7dd] border-2 border-[#a8c9b9] flex items-center justify-center shadow-md z-10 transition-all duration-300 group-hover:bg-white/40">
              <div className="w-14 h-14 rounded-xl bg-transparent flex items-center justify-center border-2 border-[#2d4a1e]/20">
                <FileText className="text-[#2d4a1e] w-8 h-8" />
              </div>
            </div>
            <p className="text-[#2d4a1e] font-poppins font-medium text-base z-10">
              {t("document_front")}
            </p>

            {/* Stylized border overlay matching image's subtle inner frame */}
            <div className="absolute inset-4 rounded-2xl border-2 border-[#2d4a1e]/10 pointer-events-none"></div>

            {/* Subtle light overlay */}
            <div className="absolute inset-0 bg-linear-to-tr from-transparent via-white/5 to-white/10 opacity-50"></div>
          </div>
        </div>
      </div>

      <EditTechnicianModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        technician={props}
      />
    </>
  );
}
