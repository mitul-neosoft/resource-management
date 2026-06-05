"use client";

import { useState } from "react";
import CodingChallengeCard from "./CodingChallengeCard";

const CODING_CHALLENGES = [
  {
    id: 1,
    title: "Two Sum",
    difficulty: "Easy" as const,
    tag: "Array",
    description:
      "Given an array of integers and a target, return the indices of the two numbers that add up to the target.",
    example: "Input: nums=[2,7,11,15], target=9\nOutput: [0,1]",
    starterCode: "function twoSum(nums, target) {\n  // your code here\n}",
    tests: [
      { input: "[2,7,11,15], target=9", expected: "[0,1]" },
      { input: "[3,2,4], target=6", expected: "[1,2]" },
      { input: "[3,3], target=6", expected: "[0,1]" },
    ],
  },
  {
    id: 2,
    title: "Palindrome Check",
    difficulty: "Easy" as const,
    tag: "String",
    description:
      "Write a function that returns true if the given string is a palindrome, false otherwise. Ignore case and non-alphanumeric characters.",
    example: 'Input: "A man a plan a canal Panama"\nOutput: true',
    starterCode: "function isPalindrome(s) {\n  // your code here\n}",
    tests: [
      { input: '"racecar"', expected: "true" },
      { input: '"hello"', expected: "false" },
      { input: '"A man a plan a canal Panama"', expected: "true" },
    ],
  },
];

export default function CodingMode() {
  const [idx, setIdx] = useState(0);
  const [code, setCode] = useState(CODING_CHALLENGES[0].starterCode);
  const [ran, setRan] = useState(false);

  const challenge = CODING_CHALLENGES[idx];

  function selectChallenge(i: number) {
    setIdx(i);
    setCode(CODING_CHALLENGES[i].starterCode);
    setRan(false);
  }

  return (
    <CodingChallengeCard
      challenge={challenge}
      code={code}
      ran={ran}
      idx={idx}
      totalChallenges={CODING_CHALLENGES.length}
      onCodeChange={(value) => {
        setCode(value);
        setRan(false);
      }}
      onRunTests={() => setRan(true)}
      onSelectChallenge={selectChallenge}
    />
  );
}