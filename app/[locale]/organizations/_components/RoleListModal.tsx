"use client";

import React from "react";
import { X, User, Mail, Shield, UserCircle, HardHat } from "lucide-react";
import { UserProfile } from "@/app/types/api";

interface RoleListModalProps {
  isOpen: boolean;
  onClose: () => void;
  users: UserProfile[];
  roleName: string;
  orgName: string;
  t: (key: string, values?: Record<string, string | number>) => string;
}

export const RoleListModal = ({
  isOpen,
  onClose,
  users,
  roleName,
  orgName,
  t,
}: RoleListModalProps) => {
  if (!isOpen) return null;

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "admin":
        return <Shield size={18} className="text-blue-400" />;
      case "encargado":
        return <UserCircle size={18} className="text-emerald-400" />;
      case "tecnico":
        return <HardHat size={18} className="text-amber-400" />;
      default:
        return <User size={18} className="text-white/40" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Overlay */}
      <div 
        className="absolute inset-0 bg-primary/80 backdrop-blur-sm animate-in fade-in duration-300"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className="relative bg-[#1C1C1C] border border-white/10 w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl animate-in zoom-in-95 fade-in duration-300">
        {/* Header */}
        <div className="p-6 border-b border-white/10 flex justify-between items-center bg-white/5">
          <div>
            <h2 className="text-xl font-bold text-white font-montserrat">
              {t("listModalTitle", { role: roleName, org: orgName })}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white/60 hover:text-white hover:bg-white/20 transition-all"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="max-h-[60vh] overflow-y-auto p-6 space-y-4 custom-scrollbar">
          {users.length > 0 ? (
            users.map((user) => (
              <div 
                key={user.id}
                className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-white/10 transition-all group"
              >
                <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-white font-bold text-lg overflow-hidden shrink-0">
                  {user.avatar ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                  ) : (
                    user.name.charAt(0)
                  )}
                </div>
                
                <div className="flex-1 min-w-0">
                  <h3 className="text-white font-bold font-montserrat truncate group-hover:text-tertiary transition-colors">
                    {user.name}
                  </h3>
                  <div className="flex items-center gap-2 text-white/40 text-xs font-poppins truncate">
                    <Mail size={12} />
                    {user.email}
                  </div>
                </div>

                <div className="shrink-0 p-2 rounded-lg bg-white/5">
                  {getRoleIcon(user.role)}
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center text-white/20 mx-auto mb-4">
                <User size={32} />
              </div>
              <p className="text-white/40 font-poppins">
                {t("unassigned")}
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-white/10 bg-white/5 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 rounded-xl bg-white text-primary font-bold font-poppins hover:bg-white/90 transition-all"
          >
            {t("close")}
          </button>
        </div>
      </div>
    </div>
  );
};
