"use client";

import { RiFireLine, RiTimeLine } from "@remixicon/react";
import ProgressBar from "./ProgressBar";
import { Question } from "./types";

interface MCQSidebarProps {
  questions: Question[];
  qIdx: number;
  score: number;
  streak: number;
}

export default function MCQSidebar({ questions, qIdx, score, streak }: MCQSidebarProps) {
  return (
    <div className="flex flex-col gap-4">
      {/* Progress */}
      <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">
          Your Progress
        </p>
        <div className="text-center py-2">
          <p className="text-5xl font-black text-red-500">{score}</p>
          <p className="text-gray-400 text-xs mt-1">
            correct out of {questions.length}
          </p>
        </div>
        <div className="mt-4">
          <ProgressBar value={(score / questions.length) * 100} />
          <div className="flex justify-between text-[11px] text-gray-300 mt-1.5">
            <span>0%</span>
            <span>100%</span>
          </div>
        </div>
      </div>

      {/* Streak */}
      <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm text-center">
        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
          Current Streak
        </p>
        <RiFireLine className="text-orange-400 mx-auto mb-1" size={32} />
        <p className="text-4xl font-black text-gray-900">{streak}</p>
        <p className="text-gray-400 text-xs mt-1">in a row</p>
        {streak >= 3 && (
          <p className="text-emerald-500 text-xs font-semibold mt-2">
            +{streak * 10} bonus pts!
          </p>
        )}
      </div>

      {/* Question map */}
      <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
          Questions
        </p>
        <div className="grid grid-cols-5 gap-1.5">
          {questions.map((_, i) => (
            <div
              key={i}
              className={`h-7 w-full rounded-md flex items-center justify-center text-xs font-bold ${
                i < qIdx
                  ? "bg-emerald-100 text-emerald-600"
                  : i === qIdx
                    ? "bg-red-500 text-white"
                    : "bg-gray-100 text-gray-400"
              }`}
            >
              {i + 1}
            </div>
          ))}
        </div>
      </div>

      {/* Source badge */}
      <div className="bg-blue-50 border border-blue-100 rounded-xl px-4 py-3 flex items-start gap-2">
        <RiTimeLine className="text-blue-400 mt-0.5 shrink-0" size={14} />
        <p className="text-[11px] text-blue-600 leading-relaxed">
          Questions sourced from{" "}
          <span className="font-bold">Open Trivia DB</span> — Computer Science
          category.
        </p>
      </div>
    </div>
  );
}