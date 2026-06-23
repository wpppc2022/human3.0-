import { QUADRANT_ORDER } from "@/lib/constants";
import type {
  AnswerValue,
  Answers,
  HumanLevel,
  HumanStageId,
  PhaseId,
  QuadrantId,
  QuadrantDevelopment,
  QuadrantScore,
  QuadrantStateId,
  Question,
  ScoringResult,
  ScoreMetrics,
} from "@/lib/types";

export function isAnswerValue(value: unknown): value is AnswerValue {
  return typeof value === "number" && Number.isInteger(value) && value >= 1 && value <= 5;
}

export function normalizeScore(answer: AnswerValue, reverseScored: boolean) {
  return reverseScored ? ((6 - answer) as AnswerValue) : answer;
}

export function getQuadrantState(score: number): QuadrantStateId {
  if (score <= 24) return "unstable";
  if (score <= 36) return "forming";
  if (score <= 48) return "grounded";
  return "mature";
}

export function buildStage(level: HumanLevel, phase: PhaseId): HumanStageId {
  const levelPrefix = level.split(".")[0];
  return `${levelPrefix}.${phase}` as HumanStageId;
}

export function getQuadrantDevelopment(score: number): QuadrantDevelopment {
  if (score <= 18) {
    return {
      level: "1.0",
      phase: "1",
      stage: "1.1",
      label: "基础支撑明显不足",
      description: "这个象限的基础支撑还不稳定，容易在压力下失去作用。",
    };
  }

  if (score <= 24) {
    return {
      level: "1.0",
      phase: "2",
      stage: "1.2",
      label: "不稳定已被看见",
      description: "你已经开始意识到这个象限的不稳，但还缺少可靠支撑。",
    };
  }

  if (score <= 28) {
    return {
      level: "1.0",
      phase: "3",
      stage: "1.3",
      label: "初步意识正在出现",
      description: "这个象限已有局部行动，但仍容易依赖外部节奏或偶发状态。",
    };
  }

  if (score <= 32) {
    return {
      level: "2.0",
      phase: "1",
      stage: "2.1",
      label: "主动能力刚开始建立",
      description: "你正在主动建立这个象限的能力，但旧模式仍会频繁失效。",
    };
  }

  if (score <= 36) {
    return {
      level: "2.0",
      phase: "2",
      stage: "2.2",
      label: "方法正在形成",
      description: "这个象限已有一些自我驱动和方法，但稳定性还不够。",
    };
  }

  if (score <= 44) {
    return {
      level: "2.0",
      phase: "3",
      stage: "2.3",
      label: "可复用方法成形",
      description: "这个象限已有基础，正在形成可复用的方法和判断。",
    };
  }

  if (score <= 48) {
    return {
      level: "3.0",
      phase: "1",
      stage: "3.1",
      label: "系统支撑开始出现",
      description: "这个象限开始具备系统支撑力，但仍需要更多压力测试。",
    };
  }

  if (score <= 54) {
    return {
      level: "3.0",
      phase: "2",
      stage: "3.2",
      label: "成熟能力正在协同",
      description: "这个象限已相对成熟，正在和其他象限形成更稳定的协同。",
    };
  }

  return {
    level: "3.0",
    phase: "3",
    stage: "3.3",
    label: "高度稳定的系统支撑",
    description: "这个象限高度稳定，能持续支撑你的整体人生系统。",
  };
}

export function calculateQuadrantScores(
  questions: Question[],
  answers: Answers,
): Record<QuadrantId, QuadrantScore> {
  const totals = QUADRANT_ORDER.reduce(
    (acc, quadrant) => ({ ...acc, [quadrant]: 0 }),
    {} as Record<QuadrantId, number>,
  );

  for (const question of questions) {
    const answer = answers[question.id];
    if (answer === undefined) continue;
    if (!isAnswerValue(answer)) {
      throw new Error(`Invalid answer for question ${question.id}: ${answer}`);
    }
    totals[question.quadrant] += normalizeScore(
      answer,
      question.reverseScored,
    );
  }

  return QUADRANT_ORDER.reduce(
    (acc, quadrant) => ({
      ...acc,
      [quadrant]: {
        quadrant,
        rawScore: totals[quadrant],
        state: getQuadrantState(totals[quadrant]),
        development: getQuadrantDevelopment(totals[quadrant]),
      },
    }),
    {} as Record<QuadrantId, QuadrantScore>,
  );
}

