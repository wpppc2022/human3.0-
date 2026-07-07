import quadrants from "@/data/quadrants.json";
import recommendations from "@/data/recommendations.json";
import templates from "@/data/result-templates.json";
import stages from "@/data/stages.json";
import { getAssessmentQuestions } from "@/lib/assessment-versions";
import { buildResult } from "@/lib/result-builder";
import { scoreAssessmentByVersion } from "@/lib/versioned-scoring";
import type {
  Answers,
  QuadrantDefinition,
  RecommendationSet,
  ResultTemplate,
  StageDefinition,
} from "@/lib/types";

export class AssessmentRequestError extends Error {
  constructor(
    message: string,
    public readonly status: 400 | 404 | 409 = 400,
    public readonly code = "INVALID_ASSESSMENT_REQUEST",
  ) {
    super(message);
    this.name = "AssessmentRequestError";
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function optionalString(
  body: Record<string, unknown>,
  key: "assessmentVersion" | "resultVersion" | "id",
) {
  const value = body[key];
  if (value === undefined) return undefined;
  if (typeof value !== "string" || value.trim().length === 0) {
    throw new AssessmentRequestError(`${key} must be a non-empty string.`);
  }
  return value;
}

export function buildPublicAssessmentResult(body: unknown) {
  if (!isRecord(body)) {
    throw new AssessmentRequestError("Invalid request body.");
  }
  if (!Object.hasOwn(body, "answers") || !isRecord(body.answers)) {
    throw new AssessmentRequestError("answers must be an object.");
  }

  const assessmentVersion = optionalString(body, "assessmentVersion");
  const resultVersion = optionalString(body, "resultVersion");
  const envelope = scoreAssessmentByVersion({
    assessmentVersion,
    resultVersion,
    answers: body.answers,
    access: "public-scoring",
  });

  if (envelope.assessmentVersion !== "h3-a48-v1") {
    throw new AssessmentRequestError(
      "Draft assessment results are not available from the public API.",
      409,
      "ASSESSMENT_VERSION_NOT_AVAILABLE",
    );
  }

  const questions = getAssessmentQuestions("h3-a48-v1", "public-scoring");
  const result = buildResult({
    id: optionalString(body, "id") ?? `api-${Date.now()}`,
    questions: [...questions],
    answers: body.answers as Answers,
    stages: stages as StageDefinition[],
    quadrants: quadrants as QuadrantDefinition[],
    recommendations: recommendations as RecommendationSet[],
    templates: templates as ResultTemplate[],
  });

  return {
    result,
    meta: {
      assessmentVersion: envelope.assessmentVersion,
      resultVersion: envelope.resultVersion,
      contentSchemaVersion: "h3-content-schema-v1" as const,
      inferredLegacyVersion: envelope.inferredLegacyVersion,
      persisted: false,
    },
  };
}
