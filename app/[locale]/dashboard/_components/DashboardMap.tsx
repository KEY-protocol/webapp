"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import "leaflet/dist/leaflet.css";

// Dynamic import to avoid SSR issues with Leaflet
const MapContainer = dynamic(
  () => import("react-leaflet").then((mod) => mod.MapContainer),
  { ssr: false },
);
const TileLayer = dynamic(
  () => import("react-leaflet").then((mod) => mod.TileLayer),
  { ssr: false },
);
const Circle = dynamic(
  () => import("react-leaflet").then((mod) => mod.Circle),
  { ssr: false },
);

interface AreaData {
  center: [number, number];
  radius: number;
  color: string;
  fillColor: string;
  name: string;
}

const AREAS: AreaData[] = [
  {
    center: [-24.5, -60.5],
    radius: 30000,
    color: "rgba(75, 134, 212, 0.5)",
    fillColor: "rgba(75, 134, 212, 0.3)",
    name: "Area 1",
  },
  {
    center: [-25.5, -61.5],
    radius: 25000,
    color: "rgba(237, 137, 54, 0.5)",
    fillColor: "rgba(237, 137, 54, 0.3)",
    name: "Area 2",
  },
  {
    center: [-26.2, -62.1],
    radius: 40000,
    color: "rgba(159, 122, 234, 0.5)",
    fillColor: "rgba(159, 122, 234, 0.3)",
    name: "Area 3",
  },
  {
    center: [-24.8, -61.2],
    radius: 15000,
    color: "rgba(72, 187, 120, 0.5)",
    fillColor: "rgba(72, 187, 120, 0.3)",
    name: "Area 4",
  },
  {
    center: [-25.9, -60.2],
    radius: 20000,
    color: "rgba(236, 201, 75, 0.5)",
    fillColor: "rgba(236, 201, 75, 0.3)",
    name: "Area 5",
  },
];

export const DashboardMap = () => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    // Fix for Leaflet marker icons in Next.js
    import("leaflet").then((L) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl:
          "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
        iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
        shadowUrl:
          "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
      });
    });
  }, []);

  if (!isMounted)
    return (
      <div className="h-[500px] w-full bg-[#1a1a1a] rounded-sm animate-pulse" />
    );

  return (
    <div className="h-[500px] w-full rounded-sm overflow-hidden shadow-xl border border-white/10 relative">
      <MapContainer
        center={[-25.5, -61.0]}
        zoom={7}
        style={{ height: "100%", width: "100%" }}
        zoomControl={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {AREAS.map((area, index) => (
          <Circle
            key={index}
            center={area.center}
            radius={area.radius}
            pathOptions={{
              color: area.color,
              fillColor: area.fillColor,
              fillOpacity: 0.6,
            }}
          />
        ))}
      </MapContainer>

      {/* Map Overlay Controls UI Emulator */}
      <div className="absolute top-4 left-4 z-[1000] flex bg-white rounded-sm overflow-hidden shadow-md">
        <button className="px-4 py-1.5 text-xs font-semibold text-gray-800 border-r border-gray-200 bg-gray-50">
          Mapa
        </button>
        <button className="px-4 py-1.5 text-xs font-semibold text-gray-500 hover:bg-gray-50 transition-colors">
          Satélite
        </button>
      </div>

      <div className="absolute top-4 left-44 z-[1000] bg-white p-1 rounded-sm shadow-md">
        <div className="w-5 h-5 flex items-center justify-center">
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-gray-700"
          >
            <circle cx="12" cy="12" r="3"></circle>
            <path d="M3 12h3m12 0h3M12 3v3m0 12v3"></path>
          </svg>
        </div>
      </div>

      <div className="absolute top-4 right-4 z-[1000] bg-white p-1 rounded-sm shadow-md">
        <div className="w-5 h-5 flex items-center justify-center">
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-gray-700"
          >
            <polyline points="15 3 21 3 21 9"></polyline>
            <polyline points="9 21 3 21 3 15"></polyline>
            <line x1="21" y1="3" x2="14" y2="10"></line>
            <line x1="3" y1="21" x2="10" y2="14"></line>
          </svg>
        </div>
      </div>

      <div className="absolute bottom-12 right-4 z-[1000] flex flex-col gap-px bg-white rounded-sm overflow-hidden shadow-md">
        <button className="p-2 text-gray-700 hover:bg-gray-100 border-b border-gray-100">
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
        </button>
        <button className="p-2 text-gray-700 hover:bg-gray-100">
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
        </button>
      </div>

      <div className="absolute bottom-4 left-4 z-[1000] bg-black/40 backdrop-blur-sm px-2 py-0.5 rounded text-[10px] text-white/80">
        Google
      </div>
    </div>
  );
};
