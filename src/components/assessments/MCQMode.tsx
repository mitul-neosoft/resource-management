"use client";

import { useState, useEffect, useCallback } from "react";
import {
  RiLoader4Line,
  RiRefreshLine,
  RiTrophyLine,
} from "@remixicon/react";
import { Question, TriviaQuestion } from "./types";
import { parseQuestions } from "./utils";
import MCQQuestionCard from "./MCQQuestionCard";
import MCQSidebar from "./MCQSidebar";

function fetchTriviaQuestions(): Promise<Question[]> {
  return fetch(
    "https://opentdb.com/api.php?amount=10&category=18&difficulty=medium&type=multiple"
  )
    .then((res) => res.json())
    .then((data: { response_code: number; results: TriviaQuestion[] }) => {
      if (data.response_code !== 0) throw new Error("API error");
      return parseQuestions(data.results);
    });
}

export default function MCQMode() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [qIdx, setQIdx] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [finished, setFinished] = useState(false);

  const fetchQuestions = useCallback(async () => {
    setLoading(true);
    setError(false);
    try {
      const parsed = await fetchTriviaQuestions();
      setQuestions(parsed);
      setQIdx(0);
      setSelected(null);
      setSubmitted(false);
      setScore(0);
      setStreak(0);
      setBestStreak(0);
      setFinished(false);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  /* eslint-disable react-hooks/exhaustive-deps, react-hooks/set-state-in-effect */
  useEffect(() => {
    fetchQuestions();
  }, []);

  const current = questions[qIdx];

  function submit() {
    if (selected === null || !current) return;
    const correct = selected === current.correctIndex;
    if (correct) {
      setScore((p) => p + 1);
      const newStreak = streak + 1;
      setStreak(newStreak);
      if (newStreak > bestStreak) setBestStreak(newStreak);
    } else {
      setStreak(0);
    }
    setSubmitted(true);
  }

  function next() {
    if (qIdx + 1 >= questions.length) {
      setFinished(true);
    } else {
      setQIdx((p) => p + 1);
      setSelected(null);
      setSubmitted(false);
    }
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4">
        <RiLoader4Line className="text-red-500 animate-spin" size={36} />
        <p className="text-gray-500 text-sm font-medium">
          Fetching questions from Open Trivia DB…
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4">
        <p className="text-gray-600 font-medium">Failed to load questions.</p>
        <button
          onClick={fetchQuestions}
          className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg text-sm font-semibold hover:bg-red-600 transition-colors"
        >
          <RiRefreshLine size={16} /> Retry
        </button>
      </div>
    );
  }

  if (finished) {
    const pct = Math.round((score / questions.length) * 100);
    return (
      <div className="flex flex-col items-center justify-center py-16 gap-6 text-center">
        <div className="w-20 h-20 rounded-full bg-red-50 flex items-center justify-center">
          <RiTrophyLine className="text-red-500" size={40} />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Quiz Complete!</h2>
          <p className="text-gray-500 mt-1 text-sm">Here&apos;s how you did</p>
        </div>
        <div className="grid grid-cols-3 gap-4 w-full max-w-sm">
          {[
            { label: "Score", value: `${score}/${questions.length}` },
            { label: "Accuracy", value: `${pct}%` },
            { label: "Best Streak", value: `${bestStreak}🔥` },
          ].map((s) => (
            <div
              key={s.label}
              className="bg-gray-50 border border-gray-100 rounded-xl p-3"
            >
              <p className="text-xl font-bold text-gray-900">{s.value}</p>
              <p className="text-xs text-gray-400 mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>
        <button
          onClick={fetchQuestions}
          className="flex items-center gap-2 px-6 py-2.5 bg-red-500 text-white rounded-xl font-semibold hover:bg-red-600 transition-colors"
        >
          <RiRefreshLine size={16} /> Try Again
        </button>
      </div>
    );
  }

  if (!current) return null;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
      <MCQQuestionCard
        question={current}
        qIdx={qIdx}
        totalQuestions={questions.length}
        score={score}
        selected={selected}
        submitted={submitted}
        onSelect={setSelected}
        onSubmit={submit}
        onNext={next}
      />
      <MCQSidebar
        questions={questions}
        qIdx={qIdx}
        score={score}
        streak={streak}
      />
    </div>
  );
}