"use client";

import { TriviaQuestion, Question } from "./types";

export function decode(str: string): string {
  const txt = document.createElement("textarea");
  txt.innerHTML = str;
  return txt.value;
}

export function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5);
}

export function parseQuestions(raw: TriviaQuestion[]): Question[] {
  return raw.map((q) => {
    const correct = decode(q.correct_answer);
    const options = shuffle([...q.incorrect_answers.map(decode), correct]);
    return {
      question: decode(q.question),
      options,
      correctIndex: options.indexOf(correct),
      difficulty: q.difficulty,
      category: decode(q.category),
    };
  });
}