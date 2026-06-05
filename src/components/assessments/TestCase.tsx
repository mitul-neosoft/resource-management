"use client";

import { RiCheckLine } from "@remixicon/react";

interface TestCaseProps {
  input: string;
  expected: string;
  ran: boolean;
}

export default function TestCase({ input, expected, ran }: TestCaseProps) {
  return (
    <div
      className={`border rounded-xl p-4 transition-colors ${ran ? "border-emerald-200 bg-emerald-50" : "border-gray-100 bg-gray-50"}`}
    >
      <p className="text-[11px] font-bold text-gray-400 uppercase mb-2">
        Test
      </p>
      <code className="text-xs text-gray-700 block font-mono">
        Input: {input}
      </code>
      <code className="text-xs text-gray-400 block font-mono mt-0.5">
        Expected: {expected}
      </code>
      {ran && (
        <div className="flex items-center gap-1 mt-2">
          <RiCheckLine className="text-emerald-500" size={13} />
          <span className="text-emerald-600 text-xs font-semibold">
            Passed
          </span>
        </div>
      )}
    </div>
  );
}