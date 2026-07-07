import { QUADRANT_ORDER } from "@/lib/constants";
import { assertAnswersForQuestions } from "@/lib/assessment-input";
import {
  CANDIDATE_ASSESSMENT_VERSION,
  getAssessmentQuestions,
  resolveAssessmentVersion,
  assertResultVersionCompatibility,
  type AssessmentVersionAccess,
} from "@/lib/assessment-versions";
import {
  buildStage,
  calculateScoreMetrics,
  determineLevel,
  determinePhase,
  getQuadrantDevelopment,
  getQuadrantState,
  normalizeScore,
  scoreAssessment,
} from "@/lib/scoring";
import type {
  Answers,
  AssessmentVersionId,
  CandidateQuadrantScore,
  CandidateScoringResult,
  QuadrantId,
  ScoringResult,
} from "@/lib/types";

export type VersionedScoringEnvelope =
  | {
      assessmentVersion: "h3-a48-v1";
      resultVersion: "h3-result-v1";
      inferredLegacyVersion: boolean;
      scoring: ScoringResult;
    }
  | {
      assessmentVersion: "h3-a32-v1";
      resultVersion: "h3-result-v2";
      inferredLegacyVersion: false;
      scoring: CandidateScoringResult;
    };

function scoreCandidateQuestions(
  questions: ReturnType<typeof getAssessmentQuestions>,
  answers: Answers,
): CandidateScoringResult {
  const quadrantScores = Object.fromEntries(
    QUADRANT_ORDER.map((quadrant) => {
      const normalizedTotal = questions
        .filter((question) => question.quadrant === quadrant)
        .reduce(
          (total, question) =>
            total + normalizeScore(answers[question.id], question.reverseScored),
          0,
        );
      const equivalentScore = normalizedTotal * 1.5;
      const score: CandidateQuadrantScore = {
        quadrant,
        normalizedTotal,
        equivalentScore,
        rawScore: equivalentScore,
        state: getQuadrantState(equivalentScore),
        development: getQuadrantDevelopment(equivalentScore),
      };
      return [quadrant, score];
    }),
  ) as Record<QuadrantId, CandidateQuadrantScore>;

  const metrics = calculateScoreMetrics(quadrantScores);
  const level = determineLevel(metrics);
  const phase = determinePhase(metrics, level);
  const dominantQuadrants = QUADRANT_ORDER.filter(
    (quadrant) => quadrantScores[quadrant].equivalentScore === metrics.maxScore,
  );
  const weakQuadrants = QUADRANT_ORDER.filter(
    (quadrant) => quadrantScores[quadrant].equivalentScore === metrics.minScore,
  );

  return {
    assessmentVersion: CANDIDATE_ASSESSMENT_VERSION,
    resultVersion: "h3-result-v2",
    assessmentStatus: "draft",
    calibrationStatus: "not-started",
    questionSetHash: null,
    quadrantScores,
    level,
    phase,
    stage: buildStage(level, phase),
    dominantQuadrants,
    weakQuadrants,
    imbalanceScore: metrics.imbalanceScore,
    averageScore: metrics.averageScore,
    minScore: metrics.minScore,
    maxScore: metrics.maxScore,
    unstableCount: metrics.unstableCount,
    formingOrBetterCount: metrics.formingOrBetterCount,
    groundedOrBetterCount: metrics.groundedOrBetterCount,
    matureCount: metrics.matureCount,
    answeredCount: 32,
    missingQuestionIds: [],
  };
}

export function scoreAssessmentByVersion(params: {
  assessmentVersion?: string;
  resultVersion?: string;
  answers: unknown;
  access: AssessmentVersionAccess;
}): VersionedScoringEnvelope {
  const inferredLegacyVersion = params.assessmentVersion === undefined;
  const definition = resolveAssessmentVersion(
    params.assessmentVersion,
    params.access,
  );
  const questions = getAssessmentQuestions(definition.id, params.access);
  const answers = assertAnswersForQuestions(
    questions,
    params.answers,
    definition.id,
  );
  const resultVersion = assertResultVersionCompatibility(
    definition.id,
    params.resultVersion,
  );

  switch (definition.id) {
    case "h3-a48-v1":
      if (resultVersion !== "h3-result-v1") {
        throw new Error("h3-a48-v1 requires h3-result-v1.");
      }
      return {
        assessmentVersion: definition.id,
        resultVersion,
        inferredLegacyVersion,
        scoring: scoreAssessment([...questions], answers),
      };
    case "h3-a32-v1":
      if (resultVersion !== "h3-result-v2") {
        throw new Error("h3-a32-v1 requires h3-result-v2.");
      }
      return {
        assessmentVersion: definition.id,
        resultVersion,
        inferredLegacyVersion: false,
        scoring: scoreCandidateQuestions(questions, answers),
      };
  }
}

export function scoreCandidateAssessmentForInternalTest(answers: unknown) {
  return scoreAssessmentByVersion({
    assessmentVersion: CANDIDATE_ASSESSMENT_VERSION,
    answers,
    access: "internal-draft",
  });
}

export function getQuestionIdsForAssessmentVersion(
  assessmentVersion: AssessmentVersionId,
) {
  return getAssessmentQuestions(assessmentVersion, "internal-draft").map(
    (question) => question.id,
  );
}
