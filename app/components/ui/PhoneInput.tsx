"use client";

import React, { useState, useEffect } from "react";
import { CountryCode, fetchAllCountryCodes } from "@/app/utils/countryCodes";

const DEFAULT_COUNTRY_CODES: CountryCode[] = [
  { code: "+54", flag: "🇦🇷", name: "Argentina" },
  { code: "+55", flag: "🇧🇷", name: "Brasil" },
  { code: "+56", flag: "🇨🇱", name: "Chile" },
  { code: "+598", flag: "🇺🇾", name: "Uruguay" },
  { code: "+595", flag: "🇵🇾", name: "Paraguay" },
  { code: "+591", flag: "🇧🇴", name: "Bolivia" },
  { code: "+57", flag: "🇨🇴", name: "Colombia" },
  { code: "+52", flag: "🇲🇽", name: "México" },
  { code: "+1", flag: "🇺🇸", name: "EE.UU." },
  { code: "+34", flag: "🇪🇸", name: "España" },
];

export function formatPhoneNumber(value: string, countryCode: string): string {
  const digits = value.replace(/\D/g, "");
  if (countryCode === "+54") {
    if (digits.length <= 2) return digits;
    if (digits.startsWith("11")) {
      if (digits.length <= 6) return `${digits.slice(0, 2)} ${digits.slice(2)}`;
      return `${digits.slice(0, 2)} ${digits.slice(2, 6)} ${digits.slice(6, 10)}`;
    }
    if (digits.startsWith("351") || digits.startsWith("341") || digits.startsWith("261")) {
      if (digits.length <= 6) return `${digits.slice(0, 3)} ${digits.slice(3)}`;
      return `${digits.slice(0, 3)} ${digits.slice(3, 6)} ${digits.slice(6, 10)}`;
    }
    if (digits.length <= 4) return digits;
    if (digits.length <= 7) return `${digits.slice(0, 4)} ${digits.slice(4)}`;
    return `${digits.slice(0, 4)} ${digits.slice(4, 7)} ${digits.slice(7, 11)}`;
  }
  if (digits.length <= 3) return digits;
  if (digits.length <= 6) return `${digits.slice(0, 3)} ${digits.slice(3)}`;
  return `${digits.slice(0, 3)} ${digits.slice(3, 6)} ${digits.slice(6, 10)}`;
}

interface PhoneInputProps {
  value: string;
  onChange: (fullFormattedPhone: string) => void;
  className?: string;
}

export function PhoneInput({ value, onChange, className = "" }: PhoneInputProps) {
  const [countryList, setCountryList] = useState<CountryCode[]>(DEFAULT_COUNTRY_CODES);
  const [selectedCountry, setSelectedCountry] = useState("+54");
  const [localNumber, setLocalNumber] = useState("");

  useEffect(() => {
    fetchAllCountryCodes().then((list) => {
      if (list && list.length > 0) {
        setCountryList(list);
      }
    });
  }, []);

  // Extraer el código y el número si ya viene un valor
  useEffect(() => {
    if (!value) {
      setLocalNumber("");
      return;
    }
    const foundCode = countryList.find((c) => value.startsWith(c.code));
    if (foundCode) {
      setSelectedCountry(foundCode.code);
      const rest = value.replace(foundCode.code, "").trim();
      setLocalNumber(formatPhoneNumber(rest, foundCode.code));
    } else {
      setLocalNumber(value);
    }
  }, [value, countryList]);

  const handleCountryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newCode = e.target.value;
    setSelectedCountry(newCode);
    const formatted = formatPhoneNumber(localNumber, newCode);
    setLocalNumber(formatted);
    onChange(formatted ? `${newCode} ${formatted}` : "");
  };

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(e.target.value, selectedCountry);
    setLocalNumber(formatted);
    onChange(formatted ? `${selectedCountry} ${formatted}` : "");
  };

  return (
    <div className={`flex gap-2 ${className}`}>
      <select
        value={selectedCountry}
        onChange={handleCountryChange}
        className="bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#28a745]/40 font-poppins cursor-pointer shrink-0"
      >
        {countryList.map((c) => (
          <option key={`${c.code}-${c.name}`} value={c.code} className="bg-[#142612] text-white">
            {c.flag} {c.code} ({c.name})
          </option>
        ))}
      </select>
      <input
        type="text"
        value={localNumber}
        onChange={handleNumberChange}
        placeholder="11 5596 3637"
        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#28a745]/40 transition-all font-poppins"
      />
    </div>
  );
}
