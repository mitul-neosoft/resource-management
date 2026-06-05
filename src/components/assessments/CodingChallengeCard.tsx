"use client";

import { RiCodeSSlashLine } from "@remixicon/react";
import CodeEditor from "./CodeEditor";
import TestCase from "./TestCase";
import DifficultyBadge from "./DifficultyBadge";
import { CodingChallenge } from "./types";

interface CodingChallengeCardProps {
  challenge: CodingChallenge;
  code: string;
  ran: boolean;
  idx: number;
  totalChallenges: number;
  onCodeChange: (value: string) => void;
  onRunTests: () => void;
  onSelectChallenge: (i: number) => void;
}

export default function CodingChallengeCard({
  challenge,
  code,
  ran,
  idx,
  totalChallenges,
  onCodeChange,
  onRunTests,
  onSelectChallenge,
}: CodingChallengeCardProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
      {/* Left: problem */}
      <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <DifficultyBadge level={challenge.difficulty} />
          <span className="bg-gray-100 text-gray-500 text-xs font-semibold px-2.5 py-0.5 rounded-full">
            {challenge.tag}
          </span>
        </div>
        <h3 className="text-lg font-bold text-gray-900 mb-2">
          {challenge.title}
        </h3>
        <p className="text-gray-500 text-sm leading-relaxed mb-4">
          {challenge.description}
        </p>

        {/* Example */}
        <div className="bg-gray-50 border border-gray-100 rounded-xl p-4 mb-5">
          <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">
            Example
          </p>
          <pre className="text-xs text-gray-700 whitespace-pre-wrap font-mono leading-relaxed">
            {challenge.example}
          </pre>
        </div>

        <CodeEditor code={code} onChange={onCodeChange} />

        {/* Challenge switcher */}
        <div className="flex gap-2 mt-4">
          {Array.from({ length: totalChallenges }).map((_, i) => (
            <button
              key={i}
              onClick={() => onSelectChallenge(i)}
              className={`flex-1 py-2 rounded-lg text-xs font-semibold transition-colors ${idx === i ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-500 hover:bg-gray-200"}`}
            >
              Challenge {i + 1}
            </button>
          ))}
        </div>
      </div>

      {/* Right: test cases */}
      <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm flex flex-col">
        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">
          Test Cases
        </p>
        <div className="flex flex-col gap-3 mb-auto">
          {challenge.tests.map((tc, i) => (
            <TestCase
              key={i}
              input={tc.input}
              expected={tc.expected}
              ran={ran}
            />
          ))}
        </div>

        <div className="flex flex-col gap-2 pt-5">
          <button
            onClick={onRunTests}
            className="w-full py-3 bg-gray-900 text-white rounded-xl text-sm font-bold hover:bg-gray-700 transition-colors flex items-center justify-center gap-2"
          >
            <RiCodeSSlashLine size={16} /> Run Tests
          </button>
          <button className="w-full py-3 border border-red-200 text-red-500 rounded-xl text-sm font-bold hover:bg-red-50 transition-colors">
            Submit Solution
          </button>
        </div>
      </div>
    </div>
  );
}