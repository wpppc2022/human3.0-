import { describe, expect, it } from "vitest";

import questions from "@/data/questions.json";
import { QUADRANT_ORDER } from "@/lib/constants";
import {
  buildStage,
  calculateScoreMetrics,
  calculateQuadrantScores,
  determineLevel,
  determinePhase,
  findDominantAndWeakQuadrants,
  getQuadrantDevelopment,
  getQuadrantState,
  isAnswerValue,
  normalizeScore,
  scoreAssessment,
} from "@/lib/scoring";
import type {
  Answers,
  HumanStageId,
  QuadrantId,
  QuadrantScore,
  Question,
} from "@/lib/types";

const typedQuestions = questions as Question[];

function buildAnswers(value: 1 | 2 | 3 | 4 | 5): Answers {
  return Object.fromEntries(
    typedQuestions.map((question) => [question.id, value]),
  ) as Answers;
}

function buildScores(
  values: Record<QuadrantId, number>,
): Record<QuadrantId, QuadrantScore> {
  return Object.fromEntries(
    QUADRANT_ORDER.map((quadrant) => [
      quadrant,
      {
        quadrant,
        rawScore: values[quadrant],
        state: getQuadrantState(values[quadrant]),
        development: getQuadrantDevelopment(values[quadrant]),
      },
    ]),
  ) as Record<QuadrantId, QuadrantScore>;
}

function stageForScores(values: Record<QuadrantId, number>) {
  const metrics = calculateScoreMetrics(buildScores(values));
  const level = determineLevel(metrics);
  const phase = determinePhase(metrics, level);

  return buildStage(level, phase);
}

describe("scoring", () => {
  it("reverses scores for reverse-scored questions", () => {
    expect(isAnswerValue(1)).toBe(true);
    expect(isAnswerValue(5)).toBe(true);
    expect(isAnswerValue(0)).toBe(false);
    expect(isAnswerValue(6)).toBe(false);
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
    expect(scores.mind.development.stage).toBe("2.2");
  });

  it.each([
    [12, "1.1"],
    [18, "1.1"],
    [19, "1.2"],
    [24, "1.2"],
    [25, "1.3"],
    [28, "1.3"],
    [29, "2.1"],
    [32, "2.1"],
    [33, "2.2"],
    [36, "2.2"],
    [37, "2.3"],
    [44, "2.3"],
    [45, "3.1"],
    [48, "3.1"],
    [49, "3.2"],
    [54, "3.2"],
    [55, "3.3"],
    [60, "3.3"],
  ] as const)(
    "maps quadrant score %i to development stage %s",
    (score, expectedStage) => {
      expect(getQuadrantDevelopment(score).stage).toBe(expectedStage);
    },
  );

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

  it.each([
    [
      "balanced grounded scores stay in Human 2.2",
      { mind: 42, body: 42, spirit: 42, vocation: 42 },
      "2.2",
    ],
    [
      "three strong quadrants with one forming support stay in Human 2.2",
      { mind: 48, body: 48, spirit: 48, vocation: 36 },
      "2.2",
    ],
    [
      "early Human 3.0 profile lands in Human 3.1",
      { mind: 49, body: 49, spirit: 49, vocation: 41 },
      "3.1",
    ],
    [
      "average below 47 blocks Human 3.0",
      { mind: 49, body: 49, spirit: 45, vocation: 44 },
      "2.3",
    ],
    [
      "min score below 41 blocks Human 3.0",
      { mind: 55, body: 55, spirit: 55, vocation: 40 },
      "2.2",
    ],
    [
      "imbalance above 10 blocks Human 3.0",
      { mind: 55, body: 55, spirit: 49, vocation: 44 },
      "2.2",
    ],
    [
      "fewer than two mature quadrants blocks Human 3.0",
      { mind: 49, body: 48, spirit: 47, vocation: 44 },
      "2.3",
    ],
    [
      "all mature but average below 51 lands in Human 3.2",
      { mind: 52, body: 51, spirit: 50, vocation: 49 },
      "3.2",
    ],
    [
      "all mature with imbalance above 6 lands in Human 3.2",
      { mind: 56, body: 55, spirit: 50, vocation: 49 },
      "3.2",
    ],
    [
      "all mature with imbalance exactly 6 can reach Human 3.3",
      { mind: 55, body: 55, spirit: 50, vocation: 49 },
      "3.3",
    ],
    [
      "all mature and balanced enough lands in Human 3.3",
      { mind: 55, body: 54, spirit: 52, vocation: 50 },
      "3.3",
    ],
  ] as const)("%s", (_name, values, expectedStage) => {
    expect(stageForScores(values)).toBe(expectedStage);
  });

  it("throws a clear error when answers are missing", () => {
    const answers = buildAnswers(4);
    delete answers.M01;

    expect(() => scoreAssessment(typedQuestions, answers)).toThrow(
      /Missing answers: M01/,
    );
  });

  it("throws a clear error when answers are outside 1 to 5", () => {
    const answers = buildAnswers(4) as Record<string, unknown>;
    answers.M01 = 6;

    expect(() => scoreAssessment(typedQuestions, answers as Answers)).toThrow(
      /invalid answers: M01/,
    );
  });
});
