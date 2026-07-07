import { describe, expect, it } from "vitest";

import quadrantsData from "../data/quadrants.json";
import questionsData from "../data/questions.json";
import recommendationsData from "../data/recommendations.json";
import templatesData from "../data/result-templates.json";
import stagesData from "../data/stages.json";
import { buildResult } from "../lib/result-builder";
import { decodeLegacyV1Answers } from "../lib/share-link";
import type {
  BuiltResult,
  QuadrantDefinition,
  Question,
  RecommendationSet,
  ResultTemplate,
  StageDefinition,
} from "../lib/types";
import fixture from "./fixtures/h3-result-v1-core-snapshot.json";

function projectCoreResult(result: BuiltResult) {
  return {
    id: result.id,
    stage: {
      id: result.stage.id,
      level: result.stage.level,
      phase: result.stage.phase,
      code: result.stage.code,
      name: result.stage.name,
      coreState: result.stage.coreState,
    },
    title: result.title,
    metatype: result.metatype,
    lifestyleArchetype: result.lifestyleArchetype,
    headline: result.headline,
    summary: result.summary,
    coreProblem: result.coreProblem,
    crossQuadrantDynamics: result.crossQuadrantDynamics,
    shareInsight: result.shareInsight,
    primaryBlock: result.primaryBlock,
    dominantQuadrant: {
      id: result.dominantQuadrant.id,
      name: result.dominantQuadrant.name,
    },
    weakQuadrant: {
      id: result.weakQuadrant.id,
      name: result.weakQuadrant.name,
    },
    quadrantReports: result.quadrantReports.map((report) => ({
      id: report.quadrant.id,
      state: report.state,
      stateLabel: report.stateLabel,
      developmentStage: report.development.stage,
      impact: report.impact,
    })),
    recommendations: result.recommendations,
    shareCard: result.shareCard,
    scoring: {
      quadrantScores: Object.fromEntries(
        Object.entries(result.scoring.quadrantScores).map(([id, score]) => [
          id,
          {
            rawScore: score.rawScore,
            state: score.state,
            developmentStage: score.development.stage,
          },
        ]),
      ),
      level: result.scoring.level,
      phase: result.scoring.phase,
      stage: result.scoring.stage,
      dominantQuadrant: result.scoring.dominantQuadrant,
      weakQuadrant: result.scoring.weakQuadrant,
      imbalanceScore: result.scoring.imbalanceScore,
      averageScore: result.scoring.averageScore,
      minScore: result.scoring.minScore,
      maxScore: result.scoring.maxScore,
      unstableCount: result.scoring.unstableCount,
      formingOrBetterCount: result.scoring.formingOrBetterCount,
      groundedOrBetterCount: result.scoring.groundedOrBetterCount,
      matureCount: result.scoring.matureCount,
      answeredCount: result.scoring.answeredCount,
      missingQuestionIds: result.scoring.missingQuestionIds,
    },
  };
}

describe("h3-result-v1 compatibility fixture", () => {
  it("keeps the frozen 48-answer BuiltResult core unchanged", () => {
    const answers = decodeLegacyV1Answers(`v1.${fixture.answerPayload}`);
    const result = buildResult({
      id: fixture.expected.id,
      questions: questionsData as Question[],
      answers,
      stages: stagesData as StageDefinition[],
      quadrants: quadrantsData as QuadrantDefinition[],
      recommendations: recommendationsData as RecommendationSet[],
      templates: templatesData as ResultTemplate[],
    });

    expect(fixture).toMatchObject({
      fixtureVersion: "h3-result-v1-core-v1",
      assessmentVersion: "h3-a48-v1",
      resultVersion: "h3-result-v1",
    });
    expect(projectCoreResult(result)).toEqual(fixture.expected);
  });
});
