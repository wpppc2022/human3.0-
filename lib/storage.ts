"use client";

import { ASSESSMENT_STORAGE_KEY, RESULT_STORAGE_KEY } from "@/lib/constants";
import { isAnswerValue } from "@/lib/scoring";
import type {
  Answers,
  AssessmentVersionId,
  BuiltResult,
  StoredAssessment,
  StoredResult,
  VersionedStoredAssessment,
  VersionedStoredResult,
} from "@/lib/types";

export const STORAGE_SCHEMA_VERSION = "h3-storage-v2" as const;
export const LEGACY_ASSESSMENT_VERSION = "h3-a48-v1" as const;
export const LEGACY_STORED_RESULT_VERSION = "h3-result-v1" as const;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isAnswers(value: unknown): value is Answers {
  if (!isRecord(value)) return false;
  return Object.values(value).every(isAnswerValue);
}

function isStoredAssessment(value: unknown): value is StoredAssessment {
  if (!isRecord(value)) return false;
  return (
    isAnswers(value.answers) &&
    typeof value.currentIndex === "number" &&
    Number.isInteger(value.currentIndex) &&
    value.currentIndex >= 0 &&
    typeof value.updatedAt === "string"
  );
}

function isStoredResult(value: unknown): value is StoredResult {
  if (!isRecord(value)) return false;
  return (
    typeof value.id === "string" &&
    isAnswers(value.answers) &&
    isRecord(value.result) &&
    typeof value.createdAt === "string"
  );
}

function hasOnlyKnownAnswerIds(answers: Answers, questionIds: readonly string[]) {
  const expected = new Set(questionIds);
  return Object.keys(answers).every((id) => expected.has(id));
}

function isVersionedStoredAssessment(
  value: unknown,
  assessmentVersion: AssessmentVersionId,
  questionIds: readonly string[],
): value is VersionedStoredAssessment {
  return (
    isStoredAssessment(value) &&
    isRecord(value) &&
    value.storageSchemaVersion === STORAGE_SCHEMA_VERSION &&
    value.assessmentVersion === assessmentVersion &&
    value.contentSchemaVersion === "h3-content-schema-v1" &&
    hasOnlyKnownAnswerIds(value.answers, questionIds) &&
    value.currentIndex < questionIds.length
  );
}

function isVersionedStoredResult(value: unknown): value is VersionedStoredResult {
  return (
    isStoredResult(value) &&
    isRecord(value) &&
    value.storageSchemaVersion === STORAGE_SCHEMA_VERSION &&
    (value.assessmentVersion === "h3-a48-v1" ||
      value.assessmentVersion === "h3-a32-v1") &&
    value.contentSchemaVersion === "h3-content-schema-v1" &&
    (value.resultVersion === "h3-result-v1" ||
      value.resultVersion === "h3-result-v2")
  );
}

function safeRead<T>(key: string): T | null {
  if (typeof window === "undefined") return null;

  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

function safeWrite<T>(key: string, value: T) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(key, JSON.stringify(value));
}

export function loadAssessmentProgress() {
  const stored = safeRead<unknown>(ASSESSMENT_STORAGE_KEY);
  return isStoredAssessment(stored) ? stored : null;
}

export function saveAssessmentProgress(answers: Answers, currentIndex: number) {
  safeWrite<StoredAssessment>(ASSESSMENT_STORAGE_KEY, {
    answers,
    currentIndex,
    updatedAt: new Date().toISOString(),
  });
}

export function clearAssessmentProgress() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(ASSESSMENT_STORAGE_KEY);
}

export function saveResult(result: BuiltResult, answers: Answers) {
  safeWrite<StoredResult>(RESULT_STORAGE_KEY, {
    id: result.id,
    answers,
    result,
    createdAt: new Date().toISOString(),
  });
}

export function loadResult() {
  const stored = safeRead<unknown>(RESULT_STORAGE_KEY);
  return isStoredResult(stored) ? stored : null;
}

export function getVersionedAssessmentStorageKey(
  assessmentVersion: AssessmentVersionId,
) {
  return `${ASSESSMENT_STORAGE_KEY}:${assessmentVersion}`;
}

export function getVersionedResultStorageKey(
  assessmentVersion: AssessmentVersionId,
) {
  return `${RESULT_STORAGE_KEY}:${assessmentVersion}`;
}

export function identifyStoredAssessmentVersion(value: unknown) {
  if (isRecord(value) && typeof value.assessmentVersion === "string") {
    return value.assessmentVersion === "h3-a48-v1" ||
      value.assessmentVersion === "h3-a32-v1"
      ? value.assessmentVersion
      : null;
  }
  return isStoredAssessment(value) ? LEGACY_ASSESSMENT_VERSION : null;
}

export function identifyStoredResultVersions(value: unknown) {
  if (isVersionedStoredResult(value)) {
    return {
      assessmentVersion: value.assessmentVersion,
      resultVersion: value.resultVersion,
      inferredLegacyVersion: false,
    };
  }
  if (isStoredResult(value)) {
    return {
      assessmentVersion: LEGACY_ASSESSMENT_VERSION,
      resultVersion: LEGACY_STORED_RESULT_VERSION,
      inferredLegacyVersion: true,
    };
  }
  return null;
}

export function loadVersionedAssessmentProgress(
  assessmentVersion: AssessmentVersionId,
  questionIds: readonly string[],
) {
  const versioned = safeRead<unknown>(
    getVersionedAssessmentStorageKey(assessmentVersion),
  );
  if (isVersionedStoredAssessment(versioned, assessmentVersion, questionIds)) {
    return versioned;
  }

  if (assessmentVersion !== LEGACY_ASSESSMENT_VERSION) return null;
  const legacy = loadAssessmentProgress();
  if (
    !legacy ||
    !hasOnlyKnownAnswerIds(legacy.answers, questionIds) ||
    legacy.currentIndex >= questionIds.length
  ) {
    return null;
  }

  return {
    ...legacy,
    storageSchemaVersion: STORAGE_SCHEMA_VERSION,
    assessmentVersion: LEGACY_ASSESSMENT_VERSION,
    contentSchemaVersion: "h3-content-schema-v1" as const,
  } satisfies VersionedStoredAssessment;
}

export function saveVersionedAssessmentProgress(
  assessmentVersion: AssessmentVersionId,
  answers: Answers,
  currentIndex: number,
) {
  const value = {
    answers,
    currentIndex,
    updatedAt: new Date().toISOString(),
    storageSchemaVersion: STORAGE_SCHEMA_VERSION,
    assessmentVersion,
    contentSchemaVersion: "h3-content-schema-v1" as const,
  } satisfies VersionedStoredAssessment;
  safeWrite(getVersionedAssessmentStorageKey(assessmentVersion), value);

  if (assessmentVersion === LEGACY_ASSESSMENT_VERSION) {
    saveAssessmentProgress(answers, currentIndex);
  }
}
