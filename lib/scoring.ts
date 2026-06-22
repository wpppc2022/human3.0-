import { QUADRANT_ORDER } from "@/lib/constants";
import type {
  AnswerValue,
  Answers,
  HumanLevel,
  HumanStageId,
  PhaseId,
  QuadrantId,
  QuadrantScore,
  QuadrantStateId,
  Question,
  ScoringResult,
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

export function determineLevel(
  quadrantScores: Record<QuadrantId, QuadrantScore>,
  averageScore: number,
  imbalanceScore: number,
): HumanLevel {
  const states = QUADRANT_ORDER.map((quadrant) => quadrantScores[quadrant].state);
  const unstableCount = states.filter((state) => state === "unstable").length;
  const solidCount = states.filter(
    (state) => state === "grounded" || state === "mature",
  ).length;

  if (unstableCount >= 2 || averageScore < 29) return "1.0";
  if (solidCount >= 3 && imbalanceScore <= 14 && averageScore >= 41) return "3.0";
  return "2.0";
}

export function determinePhase(
  quadrantScores: Record<QuadrantId, QuadrantScore>,
  averageScore: number,
  imbalanceScore: number,
): PhaseId {
  const unstableCount = QUADRANT_ORDER.filter(
    (quadrant) => quadrantScores[quadrant].state === "unstable",
  ).length;

  if (averageScore < 30 || unstableCount >= 2) return "1";
  if (imbalanceScore >= 14 || averageScore < 42) return "2";
  return "3";
}

export function buildStage(level: HumanLevel, phase: PhaseId): HumanStageId {
  const levelPrefix = level.split(".")[0];
  return `${levelPrefix}.${phase}` as HumanStageId;
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
  const rawScores = QUADRANT_ORDER.map(
    (quadrant) => quadrantScores[quadrant].rawScore,
  );
  const averageScore =
    rawScores.reduce((total, score) => total + score, 0) / rawScores.length;
  const imbalanceScore = Math.max(...rawScores) - Math.min(...rawScores);
  const { dominantQuadrant, weakQuadrant } =
    findDominantAndWeakQuadrants(quadrantScores);
  const level = determineLevel(quadrantScores, averageScore, imbalanceScore);
  const phase = determinePhase(quadrantScores, averageScore, imbalanceScore);

  return {
    quadrantScores,
    level,
    phase,
    stage: buildStage(level, phase),
    dominantQuadrant,
    weakQuadrant,
    imbalanceScore,
    averageScore,
    answeredCount: questions.length - missingQuestionIds.length,
    missingQuestionIds,
  };
}
