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
    expectedStage: "3.3",
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
    expectedStage: "2.2",
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
    expectedStage: "2.2",
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
    expectedStage: "3.3",
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
    expectedStage: "2.2",
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
    expectedStage: "2.3",
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
    expectedStage: "3.3",
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
});
