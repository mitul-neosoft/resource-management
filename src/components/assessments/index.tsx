"use client";

import { useState } from "react";
import ModeToggle from "./ModeToggle";
import MCQMode from "./MCQMode";
import CodingMode from "./CodingMode";

export default function AssessmentPage() {
  const [mode, setMode] = useState<"mcq" | "coding">("mcq");

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-5xl mx-auto">
        {/* Page header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-7">
          <div>
            <h1 className="text-2xl font-black text-gray-900">
              Daily Skill Assessment
            </h1>
            <p className="text-gray-400 text-sm mt-0.5">
              Test your knowledge. Improve your streak.
            </p>
          </div>
          <ModeToggle mode={mode} setMode={setMode} />
        </div>

        {mode === "mcq" ? <MCQMode /> : <CodingMode />}
      </div>
    </div>
  );
}