export function findDominantAndWeakQuadrants(
  quadrantScores: Record<QuadrantId, QuadrantScore>,
) {
  const ordered = [...QUADRANT_ORDER].sort((a, b) => {
    const diff = quadrantScores[b].rawScore - quadrantScores[a].rawScore;
    return diff === 0 ? QUADRANT_ORDER.indexOf(a) - QUADRANT_ORDER.indexOf(b) : diff;
  });

  return {
    dominantQuadrant: ordered[0],
    weakQuadrant: ordered[ordered.length - 1],
  };
}

export function calculateScoreMetrics(
  quadrantScores: Record<QuadrantId, QuadrantScore>,
): ScoreMetrics {
  const rawScores = QUADRANT_ORDER.map(
    (quadrant) => quadrantScores[quadrant].rawScore,
  );
  const averageScore =
    rawScores.reduce((total, score) => total + score, 0) / rawScores.length;
  const minScore = Math.min(...rawScores);
  const maxScore = Math.max(...rawScores);
  const imbalanceScore = maxScore - minScore;

  return {
    averageScore,
    minScore,
    maxScore,
    imbalanceScore,
    unstableCount: rawScores.filter((score) => score <= 24).length,
    formingOrBetterCount: rawScores.filter((score) => score >= 25).length,
    groundedOrBetterCount: rawScores.filter((score) => score >= 37).length,
    matureCount: rawScores.filter((score) => score >= 49).length,
  };
}

export function determineLevel(metrics: ScoreMetrics): HumanLevel {
  if (
    metrics.unstableCount >= 2 ||
    metrics.averageScore < 30 ||
    metrics.minScore <= 20
  ) {
    return "1.0";
  }

  if (
    metrics.averageScore >= 47 &&
    metrics.minScore >= 41 &&
    metrics.imbalanceScore <= 10 &&
    metrics.groundedOrBetterCount === 4 &&
    metrics.matureCount >= 2
  ) {
    return "3.0";
  }

  return "2.0";
}

export function determinePhase(
  metrics: ScoreMetrics,
  level: HumanLevel,
): PhaseId {
  if (level === "1.0") {
    if (
      metrics.unstableCount >= 3 ||
      metrics.averageScore < 24 ||
      metrics.minScore <= 18
    ) {
      return "1";
    }

    if (metrics.unstableCount >= 2 || metrics.averageScore < 28) return "2";
    return "3";
  }

  if (level === "2.0") {
    if (
      metrics.unstableCount >= 1 ||
      metrics.averageScore < 36 ||
      metrics.imbalanceScore >= 18
    ) {
      return "1";
    }

    if (
      metrics.averageScore < 43 ||
      metrics.imbalanceScore >= 11 ||
      metrics.groundedOrBetterCount < 2
    ) {
      return "2";
    }

    return "3";
  }

  if (
    metrics.minScore < 45 ||
    metrics.imbalanceScore >= 8 ||
    metrics.matureCount < 3
  ) {
    return "1";
  }

  if (
    metrics.averageScore < 51 ||
    metrics.minScore < 49 ||
    metrics.imbalanceScore > 6 ||
    metrics.matureCount < 4
  ) {
    return "2";
  }

  return "3";
}

export function scoreAssessment(
  questions: Question[],
  answers: Answers,
): ScoringResult {
  const missingQuestionIds = questions
    .filter((question) => answers[question.id] === undefined)
    .map((question) => question.id);

  const invalidAnswerIds = questions
    .filter((question) => {
      const answer = answers[question.id];
      return answer !== undefined && !isAnswerValue(answer);
    })
    .map((question) => question.id);

  if (missingQuestionIds.length > 0) {
    throw new Error(
      `Assessment is incomplete. Missing answers: ${missingQuestionIds.join(", ")}`,
    );
  }

  if (invalidAnswerIds.length > 0) {
    throw new Error(
      `Assessment has invalid answers: ${invalidAnswerIds.join(", ")}`,
    );
  }

  const quadrantScores = calculateQuadrantScores(questions, answers);
  const metrics = calculateScoreMetrics(quadrantScores);
  const { dominantQuadrant, weakQuadrant } =
    findDominantAndWeakQuadrants(quadrantScores);
  const level = determineLevel(metrics);
  const phase = determinePhase(metrics, level);

  return {
    quadrantScores,
    level,
    phase,
    stage: buildStage(level, phase),
    dominantQuadrant,
    weakQuadrant,
    imbalanceScore: metrics.imbalanceScore,
    averageScore: metrics.averageScore,
    minScore: metrics.minScore,
    maxScore: metrics.maxScore,
    unstableCount: metrics.unstableCount,
    formingOrBetterCount: metrics.formingOrBetterCount,
    groundedOrBetterCount: metrics.groundedOrBetterCount,
    matureCount: metrics.matureCount,
    answeredCount: questions.length - missingQuestionIds.length,
    missingQuestionIds,
  };
}
