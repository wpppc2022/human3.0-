import manifestData from "@/data/assessment-versions.json";
import candidateQuestionData from "@/data/assessment-versions/h3-a32-v1.questions.draft.json";
import stableQuestionData from "@/data/questions.json";
import type {
  AssessmentVersionDefinition,
  AssessmentVersionId,
  AssessmentVersionManifest,
  Question,
  ResultVersionDefinition,
  ResultVersionId,
} from "@/lib/types";

export const DEFAULT_ASSESSMENT_VERSION = "h3-a48-v1" as const;
export const LEGACY_RESULT_VERSION = "h3-result-v1" as const;
export const CANDIDATE_ASSESSMENT_VERSION = "h3-a32-v1" as const;
export const CANDIDATE_RESULT_VERSION = "h3-result-v2" as const;

export type AssessmentVersionAccess =
  | "public-questions"
  | "public-scoring"
  | "public-share"
  | "internal-draft"
  | "historical-rebuild";

export type AssessmentVersionErrorCode =
  | "UNKNOWN_ASSESSMENT_VERSION"
  | "ASSESSMENT_VERSION_NOT_AVAILABLE"
  | "RESULT_VERSION_INCOMPATIBLE"
  | "INVALID_ASSESSMENT_RESOURCE";

export class AssessmentVersionError extends Error {
  constructor(
    public readonly code: AssessmentVersionErrorCode,
    message: string,
    public readonly status: 400 | 404 | 409 = 409,
  ) {
    super(message);
    this.name = "AssessmentVersionError";
  }
}

const manifest = manifestData as AssessmentVersionManifest;
const stableQuestions = stableQuestionData as Question[];
const candidateQuestions = candidateQuestionData.questions as Question[];

function assertNever(value: never): never {
  throw new AssessmentVersionError(
    "INVALID_ASSESSMENT_RESOURCE",
    `Unsupported assessment version: ${String(value)}`,
  );
}

function assertQuestionResource(
  definition: AssessmentVersionDefinition,
  questions: readonly Question[],
) {
  if (questions.length !== definition.questionCount) {
    throw new AssessmentVersionError(
      "INVALID_ASSESSMENT_RESOURCE",
      `${definition.id} expected ${definition.questionCount} questions but loaded ${questions.length}.`,
    );
  }

  const ids = questions.map((question) => question.id);
  if (new Set(ids).size !== ids.length) {
    throw new AssessmentVersionError(
      "INVALID_ASSESSMENT_RESOURCE",
      `${definition.id} contains duplicate question IDs.`,
    );
  }
}

function canAccess(
  definition: AssessmentVersionDefinition,
  access: AssessmentVersionAccess,
) {
  switch (access) {
    case "public-questions":
      return definition.allowNewSessions && definition.allowPublicQuestions;
    case "public-scoring":
      return definition.allowPublicScoring;
    case "public-share":
      return definition.allowPublicShare;
    case "internal-draft":
      return true;
    case "historical-rebuild":
      return definition.status === "stable" || definition.status === "retired";
    default:
      return assertNever(access);
  }
}

export function getAssessmentVersionManifest(): AssessmentVersionManifest {
  return manifest;
}

export function listAssessmentVersionDefinitions() {
  return [...manifest.assessments];
}

export function findAssessmentVersionDefinition(id: string) {
  return manifest.assessments.find((item) => item.id === id);
}

export function getAssessmentVersionDefinition(
  id: string,
): AssessmentVersionDefinition {
  const definition = findAssessmentVersionDefinition(id);
  if (!definition) {
    throw new AssessmentVersionError(
      "UNKNOWN_ASSESSMENT_VERSION",
      `Unknown assessment version: ${id}`,
      404,
    );
  }
  return definition;
}

export function resolveAssessmentVersion(
  requestedVersion: string | undefined,
  access: AssessmentVersionAccess,
) {
  const id = requestedVersion ?? manifest.defaultAssessmentVersion;
  const definition = getAssessmentVersionDefinition(id);

  if (!canAccess(definition, access)) {
    throw new AssessmentVersionError(
      "ASSESSMENT_VERSION_NOT_AVAILABLE",
      `${definition.id} is not available for ${access}.`,
    );
  }

  return definition;
}

export function getAssessmentQuestions(
  assessmentVersion: AssessmentVersionId,
  access: AssessmentVersionAccess,
): readonly Question[] {
  const definition = resolveAssessmentVersion(assessmentVersion, access);
  let questions: readonly Question[];

  switch (definition.id) {
    case "h3-a48-v1":
      questions = stableQuestions;
      break;
    case "h3-a32-v1":
      questions = candidateQuestions;
      break;
    default:
      return assertNever(definition.id);
  }

  assertQuestionResource(definition, questions);
  return questions;
}

export function getDefaultPublicQuestions() {
  return getAssessmentQuestions(DEFAULT_ASSESSMENT_VERSION, "public-questions");
}

export function findResultVersionDefinition(id: string) {
  return manifest.results.find((item) => item.id === id);
}

export function getResultVersionDefinition(id: string): ResultVersionDefinition {
  const definition = findResultVersionDefinition(id);
  if (!definition) {
    throw new AssessmentVersionError(
      "RESULT_VERSION_INCOMPATIBLE",
      `Unknown result version: ${id}`,
    );
  }
  return definition;
}

export function assertResultVersionCompatibility(
  assessmentVersion: AssessmentVersionId,
  requestedResultVersion?: string,
): ResultVersionId {
  const assessment = getAssessmentVersionDefinition(assessmentVersion);
  const resultVersion = requestedResultVersion ?? assessment.resultVersion;
  const result = getResultVersionDefinition(resultVersion);

  if (!result.assessmentVersions.includes(assessmentVersion)) {
    throw new AssessmentVersionError(
      "RESULT_VERSION_INCOMPATIBLE",
      `${result.id} cannot build results for ${assessmentVersion}.`,
    );
  }

  return result.id;
}

if (manifest.defaultAssessmentVersion !== DEFAULT_ASSESSMENT_VERSION) {
  throw new AssessmentVersionError(
    "INVALID_ASSESSMENT_RESOURCE",
    "The production default must remain h3-a48-v1 until a separately approved switch.",
  );
}

for (const definition of manifest.assessments) {
  if (
    definition.id === CANDIDATE_ASSESSMENT_VERSION &&
    (definition.status !== "draft" ||
      definition.calibrationStatus !== "not-started" ||
      definition.allowNewSessions ||
      definition.allowPublicQuestions ||
      definition.allowPublicScoring ||
      definition.allowPublicShare)
  ) {
    throw new AssessmentVersionError(
      "INVALID_ASSESSMENT_RESOURCE",
      "h3-a32-v1 must remain a private draft with calibration not started.",
    );
  }
}
