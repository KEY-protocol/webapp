"use client";

import React from "react";
import { ProjectIcon } from "./ProjectIcon";

interface Project {
  id: number;
  title: string;
  startYear: number;
  indicators: string[];
}

const PROJECTS_DATA: Project[] = [
  {
    id: 1,
    title: "Proyecto uno",
    startYear: 2025,
    indicators: [
      "personas alcanzadas:",
      "superficie impacto:",
      "superficie intervenida:",
      "inversiones capacitaciones:",
      "inversiones infraestructura:",
    ],
  },
  {
    id: 2,
    title: "Proyecto dos",
    startYear: 2026,
    indicators: [
      "personas alcanzadas:",
      "superficie impacto:",
      "superficie intervenida:",
      "inversiones capacitaciones:",
      "inversiones infraestructura:",
    ],
  },
];

export const ProjectList = () => {
  return (
    <div className="space-y-12 py-8">
      {PROJECTS_DATA.map((project) => (
        <div
          key={project.id}
          className="border-t border-white/20 pt-8 first:border-t-0 first:pt-0"
        >
          <div className="flex gap-6">
            <ProjectIcon className="w-16 h-16 shrink-0 mt-1" />
            <div className="space-y-4">
              <div>
                <h2 className="text-3xl font-montserrat font-bold text-white">
                  {project.title}
                </h2>
                <p className="text-lg font-poppins text-white/80">
                  Inicio: {project.startYear}
                </p>
                <p className="text-lg font-montserrat font-bold text-white mt-1">
                  Indicadores:
                </p>
              </div>
              <ul className="space-y-1 list-disc list-inside ml-2">
                {project.indicators.map((indicator, index) => (
                  <li key={index} className="text-white/90 font-poppins">
                    {indicator}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
