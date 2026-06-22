import {
  QUADRANT_ORDER,
  QUADRANT_STATE_LABELS,
  QUADRANT_STATE_MEANINGS,
  SITE_NAME,
} from "@/lib/constants";
import { scoreAssessment } from "@/lib/scoring";
import type {
  Answers,
  BuiltResult,
  QuadrantDefinition,
  QuadrantId,
  Question,
  RecommendationSet,
  ResultTemplate,
  StageDefinition,
} from "@/lib/types";

function byId<T extends { id: string }>(items: T[]) {
  return new Map(items.map((item) => [item.id, item]));
}

function getQuadrantImpact(
  quadrant: QuadrantDefinition,
  stateLabel: string,
  isDominant: boolean,
  isWeak: boolean,
) {
  if (isDominant) {
    return `${quadrant.name}是你当前最容易调动的能力，它会影响你理解问题、安排生活和推进选择的方式。`;
  }

  if (isWeak) {
    return `${quadrant.name}是当前最需要补足的支撑点。它不代表失败，而是提示这个系统还需要更稳定的节律和方法。`;
  }

  return `${quadrant.name}目前处于“${stateLabel}”，它正在参与整体系统，但还需要和其他象限形成更清晰的配合。`;
}

function getPrimaryBlock(weakQuadrant: QuadrantDefinition) {
  const map: Record<QuadrantId, string> = {
    mind:
      "你的主要限制因素是 Mind。这不代表你不够聪明，而是理解、判断、拆解和校正还没有稳定地支撑你的选择。",
    body:
      "你的主要限制因素是 Body。这不代表你身体很差，而是精力、作息、训练和恢复系统还没有成为人生系统的一部分。",
    spirit:
      "你的主要限制因素是 Spirit。这不代表你没有理想，而是价值、欲望和长期方向还没有足够清晰，容易被外部评价带走。",
    vocation:
      "你的主要限制因素是 Vocation。这不代表你没有能力，而是技能、作品和现实产出还没有形成稳定的价值转化路径。",
  };

  return map[weakQuadrant.id];
}

function applyQuadrantPlaceholders(
  text: string,
  dominantQuadrant: QuadrantDefinition,
  weakQuadrant: QuadrantDefinition,
) {
  return text
    .replaceAll("{dominant}", dominantQuadrant.name)
    .replaceAll("{weak}", weakQuadrant.name);
}

export function buildResult(params: {
  id: string;
  questions: Question[];
  answers: Answers;
  stages: StageDefinition[];
  quadrants: QuadrantDefinition[];
  recommendations: RecommendationSet[];
  templates: ResultTemplate[];
}): BuiltResult {
  const scoring = scoreAssessment(params.questions, params.answers);
  const stage = byId(params.stages).get(scoring.stage);
  const template = params.templates.find((item) => item.stage === scoring.stage);
  const quadrantsById = byId(params.quadrants);
  const dominantQuadrant = quadrantsById.get(scoring.dominantQuadrant);
  const weakQuadrant = quadrantsById.get(scoring.weakQuadrant);
  const recommendation =
    params.recommendations.find((item) => item.quadrant === scoring.weakQuadrant) ??
    params.recommendations[0];

  if (!stage || !template || !dominantQuadrant || !weakQuadrant || !recommendation) {
    throw new Error("Result data is incomplete.");
  }

  const title = template.titlePattern
    .replace("{dominant}", dominantQuadrant.name)
    .replace("{weak}", weakQuadrant.name);

  const quadrantReports = QUADRANT_ORDER.map((quadrantId) => {
    const quadrant = quadrantsById.get(quadrantId);
    if (!quadrant) {
      throw new Error(`Missing quadrant definition: ${quadrantId}`);
    }

    const score = scoring.quadrantScores[quadrantId];
    const stateLabel = QUADRANT_STATE_LABELS[score.state];

    return {
      quadrant,
      state: score.state,
      stateLabel,
      stateMeaning: QUADRANT_STATE_MEANINGS[score.state],
      impact: getQuadrantImpact(
        quadrant,
        stateLabel,
        quadrantId === scoring.dominantQuadrant,
        quadrantId === scoring.weakQuadrant,
      ),
    };
  });

  const summary = `${template.summary} 当前最强支点是${dominantQuadrant.name}，最需要补足的是${weakQuadrant.name}。这份结果不是身份标签，而是一次对当下系统状态的切片观察。`;

  return {
    id: params.id,
    stage,
    title: `${stage.code}｜${title}`,
    metatype: template.metatype,
    lifestyleArchetype: template.lifestyleArchetype,
    headline: stage.coreState,
    summary,
    coreProblem: applyQuadrantPlaceholders(
      template.coreProblem,
      dominantQuadrant,
      weakQuadrant,
    ),
    crossQuadrantDynamics: applyQuadrantPlaceholders(
      template.crossQuadrantDynamics,
      dominantQuadrant,
      weakQuadrant,
    ),
    primaryBlock: getPrimaryBlock(weakQuadrant),
    dominantQuadrant,
    weakQuadrant,
    quadrantReports,
    recommendations: {
      immediateAction: recommendation.immediateAction,
      sevenDays: recommendation.sevenDays,
      thirtyDays: recommendation.thirtyDays,
      ninetyDays: recommendation.ninetyDays,
    },
    shareCard: {
      stageCode: scoring.stage,
      title,
      metatype: template.metatype,
      dominantQuadrant: dominantQuadrant.name,
      oneLiner: recommendation.immediateAction,
      keywords: template.keywords,
      siteName: SITE_NAME,
    },
    scoring,
  };
}
