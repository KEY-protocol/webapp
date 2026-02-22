"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

interface ProjectSelectorProps {
  label: string;
  placeholder: string;
  projects: { id: string; name: string }[];
}

export default function ProjectSelector({
  label,
  placeholder,
  projects,
}: ProjectSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState(placeholder);

  const toggleDropdown = () => setIsOpen(!isOpen);

  const handleSelect = (name: string) => {
    setSelectedProject(name);
    setIsOpen(false);
    // TODO: Connect with server or state management to filter training data
  };

  return (
    <div className="space-y-2">
      <label className="text-lg font-montserrat font-medium text-white/90">
        {label}
      </label>
      <div className="relative max-w-sm">
        <button
          onClick={toggleDropdown}
          className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white/70 font-poppins flex items-center justify-between hover:bg-white/15 transition-colors focus:outline-none"
        >
          <span>{selectedProject}</span>
          <ChevronDown
            className={`w-5 h-5 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
          />
        </button>

        {isOpen && (
          <div className="absolute z-10 w-full mt-2 bg-[#1a2e12] border border-white/20 rounded-lg shadow-xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="py-1">
              {projects.map((project) => (
                <button
                  key={project.id}
                  onClick={() => handleSelect(project.name)}
                  className="w-full text-left px-4 py-2 text-white/80 hover:bg-[#24421A] hover:text-white transition-colors font-poppins text-sm"
                >
                  {project.name}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
