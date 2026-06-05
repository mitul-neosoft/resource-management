"use client";

import { RiCheckLine, RiCloseLine, RiArrowRightLine } from "@remixicon/react";
import { Question } from "./types";
import DifficultyBadge from "./DifficultyBadge";

interface MCQQuestionCardProps {
  question: Question;
  qIdx: number;
  totalQuestions: number;
  score: number;
  selected: number | null;
  submitted: boolean;
  onSelect: (index: number) => void;
  onSubmit: () => void;
  onNext: () => void;
}

export default function MCQQuestionCard({
  question,
  qIdx,
  totalQuestions,
  score,
  selected,
  submitted,
  onSelect,
  onSubmit,
  onNext,
}: MCQQuestionCardProps) {
  return (
    <div className="lg:col-span-2 bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <span className="bg-red-50 text-red-600 border border-red-100 text-xs font-bold px-3 py-1 rounded-full">
            Q {qIdx + 1} of {totalQuestions}
          </span>
          <DifficultyBadge level={question.difficulty} />
        </div>
        <span className="text-sm text-gray-400 font-medium">
          Score: {score}/{totalQuestions}
        </span>
      </div>

      {/* Question */}
      <div className="bg-gray-50 border border-gray-100 rounded-xl px-5 py-4 mb-5">
        <p className="text-gray-800 font-semibold text-[15px] leading-relaxed">
          {question.question}
        </p>
      </div>

      {/* Options */}
      <div className="flex flex-col gap-2.5 mb-5">
        {question.options.map((opt, i) => {
          const isCorrect = i === question.correctIndex;
          const isSelected = i === selected;
          let cls = "border border-gray-200 bg-white text-gray-700";
          if (submitted) {
            if (isCorrect)
              cls = "border-emerald-400 bg-emerald-50 text-emerald-700";
            else if (isSelected && !isCorrect)
              cls = "border-red-400 bg-red-50 text-red-700";
          } else if (isSelected) {
            cls = "border-blue-400 bg-blue-50 text-blue-700";
          }

          return (
            <button
              key={i}
              disabled={submitted}
              onClick={() => onSelect(i)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-left transition-all ${cls} ${!submitted ? "hover:border-gray-300 hover:bg-gray-50 cursor-pointer" : "cursor-default"}`}
            >
              <span
                className={`w-7 h-7 rounded-full border text-xs font-bold flex items-center justify-center shrink-0 ${
                  submitted && isCorrect
                    ? "border-emerald-400 bg-emerald-100 text-emerald-700"
                    : submitted && isSelected && !isCorrect
                      ? "border-red-400 bg-red-100 text-red-700"
                      : isSelected
                        ? "border-blue-400 bg-blue-100 text-blue-700"
                        : "border-gray-200 bg-gray-50 text-gray-500"
                }`}
              >
                {["A", "B", "C", "D"][i]}
              </span>
              {opt}
              {submitted && isCorrect && (
                <RiCheckLine className="ml-auto text-emerald-500" size={16} />
              )}
              {submitted && isSelected && !isCorrect && (
                <RiCloseLine className="ml-auto text-red-500" size={16} />
              )}
            </button>
          );
        })}
      </div>

      {/* Actions */}
      {!submitted ? (
        <button
          onClick={onSubmit}
          disabled={selected === null}
          className="w-full py-3 rounded-xl bg-red-500 text-white font-bold text-sm hover:bg-red-600 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          Submit Answer
        </button>
      ) : (
        <div className="flex gap-3">
          <div
            className={`flex-1 flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold ${selected === question.correctIndex ? "bg-emerald-50 text-emerald-700 border border-emerald-200" : "bg-red-50 text-red-700 border border-red-200"}`}
          >
            {selected === question.correctIndex ? (
              <>
                <RiCheckLine size={16} /> Correct! +1 point
              </>
            ) : (
              <>
                <RiCloseLine size={16} /> Correct:{" "}
                {question.options[question.correctIndex]}
              </>
            )}
          </div>
          <button
            onClick={onNext}
            className="flex items-center gap-1.5 px-5 py-3 bg-gray-900 text-white rounded-xl text-sm font-semibold hover:bg-gray-700 transition-colors"
          >
            {qIdx + 1 >= totalQuestions ? "Finish" : "Next"}{" "}
            <RiArrowRightLine size={15} />
          </button>
        </div>
      )}
    </div>
  );
}