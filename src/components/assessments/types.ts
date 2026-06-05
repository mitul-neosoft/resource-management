export interface TriviaQuestion {
  category: string;
  difficulty: "easy" | "medium" | "hard";
  question: string;
  correct_answer: string;
  incorrect_answers: string[];
}

export interface Question {
  question: string;
  options: string[];
  correctIndex: number;
  difficulty: string;
  category: string;
}

export interface CodingChallenge {
  id: number;
  title: string;
  difficulty: "Easy" | "Medium" | "Hard";
  tag: string;
  description: string;
  example: string;
  starterCode: string;
  tests: { input: string; expected: string }[];
}