"use client";

import { RiQuestionLine, RiCodeSSlashLine } from "@remixicon/react";

interface ModeToggleProps {
  mode: "mcq" | "coding";
  setMode: (mode: "mcq" | "coding") => void;
}

export default function ModeToggle({ mode, setMode }: ModeToggleProps) {
  return (
    <div className="flex bg-white border border-gray-100 rounded-xl p-1 shadow-sm gap-1">
      {(["mcq", "coding"] as const).map((m) => (
        <button
          key={m}
          onClick={() => setMode(m)}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
            mode === m
              ? "bg-red-500 text-white shadow-sm"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          {m === "mcq" ? (
            <RiQuestionLine size={15} />
          ) : (
            <RiCodeSSlashLine size={15} />
          )}
          {m === "mcq" ? "MCQ Quiz" : "Coding Challenge"}
        </button>
      ))}
    </div>
  );
}