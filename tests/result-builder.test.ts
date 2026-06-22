import { describe, expect, it } from "vitest";

import quadrants from "@/data/quadrants.json";
import questions from "@/data/questions.json";
import recommendations from "@/data/recommendations.json";
import templates from "@/data/result-templates.json";
import stages from "@/data/stages.json";
import { buildResult } from "@/lib/result-builder";
import type {
  Answers,
  QuadrantDefinition,
  Question,
  RecommendationSet,
  ResultTemplate,
  StageDefinition,
} from "@/lib/types";

const typedQuestions = questions as Question[];
const typedStages = stages as StageDefinition[];
const typedQuadrants = quadrants as QuadrantDefinition[];
const typedRecommendations = recommendations as RecommendationSet[];
const typedTemplates = templates as ResultTemplate[];

function buildAnswers(value: 1 | 2 | 3 | 4 | 5): Answers {
  return Object.fromEntries(
    typedQuestions.map((question) => [question.id, value]),
  ) as Answers;
}

function buildMixedAnswers() {
  const answers = buildAnswers(3);
  for (const question of typedQuestions) {
    if (question.quadrant === "mind") {
      answers[question.id] = question.reverseScored ? 1 : 5;
    }
    if (question.quadrant === "body") {
      answers[question.id] = question.reverseScored ? 5 : 1;
    }
  }
  return answers;
}

function buildTestResult(answers = buildMixedAnswers()) {
  return buildResult({
    id: "test-result",
    questions: typedQuestions,
    answers,
    stages: typedStages,
    quadrants: typedQuadrants,
    recommendations: typedRecommendations,
    templates: typedTemplates,
  });
}

describe("result builder", () => {
  it("builds the shareable free-result fields", () => {
    const result = buildTestResult();

    expect(result.metatype).toMatch(/^The /);
    expect(result.shareCard.chineseName.length).toBeGreaterThan(3);
    expect(result.lifestyleArchetype).toContain("者");
    expect(result.coreProblem.length).toBeGreaterThan(20);
    expect(result.crossQuadrantDynamics).toContain(result.dominantQuadrant.name);
    expect(result.crossQuadrantDynamics).toContain(result.weakQuadrant.name);
    expect(result.shareInsight.length).toBeGreaterThan(10);
    expect(result.friendPerspective.conversationStarter).toContain("？");
    expect(result.recommendations.immediateAction.length).toBeGreaterThan(10);
  });

  it("uses the weak quadrant to pick immediate and longer recommendations", () => {
    const result = buildTestResult();
    const recommendation = typedRecommendations.find(
      (item) => item.quadrant === result.weakQuadrant.id,
    );

    expect(recommendation).toBeDefined();
    expect(result.recommendations.immediateAction).toBe(
      recommendation?.immediateAction,
    );
    expect(result.recommendations.sevenDays).toEqual(recommendation?.sevenDays);
  });

  it("builds a share card without exposing raw scores", () => {
    const result = buildTestResult();

    expect(result.shareCard.metatype).toBe(result.metatype);
    expect(result.shareCard.insight).toBe(result.shareInsight);
    expect(result.shareCard.insight).not.toBe(
      result.recommendations.immediateAction,
    );
    expect(result.shareCard.weakQuadrant).toBe(result.weakQuadrant.name);
    expect(JSON.stringify(result.shareCard)).not.toMatch(/rawScore|averageScore/);
  });

  it("fails clearly when result template data is missing", () => {
    expect(() =>
      buildResult({
        id: "broken-result",
        questions: typedQuestions,
        answers: buildAnswers(4),
        stages: typedStages,
        quadrants: typedQuadrants,
        recommendations: typedRecommendations,
        templates: [],
      }),
    ).toThrow(/Result data is incomplete/);
  });
});
