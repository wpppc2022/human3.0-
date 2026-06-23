import { describe, expect, it } from "vitest";

import questions from "@/data/questions.json";
import { QUADRANT_ORDER } from "@/lib/constants";
import { scoreAssessment } from "@/lib/scoring";
import type {
  AnswerValue,
  Answers,
  HumanStageId,
  QuadrantId,
  QuadrantStateId,
  Question,
} from "@/lib/types";

const typedQuestions = questions as Question[];

type NormalizedProfile = Record<QuadrantId, AnswerValue>;

interface CalibrationScenario {
  name: string;
  profile: NormalizedProfile;
  expectedStage: HumanStageId;
  expectedDominant: QuadrantId;
  expectedWeak: QuadrantId;
  expectedStates: Record<QuadrantId, QuadrantStateId>;
}

interface ScoreScenario {
  name: string;
  scores: Record<QuadrantId, number>;
  expectedStage: HumanStageId;
}

function answerForNormalizedScore(
  normalizedScore: AnswerValue,
  reverseScored: boolean,
): AnswerValue {
  return reverseScored
    ? ((6 - normalizedScore) as AnswerValue)
    : normalizedScore;
}

function buildAnswers(profile: NormalizedProfile): Answers {
  return Object.fromEntries(
    typedQuestions.map((question) => [
      question.id,
      answerForNormalizedScore(
        profile[question.quadrant],
        question.reverseScored,
      ),
    ]),
  ) as Answers;
}

function normalizedScoresForTotal(total: number): AnswerValue[] {
  if (total < 12 || total > 60) {
    throw new Error(`Quadrant total must be between 12 and 60: ${total}`);
  }

  let remaining = total - 12;
  return Array.from({ length: 12 }, () => {
    const increment = Math.min(4, remaining);
    remaining -= increment;
    return (1 + increment) as AnswerValue;
  });
}

function buildAnswersFromScores(scores: Record<QuadrantId, number>): Answers {
  const normalizedByQuadrant = Object.fromEntries(
    QUADRANT_ORDER.map((quadrant) => [
      quadrant,
      normalizedScoresForTotal(scores[quadrant]),
    ]),
  ) as Record<QuadrantId, AnswerValue[]>;

  const usedByQuadrant = Object.fromEntries(
    QUADRANT_ORDER.map((quadrant) => [quadrant, 0]),
  ) as Record<QuadrantId, number>;

  return Object.fromEntries(
    typedQuestions.map((question) => {
      const index = usedByQuadrant[question.quadrant];
      usedByQuadrant[question.quadrant] += 1;
      const normalizedScore = normalizedByQuadrant[question.quadrant][index];

      return [
        question.id,
        answerForNormalizedScore(normalizedScore, question.reverseScored),
      ];
    }),
  ) as Answers;
}

