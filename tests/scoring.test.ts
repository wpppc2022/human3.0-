import { describe, expect, it } from "vitest";

import questions from "@/data/questions.json";
import {
  calculateQuadrantScores,
  findDominantAndWeakQuadrants,
  normalizeScore,
  scoreAssessment,
} from "@/lib/scoring";
import type { Answers, HumanStageId, Question } from "@/lib/types";

const typedQuestions = questions as Question[];

function buildAnswers(value: 1 | 2 | 3 | 4 | 5): Answers {
  return Object.fromEntries(
    typedQuestions.map((question) => [question.id, value]),
  ) as Answers;
}

describe("scoring", () => {
  it("reverses scores for reverse-scored questions", () => {
    expect(normalizeScore(1, true)).toBe(5);
    expect(normalizeScore(2, true)).toBe(4);
    expect(normalizeScore(3, true)).toBe(3);
    expect(normalizeScore(4, true)).toBe(2);
    expect(normalizeScore(5, true)).toBe(1);
    expect(normalizeScore(5, false)).toBe(5);
  });

  it("calculates quadrant scores correctly", () => {
    const answers = buildAnswers(3);
    const scores = calculateQuadrantScores(typedQuestions, answers);

    expect(scores.mind.rawScore).toBe(36);
    expect(scores.body.rawScore).toBe(36);
    expect(scores.spirit.rawScore).toBe(36);
    expect(scores.vocation.rawScore).toBe(36);
    expect(scores.mind.state).toBe("forming");
  });

  it("identifies dominant and weak quadrants", () => {
    const answers = buildAnswers(3);
    for (const question of typedQuestions) {
      if (question.quadrant === "mind") {
        answers[question.id] = question.reverseScored ? 1 : 5;
      }
      if (question.quadrant === "body") {
        answers[question.id] = question.reverseScored ? 5 : 1;
      }
    }

    const scores = calculateQuadrantScores(typedQuestions, answers);
    const result = findDominantAndWeakQuadrants(scores);

    expect(result.dominantQuadrant).toBe("mind");
    expect(result.weakQuadrant).toBe("body");
  });

  it("returns a Human stage from 1.1 to 3.3", () => {
    const result = scoreAssessment(typedQuestions, buildAnswers(4));
    const validStages: HumanStageId[] = [
      "1.1",
      "1.2",
      "1.3",
      "2.1",
      "2.2",
      "2.3",
      "3.1",
      "3.2",
      "3.3",
    ];

    expect(validStages).toContain(result.stage);
  });

  it("throws a clear error when answers are missing", () => {
    const answers = buildAnswers(4);
    delete answers.M01;

    expect(() => scoreAssessment(typedQuestions, answers)).toThrow(
      /Missing answers: M01/,
    );
  });
});
