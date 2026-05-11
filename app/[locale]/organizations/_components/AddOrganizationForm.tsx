"use client";

import React, { useState } from "react";

interface AddOrganizationFormProps {
  onAdd: (name: string) => void;
  onCancel: () => void;
  t: (key: string) => string;
}

export const AddOrganizationForm = ({
  onAdd,
  onCancel,
  t,
}: AddOrganizationFormProps) => {
  const [newOrgName, setNewOrgName] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newOrgName.trim()) {
      onAdd(newOrgName);
      setNewOrgName("");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white/5 border border-white/10 p-6 rounded-2xl animate-in fade-in slide-in-from-top-4 duration-300"
    >
      <div className="flex gap-4">
        <input
          type="text"
          value={newOrgName}
          onChange={(e) => setNewOrgName(e.target.value)}
          placeholder={t("placeholder")}
          className="flex-1 bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-white/40 font-poppins"
          autoFocus
        />
        <button
          type="submit"
          className="bg-white text-primary px-8 rounded-xl font-bold font-poppins hover:bg-white/90 transition-all"
        >
          {t("create")}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="text-white/60 px-4 hover:text-white transition-colors font-poppins"
        >
          {t("cancel")}
        </button>
      </div>
    </form>
  );
};