const scenarios: CalibrationScenario[] = [
  {
    name: "all quadrants very low",
    profile: { mind: 1, body: 1, spirit: 1, vocation: 1 },
    expectedStage: "1.1",
    expectedDominant: "mind",
    expectedWeak: "vocation",
    expectedStates: {
      mind: "unstable",
      body: "unstable",
      spirit: "unstable",
      vocation: "unstable",
    },
  },
  {
    name: "all quadrants low but present",
    profile: { mind: 2, body: 2, spirit: 2, vocation: 2 },
    expectedStage: "1.1",
    expectedDominant: "mind",
    expectedWeak: "vocation",
    expectedStates: {
      mind: "unstable",
      body: "unstable",
      spirit: "unstable",
      vocation: "unstable",
    },
  },
  {
    name: "all quadrants forming",
    profile: { mind: 3, body: 3, spirit: 3, vocation: 3 },
    expectedStage: "2.2",
    expectedDominant: "mind",
    expectedWeak: "vocation",
    expectedStates: {
      mind: "forming",
      body: "forming",
      spirit: "forming",
      vocation: "forming",
    },
  },
  {
    name: "all quadrants grounded",
    profile: { mind: 4, body: 4, spirit: 4, vocation: 4 },
    expectedStage: "2.3",
    expectedDominant: "mind",
    expectedWeak: "vocation",
    expectedStates: {
      mind: "grounded",
      body: "grounded",
      spirit: "grounded",
      vocation: "grounded",
    },
  },
  {
    name: "all quadrants mature",
    profile: { mind: 5, body: 5, spirit: 5, vocation: 5 },
    expectedStage: "3.3",
    expectedDominant: "mind",
    expectedWeak: "vocation",
    expectedStates: {
      mind: "mature",
      body: "mature",
      spirit: "mature",
      vocation: "mature",
    },
  },
  {
    name: "high mind with vocation as clear bottleneck",
    profile: { mind: 5, body: 4, spirit: 4, vocation: 2 },
    expectedStage: "2.1",
    expectedDominant: "mind",
    expectedWeak: "vocation",
    expectedStates: {
      mind: "mature",
      body: "grounded",
      spirit: "grounded",
      vocation: "unstable",
    },
  },
  {
    name: "high body with other quadrants still forming",
    profile: { mind: 3, body: 5, spirit: 3, vocation: 3 },
    expectedStage: "2.1",
    expectedDominant: "body",
    expectedWeak: "vocation",
    expectedStates: {
      mind: "forming",
      body: "mature",
      spirit: "forming",
      vocation: "forming",
    },
  },
  {
    name: "strong vocation but most foundations unstable",
    profile: { mind: 2, body: 2, spirit: 2, vocation: 5 },
    expectedStage: "1.1",
    expectedDominant: "vocation",
    expectedWeak: "spirit",
    expectedStates: {
      mind: "unstable",
      body: "unstable",
      spirit: "unstable",
      vocation: "mature",
    },
  },
  {
    name: "three grounded quadrants with one forming support",
    profile: { mind: 4, body: 4, spirit: 4, vocation: 3 },
    expectedStage: "2.2",
    expectedDominant: "mind",
    expectedWeak: "vocation",
    expectedStates: {
      mind: "grounded",
      body: "grounded",
      spirit: "grounded",
      vocation: "forming",
    },
  },
  {
    name: "one mature quadrant with three forming quadrants",
    profile: { mind: 5, body: 3, spirit: 3, vocation: 3 },
    expectedStage: "2.1",
    expectedDominant: "mind",
    expectedWeak: "vocation",
    expectedStates: {
      mind: "mature",
      body: "forming",
      spirit: "forming",
      vocation: "forming",
    },
  },
  {
    name: "two grounded and two forming quadrants",
    profile: { mind: 4, body: 4, spirit: 3, vocation: 3 },
    expectedStage: "2.2",
    expectedDominant: "mind",
    expectedWeak: "vocation",
    expectedStates: {
      mind: "grounded",
      body: "grounded",
      spirit: "forming",
      vocation: "forming",
    },
  },
  {
    name: "high and balanced integrated profile",
    profile: { mind: 5, body: 5, spirit: 4, vocation: 4 },
    expectedStage: "2.2",
    expectedDominant: "mind",
    expectedWeak: "vocation",
    expectedStates: {
      mind: "mature",
      body: "mature",
      spirit: "grounded",
      vocation: "grounded",
    },
  },
];

const scoreScenarios: ScoreScenario[] = [
  {
    name: "42 / 42 / 42 / 42 stays in Human 2.2",
    scores: { mind: 42, body: 42, spirit: 42, vocation: 42 },
    expectedStage: "2.2",
  },
  {
    name: "48 / 48 / 48 / 36 stays in Human 2.2",
    scores: { mind: 48, body: 48, spirit: 48, vocation: 36 },
    expectedStage: "2.2",
  },
  {
    name: "49 / 49 / 49 / 41 enters Human 3.1",
    scores: { mind: 49, body: 49, spirit: 49, vocation: 41 },
    expectedStage: "3.1",
  },
  {
    name: "52 / 51 / 50 / 49 stays in Human 3.2",
    scores: { mind: 52, body: 51, spirit: 50, vocation: 49 },
    expectedStage: "3.2",
  },
  {
    name: "55 / 54 / 52 / 50 reaches Human 3.3",
    scores: { mind: 55, body: 54, spirit: 52, vocation: 50 },
    expectedStage: "3.3",
  },
  {
    name: "55 / 55 / 24 / 24 remains Human 1.2",
    scores: { mind: 55, body: 55, spirit: 24, vocation: 24 },
    expectedStage: "1.2",
  },
  {
    name: "30 / 30 / 30 / 30 lands in Human 2.1",
    scores: { mind: 30, body: 30, spirit: 30, vocation: 30 },
    expectedStage: "2.1",
  },
  {
    name: "44 / 44 / 37 / 37 lands in Human 2.2",
    scores: { mind: 44, body: 44, spirit: 37, vocation: 37 },
    expectedStage: "2.2",
  },
];

describe("scoring calibration scenarios", () => {
  it.each(scenarios)("$name", (scenario) => {
    const result = scoreAssessment(typedQuestions, buildAnswers(scenario.profile));

    expect(result.stage).toBe(scenario.expectedStage);
    expect(result.dominantQuadrant).toBe(scenario.expectedDominant);
    expect(result.weakQuadrant).toBe(scenario.expectedWeak);
    for (const quadrant of QUADRANT_ORDER) {
      expect(result.quadrantScores[quadrant].state).toBe(
        scenario.expectedStates[quadrant],
      );
    }
  });

  it.each(scoreScenarios)("$name", (scenario) => {
    const result = scoreAssessment(
      typedQuestions,
      buildAnswersFromScores(scenario.scores),
    );

    expect(result.stage).toBe(scenario.expectedStage);
  });
});
