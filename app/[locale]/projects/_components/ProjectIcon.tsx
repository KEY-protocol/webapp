"use client";

import React from "react";

export const ProjectIcon = ({
  className = "w-12 h-12",
}: {
  className?: string;
}) => {
  return (
    <svg
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M30 40C30 25 40 25 50 40C60 25 70 25 70 40C70 50 60 50 50 65C40 50 30 50 30 40Z"
        stroke="white"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="opacity-80"
      />
      <path
        d="M50 20 C 60 20, 80 40, 80 50 C 80 60, 60 80, 50 80 C 40 80, 20 60, 20 50 C 20 40, 40 20, 50 20 Z"
        stroke="white"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <path
        d="M50 35 L 50 65 M 35 50 L 65 50"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
        className="opacity-40"
      />
    </svg>
  );
};
