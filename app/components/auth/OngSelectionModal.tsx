"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Spinner } from "@/app/components/common/Spinner";
import { organizationsService } from "@/app/services/organizationsService";

interface OngSelectionModalProps {
  /** Called when the ADMIN confirms which ONG to administer. */
  onConfirm: (ongId: string) => void;
  /** Whether the confirmation is being processed. */
  isLoading?: boolean;
  /** Initial default user ongId if available */
  defaultOngId?: string;
}

/**
 * Modal displayed after login for ADMIN users.
 * Dynamically fetches registered active ONGs so the ADMIN can choose which ONG to work in.
 */
export function OngSelectionModal({
  onConfirm,
  isLoading = false,
  defaultOngId,
}: OngSelectionModalProps) {
  const t = useTranslations("auth.login");
  const [selectedOng, setSelectedOng] = useState(defaultOngId || "");
  const [organizations, setOrganizations] = useState<Array<{ id: string; name: string }>>([]);
  const [loadingOrgs, setLoadingOrgs] = useState(true);

  useEffect(() => {
    async function loadOrgs() {
      try {
        const data = await organizationsService.getOrganizations();
        const active = data
          .filter((o) => o.status === "ACTIVE" && o.slug !== "key-protocol")
          .map((o) => ({ id: o.slug, name: o.name }));

        if (active.length > 0) {
          setOrganizations(active);
          if (!selectedOng) {
            setSelectedOng(active[0].id);
          }
        } else {
          setOrganizations([{ id: defaultOngId || "key-protocol", name: defaultOngId || "KEY Protocol" }]);
          if (!selectedOng) setSelectedOng(defaultOngId || "key-protocol");
        }
      } catch {
        setOrganizations([{ id: defaultOngId || "key-protocol", name: defaultOngId || "KEY Protocol" }]);
        if (!selectedOng) setSelectedOng(defaultOngId || "key-protocol");
      } finally {
        setLoadingOrgs(false);
      }
    }
    loadOrgs();
  }, [defaultOngId]);

  const handleConfirm = () => {
    if (selectedOng) {
      onConfirm(selectedOng);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

      {/* Modal */}
      <div className="relative w-full max-w-md bg-[#0d1a0a] border border-white/10 rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 fade-in duration-300">
        {/* Header */}
        <div className="px-6 pt-6 pb-4 border-b border-white/5">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-[#28a745]/15 flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#28a745"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z" />
                <path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2" />
                <path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2" />
                <path d="M10 6h4" />
                <path d="M10 10h4" />
                <path d="M10 14h4" />
                <path d="M10 18h4" />
              </svg>
            </div>
            <div>
              <h2 className="text-lg font-poppins font-bold text-white">
                {t("ongModalTitle")}
              </h2>
              <p className="text-sm text-white/50 font-poppins">
                {t("ongModalDescription")}
              </p>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="px-6 py-5 space-y-3 max-h-60 overflow-y-auto">
          {loadingOrgs ? (
            <div className="flex items-center justify-center py-6">
              <Spinner />
            </div>
          ) : (
            organizations.map((org) => (
              <button
                key={org.id}
                type="button"
                onClick={() => setSelectedOng(org.id)}
                disabled={isLoading}
                className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-xl border transition-all font-poppins text-left cursor-pointer
                  ${
                    selectedOng === org.id
                      ? "bg-[#28a745]/10 border-[#28a745]/50 text-white shadow-lg shadow-green-950/10"
                      : "bg-white/3 border-white/8 text-white/70 hover:bg-white/5 hover:border-white/15"
                  }
                  disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {/* Radio indicator */}
                <span
                  className={`shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all
                    ${
                      selectedOng === org.id
                        ? "border-[#28a745] bg-[#28a745]"
                        : "border-white/30"
                    }`}
                >
                  {selectedOng === org.id && (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="white"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  )}
                </span>

                <span className="font-medium text-sm">{org.name}</span>
              </button>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="px-6 pb-6 pt-2">
          <button
            type="button"
            onClick={handleConfirm}
            disabled={!selectedOng || isLoading}
            className="w-full bg-[#28a745] hover:bg-[#218838] text-white font-poppins font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 transition-all active:scale-[0.98] shadow-lg shadow-green-950/20 disabled:opacity-40 disabled:cursor-not-allowed disabled:active:scale-100 cursor-pointer"
          >
            {isLoading ? (
              <>
                <Spinner />
                {t("sending")}
              </>
            ) : (
              t("ongModalConfirm")
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
